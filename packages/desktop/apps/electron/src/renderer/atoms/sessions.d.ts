/**
 * Per-Session State Management with Jotai
 *
 * Uses atomFamily to create isolated atoms per session.
 * Updates to one session don't trigger re-renders in other sessions.
 *
 * This solves the performance issue where streaming in Session A
 * caused re-renders and focus loss in Session B.
 */
import type { Session } from '../../shared/types';
/**
 * Session metadata for list display (lightweight, no messages)
 * Used by SessionList to avoid re-rendering on message changes
 */
export interface SessionMeta {
    id: string;
    name?: string;
    /** Preview of first user message (for title fallback) */
    preview?: string;
    workspaceId: string;
    /** Last time the session was opened or persisted. Used only as a fallback for legacy sessions without lastMessageAt. */
    lastUsedAt?: number;
    lastMessageAt?: number;
    isProcessing?: boolean;
    isFlagged?: boolean;
    lastReadMessageId?: string;
    workingDirectory?: string;
    enabledSourceSlugs?: string[];
    /** Shared viewer URL (if shared via viewer) */
    sharedUrl?: string;
    /** Shared session ID in viewer (for revoke) */
    sharedId?: string;
    /** ID of the last final (non-intermediate) assistant message - for unread detection */
    lastFinalMessageId?: string;
    /**
     * Explicit unread flag - single source of truth for NEW badge.
     * Set to true when assistant message completes while user is NOT viewing.
     * Set to false when user views the session (and not processing).
     */
    hasUnread?: boolean;
    /** Labels for filtering (additive tags, many-per-session) */
    labels?: string[];
    /** Permission mode — used by view expressions */
    permissionMode?: string;
    /** Session status for filtering */
    sessionStatus?: string;
    /** Role/type of the last message (for badge display without loading messages) */
    lastMessageRole?: 'user' | 'assistant' | 'plan' | 'tool' | 'error';
    /** Whether an async operation is ongoing (sharing, updating share, revoking, title regeneration) */
    isAsyncOperationOngoing?: boolean;
    /** @deprecated Use isAsyncOperationOngoing instead */
    isRegeneratingTitle?: boolean;
    /** Model override for this session */
    model?: string;
    /** LLM connection slug for this session */
    llmConnection?: string;
    /** Token usage stats (from JSONL header, available without loading messages) */
    tokenUsage?: {
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
        costUsd: number;
        contextTokens: number;
    };
    /** When the session was created (ms timestamp) */
    createdAt?: number;
    /** Total number of messages in this session */
    messageCount?: number;
    /** When true, session is hidden from session list (e.g., mini edit sessions) */
    hidden?: boolean;
    /** Whether this session is archived */
    isArchived?: boolean;
    /** Timestamp when session was archived (for retention policy) */
    archivedAt?: number;
}
type SessionOrderFields = {
    id: string;
    lastMessageAt?: number;
    lastUsedAt?: number;
    createdAt?: number;
};
type SessionFlagFields = {
    isFlagged?: boolean;
};
export declare function getSessionOrderTime(session: SessionOrderFields): number;
export declare function compareSessionsByActivityDesc(a: SessionOrderFields, b: SessionOrderFields): number;
export declare function compareSessionsByFlaggedThenActivityDesc<T extends SessionOrderFields & SessionFlagFields>(a: T, b: T): number;
export declare function prioritizeFlaggedSessions<T extends SessionFlagFields>(sessions: T[]): T[];
export declare function mergeStableSessionMetaList(previous: SessionMeta[] | undefined, incoming: SessionMeta[]): SessionMeta[];
export declare function areSessionMetaListsEquivalent(a: SessionMeta[] | undefined, b: SessionMeta[]): boolean;
export declare function sessionFromMeta(meta: SessionMeta, workspaceName?: string): Session;
/**
 * Extract metadata from a full session object
 */
export declare function extractSessionMeta(session: Session): SessionMeta;
/**
 * Atom family for individual session state
 * Each session gets its own atom - updates are isolated
 */
export declare const sessionAtomFamily: any;
/**
 * Atom for session metadata map (for list display)
 * Only contains lightweight data needed for SessionList
 */
export declare const sessionMetaMapAtom: any;
/**
 * Workspace-scoped session state. This is the source used by the project tree
 * and workspace switcher so each workspace keeps its own metadata and order in
 * memory instead of relying on the currently selected workspace's flat list.
 */
