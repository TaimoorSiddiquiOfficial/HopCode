/**
 * Session Storage
 *
 * Workspace-scoped session CRUD operations.
 * Sessions are stored at {workspaceRootPath}/sessions/{id}/session.jsonl
 * Each session folder contains:
 * - session.jsonl (main data in JSONL format: line 1 = header, lines 2+ = messages)
 * - attachments/ (file attachments)
 * - plans/ (plan files for Safe Mode)
 * - data/ (transform_data tool output: JSON files for datatable/spreadsheet blocks)
 * - long_responses/ (full tool results that were summarized due to size limits)
 * - downloads/ (binary files downloaded from API sources: PDFs, images, archives, etc.)
 */
import type { SessionConfig, StoredSession, SessionMetadata, SessionStatus } from './types.ts';
import type { Plan } from '../agent/plan-types.ts';
export type { SessionConfig } from './types.ts';
/**
 * Ensure sessions directory exists for a workspace
 */
export declare function ensureSessionsDir(workspaceRootPath: string): string;
/**
 * Get path to a session's directory
 *
 * SECURITY: Uses sanitizeSessionId() as defense-in-depth to prevent path traversal.
 * Callers should still validate sessionId before calling this function.
 */
export declare function getSessionPath(workspaceRootPath: string, sessionId: string): string;
/**
 * Get path to a session's JSONL file (inside session folder)
 */
export declare function getSessionFilePath(workspaceRootPath: string, sessionId: string): string;
/**
 * Ensure session directory exists with all subdirectories
 */
export declare function ensureSessionDir(workspaceRootPath: string, sessionId: string): string;
/**
 * Get the attachments directory for a session
 */
export declare function getSessionAttachmentsPath(workspaceRootPath: string, sessionId: string): string;
/**
 * Get the plans directory for a session
 */
export declare function getSessionPlansPath(workspaceRootPath: string, sessionId: string): string;
/**
 * Get the data directory for a session (transform_data tool output)
 */
export declare function getSessionDataPath(workspaceRootPath: string, sessionId: string): string;
/**
 * Get the downloads directory for a session (binary files from API responses)
 */
export declare function getSessionDownloadsPath(workspaceRootPath: string, sessionId: string): string;
/**
 * Generate a human-readable session ID.
 * Uses a prompt/title hint when available, otherwise falls back to a random
 * adjective-noun slug.
 */
export declare function generateSessionId(workspaceRootPath: string, slugHint?: string): string;
/**
 * Create a new session for a workspace
 */
export declare function createSession(workspaceRootPath: string, options?: {
    name?: string;
    workingDirectory?: string;
    enabledSourceSlugs?: string[];
    model?: string;
    llmConnection?: string;
    hidden?: boolean;
    sessionStatus?: SessionConfig['sessionStatus'];
    labels?: string[];
    isFlagged?: boolean;
    slugHint?: string;
}): Promise<SessionConfig>;
/**
 * Get or create a session with a specific ID
 * Used for --session <id> flag to allow user-defined session IDs
 */
export declare function getOrCreateSessionById(workspaceRootPath: string, sessionId: string): Promise<SessionConfig>;
/**
 * Save session immediately using the persistence queue.
 * Enqueues the session and flushes to ensure immediate write.
 *
 * This unified approach ensures all session writes go through the same
 * async code path, which is more reliable on Windows.
 *
 * Writes in JSONL format: line 1 = header, lines 2+ = messages
 */
export declare function saveSession(session: StoredSession): Promise<void>;
/**
 * Queue session for async persistence with debouncing.
 * Multiple rapid calls are coalesced into a single write.
 * Use this during active sessions to avoid blocking the main thread.
 */
export { sessionPersistenceQueue, getHeaderMetadataSignature } from './persistence-queue.js';
/**
 * Load session by ID
 * Loads session from folder structure in JSONL format.
 */
export declare function loadSession(workspaceRootPath: string, sessionId: string): StoredSession | null;
/**
 * List sessions for a workspace
 * Lists sessions from folder structure.
 *
 * Uses JSONL header for fast loading (only reads first line of each file).
 */
export declare function listSessions(workspaceRootPath: string): SessionMetadata[];
/**
 * Delete a session and its associated files
 * Deletes session folder and all associated files
 */
export declare function deleteSession(workspaceRootPath: string, sessionId: string): boolean;
/**
 * Clear messages from a session while preserving metadata.
 * Used for /clear command to reset conversation without creating a new session.
 * Also clears the SDK session ID to start a fresh backend conversation.
 */
