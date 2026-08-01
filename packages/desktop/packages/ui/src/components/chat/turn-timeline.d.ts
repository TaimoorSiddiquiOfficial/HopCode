import type { ActivityItem, ResponseContent } from './TurnCard';
export type TurnTimelineItem = {
    type: 'activity-section';
    id: string;
    activities: ActivityItem[];
} | {
    type: 'commentary';
    id: string;
    activity: ActivityItem;
} | {
    type: 'plan';
    id: string;
    activity: ActivityItem;
} | {
    type: 'response';
    id: string;
    response: ResponseContent;
};
export type ResponseTimelineItem = Extract<TurnTimelineItem, {
    type: 'response';
}>;
export declare function splitTimelineAtFinalResponse(items: TurnTimelineItem[]): {
    detailItems: TurnTimelineItem[];
    finalResponseItem?: ResponseTimelineItem;
};
export declare function getProcessedDurationMs(detailItems: TurnTimelineItem[], finalResponseItem?: ResponseTimelineItem): number;
export declare function formatProcessedDuration(ms: number): string;
/**
 * Build the visible assistant-turn timeline used by TurnCard.
 *
 * Commentary text and plan/final response blocks are timeline anchors. Tool,
 * thinking, and status activities between those anchors are grouped into their
 * own collapsible activity sections, preserving chronological order instead of
 * rendering one global text block, one global tool block, then the final answer.
 */
export declare function buildTurnTimelineItems(activities: ActivityItem[], response?: ResponseContent): TurnTimelineItem[];