export interface WorkspaceSessionState {
    sessionMetaMap: Map<string, SessionMeta>;
    sessionOrder: string[];
    loadedAt?: number;
    isRefreshing?: boolean;
    error?: string;
}
export declare const workspaceSessionsAtom: any;
export declare function getWorkspaceSessionMetas(workspaceSessions: Map<string, WorkspaceSessionState>, workspaceId: string | null | undefined): SessionMeta[];
/**
 * Backward-compatible workspace metadata view. New code should prefer
 * workspaceSessionsAtom, but existing callers can keep reading/writing the
 * Map<workspaceId, SessionMeta[]> shape while it is backed by the richer state.
 */
export declare const workspaceSessionMetaCacheAtom: any;
/**
 * Derived atom: ordered list of session IDs (for list ordering)
 */
export declare const sessionIdsAtom: any;
/**
 * Track which sessions have had their messages loaded (for lazy loading)
 * Sessions are loaded with empty messages initially, messages are fetched on-demand
 */
export declare const loadedSessionsAtom: any;
/**
 * Currently active session ID - the session displayed in the main content area
 * This replaces the tab-based session selection
 */
export declare const activeSessionIdAtom: any;
/**
 * Action atom: update a single session
 * Only triggers re-render in components subscribed to this specific session
 */
export declare const updateSessionAtom: any;
/**
 * Action atom: update only session metadata (for list display updates)
 * Doesn't affect the full session atom
 */
export declare const updateSessionMetaAtom: any;
/**
 * Action atom: append message to session (for streaming)
 * Optimized to only update the specific session
 * Note: Does NOT update lastMessageAt - caller must handle timestamp updates
 * to avoid session list jumping on intermediate/tool messages
 */
export declare const appendMessageAtom: any;
/**
 * Action atom: update streaming content for a session
 * For text_delta events - appends to the last streaming message
 */
export declare const updateStreamingContentAtom: any;
/**
 * Action atom: initialize sessions from loaded data
 */
export declare const initializeSessionsAtom: any;
/**
 * Action atom: initialize or refresh one workspace without discarding cached
 * sessions/messages for other workspaces.
 */
export declare const initializeWorkspaceSessionsAtom: any;
/**
 * Action atom: refresh session metadata after a stale reconnect.
 *
 * Unlike initializeSessionsAtom (which resets everything for workspace switches),
 * this preserves messages for already-loaded sessions and only marks overwritten
 * metadata-only sessions as unloaded for lazy re-fetching.
 *
 * All cross-atom mutations happen inside a single write transaction so that
 * React subscribers see one consistent update instead of intermediate states.
 */
export declare const refreshSessionsMetadataAtom: any;
/**
 * Action atom: add a new session
 */
export declare const addSessionAtom: any;
/**
 * Action atom: remove a session
 */
export declare const removeSessionAtom: any;
/**
 * Action atom: sync React state to per-session atoms
 *
 * This is the key to the hybrid approach:
 * - React state (sessions array) remains the source of truth
 * - This atom syncs changes to per-session atoms automatically
 * - Components using useSession(id) get isolated updates
 * - Jotai's referential equality prevents unnecessary re-renders
 *
 * IMPORTANT: During streaming, the atom is the source of truth.
 * Streaming events (text_delta, tool_start, tool_result) update atoms directly
 * and bypass React state for performance. We must NOT overwrite atoms for
 * sessions that are processing, or we lose streaming data (tool calls, text).
 * Once a "handoff" event (complete, error, etc.) occurs, React state catches up
 * and sync works normally again.
 */
export declare const syncSessionsToAtomsAtom: any;
export declare const ensureSessionMessagesLoadedAtom: any;
/**
 * Force-refresh session messages even if the session is currently marked as loaded.
 * Used by reconnect recovery when a session atom is stuck in an empty-but-loaded state.
 */
export declare const forceSessionMessagesReloadAtom: any;
/**
 * Background task for ActiveTasksBar display
 */
export interface BackgroundTask {
    /** Task or shell ID */
    id: string;
    /** Task type */
    type: 'agent' | 'shell';
    /** Tool use ID for correlation with messages */
    toolUseId: string;
    /** When the task started */
    startTime: number;
    /** Elapsed seconds (from progress events) */
    elapsedSeconds: number;
    /** Task intent/description */
    intent?: string;
}
/**
 * Atom family for tracking active background tasks per session
 * Updated on task_backgrounded, shell_backgrounded, task_progress events
 * Cleared when tasks complete or are killed
 */
export declare const backgroundTasksAtomFamily: any;
/**
 * Window's current workspace ID — shared between Root (ThemeProvider) and App.
 * Written by App on workspace switch, read by Root to keep the theme in sync.
 */
export declare const windowWorkspaceIdAtom: any;
/**
 * State for "Send to Workspace" dialog.
 * Set session IDs to open; clear to close.
 */
export declare const sendToWorkspaceAtom: any;
export {};
