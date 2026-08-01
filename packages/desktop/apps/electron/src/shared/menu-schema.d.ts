/**
 * Shared Menu Schema
 *
 * Defines menu structure consumed by both:
 * - Main process: transforms to Electron MenuItemConstructorOptions
 * - Renderer: transforms to React dropdown components
 *
 * Single source of truth for labels, shortcuts, icons, and IPC channels.
 *
 * NOTE: All labels are i18n keys (e.g., "menu.edit"), NOT resolved strings.
 * Consumers must call t(item.labelKey) or i18n.t(item.labelKey) at render/build time.
 * This avoids stale translations from module-level i18n.t() calls.
 */
export interface MenuItemAction {
    type: 'action';
    id: string;
    labelKey: string;
    /** Link to the action registry (e.g., 'view.toggleSidebar').
     *  Enables future: derive display shortcuts from registry + propagate user overrides. */
    actionId?: string;
    shortcut: string;
    shortcutDisplayMac: string;
    shortcutDisplayOther: string;
    ipcChannel: string;
    icon: string;
}
export interface MenuItemRole {
    type: 'role';
    role: string;
    labelKey: string;
    shortcutDisplayMac?: string;
    shortcutDisplayOther?: string;
    icon: string;
    ipcChannel?: string;
}
export interface MenuItemSeparator {
    type: 'separator';
}
export type MenuItem = MenuItemAction | MenuItemRole | MenuItemSeparator;
export interface MenuSection {
    id: string;
    labelKey: string;
    icon: string;
    items: MenuItem[];
}
export declare const EDIT_MENU: MenuSection;
export declare const VIEW_MENU: MenuSection;
export declare const WINDOW_MENU: MenuSection;
export declare const MENU_SECTIONS: MenuSection[];
/**
 * Settings item definition
 * Used by both AppMenu (logo dropdown) and SettingsNavigator (sidebar panel)
 */
import { type SettingsSubpage } from './settings-registry';
export interface SettingsMenuItem {
    id: SettingsSubpage;
    labelKey: string;
    icon: string;
    descriptionKey: string;
}
/**
 * All settings pages - derived from settings-registry (single source of truth)
 * Order is determined by SETTINGS_PAGES in settings-registry.ts
 */
export declare const SETTINGS_ITEMS: SettingsMenuItem[];
/**
 * Get the display shortcut for the current platform
 */
export declare function getShortcutDisplay(item: MenuItemAction | MenuItemRole, isMac: boolean): string;
