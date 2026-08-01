/**
 * SettingsInput
 *
 * Text input with label for settings pages.
 * Supports password type with show/hide toggle.
 */
import * as React from 'react';
export interface SettingsInputProps {
    /** Input label */
    label?: string;
    /** Optional description below label */
    description?: string;
    /** Current value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Input type */
    type?: 'text' | 'password' | 'email' | 'url';
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Action button next to input */
    action?: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Whether inside a card */
    inCard?: boolean;
    /** onBlur handler */
    onBlur?: () => void;
    /** onKeyDown handler */
    onKeyDown?: (e: React.KeyboardEvent) => void;
}
/**
 * SettingsInput - Text input with label
 *
 * @example
 * <SettingsInput
 *   label="Name"
 *   value={name}
 *   onChange={setName}
 *   placeholder="Enter your name..."
 * />
 */
export declare function SettingsInput({ label, description, value, onChange, placeholder, type, disabled, error, action, className, inCard, onBlur, onKeyDown, }: SettingsInputProps): React.JSX.Element;
/**
 * SettingsInputRow - Inline input with label on left
 *
 * For settings where the input should be on the right side
 */
export interface SettingsInputRowProps {
    /** Row label */
    label: string;
    /** Optional description below label */
    description?: string;
    /** Current value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Input type */
    type?: 'text' | 'password' | 'email' | 'url';
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Additional className */
    className?: string;
    /** Whether inside a card */
    inCard?: boolean;
}
export declare function SettingsInputRow({ label, description, value, onChange, placeholder, type, disabled, error, className, inCard, }: SettingsInputRowProps): React.JSX.Element;
/**
 * SettingsSecretInput - Password input with show/hide and optional validation
 *
 * Specialized for API keys, tokens, etc.
 */
export interface SettingsSecretInputProps {
    /** Input label */
    label?: string;
    /** Optional description */
    description?: string;
    /** Current value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Additional className */
    className?: string;
    /** Whether inside a card */
    inCard?: boolean;
    /** onBlur handler */
    onBlur?: () => void;
}
export declare function SettingsSecretInput({ label, description, value, onChange, placeholder, disabled, error, className, inCard, onBlur, }: SettingsSecretInputProps): React.JSX.Element;
