/**
 * SettingsSegmentedControl
 *
 * Horizontal button group for selecting between options.
 * Ideal for theme selection, font selection, etc.
 */
import * as React from 'react';
export interface SettingsSegmentedOption<T extends string = string> {
    /** Value for this option */
    value: T;
    /** Display label */
    label: string;
    /** Optional icon */
    icon?: React.ReactNode;
}
export interface SettingsSegmentedControlProps<T extends string = string> {
    /** Currently selected value */
    value: T;
    /** Change handler */
    onValueChange: (value: T) => void;
    /** Available options */
    options: SettingsSegmentedOption<T>[];
    /** Size variant */
    size?: 'sm' | 'md';
    /** Additional className */
    className?: string;
}
/**
 * SettingsSegmentedControl - Horizontal button group
 *
 * @example
 * <SettingsSegmentedControl
 *   value={theme}
 *   onValueChange={setTheme}
 *   options={[
 *     { value: 'system', label: 'System', icon: <Monitor /> },
 *     { value: 'light', label: 'Light', icon: <Sun /> },
 *     { value: 'dark', label: 'Dark', icon: <Moon /> },
 *   ]}
 * />
 */
export declare function SettingsSegmentedControl<T extends string = string>({ value, onValueChange, options, size, className, }: SettingsSegmentedControlProps<T>): React.JSX.Element;
/**
 * SettingsSegmentedControlCard - Card variant with individual backgrounds
 *
 * Each option is a small card (like Amie's app icon selector)
 */
export interface SettingsSegmentedCardOption<T extends string = string> {
    value: T;
    label: string;
    icon?: React.ReactNode;
}
export interface SettingsSegmentedControlCardProps<T extends string = string> {
    value: T;
    onValueChange: (value: T) => void;
    options: SettingsSegmentedCardOption<T>[];
    /** Number of columns */
    columns?: 2 | 3 | 4;
    className?: string;
}
export declare function SettingsSegmentedControlCard<T extends string = string>({ value, onValueChange, options, columns, className, }: SettingsSegmentedControlCardProps<T>): React.JSX.Element;
