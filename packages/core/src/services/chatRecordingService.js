/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import {} from '../config/config.js';
import path from 'node:path';
import fs from 'node:fs';
import { randomUUID } from 'node:crypto';
import { createUserContent, createModelContent, } from '@google/genai';
import * as jsonl from '../utils/jsonl-utils.js';
import { getGitBranch } from '../utils/gitUtils.js';
import { createDebugLogger } from '../utils/debugLogger.js';
import { compactToolResultDisplayForRecording } from '../utils/toolResultDisplayCompaction.js';
import { tryGenerateSessionTitle } from './sessionTitle.js';
import { serializeSnapshot } from './fileHistoryService.js';
const debugLogger = createDebugLogger('CHAT_RECORDING');
/**
 * Maximum number of auto-title generation attempts per session. See
 * {@link ChatRecordingService.autoTitleAttempts} for the rationale behind
 * retrying across turns.
 */
const AUTO_TITLE_ATTEMPT_CAP = 3;
const SESSION_FILE_DIFF_AGGREGATE_CHAR_LIMIT = 100_000;
const SESSION_FILE_DIFF_CHAR_LIMIT = 50_000;
const SESSION_FILE_CONTENT_CHAR_LIMIT = 16_000;
/**
 * Re-append a fresh `custom_title` record to EOF once this many bytes
 * of other JSONL content have been written since the last title
 * anchor. Half of the picker's 64KB tail-read window so that even an
 * oversized record landing right at the threshold keeps the title
 * within scan range. Lifting this above 64KB would let the title
 * fall out of the tail window between re-anchors; lowering it
 * trades extra writes for a tighter safety margin.
 */
const TITLE_REANCHOR_BYTES = 32 * 1024;
function isFileDiffDisplay(resultDisplay) {
    if (typeof resultDisplay !== 'object' ||
        resultDisplay === null ||
        !('fileDiff' in resultDisplay) ||
        !('fileName' in resultDisplay) ||
        !('originalContent' in resultDisplay) ||
        !('newContent' in resultDisplay)) {
        return false;
    }
    const display = resultDisplay;
    const originalContent = display['originalContent'];
    return (typeof display['fileDiff'] === 'string' &&
        typeof display['fileName'] === 'string' &&
        typeof display['newContent'] === 'string' &&
        (originalContent === null || typeof originalContent === 'string'));
}
function stringLength(value) {
    return typeof value === 'string' ? value.length : 0;
}
function truncateMiddleForSession(value, limit) {
    if (value.length <= limit) {
        return value;
    }
    const marker = `\n[... truncated for saved session preview; original length: ${value.length} characters ...]\n`;
    const contentBudget = Math.max(0, limit - marker.length);
    const headLength = Math.ceil(contentBudget * 0.6);
    const tailLength = contentBudget - headLength;
    return (value.slice(0, headLength) +
        marker +
        (tailLength > 0 ? value.slice(value.length - tailLength) : ''));
}
function buildSyntheticDiffPreview(display) {
    const originalLength = stringLength(display.originalContent);
    return [
        `--- ${display.fileName}`,
        `+++ ${display.fileName}`,
        '@@ -1 +1 @@',
        `-Full diff omitted from saved session history; original fileDiff length: ${display.fileDiff.length} characters.`,
        `+Saved session preview only; originalContent length: ${originalLength} characters, newContent length: ${display.newContent.length} characters.`,
    ].join('\n');
}
function sanitizeFileDiffForRecording(display) {
    const fileDiffLength = display.fileDiff.length;
    const originalContentLength = stringLength(display.originalContent);
    const newContentLength = display.newContent.length;
    const aggregateLength = fileDiffLength + originalContentLength + newContentLength;
    const fileDiffTruncated = fileDiffLength > SESSION_FILE_DIFF_CHAR_LIMIT;
    const originalContentTruncated = originalContentLength > SESSION_FILE_CONTENT_CHAR_LIMIT;
    const newContentTruncated = newContentLength > SESSION_FILE_CONTENT_CHAR_LIMIT;
    if (aggregateLength <= SESSION_FILE_DIFF_AGGREGATE_CHAR_LIMIT &&
        !fileDiffTruncated &&
        !originalContentTruncated &&
        !newContentTruncated) {
        return display;
    }
    return {
        ...display,
        fileDiff: fileDiffTruncated
            ? buildSyntheticDiffPreview(display)
            : display.fileDiff,
        originalContent: display.originalContent !== null && originalContentTruncated
            ? truncateMiddleForSession(display.originalContent, SESSION_FILE_CONTENT_CHAR_LIMIT)
            : display.originalContent,
        newContent: newContentTruncated
            ? truncateMiddleForSession(display.newContent, SESSION_FILE_CONTENT_CHAR_LIMIT)
            : display.newContent,
        truncatedForSession: true,
        fileDiffLength,
        originalContentLength,
        newContentLength,
        fileDiffTruncated,
        originalContentTruncated,
        newContentTruncated,
    };
}
export function sanitizeToolCallResultForRecording(toolCallResult) {
    const resultDisplay = toolCallResult.resultDisplay;
    if (isFileDiffDisplay(resultDisplay)) {
        const sanitizedResultDisplay = sanitizeFileDiffForRecording(resultDisplay);
        if (sanitizedResultDisplay === resultDisplay) {
            return toolCallResult;
        }
        return {
            ...toolCallResult,
            resultDisplay: sanitizedResultDisplay,
        };
    }
    const sanitizedResultDisplay = compactToolResultDisplayForRecording(resultDisplay);
    if (sanitizedResultDisplay === resultDisplay) {
        return toolCallResult;
    }
    return {
        ...toolCallResult,
        resultDisplay: sanitizedResultDisplay,
    };
}
/**
 * Users who don't want the fast model silently generating titles can opt
 * out at runtime: `HOPCODE_DISABLE_AUTO_TITLE=1` (or any truthy-ish value)
 * makes {@link ChatRecordingService.maybeTriggerAutoTitle} a no-op without
 * touching the rest of the feature (so `/rename --auto` still works on
 * explicit user request). Read per-call rather than cached so tests can
 * flip the var between cases without reloading the module; the cost of
 * one env lookup per assistant turn is irrelevant next to an LLM call.
 */
