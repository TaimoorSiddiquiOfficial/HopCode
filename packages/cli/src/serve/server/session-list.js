/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { SessionService, SessionOrganizationError, } from '@hoptrendy/hopcode-core';
import { writeStderrLine } from '../../utils/stdioHelpers.js';
import { createSessionOrganizationService } from '../session-organization-helpers.js';
const DEFAULT_SESSION_PAGE_SIZE = 20;
const MAX_SESSION_PAGE_SIZE = 100;
const MAX_ORGANIZED_SESSIONS = 50_000;
export class InvalidCursorError extends Error {
    constructor(cursor, kind = 'numeric') {
        super(`Invalid cursor: "${cursor}" is not a valid ${kind} cursor`);
        this.name = 'InvalidCursorError';
    }
}
function parseSessionCursor(cursor) {
    if (cursor === '')
        return undefined;
    const trimmed = cursor.trim();
    const parsed = Number(trimmed);
    if (trimmed === '' ||
        !Number.isFinite(parsed) ||
        parsed < 0 ||
        parsed > Number.MAX_SAFE_INTEGER) {
        throw new InvalidCursorError(cursor);
    }
    return parsed;
}
function parseOrganizedCursor(cursor, expected) {
    if (cursor === '')
        return undefined;
    try {
        const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
        const parsed = JSON.parse(decoded);
        const last = parsed.last;
        if (typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed) ||
            typeof last !== 'object' ||
            last === null ||
            Array.isArray(last) ||
            typeof last.isPinned !== 'boolean' ||
            typeof last.activityTime !== 'number' ||
            !Number.isFinite(last.activityTime) ||
            typeof last.sessionId !== 'string' ||
            last.sessionId.length === 0 ||
            parsed.group !== expected.group ||
            parsed.archiveState !== expected.archiveState ||
            parsed.sourceType !== expected.sourceType ||
            parsed.sourceId !== expected.sourceId) {
            throw new Error('invalid organized cursor');
        }
        return last;
    }
    catch {
        throw new InvalidCursorError(cursor, 'organized');
    }
}
function encodeOrganizedCursor(last, group, archiveState, sourceType, sourceId) {
    return Buffer.from(JSON.stringify({ group, archiveState, sourceType, sourceId, last }), 'utf8').toString('base64url');
}
function parseLiveSessionCursor(cursor) {
    if (cursor === '')
        return undefined;
    try {
        const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
        if (typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed) ||
            typeof parsed.activityTime !== 'number' ||
            !Number.isFinite(parsed.activityTime) ||
            typeof parsed.sessionId !== 'string' ||
            parsed.sessionId.length === 0) {
            throw new Error('invalid live cursor');
        }
        return parsed;
    }
    catch {
        throw new InvalidCursorError(cursor, 'live');
    }
}
function encodeLiveSessionCursor(last) {
    return Buffer.from(JSON.stringify(last), 'utf8').toString('base64url');
}
function matchesSessionMetadataSource(session, filter) {
    const sourceTypeMatches = filter.sourceType === undefined ||
        session.sourceType === filter.sourceType ||
        // Legacy sessions without source metadata belong to the default catalog.
        (filter.sourceType === 'default' && session.sourceType === undefined);
    return (sourceTypeMatches &&
        // sourceId remains exact; only the default source type has legacy fallback.
        (filter.sourceId === undefined || session.sourceId === filter.sourceId));
}
function parseMetadataSessionCursor(cursor, expected) {
    if (cursor === '')
        return undefined;
    try {
        const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
        const last = parsed.last;
        if (typeof parsed !== 'object' ||
            parsed === null ||
            Array.isArray(parsed) ||
            typeof last !== 'object' ||
            last === null ||
            Array.isArray(last) ||
            typeof last.activityTime !== 'number' ||
            !Number.isFinite(last.activityTime) ||
            typeof last.sessionId !== 'string' ||
            last.sessionId.length === 0 ||
            parsed.parentSessionId !==
                expected.parentSessionId ||
            parsed.sourceType !== expected.sourceType ||
            parsed.sourceId !== expected.sourceId ||
            parsed.archiveState !==
                expected.archiveState) {
            throw new Error('invalid metadata cursor');
        }
        return { activityTime: last.activityTime, sessionId: last.sessionId };
    }
    catch {
        throw new InvalidCursorError(cursor, expected.sourceType === undefined ? 'parent' : 'metadata');
    }
}
function encodeMetadataSessionCursor(last, filter, archiveState) {
    return Buffer.from(JSON.stringify({ ...filter, archiveState, last }), 'utf8').toString('base64url');
}
function toSummary(item) {
    return {
        sessionId: item.sessionId,
        workspaceCwd: item.cwd,
        createdAt: item.startTime,
        updatedAt: new Date(item.mtime).toISOString(),
        displayName: item.customTitle || item.prompt,
        ...(item.parentSessionId ? { parentSessionId: item.parentSessionId } : {}),
        ...(item.sourceType ? { sourceType: item.sourceType } : {}),
        ...(item.sourceId !== undefined ? { sourceId: item.sourceId } : {}),
        clientCount: 0,
        hasActivePrompt: false,
        isArchived: item.isArchived === true,
    };
}
/**
 * Merges a live session's summary onto its persisted counterpart for a session
 * that exists in both. The persisted record owns identity/immutable facts
 * (`createdAt`, `parentSessionId` lineage) while the live entry owns volatile
 * state (`clientCount`, `hasActivePrompt`, a fresher `displayName`/`updatedAt`).
 * Shared by all three list paths (default, organized, metadata-filtered) so the merge
 * rule lives in one place.
 */
