/**
 * SettingsCard
 *
 * Container card with muted background for grouping related settings.
 * Children are separated by internal dividers.
 */
import * as React from 'react';
export interface SettingsCardProps {
    /** Card content */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Whether to add internal dividers between children */
    divided?: boolean;
}
/**
 * SettingsCard - Container for grouping related settings
 *
 * @example
 * <SettingsCard>
 *   <SettingsToggle label="Option 1" ... />
 *   <SettingsToggle label="Option 2" ... />
 * </SettingsCard>
 */
export declare function SettingsCard({ children, className, divided }: SettingsCardProps): React.JSX.Element;
/**
 * SettingsCardContent - Inner padding wrapper for card content
 *
 * Use when you need custom content inside a SettingsCard
 */
export declare function SettingsCardContent({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
/**
 * SettingsCardFooter - Footer section with actions
 */
export declare function SettingsCardFooter({ children, className, }: {
    children: React.ReactNode;
    className?: string;
}): React.JSX.Element;
