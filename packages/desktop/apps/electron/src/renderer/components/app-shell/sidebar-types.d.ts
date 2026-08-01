/**
 * Sidebar Mode Types
 *
 * Defines the different content modes for the 2nd sidebar.
 * The left sidebar navigation items control which mode is active.
 */
import type { SessionFilter, SettingsSubpage } from '../../../shared/types';
export type { SessionFilter, SettingsSubpage };
/**
 * Sidebar mode - determines what content is shown in the 2nd sidebar
 */
export type SidebarMode = {
    type: 'sessions';
    filter: SessionFilter;
} | {
    type: 'sources';
} | {
    type: 'settings';
    subpage: SettingsSubpage;
};
/**
 * Type guard to check if mode is sessions mode
 */
export declare const isSessionsMode: (mode: SidebarMode) => mode is {
    type: "sessions";
    filter: SessionFilter;
};
/**
 * Type guard to check if mode is sources mode
 */
export declare const isSourcesMode: (mode: SidebarMode) => mode is {
    type: "sources";
};
/**
 * Type guard to check if mode is settings mode
 */
export declare const isSettingsMode: (mode: SidebarMode) => mode is {
    type: "settings";
    subpage: SettingsSubpage;
};
/**
 * Get a persistence key for localStorage
 * Used to save/restore the last selected sidebar mode
 */
export declare const getSidebarModeKey: (mode: SidebarMode) => string;
/**
 * Parse a persistence key back to a SidebarMode
 * Returns null if the key is invalid or requires validation (state)
 */
export declare const parseSidebarModeKey: (key: string) => SidebarMode | null;
/**
 * Default sidebar mode - all sessions view
 */
export declare const DEFAULT_SIDEBAR_MODE: SidebarMode;
