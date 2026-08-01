/**
 * Settings Registry - Single Source of Truth
 *
 * This file defines all settings pages in one place. All other files that need
 * settings page information should import from here.
 *
 * To add a new settings page:
 * 1. Add an entry to SETTINGS_PAGES below
 * 2. Create the page component in renderer/pages/settings/
 * 3. Add to SETTINGS_PAGE_COMPONENTS in renderer/pages/settings/settings-pages.ts
 * 4. Add icon to SETTINGS_ICONS in renderer/components/icons/SettingsIcons.tsx
 *
 * That's it - types, routes, and validation are derived automatically.
 */
/**
 * Settings page definition
 */
export interface SettingsPageDefinition {
    /** Unique identifier used in routes and navigation */
    id: string;
    /** i18n key for display label in settings navigator */
    labelKey: string;
    /** i18n key for short description shown in settings navigator */
    descriptionKey: string;
}
/**
 * The canonical list of all settings pages.
 * Order here determines display order in the settings navigator.
 *
 * ADD NEW PAGES HERE - everything else derives from this list.
 *
 * NOTE: labelKey/descriptionKey are i18n translation keys, resolved at render
 * time via t(). Do NOT call i18n.t() here — this module loads before i18n init.
 */
export declare const SETTINGS_PAGES: ({
    id: "general";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "appearance";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "app";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "ai";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "input";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "shortcuts";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "memory";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "mcpServers";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "hooks";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "extensions";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "permissions";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "labels";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "messaging";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "server";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "workspace";
    labelKey: string;
    descriptionKey: string;
} | {
    id: "preferences";
    labelKey: string;
    descriptionKey: string;
})[];
/**
 * Settings subpage type - derived from SETTINGS_PAGES
 * This replaces the manual union type in types.ts
 */
export type SettingsSubpage = (typeof SETTINGS_PAGES)[number]['id'];
export declare const DEFAULT_SETTINGS_SUBPAGE: SettingsSubpage;
/**
 * Array of valid settings subpage IDs - for runtime validation
 */
export declare const VALID_SETTINGS_SUBPAGES: readonly SettingsSubpage[];
/**
 * Settings subpages that should be shown in settings navigation surfaces.
 */
export declare const VISIBLE_SETTINGS_SUBPAGES: readonly SettingsSubpage[];
/**
 * Type guard to check if a string is a valid settings subpage
 */
export declare function isValidSettingsSubpage(value: string): value is SettingsSubpage;
/**
 * Check if a valid settings subpage should be shown in settings navigation.
 */
export declare function isVisibleSettingsSubpage(value: SettingsSubpage): boolean;
/**
 * Get settings page definition by ID
 */
export declare function getSettingsPage(id: SettingsSubpage): SettingsPageDefinition;
