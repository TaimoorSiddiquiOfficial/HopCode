/**
 * JSONL Session Storage
 *
 * Helpers for reading/writing sessions in JSONL format.
 * Format: Line 1 = SessionHeader, Lines 2+ = StoredMessage (one per line)
 */
import type { SessionHeader, StoredSession, StoredMessage } from './types.ts';
type HeaderWriteOptions = {
    omitMessageDerivedFields?: boolean;
    omitTranscriptDerivedFields?: boolean;
    omitTokenUsage?: boolean;
    preserveSessionTimestamps?: boolean;
};
/**
 * Replace absolute session directory paths with a portable token.
 * Applied after JSON.stringify so paths embedded anywhere in message content
 * (datatable src, planPath, attachment storedPath, etc.) are made portable.
 */
export declare function makeSessionPathPortable(jsonLine: string, sessionDir: string): string;
/**
 * Expand the portable session path token back to an absolute path.
 * Applied before JSON.parse so all path references resolve correctly at runtime.
 */
export declare function expandSessionPath(jsonLine: string, sessionDir: string): string;
/**
 * Read only the header (first line) from a session.jsonl file.
 * Uses low-level fs to read minimal bytes for fast list loading.
 */
export declare function readSessionHeader(sessionFile: string): SessionHeader | null;
/**
 * Read full session from JSONL file.
 * Parses header and all message lines.
 */
export declare function readSessionJsonl(sessionFile: string): StoredSession | null;
/**
 * Write session to JSONL format using atomic write (write-to-temp-then-rename).
 * Prevents file corruption if the process crashes mid-write: either the old
 * file remains intact or the new file is fully written. Never a partial file.
 *
 * Line 1: Header with pre-computed metadata
 * Lines 2+: Messages (one per line)
 */
export declare function writeSessionJsonl(sessionFile: string, session: StoredSession): void;
/**
 * Create a SessionHeader from a StoredSession.
 * Pre-computes messageCount, preview, and lastMessageRole for fast list loading.
 * Uses pickSessionFields() to ensure all persistent fields are included.
 */
export declare function createSessionHeader(session: StoredSession, options?: HeaderWriteOptions): SessionHeader;
/**
 * Async version of readSessionHeader for parallel I/O.
 * Uses fs/promises for non-blocking reads.
 */
export declare function readSessionHeaderAsync(sessionFile: string): Promise<SessionHeader | null>;
/**
 * Read only messages from a JSONL file (skips header).
 * Used for lazy loading when session is selected.
 * Resilient to corrupted/truncated lines (skips them instead of failing entirely).
 */
export declare function readSessionMessages(sessionFile: string): StoredMessage[];
export {};
