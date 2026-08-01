/**
 * turn-utils.ts
 *
 * Utilities for grouping messages by turn for TurnCard rendering.
 * Converts the flat Message[] array into grouped turns for email-like display.
 */
import type { Message } from '@craft-agent/core';
import { storedToMessage } from '@craft-agent/core';
export { storedToMessage };
import type { ActivityItem, ResponseContent, TodoItem } from './TurnCard';
export type { ActivityItem };
/** Represents one complete assistant turn */
export interface AssistantTurn {
    type: 'assistant';
    turnId: string;
    activities: ActivityItem[];
    response?: ResponseContent;
    intent?: string;
    isStreaming: boolean;
    isComplete: boolean;
    timestamp: number;
    /** Extracted from TodoWrite tool - latest todo state in this turn */
    todos?: TodoItem[];
}
/** Represents a user message */
export interface UserTurn {
    type: 'user';
    message: Message;
    timestamp: number;
}
/** Represents a system/info/error message that stands alone */
export interface SystemTurn {
    type: 'system';
    message: Message;
    timestamp: number;
}
/** Represents an auth request (credential input, OAuth flow) */
export interface AuthRequestTurn {
    type: 'auth-request';
    message: Message;
    timestamp: number;
}
export type Turn = AssistantTurn | UserTurn | SystemTurn | AuthRequestTurn;
/**
 * Build a stable UI identity key for an assistant turn card.
 *
 * Why this exists:
 * - Backend turnId can be reused across visually split assistant cards
 *   (e.g., steer/interruption boundaries).
 * - Expansion state must be keyed by UI-card identity, not raw backend turnId.
 */
export declare function getAssistantTurnUiKey(turn: AssistantTurn, index: number): string;
/**
 * TurnPhase represents the current lifecycle state of an assistant turn.
 *
 * State Machine:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │  PENDING ──(tool_start)──► TOOL_ACTIVE ──(all_tools_done)──► AWAITING      │
 * │     │                          │                                  │        │
 * │     │ text_delta               │ text_delta                       │        │
 * │     ▼                          ▼                                  │        │
 * │  STREAMING ◄───────────── STREAMING (intermediate) ◄──────────────┘        │
 * │     │                          │                                           │
 * │     │ text_complete            │ text_complete + more work coming          │
 * │     ▼                          ▼                                           │
 * │  COMPLETE                   AWAITING                                       │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * Key insight: The "awaiting" phase is the GAP between tool completion and
 * the next action. This was previously invisible, causing the turn card to
 * "disappear" after a tool completed.
 */
export type TurnPhase = 'pending' | 'tool_active' | 'awaiting' | 'streaming' | 'complete';
/**
 * Derives the current phase of a turn from its data.
 *
 * This is a pure function that examines turn state to determine phase.
 * The phase is derived (not tracked), making it testable and consistent.
 *
 * Priority order (first match wins):
 * 1. complete - turn.isComplete is true
 * 2. streaming - response exists and is streaming (final response)
 * 3. tool_active - any TOOL activity has status 'running'
 * 4. awaiting - has activities but no tools running (the gap!)
 * 5. pending - no activities yet
 *
 * Note: Only `type: 'tool'` activities count for tool_active phase.
 * Intermediate text (type: 'intermediate') and status activities (type: 'status')
 * with 'running' status do NOT trigger tool_active - they show "Thinking..." instead.
 */
export declare function deriveTurnPhase(turn: AssistantTurn): TurnPhase;
/**
 * Determines if the "Thinking..." indicator should be shown.
 *
 * The thinking indicator appears when the turn is active but there's
 * nothing visible to show the user (no running tools, no streaming response).
 * This covers both the initial pending state and the gap after tools complete.
 *
 * @param phase - The current turn phase
 * @param isBuffering - Whether response text is still being buffered
 */
export declare function shouldShowThinkingIndicator(phase: TurnPhase, isBuffering: boolean): boolean;
/**
 * Groups messages into turns for TurnCard rendering
 *
 * Rules:
 * - User messages flush and start fresh context
 * - Tool messages + intermediate assistant messages belong to current turn
 * - Final assistant message (non-streaming, non-intermediate) flushes the turn
 * - Error/status/info messages are standalone system turns
 *
 * Note: We intentionally ignore turnId for grouping. The SDK generates a new
 * turnId for each API message, but from a user perspective, all work between
 * a user message and the final response should be ONE turn. We use isIntermediate
 * as the signal: isIntermediate=true means more work coming, isIntermediate=false
 * means final response.
 */
