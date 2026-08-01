/**
 * SettingsRow
 *
 * Generic row component for settings with label on left and content on right.
 * Use for custom layouts that don't fit Toggle/Select patterns.
 */
import * as React from 'react';
export interface SettingsRowProps {
    /** Row label (can be string or JSX for custom rendering) */
    label: React.ReactNode;
    /** Optional description below label */
    description?: string;
    /** Content on the right side */
    children?: React.ReactNode;
    /** Click handler for the entire row */
    onClick?: () => void;
    /** Optional action button (e.g., "Change" button) */
    action?: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Whether the row is inside a card (affects padding) */
    inCard?: boolean;
}
/**
 * SettingsRow - Generic row for custom settings layouts
 *
 * @example
 * <SettingsRow
 *   label="Working Directory"
 *   description="~/Documents"
 *   action={<Button variant="ghost" size="sm">Change</Button>}
 * />
 */
export declare function SettingsRow({ label, description, children, onClick, action, className, inCard, }: SettingsRowProps): React.JSX.Element;
/**
 * SettingsRowLabel - Standalone label for use outside SettingsRow
 *
 * @example
 * <SettingsRowLabel label="Theme" />
 * <SettingsSegmentedControl ... />
 */
export declare function SettingsRowLabel({ label, description, className, }: {
    label: string;
    description?: string;
    className?: string;
}): React.JSX.Element;
