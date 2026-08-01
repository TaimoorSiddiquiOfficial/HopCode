import * as React from "react";
import type { Workspace } from "../../../shared/types";
interface WorkspaceSwitcherProps {
    variant?: 'sidebar' | 'topbar';
    isCollapsed?: boolean;
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    onSelect: (workspaceId: string, openInNewWindow?: boolean) => void | Promise<void>;
    onWorkspaceCreated?: (workspace: Workspace) => void;
    onWorkspaceRemoved?: () => void;
    /** workspaceId -> has unread */
    workspaceUnreadMap?: Record<string, boolean>;
}
/**
 * WorkspaceSwitcher - Dropdown to select active workspace.
 *
 * Supports two trigger variants:
 * - sidebar: bottom-left selector trigger
 * - topbar: center top-bar selector trigger
 */
export declare function WorkspaceSwitcher({ variant, isCollapsed, workspaces, activeWorkspaceId, onSelect, onWorkspaceCreated, onWorkspaceRemoved, }: WorkspaceSwitcherProps): React.JSX.Element;
export {};
