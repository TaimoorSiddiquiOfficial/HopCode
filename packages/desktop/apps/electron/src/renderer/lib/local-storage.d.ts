/**
 * Centralized localStorage utility for the Electron renderer.
 * Provides type-safe access with consistent key prefixing.
 */
/**
 * All localStorage keys used in the app.
 * Centralized here to avoid magic strings and key collisions.
 */
export declare const KEYS: {
    readonly sidebarVisible: "sidebar-visible";
    readonly sidebarWidth: "sidebar-width";
    readonly sessionListWidth: "session-list-width";
    readonly sidebarMode: "sidebar-mode";
    readonly listFilter: "list-filter";
    readonly labelFilter: "label-filter";
    readonly viewFilters: "view-filters";
    readonly expandedFolders: "expanded-folders";
    readonly collapsedSidebarItems: "collapsed-sidebar-items";
    readonly chatGroupingMode: "chat-grouping-mode";
    readonly collapsedSessionGroups: "collapsed-session-groups";
    readonly focusModeEnabled: "focus-mode-enabled";
    readonly sessionFilesExpandedFolders: "session-files-expanded";
    readonly filePreviewWidth: "file-preview-width";
    readonly theme: "theme";
    readonly panelLayout: "panel-layout";
    readonly tabs: "tabs";
    readonly recentWorkingDirs: "recent-working-dirs";
    readonly turnCardExpansion: "turncard-expansion";
    readonly lastSelectedSessionId: "last-selected-session-id";
    readonly lastSettingsSubpage: "last-settings-subpage";
    readonly showConnectionIcons: "show-connection-icons";
    readonly whatsNewLastSeenVersion: "whats-new-last-seen-version";
    readonly workspaceUrl: "workspace-url";
};
export type StorageKey = typeof KEYS[keyof typeof KEYS];
/**
 * Get a value from localStorage with JSON parsing.
 * Returns fallback if key doesn't exist or parsing fails.
 */
export declare function get<T>(key: StorageKey, fallback: T, suffix?: string): T;
/**
 * Set a value in localStorage with JSON stringification.
 */
export declare function set<T>(key: StorageKey, value: T, suffix?: string): void;
/**
 * Remove a key from localStorage.
 */
export declare function remove(key: StorageKey, suffix?: string): void;
/**
 * Get raw string value (for non-JSON data like atomWithStorage compatibility).
 */
export declare function getRaw(key: StorageKey, suffix?: string): string | null;
/**
 * Set raw string value (for non-JSON data like atomWithStorage compatibility).
 */
export declare function setRaw(key: StorageKey, value: string, suffix?: string): void;
/**
 * Build a full key string for use with atomWithStorage or other APIs
 * that need the raw key string.
 */
export declare function getKeyString(key: StorageKey, suffix?: string): string;
