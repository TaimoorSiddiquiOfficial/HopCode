/**
 * ConnectionIcon
 *
 * Displays the provider logo for an LLM connection.
 * Falls back to the first letter of the connection name if no icon is available.
 *
 * Used in:
 * - AI Settings (connections list)
 * - FreeFormInput (model display)
 * - Session List (connection badge)
 * - New Session (model selector group names)
 */
import type { LlmConnectionWithStatus } from '../../../shared/types';
interface ConnectionIconProps {
    /** The connection to display an icon for */
    connection: Pick<LlmConnectionWithStatus, 'name' | 'providerType'> & {
        type?: string;
        defaultModel?: string;
    };
    /** Size in pixels (default: 16) */
    size?: number;
    /** Additional CSS classes */
    className?: string;
    /** Show tooltip with connection name + model on hover (default: false) */
    showTooltip?: boolean;
}
export declare function ConnectionIcon({ connection, size, className, showTooltip }: ConnectionIconProps): import("react").JSX.Element;
export {};