function autoTitleDisabledByEnv() {
    const v = process.env['HOPCODE_DISABLE_AUTO_TITLE'];
    if (!v)
        return false;
    // Accept "0", "false", "no", "off" (case-insensitive) as "not disabled".
    const lowered = v.trim().toLowerCase();
    return (lowered !== '' &&
        lowered !== '0' &&
        lowered !== 'false' &&
        lowered !== 'no' &&
        lowered !== 'off');
}
/**
 * Service for recording the current chat session to disk.
 *
 * This service provides comprehensive conversation recording that captures:
 * - All user and assistant messages
 * - Tool calls and their execution results
 * - Token usage statistics
 * - Assistant thoughts and reasoning
 *
 * **API Design:**
 * - `recordUserMessage()` - Queues a user message for recording
 * - `recordAssistantTurn()` - Queues an assistant turn with all data
 * - `recordToolResult()` - Queues tool results for recording
 *
 * **Storage Format:** JSONL files with tree-structured records.
 * Each record has uuid/parentUuid fields enabling:
 * - Append-only writes (never rewrite the file)
 * - Linear history reconstruction
 * - Future conversation branching (fork from any historical point)
 *
 * File location: ~/.hopcode/tmp/<project_id>/chats/
 *
 * For session management (list, load, remove), use SessionService.
 */
