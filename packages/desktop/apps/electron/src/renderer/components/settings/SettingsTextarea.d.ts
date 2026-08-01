/**
 * SettingsTextarea
 *
 * Multiline text input with label and optional character count.
 */
import * as React from 'react';
export interface SettingsTextareaProps {
    /** Textarea label */
    label?: string;
    /** Optional description below label */
    description?: string;
    /** Current value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Maximum character length */
    maxLength?: number;
    /** Number of visible rows */
    rows?: number;
    /** Disabled state */
    disabled?: boolean;
    /** Error message */
    error?: string;
    /** Additional className */
    className?: string;
    /** Whether inside a card */
    inCard?: boolean;
}
/**
 * SettingsTextarea - Multiline text input with character count
 *
 * @example
 * <SettingsTextarea
 *   label="Notes"
 *   description="Additional context for the AI assistant"
 *   value={notes}
 *   onChange={setNotes}
 *   maxLength={2000}
 *   rows={4}
 * />
 */
export declare function SettingsTextarea({ label, description, value, onChange, placeholder, maxLength, rows, disabled, error, className, inCard, }: SettingsTextareaProps): React.JSX.Element;