export declare function groupMessagesByTurn(messages: Message[]): Turn[];
/**
 * Reuses grouped turns for the common text_delta path.
 *
 * The renderer receives frequent updates where the only message change is the
 * content of one streaming assistant message. Re-grouping the whole history for
 * that case is unnecessary, so this patches the matching turn in place and lets
 * callers fall back to groupMessagesByTurn for every other shape change.
 */
export declare function updateGroupedTurnsForStreamingMessage(previousMessages: Message[], nextMessages: Message[], previousTurns: Turn[]): Turn[] | undefined;
/**
 * Get the primary intent for a turn (first available intent from activities)
 */
export declare function getTurnIntent(turn: AssistantTurn): string | undefined;
/**
 * Check if any activity in the turn is still running
 */
export declare function hasPendingActivities(turn: AssistantTurn): boolean;
/**
 * Check if any activity in the turn has an error
 */
export declare function hasErrorActivities(turn: AssistantTurn): boolean;
/**
 * Get a summary of completed activities
 */
export declare function getActivitySummary(turn: AssistantTurn): string;
/**
 * Format an AssistantTurn as markdown for detailed viewing in Monaco
 * Shows full tool inputs, results, and response
 */
export declare function formatTurnAsMarkdown(turn: AssistantTurn): string;
/**
 * Format a single ActivityItem as markdown for detailed viewing in Monaco
 */
export declare function formatActivityAsMarkdown(activity: ActivityItem): string;
/**
 * Get the last assistant turn from a list of turns.
 * Useful for determining the current/most recent assistant response.
 */
export declare function getLastAssistantTurn(turns: Turn[]): AssistantTurn | undefined;
/**
 * Get the timestamp of the last user message from turns.
 * Useful for calculating elapsed time since user sent their message.
 */
export declare function getLastUserMessageTime(turns: Turn[]): number | undefined;
/**
 * Check if the last assistant turn is still streaming/processing.
 */
export declare function isLastTurnStreaming(turns: Turn[]): boolean;
/**
 * Pre-compute which activities are the last child at their depth level.
 * Returns a Set of activity IDs that are last children.
 * This is O(n) instead of O(n²) for checking during render.
 */
export declare function computeLastChildSet(activities: ActivityItem[]): Set<string>;
/**
 * Format duration in milliseconds to human-readable string.
 * @example formatDuration(1234) => "1.2s"
 * @example formatDuration(65000) => "1m 5s"
 * @example formatDuration(125000) => "2m+"
 */
export declare function formatDuration(ms: number): string;
/**
 * Format token count to human-readable string.
 * @example formatTokens(500) => "500"
 * @example formatTokens(1500) => "1.5k"
 * @example formatTokens(15000) => "15k"
 */
export declare function formatTokens(count: number): string;
/**
 * Data extracted from TaskOutput tool result
 */
export interface TaskOutputData {
    durationMs?: number;
    inputTokens?: number;
    outputTokens?: number;
}
/**
 * Represents a Task tool with its child activities grouped together
 */
export interface ActivityGroup {
    type: 'group';
    parent: ActivityItem;
    children: ActivityItem[];
    /** Data from TaskOutput result (duration, tokens) */
    taskOutputData?: TaskOutputData;
}
/**
 * Type guard to check if an item is an ActivityGroup
 */
export declare function isActivityGroup(item: ActivityItem | ActivityGroup): item is ActivityGroup;
/**
 * Groups activities by their parent Task tool.
 *
 * This transforms a flat chronological list into a grouped structure:
 * - Maintains chronological order of top-level items (orphans and Task groups)
 * - Each Task tool becomes a group containing its child activities
 * - Maintains chronological order within each group
 * - TaskOutput activities are hidden but their data enriches the parent Task
 *
 * @param activities - Flat list of activities sorted by timestamp
 * @returns Mixed array of standalone activities and activity groups
 */
export declare function groupActivitiesByParent(activities: ActivityItem[]): (ActivityItem | ActivityGroup)[];
/**
 * Counts the total number of activities including those inside groups
 */
export declare function countTotalActivities(items: (ActivityItem | ActivityGroup)[]): number;