function mergeLiveSessionSummary(existing, live) {
    return {
        ...existing,
        ...live,
        createdAt: existing.createdAt,
        displayName: live.displayName ?? existing.displayName,
        // Immutable lineage; the persisted transcript is authoritative, and a live
        // entry only carries it when spawned this run.
        parentSessionId: existing.parentSessionId ?? live.parentSessionId,
        sourceType: existing.sourceType ?? live.sourceType,
        sourceId: existing.sourceType !== undefined ? existing.sourceId : live.sourceId,
        updatedAt: live.updatedAt ?? existing.updatedAt,
        clientCount: live.clientCount,
        hasActivePrompt: live.hasActivePrompt,
        isArchived: false,
    };
}
async function listAllPersistedSummaries(sessionService, archiveState) {
    // Organized view needs global pin/group ordering before pagination; v1 keeps
    // the storage API unchanged and performs that merge in memory.
    const sessions = [];
    let truncated = false;
    let cursor;
    do {
        const page = await sessionService.listSessions({
            cursor,
            size: 10_000,
            archiveState,
        });
        const remaining = MAX_ORGANIZED_SESSIONS - sessions.length;
        sessions.push(...page.items.slice(0, remaining).map(toSummary));
        cursor = page.nextCursor;
        if (page.items.length === 0) {
            break;
        }
        if (page.items.length > remaining ||
            (sessions.length >= MAX_ORGANIZED_SESSIONS && cursor !== undefined)) {
            writeStderrLine(`qwen serve: organized session list truncated at ${MAX_ORGANIZED_SESSIONS} sessions`);
            truncated = true;
            break;
        }
    } while (cursor !== undefined);
    return { sessions, truncated };
}
function getSummaryActivityTime(session) {
    const time = Date.parse(session.updatedAt ?? session.createdAt);
    return Number.isFinite(time) ? time : 0;
}
function getLiveSessionCursorKey(session) {
    return {
        activityTime: getSummaryActivityTime(session),
        sessionId: session.sessionId,
    };
}
function compareLiveSessionCursorKeys(a, b) {
    const byTime = b.activityTime - a.activityTime;
    if (byTime !== 0)
        return byTime;
    return a.sessionId.localeCompare(b.sessionId);
}
function compareOrganizedSessions(activityTimeById, a, b) {
    return compareOrganizedCursorKeys(getOrganizedCursorKey(activityTimeById, a), getOrganizedCursorKey(activityTimeById, b));
}
function getOrganizedCursorKey(activityTimeById, session) {
    return {
        isPinned: session.isPinned === true,
        activityTime: activityTimeById.get(session.sessionId) ?? 0,
        sessionId: session.sessionId,
    };
}
function compareOrganizedCursorKeys(a, b) {
    const byPinned = Number(b.isPinned) - Number(a.isPinned);
    if (byPinned !== 0)
        return byPinned;
    const byTime = b.activityTime - a.activityTime;
    if (byTime !== 0)
        return byTime;
    return a.sessionId.localeCompare(b.sessionId);
}
function applyOrganization(session, organization) {
    return {
        ...session,
        groupId: organization?.groupId ?? null,
        color: organization?.color ?? null,
        isPinned: organization?.isPinned === true,
        ...(organization?.pinnedAt !== undefined
            ? { pinnedAt: organization.pinnedAt }
            : {}),
    };
}
async function listOrganizedWorkspaceSessionsForResponse(bridge, workspaceCwd, options, pageSize, readOptions) {
    const archiveState = options.archiveState ?? 'active';
    const sessionService = new SessionService(workspaceCwd);
    const organizationService = createSessionOrganizationService(workspaceCwd);
    const snapshot = await organizationService.readSnapshot();
    const knownGroupIds = new Set(snapshot.groups.map((group) => group.id));
    const group = options.group ?? 'all';
    if (group !== 'all' &&
        group !== 'pinned' &&
        group !== 'ungrouped' &&
        !knownGroupIds.has(group)) {
        throw new SessionOrganizationError(`Group not found: ${group}`, 'group_not_found', 'group');
    }
    const cursorKey = options.cursor !== undefined
        ? parseOrganizedCursor(options.cursor, {
            group,
            archiveState,
            sourceType: options.sourceType,
            sourceId: options.sourceId,
        })
        : undefined;
    const isFirstPage = cursorKey === undefined;
    let liveMergeFailed = false;
    const bySessionId = new Map();
    const persisted = await listAllPersistedSummaries(sessionService, archiveState);
    for (const session of persisted.sessions) {
        bySessionId.set(session.sessionId, applyOrganization(session, snapshot.sessions.get(session.sessionId)));
    }
    if (readOptions.mergeLive !== false &&
        archiveState !== 'archived' &&
        isFirstPage) {
        try {
            const liveSessions = bridge.listWorkspaceSessions(workspaceCwd);
            for (const live of liveSessions) {
                const existing = bySessionId.get(live.sessionId);
                const organization = snapshot.sessions.get(live.sessionId);
                if (existing) {
                    bySessionId.set(live.sessionId, applyOrganization(mergeLiveSessionSummary(existing, live), organization));
                }
                else if (!(await sessionService.sessionExists(live.sessionId))) {
                    bySessionId.set(live.sessionId, applyOrganization({
                        ...live,
                        createdAt: live.createdAt,
                        clientCount: live.clientCount,
                        hasActivePrompt: live.hasActivePrompt,
                        isArchived: false,
                    }, organization));
                }
            }
        }
        catch (error) {
            liveMergeFailed = true;
            writeStderrLine(`qwen serve: organized session list live merge failed; using persisted sessions only: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const filtered = [...bySessionId.values()].filter((session) => {
        if (!matchesSessionMetadataSource(session, options))
            return false;
        if (group === 'all')
            return true;
        if (group === 'pinned')
            return session.isPinned === true;
        if (group === 'ungrouped')
            return session.groupId == null && session.color == null;
        // Color takes precedence over a named group in the sidebar's bucketing, so
        // a session carrying a color tag is never shown under its group. Keep the
        // named-group filter consistent for REST/ACP consumers (the store allows
        // both fields even though the UI keeps them mutually exclusive).
        return session.color == null && session.groupId === group;
    });
    const activityTimeById = new Map(filtered.map((session) => [
        session.sessionId,
        getSummaryActivityTime(session),
    ]));
    filtered.sort((a, b) => compareOrganizedSessions(activityTimeById, a, b));
    const afterCursor = cursorKey === undefined
        ? filtered
        : filtered.filter((session) => compareOrganizedCursorKeys(cursorKey, getOrganizedCursorKey(activityTimeById, session)) < 0);
    const page = afterCursor.slice(0, pageSize);
    const nextCursor = page.length < afterCursor.length
        ? encodeOrganizedCursor(getOrganizedCursorKey(activityTimeById, page[page.length - 1]), group, archiveState, options.sourceType, options.sourceId)
        : undefined;
    return {
        sessions: page,
        ...(nextCursor !== undefined ? { nextCursor } : {}),
        ...(liveMergeFailed ? { liveMergeFailed: true } : {}),
        ...(persisted.truncated ? { truncated: true } : {}),
    };
}
/**
 * Applies persisted metadata filters before pagination so pages are not
 * silently short of matches.
 */
async function listWorkspaceSessionsByMetadataForResponse(bridge, workspaceCwd, options, pageSize, filter, readOptions) {
    const archiveState = options.archiveState ?? 'active';
    const sessionService = new SessionService(workspaceCwd);
    const bySessionId = new Map();
    const persisted = await listAllPersistedSummaries(sessionService, archiveState);
    for (const session of persisted.sessions) {
        bySessionId.set(session.sessionId, session);
    }
    let liveMergeFailed = false;
    if (readOptions.mergeLive !== false && archiveState !== 'archived') {
        try {
            for (const live of bridge.listWorkspaceSessions(workspaceCwd)) {
                const existing = bySessionId.get(live.sessionId);
                if (existing) {
                    bySessionId.set(live.sessionId, mergeLiveSessionSummary(existing, live));
                }
                else if (!(await sessionService.sessionExists(live.sessionId))) {
                    bySessionId.set(live.sessionId, {
                        ...live,
                        createdAt: live.createdAt,
                        clientCount: live.clientCount,
                        hasActivePrompt: live.hasActivePrompt,
                        isArchived: false,
                    });
                }
            }
        }
        catch (error) {
            liveMergeFailed = true;
            writeStderrLine(`qwen serve: session metadata filter live merge failed; using persisted sessions only: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    const matches = [...bySessionId.values()]
        .filter((session) => (filter.parentSessionId === undefined ||
        session.parentSessionId === filter.parentSessionId) &&
        matchesSessionMetadataSource(session, filter))
        .sort((a, b) => compareLiveSessionCursorKeys(getLiveSessionCursorKey(a), getLiveSessionCursorKey(b)));
    const cursorKey = options.cursor !== undefined && options.cursor !== ''
        ? parseMetadataSessionCursor(options.cursor, {
            ...filter,
            archiveState,
        })
        : undefined;
    const afterCursor = cursorKey === undefined
        ? matches
        : matches.filter((session) => compareLiveSessionCursorKeys(cursorKey, getLiveSessionCursorKey(session)) < 0);
    const page = afterCursor.slice(0, pageSize);
    const nextCursor = page.length < afterCursor.length
        ? encodeMetadataSessionCursor(getLiveSessionCursorKey(page[page.length - 1]), filter, archiveState)
        : undefined;
    return {
        sessions: page,
        ...(nextCursor !== undefined ? { nextCursor } : {}),
        ...(liveMergeFailed ? { liveMergeFailed: true } : {}),
        ...(persisted.truncated ? { truncated: true } : {}),
    };
}
export async function listWorkspaceSessionsForResponse(bridge, workspaceCwd, options, readOptions = {}) {
    const rawSize = options?.size;
    const requestedSize = typeof rawSize === 'number' && Number.isSafeInteger(rawSize)
        ? rawSize
        : DEFAULT_SESSION_PAGE_SIZE;
    const pageSize = Math.min(Math.max(requestedSize, 1), MAX_SESSION_PAGE_SIZE);
    if (options?.view === 'organized') {
        return listOrganizedWorkspaceSessionsForResponse(bridge, workspaceCwd, options, pageSize, readOptions);
    }
    if (options?.parentSessionId !== undefined ||
        options?.sourceType !== undefined) {
        return listWorkspaceSessionsByMetadataForResponse(bridge, workspaceCwd, options, pageSize, {
            ...(options.parentSessionId !== undefined
                ? { parentSessionId: options.parentSessionId }
                : {}),
            ...(options.sourceType !== undefined
                ? { sourceType: options.sourceType }
                : {}),
            ...(options.sourceId !== undefined
                ? { sourceId: options.sourceId }
                : {}),
        }, readOptions);
    }
    let numericCursor;
    if (options?.cursor != null) {
        numericCursor = parseSessionCursor(options.cursor);
    }
    const isFirstPage = numericCursor === undefined;
    const sessionService = new SessionService(workspaceCwd);
    const archiveState = options?.archiveState ?? 'active';
    const persisted = await sessionService.listSessions({
        cursor: numericCursor,
        size: pageSize,
        archiveState,
    });
    const bySessionId = new Map();
    for (const item of persisted.items) {
        bySessionId.set(item.sessionId, toSummary(item));
    }
    if (archiveState === 'archived' || readOptions.mergeLive === false) {
        const sessions = [...bySessionId.values()];
        const nextCursor = persisted.nextCursor != null ? String(persisted.nextCursor) : undefined;
        return { sessions, nextCursor };
    }
    const liveSessions = bridge.listWorkspaceSessions(workspaceCwd);
    for (const live of liveSessions) {
        const existing = bySessionId.get(live.sessionId);
        if (existing) {
            bySessionId.set(live.sessionId, mergeLiveSessionSummary(existing, live));
        }
        else if (isFirstPage &&
            !(await sessionService.sessionExists(live.sessionId))) {
            bySessionId.set(live.sessionId, {
                ...live,
                createdAt: live.createdAt,
                clientCount: live.clientCount,
                hasActivePrompt: live.hasActivePrompt,
                isArchived: false,
            });
        }
    }
    const sessions = [...bySessionId.values()].sort((a, b) => {
        const aTime = Date.parse(a.updatedAt ?? a.createdAt);
        const bTime = Date.parse(b.updatedAt ?? b.createdAt);
        return bTime - aTime;
    });
    const nextCursor = persisted.nextCursor != null ? String(persisted.nextCursor) : undefined;
    return { sessions, nextCursor };
}
export function listLiveWorkspaceSessionsForResponse(bridge, workspaceCwd, options) {
    const rawSize = options?.size;
    const requestedSize = typeof rawSize === 'number' && Number.isSafeInteger(rawSize)
        ? rawSize
        : DEFAULT_SESSION_PAGE_SIZE;
    const pageSize = Math.min(Math.max(requestedSize, 1), MAX_SESSION_PAGE_SIZE);
    const cursorKey = options?.cursor !== undefined
        ? parseLiveSessionCursor(options.cursor)
        : undefined;
    const sessions = bridge
        .listWorkspaceSessions(workspaceCwd)
        .sort((a, b) => compareLiveSessionCursorKeys(getLiveSessionCursorKey(a), getLiveSessionCursorKey(b)));
    const afterCursor = cursorKey === undefined
        ? sessions
        : sessions.filter((session) => compareLiveSessionCursorKeys(cursorKey, getLiveSessionCursorKey(session)) < 0);
    const page = afterCursor.slice(0, pageSize);
    const nextCursor = page.length < afterCursor.length
        ? encodeLiveSessionCursor(getLiveSessionCursorKey(page[page.length - 1]))
        : undefined;
    return {
        sessions: page,
        ...(nextCursor !== undefined ? { nextCursor } : {}),
    };
}
/**
 * Scans local persisted session JSONL files for aggregate counts and merges
 * the current in-memory live count from the bridge.
 *
 * This is an O(n) disk walk. Callers (and HTTP clients) must treat it as an
 * infrequent / on-demand operator endpoint, not a polling source.
 */
export async function getWorkspaceSessionInfoForResponse(bridge, workspaceCwd, options = {}) {
    const counts = await new SessionService(workspaceCwd).getSessionInfoCounts();
    return {
        active: counts.active,
        archived: counts.archived,
        total: counts.total,
        ...(options.includeLive === false
            ? {}
            : { live: bridge.listWorkspaceSessions(workspaceCwd).length }),
        expensive: true,
        cost: 'disk_scan',
        ...(counts.truncated ? { truncated: true } : {}),
    };
}
export function parseSessionPageSizeQuery(raw) {
    if (typeof raw !== 'string')
        return undefined;
    const trimmed = raw.trim();
    if (!/^[+-]?\d+$/.test(trimmed))
        return undefined;
    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(parsed))
        return undefined;
    if (Number.isSafeInteger(parsed))
        return parsed;
    return trimmed.startsWith('-') ? 1 : MAX_SESSION_PAGE_SIZE;
}
//# sourceMappingURL=session-list.js.map