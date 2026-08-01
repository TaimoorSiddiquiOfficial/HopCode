import type { ACPToolCall, PermissionRequest } from '../../../adapters/types';
interface ParallelAgentsGroupProps {
    agents: ACPToolCall[];
    pendingApproval?: PermissionRequest | null;
}
export interface TimelineRow {
    leftPct: number;
    widthPct: number;
    running: boolean;
}
export interface TimelineTick {
    leftPct: number;
    label: string;
}
export interface AgentsTimeline {
    rows: Map<string, TimelineRow>;
    ticks: TimelineTick[];
}
/**
 * Geometry for the shared-axis mini timeline: one bar per agent against
 * the group's combined wall-clock span, so overlap and relative duration
 * read at a glance. Returns null when the bars would not be comparable
 * (an agent without a start time) or carry no information (single agent,
 * sub-second span) — the list then renders without a timeline.
 */
export declare function computeAgentsTimeline(agents: ACPToolCall[], now: number): AgentsTimeline | null;
export declare function ParallelAgentsGroup({ agents, pendingApproval, }: ParallelAgentsGroupProps): import("react").JSX.Element;
export {};
