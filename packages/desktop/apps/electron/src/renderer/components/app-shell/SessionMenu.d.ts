/**
 * SessionMenu - Shared menu content for session actions
 *
 * Used by:
 * - SessionList (dropdown via "..." button, context menu via right-click)
 * - ChatPage (title dropdown menu)
 *
 * Uses MenuComponents context to render with either DropdownMenu or ContextMenu
 * primitives, allowing the same component to work in both scenarios.
 *
 * Provides consistent session actions:
 * - Share / Shared submenu
 * - Status submenu
 * - Flag/Unflag
 * - Mark as Unread
 * - Rename
 * - Open in New Window
 * - Show in file manager
 * - Delete
 */
import * as React from 'react';
import { type SessionStatusId } from '@/config/session-status-config';
import type { SessionStatus } from '@/config/session-status-config';
import type { LabelConfig } from '@craft-agent/shared/labels';
import type { SessionMeta } from '@/atoms/sessions';
export interface SessionMenuProps {
    /** Session data — display state is derived from this */
    item: SessionMeta;
    /** Hide heavier metadata entrypoints for context menus while keeping core actions intact. */
    hideMetadataActions?: boolean;
    /** Hide Share/Shared entrypoint for title menus. */
    hideShareAction?: boolean;
    /** Hide messaging platform connection entrypoint for title menus. */
    hideMessagingAction?: boolean;
    /** Hide status entrypoint for title menus. */
    hideStatusAction?: boolean;
    /** Available todo states */
    sessionStatuses: SessionStatus[];
    /** All available label configs (tree structure) for the labels submenu */
    labels?: LabelConfig[];
    /** Callback when labels are toggled (receives full updated labels array) */
    onLabelsChange?: (labels: string[]) => void;
    /** Whether multiple workspaces exist (enables "Send to Workspace" item) */
    hasRemoteWorkspaces?: boolean;
    /** Callbacks */
    onRename: () => void;
    onFlag: () => void;
    onUnflag: () => void;
    onArchive: () => void;
    onUnarchive: () => void;
    onMarkUnread: () => void;
    onSessionStatusChange: (state: SessionStatusId) => void;
    onOpenInNewWindow: () => void;
    onSendToWorkspace?: () => void;
    onDelete: () => void;
}
/**
 * SessionMenu - Renders the menu items for session actions
 * This is the content only, not wrapped in a DropdownMenu
 */
export declare function SessionMenu({ item, hideMetadataActions, hideShareAction, hideMessagingAction, hideStatusAction, sessionStatuses, labels, onLabelsChange, onRename, onFlag, onUnflag, onArchive, onUnarchive, onMarkUnread, onSessionStatusChange, onOpenInNewWindow, onSendToWorkspace, onDelete, hasRemoteWorkspaces, }: SessionMenuProps): React.JSX.Element;
