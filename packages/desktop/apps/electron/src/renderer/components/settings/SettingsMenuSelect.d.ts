/**
 * SettingsMenuSelect
 *
 * Menu-style dropdown select with support for option descriptions.
 * Uses Radix Popover for collision detection and accessibility.
 * Includes search/filter when options exceed threshold.
 */
import * as React from 'react';
export interface SettingsMenuSelectOption {
    /** Value for this option */
    value: string;
    /** Display label */
    label: string;
    /** Optional description/subtitle */
    description?: string;
}
export interface SettingsMenuSelectProps {
    /** Currently selected value */
    value: string;
    /** Change handler */
    onValueChange: (value: string) => void;
    /** Available options */
    options: SettingsMenuSelectOption[];
    /** Placeholder when nothing selected */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className for trigger */
    className?: string;
    /** Width of the dropdown menu */
    menuWidth?: number;
    /** Called when hovering over an option (for live preview). Pass null on leave. */
    onHover?: (value: string | null) => void;
    /** Enable search filter (auto-enabled when options > 8) */
    searchable?: boolean;
    /** Placeholder for search input */
    searchPlaceholder?: string;
}
/**
 * SettingsMenuSelect - Menu-style dropdown with descriptions
 *
 * Uses Radix Popover for automatic collision detection and positioning.
 * Trigger styled like the model selector in FreeFormInput.
 * Includes search filter when options exceed 8 or searchable prop is true.
 */
export declare function SettingsMenuSelect({ value, onValueChange, options, placeholder, disabled, className, menuWidth, onHover, searchable, searchPlaceholder, }: SettingsMenuSelectProps): React.JSX.Element;
/**
 * SettingsMenuSelectRow - Inline row with label and menu select
 */
export interface SettingsMenuSelectRowProps {
    /** Row label */
    label: string;
    /** Optional description below label */
    description?: string;
    /** Currently selected value */
    value: string;
    /** Change handler */
    onValueChange: (value: string) => void;
    /** Available options */
    options: SettingsMenuSelectOption[];
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
    /** Whether inside a card */
    inCard?: boolean;
    /** Width of the dropdown menu */
    menuWidth?: number;
    /** Called when hovering over an option (for live preview). Pass null on leave. */
    onHover?: (value: string | null) => void;
    /** Enable search filter (auto-enabled when options > 8) */
    searchable?: boolean;
    /** Placeholder for search input */
    searchPlaceholder?: string;
}
export declare function SettingsMenuSelectRow({ label, description, value, onValueChange, options, placeholder, disabled, className, inCard, menuWidth, onHover, searchable, searchPlaceholder, }: SettingsMenuSelectRowProps): React.JSX.Element;
