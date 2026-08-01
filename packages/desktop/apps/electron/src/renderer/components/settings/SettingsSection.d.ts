/**
 * SettingsSection, SettingsGroup, SettingsDivider
 *
 * Structural components for organizing settings pages.
 */
import * as React from 'react';
export interface SettingsSectionProps {
    /** Section title */
    title: string;
    /** Optional description below title (supports ReactNode for inline links) */
    description?: React.ReactNode;
    /** Content - usually SettingsCard or SettingsRadioGroup */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Variant for different visual treatments */
    variant?: 'default' | 'danger';
    /** Optional action element (e.g., Edit button) shown at the right of the header */
    action?: React.ReactNode;
}
/**
 * SettingsSection - A semantic section with title and description
 *
 * @example
 * <SettingsSection title="Billing" description="Choose how you pay">
 *   <SettingsRadioGroup>...</SettingsRadioGroup>
 * </SettingsSection>
 */
export declare function SettingsSection({ title, description, children, className, variant, action, }: SettingsSectionProps): React.JSX.Element;
export interface SettingsGroupProps {
    /** Group title (displayed uppercase) */
    title: string;
    /** Content - usually multiple SettingsSection components */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
}
/**
 * SettingsGroup - Top-level divider for major sections (e.g., "App" vs "Workspace")
 *
 * @example
 * <SettingsGroup title="Workspace">
 *   <SettingsSection title="Model">...</SettingsSection>
 *   <SettingsSection title="Permissions">...</SettingsSection>
 * </SettingsGroup>
 */
export declare function SettingsGroup({ title, children, className }: SettingsGroupProps): React.JSX.Element;
export interface SettingsDividerProps {
    /** Additional className */
    className?: string;
}
/**
 * SettingsDivider - Horizontal separator between sections
 *
 * Use sparingly - vertical spacing is usually enough.
 */
export declare function SettingsDivider({ className }: SettingsDividerProps): React.JSX.Element;
