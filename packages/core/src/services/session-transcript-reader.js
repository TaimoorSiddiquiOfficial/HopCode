/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import { Storage } from '../config/storage.js';
import * as jsonl from '../utils/jsonl-utils.js';
import { createDebugLogger } from '../utils/debugLogger.js';
import { aggregateTranscriptRecordFragments, isTranscriptConversationRecord, validateTranscriptRecord, walkTranscriptUuidChain, } from '../utils/transcript-records.js';
export const SESSION_TRANSCRIPT_DEFAULT_LIMIT = 100;
export const SESSION_TRANSCRIPT_MAX_LIMIT = 500;
export const SESSION_TRANSCRIPT_CURSOR_VERSION = 1;
export const SESSION_TRANSCRIPT_MAX_INDEX_BYTES = 256 * 1024 * 1024;
export const SESSION_TRANSCRIPT_MAX_PAGE_BYTES = 4 * 1024 * 1024;
export class InvalidSessionTranscriptCursorError extends Error {
    constructor(message = 'Invalid transcript cursor') {
        super(message);
        this.name = 'InvalidSessionTranscriptCursorError';
    }
}
export class SessionTranscriptSnapshotUnavailableError extends Error {
    constructor(sessionId) {
        super(`Transcript snapshot is unavailable for session ${sessionId}`);
        this.name = 'SessionTranscriptSnapshotUnavailableError';
    }
}
export class SessionTranscriptTooLargeError extends Error {
    sessionId;
    snapshotSize;
    maxBytes;
    constructor(sessionId, snapshotSize, maxBytes) {
        super(`Transcript snapshot for session ${sessionId} is too large to index (${snapshotSize} bytes, max ${maxBytes} bytes)`);
        this.sessionId = sessionId;
        this.snapshotSize = snapshotSize;
        this.maxBytes = maxBytes;
        this.name = 'SessionTranscriptTooLargeError';
    }
}
export class SessionTranscriptPageTooLargeError extends Error {
    sessionId;
    pageBytes;
    maxBytes;
    constructor(sessionId, pageBytes, maxBytes) {
        super(`Transcript page for session ${sessionId} exceeds the page budget (${pageBytes} bytes, max ${maxBytes} bytes)`);
        this.sessionId = sessionId;
        this.pageBytes = pageBytes;
        this.maxBytes = maxBytes;
        this.name = 'SessionTranscriptPageTooLargeError';
    }
}
const INDEX_CACHE_MAX_ENTRIES = 32;
const INDEX_CACHE_MAX_BYTES = 64 * 1024 * 1024;
const INDEX_CACHE_TTL_MS = 5 * 60 * 1000;
const INDEX_ENTRY_BASE_BYTES = 256;
const INDEX_SEGMENT_BYTES = 64;
const INDEX_STRING_BYTES = 2;
const READ_CHUNK_SIZE = 64 * 1024;
const CURSOR_HMAC_KEY_BYTES = 32;
const CURSOR_HMAC_KEY_FILENAME = 'session-transcript-cursor-key';
const SESSION_TRANSCRIPT_SESSION_ID_PATTERN = /^[0-9a-fA-F-]{32,36}$/;
const debugLogger = createDebugLogger('SESSION_TRANSCRIPT');
const indexCache = new Map();
// Per-workspace HMAC signing keys are cached for the daemon's lifetime (keyed by
// key-file path). Rotating a key file externally therefore requires a daemon
// restart to take effect — the only in-process invalidation is the corrupt
// (wrong-length) key replacement in readCursorHmacKey. This is acceptable: the
// key protects cursor integrity across workspaces, not against a local adversary
// who can already read the key file next to the transcripts it signs.
const cursorHmacKeys = new Map();
let indexCacheMaxBytesForTest;
function makeSessionTranscriptNotFoundError(sessionId) {
    const error = new Error(`ENOENT: no such file or directory, open '${sessionId}.jsonl'`);
    error.code = 'ENOENT';
    error.errno = -2;
    error.syscall = 'open';
    return error;
}
function isObjectRecord(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function isFiniteNonNegativeInteger(value) {
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
}
function cursorPayload(state) {
    return {
        v: state.v,
        sessionId: state.sessionId,
        fileIdentity: {
            dev: state.fileIdentity.dev,
            ino: state.fileIdentity.ino,
        },
        snapshotSize: state.snapshotSize,
        position: state.position,
        ...(state.direction === 'backward' ? { direction: 'backward' } : {}),
        leafUuid: state.leafUuid,
        startTime: state.startTime,
        lastUpdated: state.lastUpdated,
        ...(state.replay !== undefined ? { replay: state.replay } : {}),
    };
}
function getCursorHmacKeyPath(workspaceCwd) {
    // This key binds cursors to one workspace and prevents remote cursor
    // tampering or cross-workspace replay. It is not intended to protect against
    // a local user who can already read the project directory and transcripts.
    return path.join(new Storage(workspaceCwd).getProjectDir(), CURSOR_HMAC_KEY_FILENAME);
}
function readCursorHmacKey(keyPath) {
    try {
        const key = Buffer.from(fs.readFileSync(keyPath, 'utf8').trim(), 'base64url');
        if (key.length === CURSOR_HMAC_KEY_BYTES) {
            return key;
        }
        debugLogger.warn(`invalid cursor signing key at ${keyPath}; replacing persisted key`);
        return undefined;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return undefined;
        }
        throw error;
    }
}
function writeCursorHmacKey(keyPath, key) {
    const encoded = `${key.toString('base64url')}\n`;
    fs.mkdirSync(path.dirname(keyPath), { recursive: true, mode: 0o700 });
    try {
        const fd = fs.openSync(keyPath, 'wx', 0o600);
        try {
            fs.writeFileSync(fd, encoded, 'utf8');
        }
        finally {
            fs.closeSync(fd);
        }
    }
    catch (error) {
        if (error.code === 'EEXIST') {
            const existing = readCursorHmacKey(keyPath);
            if (existing) {
                return existing;
            }
            fs.writeFileSync(keyPath, encoded, { encoding: 'utf8', mode: 0o600 });
        }
        else {
            throw error;
        }
    }
    return key;
}
function getCursorHmacKey(workspaceCwd) {
    const keyPath = getCursorHmacKeyPath(workspaceCwd);
    const cached = cursorHmacKeys.get(keyPath);
    if (cached)
        return cached;
    const key = readCursorHmacKey(keyPath) ??
        writeCursorHmacKey(keyPath, crypto.randomBytes(CURSOR_HMAC_KEY_BYTES));
    cursorHmacKeys.set(keyPath, key);
    return key;
}
function signCursorPayloadWithKey(payload, key) {
    return crypto
        .createHmac('sha256', key)
        .update(JSON.stringify(payload))
        .digest('base64url');
}
function hasValidCursorMacWithKey(payload, mac, key) {
    const expected = Buffer.from(signCursorPayloadWithKey(payload, key), 'utf8');
    const actual = Buffer.from(mac, 'utf8');
    return (expected.length === actual.length &&
        crypto.timingSafeEqual(expected, actual));
}
function encodeCursorState(state, key) {
    const payload = cursorPayload(state);
    return Buffer.from(JSON.stringify({
        ...payload,
        mac: signCursorPayloadWithKey(payload, key),
    }), 'utf8').toString('base64url');
}
function decodeCursorState(cursor, key) {
    try {
        const decoded = Buffer.from(cursor, 'base64url').toString('utf8');
        const parsed = JSON.parse(decoded);
        if (!isObjectRecord(parsed)) {
            throw new InvalidSessionTranscriptCursorError();
        }
        const fileIdentity = parsed['fileIdentity'];
        if (parsed['v'] !== SESSION_TRANSCRIPT_CURSOR_VERSION ||
            typeof parsed['sessionId'] !== 'string' ||
            !isObjectRecord(fileIdentity) ||
            !isFiniteNonNegativeInteger(fileIdentity['dev']) ||
            !isFiniteNonNegativeInteger(fileIdentity['ino']) ||
            !isFiniteNonNegativeInteger(parsed['snapshotSize']) ||
            !isFiniteNonNegativeInteger(parsed['position']) ||
            (parsed['direction'] !== undefined &&
                parsed['direction'] !== 'backward') ||
            typeof parsed['leafUuid'] !== 'string' ||
            typeof parsed['startTime'] !== 'string' ||
            typeof parsed['lastUpdated'] !== 'string' ||
            typeof parsed['mac'] !== 'string') {
            debugLogger.debug('cursor decode failed: invalid payload shape');
            throw new InvalidSessionTranscriptCursorError();
        }
        const state = {
            v: SESSION_TRANSCRIPT_CURSOR_VERSION,
            sessionId: parsed['sessionId'],
            fileIdentity: {
                dev: fileIdentity['dev'],
                ino: fileIdentity['ino'],
            },
            snapshotSize: parsed['snapshotSize'],
            position: parsed['position'],
            ...(parsed['direction'] === 'backward'
                ? { direction: 'backward' }
                : {}),
            leafUuid: parsed['leafUuid'],
            startTime: parsed['startTime'],
            lastUpdated: parsed['lastUpdated'],
            ...(parsed['replay'] !== undefined ? { replay: parsed['replay'] } : {}),
        };
        if (!hasValidCursorMacWithKey(cursorPayload(state), parsed['mac'], key)) {
            debugLogger.debug(`cursor decode failed: mac mismatch session=${state.sessionId} ` +
                `position=${state.position} snapshotSize=${state.snapshotSize}`);
            throw new InvalidSessionTranscriptCursorError();
        }
        debugLogger.debug(`cursor decoded session=${state.sessionId} position=${state.position} ` +
            `snapshotSize=${state.snapshotSize}`);
        return state;
    }
    catch (error) {
        if (error instanceof InvalidSessionTranscriptCursorError) {
            throw error;
        }
        debugLogger.debug(`cursor decode failed: ${error instanceof Error ? error.message : String(error)}`);
        throw new InvalidSessionTranscriptCursorError();
    }
}
export class SessionTranscriptCursorCodec {
    key;
    constructor(key) {
        if (key.byteLength !== CURSOR_HMAC_KEY_BYTES) {
            throw new RangeError(`Transcript cursor signing key must be ${CURSOR_HMAC_KEY_BYTES} bytes`);
        }
        this.key = Buffer.from(key);
    }
    encode(state) {
        return encodeCursorState(state, this.key);
    }
    decode(cursor) {
        return decodeCursorState(cursor, this.key);
    }
}
export function encodeSessionTranscriptCursor(state, workspaceCwd) {
    return encodeCursorState(state, getCursorHmacKey(workspaceCwd));
}
export function decodeSessionTranscriptCursor(cursor, workspaceCwd) {
    return decodeCursorState(cursor, getCursorHmacKey(workspaceCwd));
}
function normalizeLimit(limit) {
    if (limit === undefined)
        return SESSION_TRANSCRIPT_DEFAULT_LIMIT;
    if (!Number.isSafeInteger(limit) ||
        limit < 1 ||
        limit > SESSION_TRANSCRIPT_MAX_LIMIT) {
        throw new RangeError(`Transcript limit must be an integer from 1 to ${SESSION_TRANSCRIPT_MAX_LIMIT}`);
    }
    return limit;
}
function normalizeMaxBytes(maxBytes) {
    if (maxBytes === undefined)
        return undefined;
    if (!Number.isSafeInteger(maxBytes) || maxBytes < 1) {
        throw new RangeError('Transcript page byte limit must be a positive integer');
    }
    return maxBytes;
}
function recordSegmentBytes(index, uuid) {
    const entry = index.byUuid.get(uuid);
    return (entry?.segments.reduce((total, segment) => total + segment.length, 0) ?? 0);
}
function selectPageUuids(index, sessionId, position, limit, maxBytes) {
    const candidates = index.activeUuids.slice(position, position + limit);
    if (maxBytes === undefined)
        return candidates;
    const selected = [];
    let selectedBytes = 0;
    for (const uuid of candidates) {
        const bytes = recordSegmentBytes(index, uuid);
        if (selected.length === 0 && bytes > maxBytes) {
            throw new SessionTranscriptPageTooLargeError(sessionId, bytes, maxBytes);
        }
        if (selectedBytes + bytes > maxBytes)
            break;
        selected.push(uuid);
        selectedBytes += bytes;
    }
    return selected;
}
function isReplayTurnStart(index, uuid) {
    const entry = index.byUuid.get(uuid);
    return entry?.type === 'user' && entry.subtype !== 'mid_turn_user_message';
}
function selectBackwardPageUuids(index, sessionId, position, limit, maxBytes) {
    let start = Math.max(0, position - limit);
    for (let i = start; i < position; i++) {
        if (isReplayTurnStart(index, index.activeUuids[i])) {
            start = i;
            break;
        }
    }
    while (start > 0 && !isReplayTurnStart(index, index.activeUuids[start])) {
        start--;
    }
    let selectedStart = position;
    let selectedBytes = 0;
    for (let i = position - 1; i >= start; i--) {
        const uuid = index.activeUuids[i];
        const bytes = recordSegmentBytes(index, uuid);
        if (selectedStart === position &&
            maxBytes !== undefined &&
            bytes > maxBytes) {
            throw new SessionTranscriptPageTooLargeError(sessionId, bytes, maxBytes);
        }
        if (maxBytes !== undefined && selectedBytes + bytes > maxBytes)
            break;
        selectedStart = i;
        selectedBytes += bytes;
    }
    let alignedToReplayBoundary = false;
    for (let i = selectedStart; i < position; i++) {
        if (isReplayTurnStart(index, index.activeUuids[i])) {
            selectedStart = i;
            alignedToReplayBoundary = true;
            break;
        }
    }
    if (!alignedToReplayBoundary) {
        while (selectedStart > 0 &&
            !isReplayTurnStart(index, index.activeUuids[selectedStart])) {
            selectedStart--;
        }
        if (maxBytes !== undefined) {
            const alignedBytes = index.activeUuids
                .slice(selectedStart, position)
                .reduce((total, uuid) => total + recordSegmentBytes(index, uuid), 0);
            if (alignedBytes > maxBytes) {
                throw new SessionTranscriptPageTooLargeError(sessionId, alignedBytes, maxBytes);
            }
        }
    }
    return {
        uuids: index.activeUuids.slice(selectedStart, position),
        nextPosition: selectedStart,
    };
}
function fileIdentityFromStats(stats) {
    return { dev: stats.dev, ino: stats.ino };
}
function sameFileIdentity(a, b) {
    return a.dev === b.dev && a.ino === b.ino;
}
function makeCacheKey(filePath, fileIdentity, snapshotSize, lastUpdated) {
    // `lastUpdated` (file mtime) is part of the key so an in-place rewrite that
    // preserves the inode AND byte length (e.g. `rsync --inplace`, a redaction
    // pass) still invalidates the cached index instead of serving a stale one
    // whose byte offsets now point at different records.
    return `${filePath}:${fileIdentity.dev}:${fileIdentity.ino}:${snapshotSize}:${lastUpdated}`;
}
function getIndexCacheMaxBytes() {
    return indexCacheMaxBytesForTest ?? INDEX_CACHE_MAX_BYTES;
}
function estimateStringBytes(value) {
    return value ? value.length * INDEX_STRING_BYTES : 0;
}
function estimateIndexCacheBytes(index) {
    let total = INDEX_ENTRY_BASE_BYTES +
        estimateStringBytes(index.filePath) +
        estimateStringBytes(index.leafUuid) +
        estimateStringBytes(index.startTime) +
        estimateStringBytes(index.lastUpdated);
    for (const uuid of index.activeUuids) {
        total += estimateStringBytes(uuid);
    }
    for (const gap of index.gaps) {
        total +=
            INDEX_ENTRY_BASE_BYTES +
                estimateStringBytes(gap.childUuid) +
                estimateStringBytes(gap.missingParentUuid);
    }
    for (const [uuid, entry] of index.byUuid) {
        total +=
            INDEX_ENTRY_BASE_BYTES +
                estimateStringBytes(uuid) +
                estimateStringBytes(entry.parentUuid) +
                entry.segments.length * INDEX_SEGMENT_BYTES;
    }
    return total;
}
function getIndexCacheBytes() {
    let total = 0;
    for (const entry of indexCache.values()) {
        total += entry.byteSize ?? 0;
    }
    return total;
}
function pruneCache(now = Date.now()) {
    for (const [key, entry] of indexCache) {
        if (entry.expiresAt <= now) {
            indexCache.delete(key);
            debugLogger.debug(`index cache expired ${key}`);
        }
    }
    while (indexCache.size > INDEX_CACHE_MAX_ENTRIES) {
        const oldest = indexCache.keys().next().value;
        if (typeof oldest !== 'string')
            break;
        indexCache.delete(oldest);
        debugLogger.debug(`index cache evicted LRU ${oldest}`);
    }
    while (getIndexCacheBytes() > getIndexCacheMaxBytes()) {
        let evicted = false;
        for (const [key, entry] of indexCache) {
            if (!entry.byteSize)
                continue;
            indexCache.delete(key);
            debugLogger.debug(`index cache evicted by byte budget ${key}`);
            evicted = true;
            break;
        }
        if (!evicted)
            break;
    }
}
async function forEachLineInSnapshot(filePath, snapshotSize, onLine) {
    if (snapshotSize === 0)
        return;
    let pending = [];
    let pendingLength = 0;
    let pendingOffset = 0;
    let streamOffset = 0;
    const stream = fs.createReadStream(filePath, {
        start: 0,
        end: snapshotSize - 1,
        highWaterMark: READ_CHUNK_SIZE,
    });
    const makePendingLine = () => pending.length === 1 ? pending[0] : Buffer.concat(pending, pendingLength);
    for await (const chunk of stream) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        let lineStart = 0;
        while (lineStart < buffer.length) {
            const lineEnd = buffer.indexOf(0x0a, lineStart);
            if (lineEnd === -1)
                break;
            const lineOffset = pendingLength > 0 ? pendingOffset : streamOffset + lineStart;
            const currentLine = buffer.subarray(lineStart, lineEnd);
            const rawLine = pendingLength > 0
                ? Buffer.concat([...pending, currentLine], pendingLength + currentLine.length)
                : currentLine;
            const line = rawLine.length > 0 && rawLine[rawLine.length - 1] === 0x0d
                ? rawLine.subarray(0, rawLine.length - 1)
                : rawLine;
            onLine(line, lineOffset, line.length);
            pending = [];
            pendingLength = 0;
            lineStart = lineEnd + 1;
        }
        if (lineStart < buffer.length) {
            if (pendingLength === 0) {
                pendingOffset = streamOffset + lineStart;
            }
            const tail = buffer.subarray(lineStart);
            pending.push(tail);
            pendingLength += tail.length;
        }
        streamOffset += buffer.length;
    }
    if (pendingLength > 0) {
        const rawLine = makePendingLine();
        const line = rawLine[rawLine.length - 1] === 0x0d
            ? rawLine.subarray(0, rawLine.length - 1)
            : rawLine;
        onLine(line, pendingOffset, line.length);
    }
}
async function readSegmentRecords(handle, filePath, segment, uuid) {
    if (segment.length === 0)
        return [];
    const buffer = Buffer.alloc(segment.length);
    await handle.read(buffer, 0, segment.length, segment.offset);
    const line = buffer.toString('utf8').trim();
    if (line.length === 0)
        return [];
    const records = jsonl
        .parseLineTolerant(line, filePath)
        .flatMap((value) => {
        const record = validateTranscriptRecord(value).record;
        return record && isTranscriptConversationRecord(record)
            ? [record]
            : [];
    });
    const anomalySessionId = path.basename(filePath, '.jsonl');
    const record = records[segment.fragmentIndex];
    if (!record) {
        debugLogger.warn(`segment read anomaly: no fragment session=${anomalySessionId} ` +
            `uuid=${uuid} offset=${segment.offset} fragment=${segment.fragmentIndex}`);
        // The frozen snapshot changed under us (e.g. an in-place rewrite that kept
        // the inode and byte length): the recorded offset no longer parses to the
        // expected record. Surface it as snapshot-unavailable (→ 409) rather than
        // silently dropping the record and returning a short/empty transcript.
        throw new SessionTranscriptSnapshotUnavailableError(anomalySessionId);
    }
    if (record.uuid !== uuid) {
        debugLogger.warn(`segment read anomaly: uuid mismatch session=${anomalySessionId} ` +
            `expected=${uuid} actual=${record.uuid} offset=${segment.offset}`);
        throw new SessionTranscriptSnapshotUnavailableError(anomalySessionId);
    }
    return [record];
}
async function readAggregatedRecords(index, uuids) {
    const handle = await fsp.open(index.filePath, 'r');
    try {
        const records = [];
        for (const uuid of uuids) {
            const entry = index.byUuid.get(uuid);
            if (!entry)
                continue;
            const physicalRecords = [];
            for (const segment of entry.segments) {
                physicalRecords.push(...(await readSegmentRecords(handle, index.filePath, segment, uuid)));
            }
            if (physicalRecords.length > 0) {
                records.push(aggregateTranscriptRecordFragments(physicalRecords));
            }
        }
        return records;
    }
    finally {
        await handle.close();
    }
}
async function buildIndex(params) {
    const { filePath, fileIdentity, snapshotSize, lastUpdated } = params;
    const sessionId = path.basename(filePath, '.jsonl');
    if (snapshotSize > SESSION_TRANSCRIPT_MAX_INDEX_BYTES) {
        debugLogger.warn(`index rejected: snapshot too large session=${sessionId} ` +
            `snapshotSize=${snapshotSize} max=${SESSION_TRANSCRIPT_MAX_INDEX_BYTES}`);
        throw new SessionTranscriptTooLargeError(sessionId, snapshotSize, SESSION_TRANSCRIPT_MAX_INDEX_BYTES);
    }
    debugLogger.debug(`index build start session=${sessionId} snapshotSize=${snapshotSize}`);
    const byUuid = new Map();
    let sequence = 0;
    let leafUuid;
    let startTime;
    await forEachLineInSnapshot(filePath, snapshotSize, (line, offset, length) => {
        const text = line.toString('utf8').trim();
        if (text.length === 0)
            return;
        let fragmentIndex = 0;
        for (const value of jsonl.parseLineTolerant(text, filePath)) {
            const record = validateTranscriptRecord(value).record;
            if (!record || !isTranscriptConversationRecord(record)) {
                continue;
            }
            if (record.timestamp)
                startTime ??= record.timestamp;
            leafUuid = record.uuid;
            const existing = byUuid.get(record.uuid);
            const segment = {
                offset,
                length,
                sequence: sequence++,
                fragmentIndex,
            };
            fragmentIndex++;
            if (existing) {
                existing.segments.push(segment);
            }
            else {
                byUuid.set(record.uuid, {
                    parentUuid: record.parentUuid,
                    type: record.type,
                    ...(record.subtype !== undefined
                        ? { subtype: record.subtype }
                        : {}),
                    segments: [segment],
                });
            }
        }
    });
    if (!leafUuid) {
        debugLogger.warn(`index build failed: no transcript records session=${sessionId}`);
        throw new SessionTranscriptSnapshotUnavailableError(sessionId);
    }
    startTime ??= lastUpdated;
    const chain = walkTranscriptUuidChain(leafUuid, (uuid) => {
        const entry = byUuid.get(uuid);
        return entry
            ? {
                uuid,
                parentUuid: entry.parentUuid,
                sessionId,
                timestamp: startTime,
                type: 'system',
            }
            : undefined;
    });
    const activeUuids = [...chain.uuids];
    const gaps = [...chain.gaps];
    if (chain.cycleUuid) {
        debugLogger.debug(`active chain terminated: cycle session=${sessionId} uuid=${chain.cycleUuid}`);
    }
    debugLogger.debug(`index build complete session=${sessionId} records=${byUuid.size} ` +
        `active=${activeUuids.length} gaps=${gaps.length}`);
    return {
        filePath,
        fileIdentity,
        snapshotSize,
        leafUuid,
        activeUuids,
        gaps,
        startTime,
        lastUpdated,
        byUuid,
    };
}
async function getCachedIndex(params) {
    const now = Date.now();
    pruneCache(now);
    const key = makeCacheKey(params.filePath, params.fileIdentity, params.snapshotSize, params.lastUpdated);
    const cached = indexCache.get(key);
    if (cached?.value && cached.expiresAt > now) {
        indexCache.delete(key);
        indexCache.set(key, cached);
        debugLogger.debug(`index cache hit ${key}`);
        return cached.value;
    }
    if (cached?.pending && cached.expiresAt > now) {
        debugLogger.debug(`index cache pending hit ${key}`);
        return cached.pending;
    }
    debugLogger.debug(`index cache miss ${key}`);
    const pending = buildIndex(params);
    indexCache.set(key, {
        pending,
        expiresAt: now + INDEX_CACHE_TTL_MS,
    });
    try {
        const value = await pending;
        const byteSize = estimateIndexCacheBytes(value);
        if (byteSize > getIndexCacheMaxBytes()) {
            if (indexCache.get(key)?.pending === pending) {
                indexCache.delete(key);
            }
            debugLogger.debug(`index cache skipped oversized entry ${key} byteSize=${byteSize}`);
            return value;
        }
        indexCache.set(key, {
            value,
            byteSize,
            expiresAt: Date.now() + INDEX_CACHE_TTL_MS,
        });
        pruneCache();
        return value;
    }
    catch (error) {
        indexCache.delete(key);
        debugLogger.debug(`index cache build failed ${key}: ${error instanceof Error ? error.message : String(error)}`);
        throw error;
    }
}
export class SessionTranscriptReader {
    workspaceCwd;
    cursorCodec;
    storage;
    constructor(workspaceCwd, cursorCodec) {
        this.workspaceCwd = workspaceCwd;
        this.cursorCodec = cursorCodec;
        this.storage = new Storage(workspaceCwd);
    }
    getSessionFilePath(sessionId) {
        if (!SESSION_TRANSCRIPT_SESSION_ID_PATTERN.test(sessionId)) {
            debugLogger.debug(`invalid session id for transcript read: ${sessionId}`);
            throw makeSessionTranscriptNotFoundError(sessionId);
        }
        return path.join(this.storage.getProjectDir(), 'chats', `${sessionId}.jsonl`);
    }
    async readPage(sessionId, options = {}) {
        const limit = normalizeLimit(options.limit);
        const maxBytes = normalizeMaxBytes(options.maxBytes);
        const cursor = options.cursor !== undefined
            ? (this.cursorCodec?.decode(options.cursor) ??
                decodeSessionTranscriptCursor(options.cursor, this.workspaceCwd))
            : undefined;
        if (cursor && options.beforeRecordId !== undefined) {
            throw new InvalidSessionTranscriptCursorError();
        }
        if (cursor && cursor.sessionId !== sessionId) {
            debugLogger.debug(`cursor session mismatch requested=${sessionId} cursor=${cursor.sessionId}`);
            throw new InvalidSessionTranscriptCursorError();
        }
        const filePath = this.getSessionFilePath(sessionId);
        const stats = await fsp.stat(filePath);
        const currentIdentity = fileIdentityFromStats(stats);
        const snapshotSize = cursor?.snapshotSize ?? stats.size;
        const fileIdentity = cursor?.fileIdentity ?? currentIdentity;
        if (stats.size < snapshotSize ||
            !sameFileIdentity(currentIdentity, fileIdentity)) {
            debugLogger.warn(`snapshot unavailable session=${sessionId} ` +
                `currentSize=${stats.size} cursorSize=${snapshotSize} ` +
                `currentIdentity=${currentIdentity.dev}:${currentIdentity.ino} ` +
                `cursorIdentity=${fileIdentity.dev}:${fileIdentity.ino}`);
            throw new SessionTranscriptSnapshotUnavailableError(sessionId);
        }
        const index = await getCachedIndex({
            filePath,
            fileIdentity,
            snapshotSize,
            lastUpdated: cursor?.lastUpdated ?? new Date(stats.mtimeMs).toISOString(),
        });
        if (cursor && cursor.leafUuid !== index.leafUuid) {
            debugLogger.warn(`snapshot unavailable: leaf changed session=${sessionId} ` +
                `cursorLeaf=${cursor.leafUuid} indexLeaf=${index.leafUuid}`);
            throw new SessionTranscriptSnapshotUnavailableError(sessionId);
        }
        const direction = cursor?.direction ??
            (options.beforeRecordId !== undefined ? 'backward' : 'forward');
        let position = cursor?.position ?? 0;
        if (!cursor && options.beforeRecordId !== undefined) {
            if (options.beforeRecordId.length === 0) {
                throw new InvalidSessionTranscriptCursorError();
            }
            position = index.activeUuids.indexOf(options.beforeRecordId);
            if (position < 0) {
                throw new InvalidSessionTranscriptCursorError();
            }
        }
        if (position > index.activeUuids.length) {
            debugLogger.debug(`cursor position out of range session=${sessionId} ` +
                `position=${position} active=${index.activeUuids.length}`);
            throw new InvalidSessionTranscriptCursorError();
        }
        const backwardPage = direction === 'backward'
            ? selectBackwardPageUuids(index, sessionId, position, limit, maxBytes)
            : undefined;
        const pageUuids = backwardPage?.uuids ??
            selectPageUuids(index, sessionId, position, limit, maxBytes);
        const nextPosition = backwardPage?.nextPosition ?? position + pageUuids.length;
        const records = await readAggregatedRecords(index, pageUuids);
        const hasMore = direction === 'backward'
            ? nextPosition > 0
            : nextPosition < index.activeUuids.length;
        const nextCursorState = hasMore
            ? {
                v: SESSION_TRANSCRIPT_CURSOR_VERSION,
                sessionId,
                fileIdentity,
                snapshotSize,
                position: nextPosition,
                ...(direction === 'backward'
                    ? { direction: 'backward' }
                    : {}),
                leafUuid: index.leafUuid,
                startTime: index.startTime,
                lastUpdated: index.lastUpdated,
            }
            : undefined;
        debugLogger.debug(`read page session=${sessionId} position=${position} ` +
            `nextPosition=${nextPosition} records=${records.length} ` +
            `hasMore=${hasMore}`);
        return {
            sessionId,
            filePath,
            records,
            gaps: index.gaps,
            hasMore,
            ...(direction === 'backward' ? { direction: 'backward' } : {}),
            ...(nextCursorState ? { nextCursorState } : {}),
            ...(cursor?.replay !== undefined ? { replay: cursor.replay } : {}),
            startTime: index.startTime,
            lastUpdated: index.lastUpdated,
        };
    }
}
export function resetSessionTranscriptIndexCacheForTest() {
    indexCache.clear();
    cursorHmacKeys.clear();
    indexCacheMaxBytesForTest = undefined;
}
export function setSessionTranscriptIndexCacheMaxBytesForTest(maxBytes) {
    indexCacheMaxBytesForTest = maxBytes;
    pruneCache();
}
export function getSessionTranscriptIndexCacheStatsForTest() {
    return {
        entries: indexCache.size,
        byteSize: getIndexCacheBytes(),
    };
}
//# sourceMappingURL=session-transcript-reader.js.map