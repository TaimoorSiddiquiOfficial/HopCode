/**
 * Settings Page Components Registry
 *
 * Maps settings subpage IDs to their React components.
 * TypeScript enforces that all pages defined in settings-registry have a component here.
 *
 * To add a new settings page:
 * 1. Add to SETTINGS_PAGES in shared/settings-registry.ts
 * 2. Create the page component (e.g., NewSettingsPage.tsx)
 * 3. Add to SETTINGS_PAGE_COMPONENTS below
 * 4. Add icon to SETTINGS_ICONS in components/icons/SettingsIcons.tsx
 */
import type { ComponentType } from 'react';
import type { SettingsSubpage } from '../../../shared/settings-registry';
/**
 * Map of settings subpage IDs to their page components.
 * TypeScript will error if a page from SETTINGS_PAGES is missing here.
 */
export declare const SETTINGS_PAGE_COMPONENTS: Record<SettingsSubpage, ComponentType>;
/**
 * Get the component for a settings subpage
 */
export declare function getSettingsPageComponent(subpage: SettingsSubpage): ComponentType;
