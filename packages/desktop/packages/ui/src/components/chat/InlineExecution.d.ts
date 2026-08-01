/**
 * InlineExecution - Compact execution view for EditPopover
 *
 * Shows mini agent execution progress inline within a popover,
 * transitioning through: executing → success | error states.
 */
import * as React from 'react';
import { type ActivityStatus } from './TurnCard';
export type InlineExecutionStatus = 'executing' | 'success' | 'error';
export interface InlineActivityItem {
    id: string;
    name: string;
    status: ActivityStatus;
    description?: string;
}
export interface InlineExecutionProps {
    /** Current execution status */
    status: InlineExecutionStatus;
    /** Activities to display (simplified from full ActivityItem) */
    activities: InlineActivityItem[];
    /** Result message on success */
    result?: string;
    /** Error message on failure */
    error?: string;
    /** Callback to cancel execution */
    onCancel?: () => void;
    /** Callback to dismiss (on success/error) */
    onDismiss?: () => void;
    /** Callback to retry (on error) */
    onRetry?: () => void;
    /** Optional className */
    className?: string;
}
export declare function InlineExecution({ status, activities, result, error, onCancel, onDismiss, onRetry, className, }: InlineExecutionProps): React.JSX.Element;
/**
 * Map a tool event to an InlineActivityItem.
 * Use this when processing session events in EditPopover.
 */
export declare function mapToolEventToActivity(toolName: string, toolUseId: string, status: ActivityStatus, description?: string): InlineActivityItem;
