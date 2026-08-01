/**
 * SettingsToggle
 *
 * Toggle switch row with label and optional description.
 * Designed for use inside SettingsCard.
 */
import * as React from 'react';
export interface SettingsToggleProps {
    /** Toggle label (string or JSX for custom rendering) */
    label: React.ReactNode;
    /** Optional description below label */
    description?: string;
    /** Current checked state */
    checked: boolean;
    /** Change handler */
    onCheckedChange: (checked: boolean) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
    /** Whether the toggle is inside a card (affects padding) */
    inCard?: boolean;
}
/**
 * SettingsToggle - Toggle switch with label and description
 *
 * @example
 * <SettingsCard>
 *   <SettingsToggle
 *     label="Desktop notifications"
 *     description="Get notified when AI finishes working"
 *     checked={enabled}
 *     onCheckedChange={setEnabled}
 *   />
 * </SettingsCard>
 */
export declare function SettingsToggle({ label, description, checked, onCheckedChange, disabled, className, inCard, }: SettingsToggleProps): React.JSX.Element;
