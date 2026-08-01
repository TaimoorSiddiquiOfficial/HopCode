import type { StoredSession, SessionHeader } from './types.js';
declare function getHeaderMetadataSignature(header: SessionHeader): string;
declare function mergeHeaderWithExternalMetadata(localHeader: SessionHeader, diskHeader: SessionHeader): SessionHeader;
/**
 * Debounced async session persistence queue.
 * Prevents main thread blocking by using async writes and coalescing
 * rapid successive persist calls into a single write.
 *
 * IMPORTANT: Writes are serialized per-session to prevent race conditions
 * when rapid successive flushes (e.g., clearSessionForRecovery + onSdkSessionIdUpdate)
 * would otherwise write to the same .tmp file concurrently.
 */
declare class SessionPersistenceQueue {
    private pending;
    private writeInProgress;
    private lastWrittenHeaderSignature;
    private debounceMs;
    constructor(debounceMs?: number);
    /**
     * Queue a session for persistence. If a write is already pending for this
     * session, it will be replaced with the new data and the timer reset.
     */
    enqueue(session: StoredSession): void;
    /**
     * Write a session to disk immediately in JSONL format.
     * Uses atomic write (write-to-temp-then-rename) to prevent corruption on crash.
     */
    private write;
    /**
     * Immediately flush a specific session if pending.
     * Waits for any in-progress write to complete before starting a new one
     * to prevent race conditions on the shared .tmp file.
     */
    flush(sessionId: string): Promise<void>;
    /**
     * Cancel a pending write for a session (e.g., when deleting the session).
     */
    cancel(sessionId: string): void;
    /**
     * Flush all pending sessions. Call this on app quit.
     */
    flushAll(): Promise<void>;
    /**
     * Check if a session has a pending write.
     */
    hasPending(sessionId: string): boolean;
    /**
     * Get the metadata signature of the last header we wrote for a session.
     * Used by ConfigWatcher to suppress self-triggered metadata change events.
     */
    getLastWrittenSignature(sessionId: string): string | undefined;
    /**
     * Get count of pending writes.
     */
    get pendingCount(): number;
}
export declare const sessionPersistenceQueue: SessionPersistenceQueue;
export { SessionPersistenceQueue, getHeaderMetadataSignature, mergeHeaderWithExternalMetadata, };
