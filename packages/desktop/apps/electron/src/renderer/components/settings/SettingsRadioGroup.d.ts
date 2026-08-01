/**
 * SettingsRadioGroup & SettingsRadioCard
 *
 * Full-width radio card selection pattern (Amie-style).
 * Each option is a separate card with radio indicator on the left.
 */
import * as React from 'react';
export interface SettingsRadioGroupProps<T extends string = string> {
    /** Currently selected value */
    value: T;
    /** Change handler */
    onValueChange: (value: T) => void;
    /** Radio cards */
    children: React.ReactNode;
    /** Additional className */
    className?: string;
}
/**
 * SettingsRadioGroup - Container for radio card options
 *
 * @example
 * <SettingsRadioGroup value={model} onValueChange={setModel}>
 *   <SettingsRadioCard value="opus" label="Opus 4.6" description="Most capable" />
 *   <SettingsRadioCard value="sonnet" label="Sonnet 4.6" description="Balanced" />
 * </SettingsRadioGroup>
 */
export declare function SettingsRadioGroup<T extends string = string>({ value, onValueChange, children, className, }: SettingsRadioGroupProps<T>): React.JSX.Element;
export interface SettingsRadioCardProps {
    /** Value for this option */
    value: string;
    /** Option label */
    label: string;
    /** Optional description below label */
    description?: string;
    /** Optional icon on the right */
    icon?: React.ReactNode;
    /** Optional badge (e.g., "Active", "Beta") */
    badge?: React.ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Content to show when this option is selected */
    expandedContent?: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Standalone mode: whether this option is selected (use instead of RadioGroup) */
    selected?: boolean;
    /** Standalone mode: click handler (use instead of RadioGroup) */
    onClick?: () => void;
    /** When true, disables card styling (use when inside a SettingsCard) */
    inCard?: boolean;
}
/**
 * SettingsRadioCard - Full-width radio option card
 *
 * @example
 * <SettingsRadioCard
 *   value="api_key"
 *   label="API Key"
 *   description="Use your local HopCode setup"
 *   expandedContent={<ApiKeyInput />}
 * />
 */
export declare function SettingsRadioCard({ value, label, description, icon, badge, disabled, expandedContent, className, selected, onClick, inCard, }: SettingsRadioCardProps): React.JSX.Element;
export interface SettingsRadioOptionProps {
    /** Value for this option */
    value: string;
    /** Option label */
    label: string;
    /** Optional description (inline, after separator) */
    description?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className */
    className?: string;
}
/**
 * SettingsRadioOption - Simple inline radio option (no card background)
 *
 * Use inside a SettingsCard for grouped options without individual backgrounds.
 */
export declare function SettingsRadioOption({ value, label, description, disabled, className, }: SettingsRadioOptionProps): React.JSX.Element;
