import type { LabelConfig } from "@craft-agent/shared/labels";
import { type FilterMode } from "@/hooks/useSessionSearch";
import { type SessionMeta } from "@/atoms/sessions";
import type { ViewConfig } from "@craft-agent/shared/views";
import type { SessionStatusId, SessionStatus } from "@/config/session-status-config";
export interface SessionListRow {
    item: SessionMeta;
}
/** Grouping mode for chat list */
export type ChatGroupingMode = 'none' | 'date' | 'status';
interface SessionListProps {
    items: SessionMeta[];
    onDelete: (sessionId: string, skipConfirmation?: boolean, displayTitle?: string) => Promise<boolean>;
    onFlag?: (sessionId: string) => void;
    onUnflag?: (sessionId: string) => void;
    onArchive?: (sessionId: string) => void;
    onUnarchive?: (sessionId: string) => void;
    onMarkUnread: (sessionId: string) => void;
    onSessionStatusChange: (sessionId: string, state: SessionStatusId) => void;
    onRename: (sessionId: string, name: string) => void;
    /** Called when Enter is pressed to focus chat input for a specific session */
    onFocusChatInput?: (sessionId?: string) => void;
    /** Called when a session is selected */
    onSessionSelect?: (session: SessionMeta) => void;
    /** Called when user wants to open a session in a new window */
    onOpenInNewWindow?: (session: SessionMeta) => void;
    /** Called to navigate to a specific view (e.g., 'allSessions', 'flagged') */
    onNavigateToView?: (view: 'allSessions' | 'flagged') => void;
    /** Unified session options per session (real-time state) */
    sessionOptions?: Map<string, import('../../hooks/useSessionOptions').SessionOptions>;
    /** Whether search mode is active */
    searchActive?: boolean;
    /** Current search query */
    searchQuery?: string;
    /** Called when search query changes */
    onSearchChange?: (query: string) => void;
    /** Called when search is closed */
    onSearchClose?: () => void;
    /** Dynamic todo states from workspace config */
    sessionStatuses?: SessionStatus[];
    /** View evaluator — evaluates a session and returns matching view configs */
    evaluateViews?: (meta: SessionMeta) => ViewConfig[];
    /** Label configs for resolving session label IDs to display info */
    labels?: LabelConfig[];
    /** Callback when session labels are toggled (for labels submenu in SessionMenu) */
    onLabelsChange?: (sessionId: string, labels: string[]) => void;
    /** How to group sessions: 'date' (default) or 'status' */
    groupingMode?: ChatGroupingMode;
    /** Workspace ID for content search (optional - if not provided, content search is disabled) */
    workspaceId?: string;
    /** Secondary status filter (status chips in "All Sessions" view) - for search result grouping */
    statusFilter?: Map<string, FilterMode>;
    /** Secondary label filter (label chips) - for search result grouping */
    labelFilterMap?: Map<string, FilterMode>;
    /** Override which session is highlighted (for multi-panel focused panel tracking) */
    focusedSessionId?: string | null;
    /** Override navigation target (for multi-panel: focuses existing panel or navigates focused panel) */
    onNavigateToSession?: (sessionId: string) => void;
    /** Session-level pending prompt marker (permission/admin approval) */
    hasPendingPrompt?: (sessionId: string) => boolean;
    /** DOM-verified match info for the active session (from ChatDisplay) */
    activeChatMatchInfo?: {
        sessionId: string | null;
        count: number;
        isHighlighting?: boolean;
    };
    /** Shows a lightweight loading state while the session metadata list is refreshing. */
    isLoading?: boolean;
}
export type { SessionStatusId };
/**
 * SessionList - Scrollable list of session cards with keyboard navigation
 *
 * Keyboard shortcuts:
 * - Arrow Up/Down: Navigate and select sessions (immediate selection)
 * - Arrow Left/Right: Navigate between zones
 * - Enter: Focus chat input
 * - Home/End: Jump to first/last session
 */
export declare function SessionList({ items, onDelete, onFlag, onUnflag, onArchive, onUnarchive, onMarkUnread, onSessionStatusChange, onRename, onFocusChatInput, onOpenInNewWindow, sessionOptions, searchActive, searchQuery, onSearchChange, onSearchClose, sessionStatuses, evaluateViews, labels, onLabelsChange, groupingMode, workspaceId, statusFilter, labelFilterMap, focusedSessionId, onNavigateToSession, hasPendingPrompt, activeChatMatchInfo, isLoading, }: SessionListProps): import("react").JSX.Element;
