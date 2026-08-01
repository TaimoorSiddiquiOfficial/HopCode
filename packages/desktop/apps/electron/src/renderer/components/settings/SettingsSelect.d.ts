/**
 * SettingsSelect
 *
 * Dropdown select with label for settings pages.
 * Wraps the shadcn Select component with settings-specific styling.
 */
import * as React from 'react';
export interface SettingsSelectOption {
    /** Value for this option */
    value: string;
    /** Display label */
    label: string;
}
export interface SettingsSelectProps {
    /** Select label */
    label?: string;
    /** Optional description below label */
    description?: string;
    /** Currently selected value */
    value: string;
    /** Change handler */
    onValueChange: (value: string) => void;
    /** Available options */
    options: SettingsSelectOption[];
    /** Placeholder text when nothing selected */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className for wrapper */
    className?: string;
    /** Whether the select is inside a card (affects padding) */
    inCard?: boolean;
}
/**
 * SettingsSelect - Dropdown select with label
 *
 * @example
 * <SettingsSelect
 *   label="Timezone"
 *   value={timezone}
 *   onValueChange={setTimezone}
 *   options={timezoneOptions}
 *   placeholder="Select timezone..."
 * />
 */
export declare function SettingsSelect({ label, description, value, onValueChange, options, placeholder, disabled, className, inCard, }: SettingsSelectProps): React.JSX.Element;
/**
 * SettingsSelectRow - Inline select with label on left
 *
 * For use in rows where select is on the right side
 */
export interface SettingsSelectRowProps {
    /** Row label */
    label: string;
    /** Optional description below label */
    description?: string;
    /** Currently selected value */
    value: string;
    /** Change handler */
    onValueChange: (value: string) => void;
    /** Available options */
    options: SettingsSelectOption[];
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
    /** Whether inside a card */
    inCard?: boolean;
}
export declare function SettingsSelectRow({ label, description, value, onValueChange, options, placeholder, disabled, className, inCard, }: SettingsSelectRowProps): React.JSX.Element;
