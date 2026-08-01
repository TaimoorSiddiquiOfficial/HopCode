/**
 * Settings Icons
 *
 * Custom SVG icons for settings pages. Used by both:
 * - AppMenu (logo dropdown settings submenu)
 * - SettingsNavigator (settings sidebar panel)
 *
 * These are more detailed than Lucide icons and provide visual consistency
 * across the settings UI.
 */
import type { SettingsSubpage } from '../../../shared/types';
type IconProps = {
    className?: string;
};
/** AI sparkles icon for AI settings */
export declare const AiSettingsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Custom app settings icon (toggle switches) */
export declare const AppSettingsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Palette icon for appearance settings */
export declare const AppearanceIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Keyboard icon for input settings */
export declare const InputIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Memory icon for managed memory settings */
export declare const MemorySettingsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Custom workspace icon */
export declare const WorkspaceIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Shield icon for permissions */
export declare const PermissionsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Tag icon for labels */
export declare const LabelsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Keyboard icon for shortcuts */
export declare const ShortcutsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Server/network icon for server settings */
export declare const ServerSettingsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** Message bubble icon for messaging settings */
export declare const MessagingSettingsIcon: ({ className }: IconProps) => import("react").JSX.Element;
/** User icon for preferences */
export declare const PreferencesIcon: ({ className }: IconProps) => import("react").JSX.Element;
/**
 * Map of settings subpage IDs to their icon components.
 * Used by both AppMenu and SettingsNavigator for consistent icons.
 */
export declare const SETTINGS_ICONS: Record<SettingsSubpage, React.ComponentType<IconProps>>;
export {};
