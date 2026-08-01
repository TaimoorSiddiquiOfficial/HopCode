/**
 * TopBar - Persistent top bar above all panels (Slack-style)
 *
 * Layout: [Sidebar] [Menu] [Back] [Forward]
 *
 * Fixed at top of window, 48px tall.
 * macOS: offset left to avoid stoplight controls.
 */
import type { SettingsMenuItem } from '../../../shared/menu-schema';
import type { Workspace } from '../../../shared/types';
import type { ViewRoute } from '../../../shared/routes';
interface TopBarProps {
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    onSelectWorkspace: (workspaceId: string, openInNewWindow?: boolean, options?: {
        route?: ViewRoute;
        suppressSessionListLoading?: boolean;
    }) => void | Promise<void>;
    workspaceUnreadMap?: Record<string, boolean>;
    onWorkspaceCreated?: (workspace: Workspace) => void;
    onWorkspaceRemoved?: () => void;
    onNewChat: () => void;
    onNewWindow?: () => void;
    onOpenSettings: () => void;
    onOpenSettingsSubpage: (subpage: SettingsMenuItem['id']) => void;
    onOpenKeyboardShortcuts: () => void;
    onShowAbout?: () => void;
    onBack: () => void;
    onForward: () => void;
    canGoBack: boolean;
    canGoForward: boolean;
    onToggleSidebar: () => void;
    onToggleFocusMode: () => void;
    /** When true, hides controls that don't apply in compact/mobile layout */
    isCompact?: boolean;
}
export declare function TopBar({ onNewChat, onNewWindow, onOpenSettings, onOpenSettingsSubpage, onOpenKeyboardShortcuts, onShowAbout, onBack, onForward, canGoBack, canGoForward, onToggleSidebar, onToggleFocusMode, isCompact, }: TopBarProps): import("react").JSX.Element;
export {};
