/**
 * Session Bundle — Serialization Format for Session Export/Import
 *
 * A SessionBundle is the portable representation of a session directory,
 * used for transferring sessions between workspaces (same-server or cross-server).
 *
 * This is the foundation for session dispatch (move/fork), backup, and sharing.
 */
import type { SessionHeader, StoredMessage } from './types.ts';
import { type BundleFile } from '../utils/bundle-files.ts';
export { type BundleFile, MAX_BUNDLE_SIZE_BYTES } from '../utils/bundle-files.ts';
/**
 * Dispatch mode determines how the imported session relates to the original.
 */
export type DispatchMode = 'move' | 'fork';
/**
 * Branch info for fork operations.
 * Enables SDK-level conversation branching on the target server,
 * so the forked session has full context from the original.
 */
export interface BundleBranchInfo {
    /** SDK session ID to branch from */
    sdkSessionId: string;
    /** SDK turn ID (branch point) */
    sdkTurnId: string;
    /** Working directory for SDK session storage */
    sdkCwd: string;
}
/**
 * Serialized representation of a session directory.
 * JSON envelope format — sessions are typically small (text + a few attachments).
 */
export interface SessionBundle {
    /** Bundle format version */
    version: 1;
    /** Session data (header metadata + full message history) */
    session: {
        /** Session metadata (id, name, timestamps, config) */
        header: SessionHeader;
        /** Full message history */
        messages: StoredMessage[];
    };
    /** All files from the session directory (attachments, plans, data, downloads, etc.) */
    files: BundleFile[];
    /** Branch info for fork operations (populated by the exporter when forking) */
    branchInfo?: BundleBranchInfo;
}
/**
 * Serialize a session directory into a SessionBundle.
 *
 * Reads the session JSONL and all associated files (attachments, plans, data, downloads).
 * Skips tmp/ directory and dotfiles. Validates total size against MAX_BUNDLE_SIZE_BYTES.
 *
 * @param workspaceRootPath - Root path of the workspace containing the session
 * @param sessionId - ID of the session to serialize
 * @returns SessionBundle or null if session doesn't exist or exceeds size limit
 */
export declare function serializeSession(workspaceRootPath: string, sessionId: string): SessionBundle | null;
/**
 * Validate a SessionBundle structure.
 * Checks version, required fields, and basic integrity.
 */
export declare function validateBundle(bundle: unknown): bundle is SessionBundle;
