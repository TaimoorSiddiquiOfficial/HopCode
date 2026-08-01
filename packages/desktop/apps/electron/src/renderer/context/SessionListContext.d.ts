import type { LabelConfig } from "@craft-agent/shared/labels";
import type { SessionStatusId, SessionStatus } from "@/config/session-status-config";
import type { SessionMeta } from "@/atoms/sessions";
import type { SessionOptions } from "@/hooks/useSessionOptions";
import type { ContentSearchResult } from "@/hooks/useSessionSearch";
export interface SessionListContextValue {
    onRenameClick: (sessionId: string, currentName: string) => void;
    onSessionStatusChange: (sessionId: string, state: SessionStatusId) => void;
    onFlag?: (sessionId: string) => void;
    onUnflag?: (sessionId: string) => void;
    onArchive?: (sessionId: string) => void;
    onUnarchive?: (sessionId: string) => void;
    onMarkUnread: (sessionId: string) => void;
    onDelete: (sessionId: string, skipConfirmation?: boolean, displayTitle?: string) => Promise<boolean>;
    onLabelsChange?: (sessionId: string, labels: string[]) => void;
    onSelectSessionById: (sessionId: string) => void;
    onOpenInNewWindow: (item: SessionMeta) => void;
    onSendToWorkspace?: (sessionIds: string[]) => void;
    onFocusZone: () => void;
    onKeyDown: (e: React.KeyboardEvent, item: SessionMeta) => void;
    sessionStatuses: SessionStatus[];
    flatLabels: LabelConfig[];
    labels: LabelConfig[];
    searchQuery?: string;
    selectedSessionId?: string | null;
    isMultiSelectActive: boolean;
    sessionOptions?: Map<string, SessionOptions>;
    contentSearchResults: Map<string, ContentSearchResult>;
    /** DOM-verified match info for the active session (count, highlighting state) */
    activeChatMatchInfo?: {
        sessionId: string | null;
        count: number;
        isHighlighting?: boolean;
    };
    /** Whether a session currently has a pending permission/admin prompt */
    hasPendingPrompt?: (sessionId: string) => boolean;
}
export declare function useSessionListContext(): SessionListContextValue;
export declare const SessionListProvider: import("react").Provider<SessionListContextValue | null>;
