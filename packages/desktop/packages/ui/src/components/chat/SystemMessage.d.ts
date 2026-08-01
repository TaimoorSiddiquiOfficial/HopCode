/**
 * SystemMessage - Displays system/info/error/warning messages
 *
 * Used for displaying non-conversational messages like errors, warnings,
 * info notices, and general system messages. Supports different visual
 * styles based on the message type.
 *
 * Error and warning types use shadow-tinted for a softer, more polished appearance.
 * System and info types use a simple bordered style.
 */
export type SystemMessageType = 'error' | 'info' | 'warning' | 'system';
export interface SystemMessageProps {
    /** Message content (markdown supported) */
    content: string;
    /** Message type determining visual style */
    type: SystemMessageType;
    /** Additional className for the outer container */
    className?: string;
}
/**
 * SystemMessage - Renders a styled message bubble based on type
 */
export declare function SystemMessage({ content, type, className, }: SystemMessageProps): import("react").JSX.Element;
