import * as React from "react";
import type { Session, Message, FileAttachment, PermissionRequest, CredentialRequest, CredentialResponse, LoadedSource, LoadedSkill } from "../../../shared/types";
import type { PermissionMode } from "@craft-agent/shared/agent/modes";
import type { ThinkingLevel } from "@craft-agent/shared/agent/thinking-levels";
import type { RichTextInputHandle } from "@/components/ui/rich-text-input";
interface ChatDisplayProps {
    session: Session | null;
    onSendMessage: (message: string, attachments?: FileAttachment[], skillSlugs?: string[]) => void;
    onOpenFile: (path: string) => void;
    onOpenUrl: (url: string) => void;
    currentModel: string;
    onModelChange: (model: string, connection?: string) => void;
    /** Callback when LLM connection changes (only works when session is empty) */
    onConnectionChange?: (connectionSlug: string) => void;
    /** Ref for the input, used for external focus control */
    textareaRef?: React.RefObject<RichTextInputHandle>;
    /** When true, disables input (e.g., when agent needs activation) */
    disabled?: boolean;
    /** Pending permission request for this session */
    pendingPermission?: PermissionRequest;
    /** Callback to respond to permission request */
    onRespondToPermission?: (sessionId: string, requestId: string, allowed: boolean, alwaysAllow: boolean, options?: import('../../../shared/types').PermissionResponseOptions) => void;
    /** Pending credential request for this session */
    pendingCredential?: CredentialRequest;
    /** Callback to respond to credential request */
    onRespondToCredential?: (sessionId: string, requestId: string, response: CredentialResponse) => void;
    /** Current thinking level ('off', 'think', 'max') */
    thinkingLevel?: ThinkingLevel;
    /** Callback when thinking level changes */
    onThinkingLevelChange?: (level: ThinkingLevel) => void;
    /** Current permission mode */
    permissionMode?: PermissionMode;
    onPermissionModeChange?: (mode: PermissionMode) => void;
    /** Enabled permission modes for Shift+Tab cycling */
    enabledModes?: PermissionMode[];
    /** Current input value - preserved across mode switches and conversation changes */
    inputValue?: string;
    /** Callback when input value changes */
    onInputChange?: (value: string) => void;
    /** Messages waiting for the next tool-result boundary, shown above the input */
    queuedInputMessages?: Message[];
    /** Persisted attachment draft for this session (hydrated from disk in ChatPage) */
    attachmentsValue?: FileAttachment[];
    /** Callback when attachment draft changes (add, remove, clear on send) */
    onAttachmentsChange?: (attachments: FileAttachment[]) => void;
    /** Available sources (enabled only) */
    sources?: LoadedSource[];
    /** Callback when source selection changes */
    onSourcesChange?: (slugs: string[]) => void;
    /** Available skills for @mention autocomplete */
    skills?: LoadedSkill[];
    /** Available label configs (tree) for label menu and badge display */
    labels?: import('@craft-agent/shared/labels').LabelConfig[];
    /** Callback when labels change */
    onLabelsChange?: (labels: string[]) => void;
    /** Available workflow states */
    sessionStatuses?: import('@/config/session-status-config').SessionStatus[];
    /** Callback when session state changes */
    onSessionStatusChange?: (stateId: string) => void;
    /** Workspace ID for loading skill icons */
    workspaceId?: string;
    /** Current working directory for this session */
    workingDirectory?: string;
    /** Callback when working directory changes */
    onWorkingDirectoryChange?: (path: string) => void;
    /** Session folder path (for "Reset to Session Root" option) */
    sessionFolderPath?: string;
    /** When true, messages are still loading - show spinner in messages area */
    messagesLoading?: boolean;
    /** Disable send action (for tutorial guidance) */
    disableSend?: boolean;
    /** Search query for highlighting matches - passed from session list */
    searchQuery?: string;
    /** Whether search mode is active (prevents focus stealing to chat input) */
    isSearchModeActive?: boolean;
    /** Callback when match info changes - for immediate UI updates */
    onMatchInfoChange?: (info: {
        count: number;
        index: number;
        isHighlighting: boolean;
        sessionId: string | null;
    }) => void;
    /** Enable compact mode - hides non-essential UI elements for popover embedding */
    compactMode?: boolean;
    /** Custom placeholder for input (used in compact mode for edit context) */
    placeholder?: string | string[];
    /** Label shown as empty state in compact mode (e.g., "Permission Settings") */
    emptyStateLabel?: string;
    /** When true, the session's locked connection has been removed - disables send and shows unavailable state */
    connectionUnavailable?: boolean;
}
/**
 * Imperative handle exposed via forwardRef for navigation between matches
 */
export interface ChatDisplayHandle {
    goToNextMatch: () => void;
    goToPrevMatch: () => void;
    matchCount: number;
    currentMatchIndex: number;
    isHighlighting: boolean;
}
/**
 * ChatDisplay - Main chat interface for a selected session
 *
 * Structure:
 * - Session Header: Avatar + workspace name
 * - Messages Area: Scrollable list of MessageBubble components
 * - Input Area: Textarea + Send button
 *
 * Shows empty state when no session is selected
 */
export declare const ChatDisplay: React.ForwardRefExoticComponent<ChatDisplayProps & React.RefAttributes<ChatDisplayHandle>>;
export {};