export class ChatRecordingService {
    onWriteFailure;
    /** UUID of the active logical tail, including records queued for writing. */
    lastRecordUuid = null;
    config;
    /**
     * Tracks the `lastRecordUuid` value just before each user turn was recorded.
     * Used by {@link rewindRecording} to re-root the parentUuid chain so that
     * rewound messages end up on a dead branch in the tree, making
     * `reconstructHistory()` skip them automatically on resume.
     *
     * Index `i` holds the active tail UUID observed before the (i+1)th user
     * message was queued. For example, `turnParentUuids[0]` is the UUID right
     * before the very first user message (often `null` or the startup context
     * record).
     */
    turnParentUuids = [];
    /**
     * Cached chats-dir / conversation-file path so per-record appendRecord
     * doesn't re-stat them on every write. The first call performs the
     * mkdir / wx-create; subsequent calls short-circuit.
     */
    chatsDirEnsured = false;
    cachedConversationFile;
    /**
     * Serialized async write queue for appendRecord. A rejected write leaves the
     * canonical chain rejected so later queued records cannot be persisted with
     * a parentUuid that never reached disk. Must be flushed before process exit
     * (see {@link flush}).
     */
    writeChain = Promise.resolve();
    /** First async JSONL write failure; permanently degrades this recorder. */
    writeFailure;
    /** In-memory cache of the current session's custom title (for re-append on exit) */
    currentCustomTitle;
    /**
     * Source of {@link currentCustomTitle}. `undefined` on legacy records that
     * pre-date the `titleSource` field — that's treated as manual everywhere
     * (safe default) without rewriting the persisted record.
     */
    currentTitleSource;
    /** Parent session id once recorded, so {@link recordParentSession} is
     * idempotent — a bridge retry (after a failed response) must not append a
     * second `parent_session` record for the same immutable lineage. */
    currentParentSessionId;
    /** Immutable creator attribution once recorded. */
    currentSourceType;
    currentSourceId;
    /**
     * How many auto-title attempts have been made this process.
     *
     * We don't commit to "one attempt per session" because the first assistant
     * turn may be a pure tool-call with no user-visible text (e.g., the model
     * opens with a search) — the title service returns null, and we'd waste
     * the whole session's chance on a turn that never had a shot. Instead we
     * retry for a handful of turns until either the title lands or we hit the
     * cap, which protects against a persistently failing fast-model looping
     * on every turn. {@link AUTO_TITLE_ATTEMPT_CAP} sets the ceiling.
     */
    autoTitleAttempts = 0;
    /**
     * AbortController for the in-flight auto-title LLM call, or `undefined`
     * when no generation is pending. Doubles as the in-flight guard — a
     * defined controller means "one is running; don't launch another".
     * Stored on the instance so {@link finalize} (called on session switch
     * and shutdown) can cancel a pending call cleanly rather than letting
     * it burn tokens after the session has already moved on.
     */
    autoTitleController;
    /** Explicit title writes waiting to settle; background auto-title defers. */
    pendingExplicitTitleWrites = 0;
    /** Title writes whose durable result and final cached value are unresolved. */
    pendingTitleWrites = 0;
    /**
     * JSON-serialized form of the most recent attribution snapshot accepted for
     * recording, used to deduplicate identical writes on every non-retry
     * turn. Without this, sessions that touch many files would write a
     * full duplicate of the entire snapshot to the JSONL on every turn,
     * inflating the on-disk session and making `/resume` slower to
     * hydrate.
     */
    lastAttributionSnapshotJson;
    cachedGitBranch;
    /**
     * Approximate bytes of JSONL content accepted after the last
     * `custom_title` record in the ordered writer queue. Used by the title
     * re-anchor invariant: once enough non-title content accumulates
     * past the last anchor, {@link appendRecord} re-appends a fresh
     * `custom_title` to EOF so the picker's tail-window scan
     * ({@link readSessionTitleFromFile}) keeps finding it.
     *
     * Without this, a long agentic turn that streams >64KB of tool
     * output could push the only `custom_title` record past the 64KB
     * tail window, forcing the picker into a head-window fallback (or
     * returning undefined if the title is beyond both windows).
     */
    bytesSinceTitleAnchor = 0;
    hasNonTitleContentSinceTitleAnchor = false;
    constructor(config, onWriteFailure) {
        this.onWriteFailure = onWriteFailure;
        this.config = config;
        this.lastRecordUuid =
            config.getResumedSessionData()?.lastCompletedUuid ?? null;
        // On resume, load the cached custom title AND its source from the
        // session file. Preserving the persisted source is load-bearing: the
        // SessionPicker dim-styling depends on it, and hardcoding `'manual'`
        // would silently downgrade auto-titled sessions every time they get
        // resumed. Legacy records (no `titleSource` field) stay `undefined` —
        // treated as manual for safety without rewriting the JSONL.
        //
        // Do not re-append during construction: loading/resuming a session is a
        // read operation from the user's perspective, and touching the JSONL mtime
        // would make session lists treat it as fresh activity.
        if (config.getResumedSessionData()) {
            try {
                const sessionService = config.getSessionService();
                const info = sessionService.getSessionTitleInfo(config.getSessionId());
                this.currentCustomTitle = info.title;
                this.currentTitleSource = info.source;
                if (info.title) {
                    // Prime the threshold so the first real content write re-anchors.
                    this.bytesSinceTitleAnchor = TITLE_REANCHOR_BYTES;
                }
            }
            catch {
                // Best-effort — don't block construction
            }
        }
    }
    /**
     * Returns the current custom title, if any. Read-only accessor for
     * callers (e.g. auto-title trigger) that need to know whether a title is
     * already set before attempting generation.
     */
    getCurrentCustomTitle() {
        return this.currentCustomTitle;
    }
    /**
     * Returns the source of the current custom title, or `undefined` when no
     * title is set.
     */
    getCurrentTitleSource() {
        return this.currentTitleSource;
    }
    /**
     * Returns the session ID.
     * @returns The session ID.
     */
    getSessionId() {
        return this.config.getSessionId();
    }
    /**
     * Ensures the chats directory exists, creating it if it doesn't exist.
     * @returns The path to the chats directory.
     * @throws Error if the directory cannot be created.
     */
    ensureChatsDir() {
        const projectDir = this.config.storage.getProjectDir();
        const chatsDir = path.join(projectDir, 'chats');
        if (this.chatsDirEnsured) {
            return chatsDir;
        }
        try {
            fs.mkdirSync(chatsDir, { recursive: true });
            // Only cache success — keep transient mkdir failures self-healing.
            this.chatsDirEnsured = true;
        }
        catch {
            // ignored
        }
        return chatsDir;
    }
    /**
     * Ensures the conversation file exists, creating it if it doesn't exist.
     * Uses atomic file creation to avoid race conditions. Result is cached so
     * subsequent appendRecord calls skip the wx-create entirely.
     * @returns The path to the conversation file.
     * @throws Error if the file cannot be created or accessed.
     */
    ensureConversationFile() {
        if (this.cachedConversationFile) {
            return this.cachedConversationFile;
        }
        const chatsDir = this.ensureChatsDir();
        const sessionId = this.getSessionId();
        const safeFilename = `${sessionId}.jsonl`;
        const conversationFile = path.join(chatsDir, safeFilename);
        try {
            // Use 'wx' flag for exclusive creation - atomic operation that fails if
            // the file already exists. EEXIST is the expected steady-state path on
            // resume; we treat it as success.
            fs.writeFileSync(conversationFile, '', { flag: 'wx', encoding: 'utf8' });
        }
        catch (error) {
            const nodeError = error;
            if (nodeError.code !== 'EEXIST') {
                const message = error instanceof Error ? error.message : String(error);
                throw new Error(`Failed to create conversation file at ${conversationFile}: ${message}`);
            }
        }
        this.cachedConversationFile = conversationFile;
        return conversationFile;
    }
    /**
     * Creates base fields for a ChatRecord.
     */
    createBaseRecord(type) {
        const cwd = this.config.getProjectRoot();
        return {
            uuid: randomUUID(),
            parentUuid: this.lastRecordUuid,
            sessionId: this.getSessionId(),
            timestamp: new Date().toISOString(),
            type,
            cwd,
            version: this.config.getCliVersion() || 'unknown',
            gitBranch: this.getCachedGitBranch(cwd),
        };
    }
    getCachedGitBranch(cwd) {
        if (!this.cachedGitBranch || this.cachedGitBranch.cwd !== cwd) {
            this.cachedGitBranch = { cwd, branch: getGitBranch(cwd) };
        }
        return this.cachedGitBranch.branch;
    }
    enterWriteFailure(cause, sessionId) {
        if (!this.writeFailure) {
            this.writeFailure =
                cause instanceof Error ? cause : new Error(String(cause));
            debugLogger.error('Error appending record (async):', this.writeFailure);
            try {
                const notification = this.onWriteFailure?.({
                    sessionId,
                    error: this.writeFailure,
                });
                if (notification) {
                    void notification.catch((error) => {
                        debugLogger.debug('Chat recording failure listener rejected:', error);
                    });
                }
            }
            catch (error) {
                debugLogger.debug('Chat recording failure listener threw:', error);
            }
        }
        return this.writeFailure;
    }
    enqueueRecordWrite(conversationFile, record) {
        const pendingWrite = this.writeChain.then(async () => {
            try {
                await jsonl.writeLine(conversationFile, record);
            }
            catch (error) {
                throw this.enterWriteFailure(error, record.sessionId);
            }
        });
        this.writeChain = pendingWrite;
        // Mark fire-and-forget writes as handled without replacing the canonical
        // rejected chain that flush() and strict callers must continue to observe.
        void pendingWrite.catch(() => { });
        return pendingWrite;
    }
    /**
     * Fire-and-forget: queues a JSONL write on the internal writeChain.
     * A failed write permanently degrades this recorder; already-queued
     * descendants are skipped and later fire-and-forget calls become no-ops.
     */
    appendRecord(record, options) {
        if (this.writeFailure)
            return;
        let conversationFile;
        try {
            conversationFile = this.ensureConversationFile();
        }
        catch (error) {
            debugLogger.error('Error appending record:', error);
            throw error;
        }
        if (options?.updateActiveTail !== false) {
            this.lastRecordUuid = record.uuid;
        }
        this.enqueueRecordWrite(conversationFile, record);
        this.updateTitleAnchorTracking(record);
    }
    async appendRecordStrict(record, options) {
        if (this.writeFailure)
            throw this.writeFailure;
        const previousLastRecordUuid = this.lastRecordUuid;
        const updateActiveTail = options?.updateActiveTail !== false;
        let conversationFile;
        try {
            conversationFile = this.ensureConversationFile();
        }
        catch (error) {
            debugLogger.error('Error appending record:', error);
            throw error;
        }
        if (updateActiveTail) {
            this.lastRecordUuid = record.uuid;
        }
        const pendingWrite = this.enqueueRecordWrite(conversationFile, record);
        // Keep anchor accounting in logical queue order, matching appendRecord.
        // Once accepted, a failed write permanently stops this recorder, so no
        // rollback of this bookkeeping is needed on rejection.
        this.updateTitleAnchorTracking(record);
        try {
            await pendingWrite;
        }
        catch (error) {
            if (updateActiveTail && this.lastRecordUuid === record.uuid) {
                this.lastRecordUuid = previousLastRecordUuid;
            }
            throw error;
        }
    }
    /**
     * Maintain the "title is always in the tail window" invariant by
     * counting bytes accepted since the last `custom_title` record and
     * re-anchoring once enough non-title content has been written.
     *
     * - A `custom_title` record IS the new anchor — reset the counter.
     * - Without a current or pending title, the counter is irrelevant.
     * - Otherwise accumulate this record's serialized size; if the
     *   running total breaches the threshold, re-append a fresh
     *   `custom_title` to EOF. The recursive `appendRecord` call will
     *   land this branch's first arm (subtype === 'custom_title') and
     *   reset the counter to 0.
     *
     * Size estimate uses `JSON.stringify` for parity with the actual
     * write path (`jsonl.writeLine` serializes the same way). It's an
     * extra serialize per record, but appendRecord is already gated by
     * an async I/O write whose cost dominates by orders of magnitude.
     *
     * Byte count uses `Buffer.byteLength(..., 'utf8')`, not `String.length`:
     * `String.length` counts UTF-16 code units, but `jsonl.writeLine`
     * emits UTF-8 — multi-byte characters (CJK, emoji) are 2–3× larger
     * on disk than `.length` reports, and undercounting would let the
     * actual on-disk distance from the last anchor blow past the 64KB
     * tail window before the threshold fires.
     */
    updateTitleAnchorTracking(record) {
        if (record.type === 'system' && record.subtype === 'custom_title') {
            this.bytesSinceTitleAnchor = 0;
            this.hasNonTitleContentSinceTitleAnchor = false;
            return;
        }
        if (!this.currentCustomTitle && this.pendingTitleWrites === 0)
            return;
        this.hasNonTitleContentSinceTitleAnchor = true;
        let serializedRecord;
        try {
            serializedRecord = JSON.stringify(record);
        }
        catch {
            // Anchor bookkeeping must not change the writer's success contract.
            // The real serializer will surface the failure through writeChain.
            return;
        }
        // +1 for the trailing newline jsonl.writeLine appends.
        this.bytesSinceTitleAnchor +=
            Buffer.byteLength(serializedRecord, 'utf8') + 1;
        if (this.bytesSinceTitleAnchor >= TITLE_REANCHOR_BYTES &&
            this.pendingTitleWrites === 0) {
            this.reanchorTitle();
        }
    }
    /**
     * Append a fresh `custom_title` record to EOF using the in-memory
     * cached title. Mirrors {@link finalize}'s record shape — invoked
     * mid-session (every 32KB of other writes) so the picker's
     * tail-window scan never has to fall back to
     * scanning the middle of the file.
     */
    reanchorTitle() {
        if (!this.currentCustomTitle)
            return;
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'custom_title',
                systemPayload: {
                    customTitle: this.currentCustomTitle,
                    ...(this.currentTitleSource
                        ? { titleSource: this.currentTitleSource }
                        : {}),
                },
            };
            this.appendRecord(record, { updateActiveTail: false });
        }
        catch (error) {
            // Reset the counter even on failure: otherwise every subsequent
            // appendRecord re-fires reanchorTitle (counter still ≥ threshold)
            // and turns a transient I/O issue into an unbounded retry storm.
            // Skipping a single anchor write is the right tradeoff — finalize()
            // will re-emit one on the next lifecycle event.
            this.bytesSinceTitleAnchor = 0;
            debugLogger.error('Error re-anchoring custom title:', error);
        }
    }
    /**
     * Awaits all queued async writes. Call before process exit / session
     * teardown to ensure no records are dropped.
     */
    async flush() {
        await this.writeChain;
    }
    /**
     * Clears cached filesystem paths after Config swaps to a new working
     * directory. The recorder keeps session state, but future appends must
     * resolve the JSONL path through the updated Config.storage.
     */
    resetStoragePaths() {
        this.chatsDirEnsured = false;
        this.cachedConversationFile = undefined;
    }
    /**
     * Records a user message.
     * Queues the write immediately on the serialized async writer.
     *
     * @param message The raw PartListUnion object as used with the API
     */
    recordUserMessage(message) {
        try {
            this.turnParentUuids.push(this.lastRecordUuid);
            const record = {
                ...this.createBaseRecord('user'),
                message: createUserContent(message),
            };
            this.appendRecord(record);
            this.afterWrite(record);
        }
        catch (error) {
            debugLogger.error('Error saving user message:', error);
        }
    }
    /**
     * Records a user message drained while tool results are being submitted.
     *
     * The model sees these as extra user-role parts in the same API Content as
     * tool results. Keeping a distinct subtype lets resume reconstruct that shape
     * instead of replaying consecutive user-role entries.
     */
    recordMidTurnUserMessage(message, displayText) {
        try {
            const record = {
                ...this.createBaseRecord('user'),
                subtype: 'mid_turn_user_message',
                message: createUserContent(message),
                systemPayload: displayText
                    ? { displayText }
                    : undefined,
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error saving mid-turn user message:', error);
        }
    }
    /**
     * Records a cron-fired prompt.
     * Stored as a user-role message with subtype 'cron' so the UI
     * restores it as a notification item instead of a user turn.
     */
    recordCronPrompt(message, displayText) {
        this.recordNotificationLike(message, 'cron', displayText);
    }
    /**
     * Records a background agent notification.
     * Stored as a user-role message with subtype 'notification' so the
     * UI restores it as an info item, not a user turn.
     */
    recordNotification(message, displayText) {
        this.recordNotificationLike(message, 'notification', displayText);
    }
    recordNotificationLike(message, subtype, displayText) {
        try {
            const record = {
                ...this.createBaseRecord('user'),
                subtype,
                message: createUserContent(message),
                systemPayload: displayText
                    ? { displayText }
                    : undefined,
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error(`Error saving ${subtype} record:`, error);
        }
    }
    /**
     * Records an assistant turn with all available data.
     * Queues the write immediately on the serialized async writer.
     *
     * @param data.message The raw PartListUnion object from the model response
     * @param data.model The model name
     * @param data.tokens Token usage statistics
     * @param data.contextWindowSize Context window size of the model
     * @param data.toolCallsMetadata Enriched tool call info for UI recovery
     */
    recordAssistantTurn(data) {
        try {
            const record = {
                ...this.createBaseRecord('assistant'),
                model: data.model,
            };
            if (data.message !== undefined) {
                record.message = createModelContent(data.message);
            }
            if (data.tokens) {
                record.usageMetadata = data.tokens;
            }
            if (data.contextWindowSize !== undefined) {
                record.contextWindowSize = data.contextWindowSize;
            }
            this.appendRecord(record);
            this.afterWrite(record);
            this.maybeTriggerAutoTitle();
        }
        catch (error) {
            debugLogger.error('Error saving assistant turn:', error);
        }
    }
    /**
     * Fire-and-forget: after an assistant turn is recorded, attempt to generate
     * a short session title from the conversation so far. Runs at most once per
     * process lifetime per session and only when:
     *
     * - No title is already set (auto must never overwrite a manual rename,
     *   and we don't need to regenerate an existing auto title mid-session).
     * - A fast model is configured — the service itself also guards this,
     *   but checking here avoids paying for the import/history load when
     *   there's no point.
     *
     * Errors are swallowed. The title is best-effort and must never surface
     * as a user-visible error or interrupt recording.
     */
    maybeTriggerAutoTitle() {
        if (this.currentCustomTitle)
            return;
        if (this.writeFailure)
            return;
        if (this.pendingExplicitTitleWrites > 0)
            return;
        if (this.autoTitleController)
            return;
        if (this.autoTitleAttempts >= AUTO_TITLE_ATTEMPT_CAP)
            return;
        // Opt-out env var — lets users silence auto-titling without having to
        // unset their fast model (which would break `/rename --auto`, recap,
        // compression, and other fast-model features).
        if (autoTitleDisabledByEnv())
            return;
        // Headless/one-shot CLI flows (`hopcode -p "…"`, cron, CI scripts) run a
        // single prompt and throw the session away. Spending fast-model tokens
        // on a title no one will ever resume is pure waste; skip entirely.
        // Daemon (ACP) sessions are long-lived and user-resumable, so they
        // DO need auto-titles even though `isInteractive()` returns false
        // (the ACP child is spawned with pipe stdio, not a TTY).
        if (!this.config.isInteractive() &&
            !this.config.getExperimentalZedIntegration()) {
            return;
        }
        const fastModel = this.config.getFastModel();
        if (!fastModel)
            return;
        this.autoTitleAttempts++;
        const controller = new AbortController();
        this.autoTitleController = controller;
        void (async () => {
            try {
                const outcome = await tryGenerateSessionTitle(this.config, controller.signal);
                if (!outcome.ok)
                    return;
                if (controller.signal.aborted)
                    return;
                // Any explicit title, including `/rename --auto`, wins over this
                // background attempt even while its durable write is still pending.
                if (this.currentCustomTitle)
                    return;
                if (this.pendingExplicitTitleWrites > 0)
                    return;
                if (this.writeFailure)
                    return;
                // Cross-process guard: another CLI tab writing to the same JSONL
                // could have renamed (manually) since we started. Re-read the file's
                // latest title record before we append so we don't clobber it.
                // Cost is one 64KB tail read; happens once per successful generation.
                try {
                    const sessionService = this.config.getSessionService();
                    const onDisk = sessionService.getSessionTitleInfo(this.config.getSessionId());
                    if (onDisk.source === 'manual') {
                        // Sync in-memory state with what landed on disk so subsequent
                        // turns don't retry against a stale cache.
                        this.currentCustomTitle = onDisk.title;
                        this.currentTitleSource = 'manual';
                        return;
                    }
                }
                catch {
                    // Best-effort — if the re-read fails for any reason, fall through
                    // to the in-process check (which already passed) and proceed.
                }
                if (controller.signal.aborted)
                    return;
                if (this.currentCustomTitle)
                    return;
                if (this.pendingExplicitTitleWrites > 0)
                    return;
                if (this.writeFailure)
                    return;
                await this.persistCustomTitle(outcome.title, 'auto');
            }
            catch (err) {
                // Don't permanently disable: transient failures (network blips, rate
                // limits, bad UTF-16 in one turn's history) should still allow a
                // later turn to retry. The attempt cap bounds total waste.
                debugLogger.warn(`Auto-title generation failed: ${err instanceof Error ? err.message : String(err)}`);
            }
            finally {
                // Clear only if we're still the active controller — `finalize()`
                // may have swapped to a new one during a subsequent session, and
                // we shouldn't overwrite that.
                if (this.autoTitleController === controller) {
                    this.autoTitleController = undefined;
                }
            }
        })();
    }
    /**
     * Records tool results (function responses) sent back to the model.
     * Queues the write immediately on the serialized async writer.
     *
     * @param message The raw PartListUnion object with functionResponse parts
     * @param toolCallResult Optional tool call result info for UI recovery
     */
    recordToolResult(message, toolCallResult) {
        try {
            const record = {
                ...this.createBaseRecord('tool_result'),
                message: createUserContent(message),
            };
            if (toolCallResult) {
                const recordingToolCallResult = sanitizeToolCallResultForRecording(toolCallResult);
                // special case for task executions - we don't want to record the tool calls
                if (typeof recordingToolCallResult.resultDisplay === 'object' &&
                    recordingToolCallResult.resultDisplay !== null &&
                    'type' in recordingToolCallResult.resultDisplay &&
                    recordingToolCallResult.resultDisplay.type === 'task_execution') {
                    const taskResult = recordingToolCallResult.resultDisplay;
                    record.toolCallResult = {
                        ...recordingToolCallResult,
                        resultDisplay: {
                            ...taskResult,
                            toolCalls: [],
                        },
                    };
                }
                else {
                    record.toolCallResult = recordingToolCallResult;
                }
            }
            this.appendRecord(record);
            this.afterWrite(record);
        }
        catch (error) {
            debugLogger.error('Error saving tool result:', error);
        }
    }
    /**
     * Records a slash command invocation as a system record. This keeps the model
     * history clean while allowing resume to replay UI output for commands like
     * /about.
     */
    recordSlashCommand(payload) {
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'slash_command',
                systemPayload: payload,
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error saving slash command record:', error);
        }
    }
    /**
     * Records a chat compression checkpoint as a system record. This keeps the UI
     * history immutable while allowing resume/continue flows to reconstruct the
     * compressed model-facing history from the stored snapshot.
     */
    recordChatCompression(payload) {
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'chat_compression',
                systemPayload: payload,
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error saving chat compression record:', error);
        }
    }
    /**
     * Records a UI telemetry event for replaying metrics on resume.
     */
    recordUiTelemetryEvent(uiEvent) {
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'ui_telemetry',
                systemPayload: { uiEvent },
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error saving ui telemetry record:', error);
        }
    }
    /**
     * Records a conversation rewind and re-roots the parentUuid chain.
     *
     * Sets `lastRecordUuid` back to the UUID that was current just before the
     * target user turn was recorded, then appends a rewind system record.
     * This makes all messages after that point sit on a dead branch in the
     * UUID tree, so `reconstructHistory()` will skip them on resume.
     *
     * @param targetTurnIndex 0-based index of the user turn to rewind to.
     *   For example, 0 means rewind to the very first user message (keeping
     *   nothing before it), 1 means keep the first user turn, etc.
     * @param payload Additional metadata to persist with the rewind record.
     */
    rewindRecording(targetTurnIndex, payload, survivingFileHistorySnapshots) {
        try {
            // Re-root: point back to the record just before the target user turn.
            this.lastRecordUuid = this.turnParentUuids[targetTurnIndex] ?? null;
            // Trim future boundaries — they no longer exist in the active branch.
            this.turnParentUuids = this.turnParentUuids.slice(0, targetTurnIndex);
            // The previous attribution snapshot now sits on the abandoned
            // branch — clear the dedup key so the next snapshot lands on the
            // active branch and `/resume` can find it. Without this, a
            // post-rewind identical snapshot would be skipped and the rewound
            // session would lose all attribution state on restore.
            this.lastAttributionSnapshotJson = undefined;
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'rewind',
                systemPayload: payload,
            };
            this.appendRecord(record);
            // Re-record surviving file history snapshots on the active branch so
            // they are visible to reconstructHistory on resume.
            if (survivingFileHistorySnapshots?.length) {
                this.recordFileHistorySnapshotBatch(survivingFileHistorySnapshots);
            }
        }
        catch (error) {
            debugLogger.error('Error saving rewind record:', error);
        }
    }
    /**
     * Rebuilds `turnParentUuids` from a reconstructed message list.
     *
     * Call this after resuming a session so that subsequent rewinds within
     * the resumed session have correct boundary data. Also updates
     * `lastRecordUuid` to the last record in the chain.
     */
    rebuildTurnBoundaries(messages) {
        this.turnParentUuids = [];
        for (let i = 0; i < messages.length; i++) {
            const record = messages[i];
            if (record.type === 'user' &&
                record.subtype !== 'notification' &&
                record.subtype !== 'cron' &&
                record.subtype !== 'mid_turn_user_message') {
                // Reconstructed histories can start mid-chain; the persisted edge is
                // the source of truth, not the previous item in this sliced list.
                this.turnParentUuids.push(record.parentUuid ?? null);
            }
        }
        // Ensure lastRecordUuid points to the end of the reconstructed chain.
        if (messages.length > 0) {
            this.lastRecordUuid = messages[messages.length - 1].uuid;
        }
    }
    /**
     * Observer invoked after a custom title record lands (manual or auto).
     * The ACP session layer registers here to push a live title notification
     * to connected daemon clients — without it, auto-generated titles are
     * only discoverable via the next session-list poll (generation runs in
     * this child process; the daemon bridge never sees it happen).
     */
    titleRecordedCallback;
    setTitleRecordedCallback(callback) {
        this.titleRecordedCallback = callback;
    }
    /**
     * Returns the currently registered title-recorded callback.
     * Used to chain callbacks (e.g., when a UI component needs to observe
     * title changes without replacing an existing ACP notification callback).
     */
    getTitleRecordedCallback() {
        return this.titleRecordedCallback;
    }
    /**
     * Durably records an explicit custom title for the session. Explicit title
     * requests take priority over the best-effort background auto-title task.
     *
     * @param customTitle The title text.
     * @param titleSource Where the title came from — defaults to `'manual'`
     *   so existing `/rename` call sites keep their behavior unchanged.
     * @returns true once the record is written, false on any I/O failure.
     */
    async recordCustomTitle(customTitle, titleSource = 'manual') {
        this.pendingExplicitTitleWrites++;
        this.autoTitleController?.abort();
        try {
            return await this.persistCustomTitle(customTitle, titleSource);
        }
        finally {
            this.pendingExplicitTitleWrites--;
        }
    }
    async persistCustomTitle(customTitle, titleSource) {
        this.pendingTitleWrites++;
        let persisted = false;
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'custom_title',
                systemPayload: { customTitle, titleSource },
            };
            await this.appendRecordStrict(record);
            this.currentCustomTitle = customTitle;
            this.currentTitleSource = titleSource;
            try {
                this.titleRecordedCallback?.(customTitle, titleSource, record.sessionId);
            }
            catch {
                // Observer errors must never break title recording.
            }
            persisted = true;
            return true;
        }
        catch (error) {
            if (error !== this.writeFailure) {
                debugLogger.error('Error saving custom title record:', error);
            }
            return false;
        }
        finally {
            this.pendingTitleWrites--;
            if (persisted &&
                this.pendingTitleWrites === 0 &&
                this.bytesSinceTitleAnchor >= TITLE_REANCHOR_BYTES &&
                !this.writeFailure) {
                this.reanchorTitle();
            }
        }
    }
    /**
     * Records the session that spawned this one (a `create_sub_session` caller).
     * Appended as a system record near the start of the transcript so the parent
     * lineage persists with the session and survives a daemon restart (the
     * session list rehydrates it by scanning the transcript). Immutable — written
     * once when the sub-session is created.
     *
     * @param parentSessionId Id of the spawning session.
     * @returns true once the record is durably written, false on I/O error.
     *   AWAITS the write (via the strict append path) rather than the
     *   fire-and-forget `appendRecord`, whose failure is only observable through
     *   a later `flush()` and cannot determine this call's return value.
     */
    async recordParentSession(parentSessionId) {
        // Idempotent: the lineage is immutable and written once. A bridge retry
        // (the write succeeded but its response was lost) must not append a second
        // record — the session would then carry two `parent_session` entries.
        if (this.currentParentSessionId === parentSessionId)
            return true;
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'parent_session',
                systemPayload: { parentSessionId },
            };
            await this.appendRecordStrict(record);
            this.currentParentSessionId = parentSessionId;
            return true;
        }
        catch (error) {
            if (error !== this.writeFailure) {
                debugLogger.error('Error saving parent session record:', error);
            }
            return false;
        }
    }
    /** Persist immutable creator attribution near the start of the transcript. */
    async recordSessionSource(sourceType, sourceId) {
        if (this.currentSourceType !== undefined) {
            return (this.currentSourceType === sourceType &&
                this.currentSourceId === sourceId);
        }
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'session_source',
                systemPayload: {
                    sourceType,
                    ...(sourceId !== undefined ? { sourceId } : {}),
                },
            };
            await this.appendRecordStrict(record);
            this.currentSourceType = sourceType;
            this.currentSourceId = sourceId;
            return true;
        }
        catch (error) {
            if (error !== this.writeFailure) {
                debugLogger.error('Error saving session source:', error);
            }
            return false;
        }
    }
    /**
     * Finalizes the current session by re-appending cached metadata to EOF, but
     * only after this recorder has appended non-title content since the last
     * title anchor. Pure load/resume must remain read-only so session lists do
     * not treat restored sessions as newly active.
     *
     * Best-effort: errors are logged but never thrown.
     */
    finalize() {
        // Cancel any pending auto-title LLM call — the session is transitioning
        // (switch / shutdown) and the result is no longer useful. Without this,
        // a slow fast-model call could keep a socket open past the logical end
        // of the session.
        if (this.autoTitleController) {
            try {
                this.autoTitleController.abort();
            }
            catch {
                // best-effort
            }
        }
        // A pending explicit rename owns the next title anchor. Re-appending the
        // previous cached title behind it would make the JSONL tail revert after
        // the rename succeeds.
        if (this.pendingExplicitTitleWrites > 0) {
            return;
        }
        if (!this.currentCustomTitle) {
            return;
        }
        if (!this.hasNonTitleContentSinceTitleAnchor) {
            return;
        }
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'custom_title',
                systemPayload: {
                    customTitle: this.currentCustomTitle,
                    ...(this.currentTitleSource
                        ? { titleSource: this.currentTitleSource }
                        : {}),
                },
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error finalizing session metadata:', error);
        }
    }
    /**
     * Records @-command metadata as a system record for UI reconstruction.
     */
    recordAtCommand(payload) {
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'at_command',
                systemPayload: payload,
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error saving @-command record:', error);
        }
    }
    /**
     * Records an attribution state snapshot for session persistence.
     * Called at the start of every non-retry turn so that a resumed session
     * sees the most recent state including edits made during the prior turn.
     *
     * Deduplicates identical successive writes: if the snapshot's JSON
     * form is byte-identical to the last one we wrote, skip the append.
     * Without this, sessions that touch many files would write a full
     * duplicate of the entire snapshot to the JSONL on every turn, even
     * when nothing changed — inflating session size and slowing /resume.
     *
     * Set the dedup key optimistically so synchronous identical calls (common
     * during a tool-driven turn) dedup correctly. A synchronous setup failure
     * rolls the key back; an async write failure permanently degrades this
     * recorder, so the current instance never retries it.
     */
    recordAttributionSnapshot(snapshot) {
        let json;
        try {
            this.cachedGitBranch = undefined;
            json = JSON.stringify(snapshot);
            if (json === this.lastAttributionSnapshotJson) {
                return;
            }
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'attribution_snapshot',
                systemPayload: { snapshot },
            };
            this.lastAttributionSnapshotJson = json;
            this.appendRecord(record);
        }
        catch (error) {
            // Synchronous setup failures happen before an async write is queued and
            // do not degrade the recorder, so roll back the optimistic dedup key to
            // let the next identical snapshot retry.
            if (json !== undefined && this.lastAttributionSnapshotJson === json) {
                this.lastAttributionSnapshotJson = undefined;
            }
            debugLogger.error('Error saving attribution snapshot:', error);
        }
    }
    recordFileHistorySnapshot(snapshot) {
        try {
            this.appendSerializedFileHistorySnapshotBatch([
                serializeSnapshot(snapshot),
            ]);
        }
        catch (error) {
            debugLogger.error('Error saving file history snapshot:', error);
        }
    }
    recordFileHistorySnapshotBatch(snapshots) {
        if (snapshots.length === 0)
            return;
        try {
            const serialized = snapshots.map(serializeSnapshot);
            this.appendSerializedFileHistorySnapshotBatch(serialized);
        }
        catch (error) {
            debugLogger.error('Error saving file history snapshot batch:', error);
        }
    }
    /**
     * Optional hook invoked synchronously after a record is queued for write.
     * Placeholder for upstream callers that invoke this method; does not
     * change local behavior.
     */
    afterWrite(_record) { }
    appendSerializedFileHistorySnapshotBatch(snapshots) {
        try {
            const record = {
                ...this.createBaseRecord('system'),
                type: 'system',
                subtype: 'file_history_snapshot',
                systemPayload: { snapshots },
            };
            this.appendRecord(record);
        }
        catch (error) {
            debugLogger.error('Error saving file history snapshot batch:', error);
        }
    }
    async recordSessionArtifactEvent(payload) {
        const record = {
            ...this.createBaseRecord('system'),
            type: 'system',
            subtype: 'session_artifact_event',
            systemPayload: payload,
        };
        await this.appendRecordStrict(record, { updateActiveTail: false });
    }
    async recordSessionArtifactSnapshot(payload) {
        const record = {
            ...this.createBaseRecord('system'),
            type: 'system',
            subtype: 'session_artifact_snapshot',
            systemPayload: payload,
        };
        await this.appendRecordStrict(record, { updateActiveTail: false });
    }
}
//# sourceMappingURL=chatRecordingService.js.map