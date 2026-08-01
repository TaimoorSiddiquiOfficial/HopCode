/**
 * AutomationEventTimeline
 *
 * Compact timeline showing recent automation executions.
 * Displayed as a section within AutomationInfoPage.
 * Webhook entries are expandable to show execution details.
 */
import { type ExecutionEntry } from './types';
export interface AutomationEventTimelineProps {
    entries: ExecutionEntry[];
    className?: string;
    onReplay?: (automationId: string, event: string) => void;
}
export declare function AutomationEventTimeline({ entries, className, onReplay }: AutomationEventTimelineProps): import("react").JSX.Element;
