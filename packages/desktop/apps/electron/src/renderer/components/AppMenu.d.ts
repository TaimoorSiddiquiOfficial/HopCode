import type { SettingsMenuItem } from "../../shared/menu-schema";
interface AppMenuProps {
    onNewChat: () => void;
    onNewWindow?: () => void;
    onOpenSettings: () => void;
    /** Navigate to a specific settings subpage */
    onOpenSettingsSubpage: (subpage: SettingsMenuItem['id']) => void;
    onOpenKeyboardShortcuts: () => void;
    onOpenStoredUserPreferences: () => void;
    onShowAbout?: () => void;
    onBack?: () => void;
    onForward?: () => void;
    canGoBack?: boolean;
    canGoForward?: boolean;
    onToggleSidebar?: () => void;
    onToggleFocusMode?: () => void;
}
/**
 * AppMenu - Main application dropdown menu and top bar navigation
 *
 * Contains the Craft logo dropdown with all menu functionality:
 * - File actions (New Chat, New Window)
 * - Edit submenu (Undo, Redo, Cut, Copy, Paste, Select All)
 * - View submenu (Zoom In/Out, Reset)
 * - Window submenu (Minimize, Maximize)
 * - Settings submenu (Settings, Stored User Preferences)
 * - Help submenu (Documentation, Keyboard Shortcuts)
 * - Debug submenu (dev only)
 * - Quit
 *
 * On Windows/Linux, this is the only menu (native menu is hidden).
 * On macOS, this mirrors the native menu for consistency.
 */
export declare function AppMenu({ onNewChat, onNewWindow, onOpenSettings, onOpenSettingsSubpage, onOpenKeyboardShortcuts, onOpenStoredUserPreferences, onShowAbout, onBack, onForward, canGoBack, canGoForward, onToggleSidebar, onToggleFocusMode, }: AppMenuProps): import("react").JSX.Element;
export {};