export declare function clearSessionMessages(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Get or create the latest session for a workspace
 * Uses listActiveSessions to exclude archived sessions
 */
export declare function getOrCreateLatestSession(workspaceRootPath: string): Promise<SessionConfig>;
/**
 * Update SDK session ID for a session
 */
export declare function updateSessionSdkId(workspaceRootPath: string, sessionId: string, sdkSessionId: string): Promise<void>;
/**
 * Check if sdkCwd can be safely updated for a session.
 *
 * sdkCwd is normally immutable because the SDK stores session transcripts at
 * provider-specific per-CWD session folder. However, it's safe to update sdkCwd if
 * no SDK interaction has occurred yet (no transcripts to preserve).
 *
 * @returns true if sdkCwd can be updated (no messages and no SDK session ID)
 */
export declare function canUpdateSdkCwd(session: StoredSession): boolean;
/**
 * Update session metadata
 */
export declare function updateSessionMetadata(workspaceRootPath: string, sessionId: string, updates: Partial<Pick<SessionConfig, 'isFlagged' | 'name' | 'sessionStatus' | 'labels' | 'lastReadMessageId' | 'hasUnread' | 'enabledSourceSlugs' | 'workingDirectory' | 'sdkCwd' | 'sharedUrl' | 'sharedId' | 'model' | 'llmConnection' | 'isArchived' | 'archivedAt'>>): Promise<void>;
/**
 * Flag a session
 */
export declare function flagSession(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Unflag a session
 */
export declare function unflagSession(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Set session status
 */
export declare function setSessionStatus(workspaceRootPath: string, sessionId: string, sessionStatus: SessionStatus): Promise<void>;
/**
 * Set labels for a session
 */
export declare function setSessionLabels(workspaceRootPath: string, sessionId: string, labels: string[]): Promise<void>;
/**
 * Archive a session
 */
export declare function archiveSession(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Unarchive a session
 */
export declare function unarchiveSession(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Set pending plan execution state.
 * Called when user clicks "Accept & Compact" - stores the plan path
 * so it can be executed after compaction, even if the page reloads.
 */
export declare function setPendingPlanExecution(workspaceRootPath: string, sessionId: string, planPath: string, draftInputSnapshot?: string): Promise<void>;
/**
 * Mark compaction as complete for pending plan execution.
 * Called when compaction_complete event fires - sets awaitingCompaction to false
 * so reload recovery knows compaction finished and can trigger execution.
 */
export declare function markCompactionComplete(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Mark pending plan execution as already dispatched from the UI.
 * This prevents reload recovery from sending the same approval message twice
 * if cleanup fails after the send has already been kicked off.
 */
export declare function markPendingPlanExecutionDispatched(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Clear pending plan execution state.
 * Called after plan execution is sent, on new user message, or when
 * the pending execution is no longer relevant.
 */
export declare function clearPendingPlanExecution(workspaceRootPath: string, sessionId: string): Promise<void>;
/**
 * Get pending plan execution state for a session.
 * Used on reload to check if we need to resume plan execution.
 */
export declare function getPendingPlanExecution(workspaceRootPath: string, sessionId: string): {
    planPath: string;
    draftInputSnapshot?: string;
    awaitingCompaction: boolean;
    executionDispatched: boolean;
} | null;
/**
 * List flagged sessions (excludes archived)
 */
export declare function listFlaggedSessions(workspaceRootPath: string): SessionMetadata[];
/**
 * List completed sessions (category: closed)
 * Includes done, cancelled, and any custom "closed" statuses
 * Excludes archived sessions
 */
export declare function listCompletedSessions(workspaceRootPath: string): SessionMetadata[];
/**
 * List inbox sessions (category: open)
 * Includes todo, in-progress, needs-review, and any custom "open" statuses
 * Excludes archived sessions
 */
export declare function listInboxSessions(workspaceRootPath: string): SessionMetadata[];
/**
 * List archived sessions
 */
export declare function listArchivedSessions(workspaceRootPath: string): SessionMetadata[];
/**
 * List active (non-archived) sessions
 */
export declare function listActiveSessions(workspaceRootPath: string): SessionMetadata[];
/**
 * Delete archived sessions older than the specified number of days
 * Returns the number of sessions deleted
 */
export declare function deleteOldArchivedSessions(workspaceRootPath: string, retentionDays: number): number;
/**
 * Format a plan as markdown
 */
export declare function formatPlanAsMarkdown(plan: Plan): string;
/**
 * Parse a markdown plan file back to a Plan object
 */
export declare function parsePlanFromMarkdown(content: string, planId: string): Plan | null;
/**
 * Save a plan to a markdown file
 */
export declare function savePlanToFile(workspaceRootPath: string, sessionId: string, plan: Plan, fileName?: string): string;
/**
 * Load a plan from a markdown file by name
 */
export declare function loadPlanFromFile(workspaceRootPath: string, sessionId: string, fileName: string): Plan | null;
/**
 * Load a plan from a full file path
 */
export declare function loadPlanFromPath(filePath: string): Plan | null;
/**
 * List all plan files in a session
 */
export declare function listPlanFiles(workspaceRootPath: string, sessionId: string): Array<{
    name: string;
    path: string;
    modifiedAt: number;
}>;
/**
 * Delete a plan file
 */
export declare function deletePlanFile(workspaceRootPath: string, sessionId: string, fileName: string): boolean;
/**
 * Get the most recent plan file for a session
 */
export declare function getMostRecentPlanFile(workspaceRootPath: string, sessionId: string): {
    name: string;
    path: string;
} | null;
/**
 * Ensure attachments directory exists
 */
export declare function ensureAttachmentsDir(workspaceRootPath: string, sessionId: string): string;
