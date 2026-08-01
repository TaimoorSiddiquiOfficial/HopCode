/**
 * Stateless tool matching for SDK message → AgentEvent conversion.
 *
 * This module extracts tool_start and tool_result events from SDK message
 * content blocks using DIRECT ID matching instead of FIFO queues.
 *
 * Key principle: Every output is derived from the current message + an
 * append-only tool index. No mutable queues, stacks, or order-dependent state.
 *
 * The SDK provides:
 * - `parent_tool_use_id` on every message — identifies the subagent context (Task ID or null)
 * - `tool_use_id` on each tool_result content block — directly identifies which tool the result is for
 *
 * Together these eliminate the need for FIFO matching, parent stacks, and orphan recovery.
 */
import type { AgentEvent } from '@craft-agent/core/types';
export { PARENT_TASK_TOOLS, isParentTaskTool } from '../utils/toolNames.ts';
export interface ToolEntry {
    name: string;
    input: Record<string, unknown>;
}
/**
 * Append-only index of tool metadata, built from tool_start events.
 * Order-independent: inserting A then B = inserting B then A.
 * Used to look up tool name/input when processing tool_result blocks
 * (which carry tool_use_id but not tool_name).
 */
export declare class ToolIndex {
    private entries;
    /** Register a tool (idempotent — same ID always maps to same entry) */
    register(toolUseId: string, name: string, input: Record<string, unknown>): void;
    getName(toolUseId: string): string | undefined;
    getInput(toolUseId: string): Record<string, unknown> | undefined;
    getEntry(toolUseId: string): ToolEntry | undefined;
    has(toolUseId: string): boolean;
    get size(): number;
}
/** Represents a tool_use content block from an assistant message */
export interface ToolUseBlock {
    type: 'tool_use';
    id: string;
    name: string;
    input: Record<string, unknown>;
}
/** Represents a tool_result content block from a user message */
export interface ToolResultBlock {
    type: 'tool_result';
    tool_use_id: string;
    content?: unknown;
    is_error?: boolean;
}
/** Represents a text content block */
export interface TextBlock {
    type: 'text';
    text: string;
}
/** Union of content blocks we handle */
export type ContentBlock = ToolUseBlock | ToolResultBlock | TextBlock | {
    type: string;
};
/**
 * Extract tool_start events from assistant message content blocks.
 *
 * Each tool_use block in the content becomes a tool_start event.
 * Parent assignment comes directly from the SDK's parent_tool_use_id field
 * on the message — no stacks or FIFO needed.
 *
 * Fallback: When SDK's parent_tool_use_id is null AND exactly one Task is active,
 * we assign that Task as the parent. This handles cases where the SDK doesn't
 * provide parent info for subagent child tools.
 *
 * @param contentBlocks - Content blocks from SDKAssistantMessage.message.content
 * @param sdkParentToolUseId - parent_tool_use_id from the SDK message (null = top-level)
 * @param toolIndex - Append-only index to register new tools in
 * @param emittedToolStartIds - Set of tool IDs already emitted (for stream/assistant dedup)
 * @param turnId - Current turn correlation ID
 * @param activeParentTools - Set of currently active Task tool IDs (for fallback parent assignment)
 * @param sessionDir - Session directory for reading tool metadata (prevents race when concurrent sessions clobber singleton)
 * @returns Array of tool_start AgentEvents
 */
export declare function extractToolStarts(contentBlocks: ContentBlock[], sdkParentToolUseId: string | null, toolIndex: ToolIndex, emittedToolStartIds: Set<string>, turnId?: string, activeParentTools?: Set<string>, sessionDir?: string): AgentEvent[];
/**
 * Extract tool_result events from user message content blocks.
 *
 * Each tool_result content block carries an explicit `tool_use_id` that
 * directly identifies which tool the result belongs to. No FIFO matching needed.
 *
 * Falls back to the convenience field `tool_use_result` + `parent_tool_use_id`
 * when content blocks don't contain tool_result entries (e.g., some MCP tools).
 *
 * @param contentBlocks - Content blocks from SDKUserMessage.message.content (may be empty)
 * @param sdkParentToolUseId - parent_tool_use_id from the SDK message
 * @param toolUseResultValue - Convenience field tool_use_result from SDK message
 * @param toolIndex - Read-only lookup for tool name/input
 * @param turnId - Current turn correlation ID
 * @returns Array of tool_result AgentEvents (and background task events)
 */
export declare function extractToolResults(contentBlocks: ContentBlock[], sdkParentToolUseId: string | null, toolUseResultValue: unknown, toolIndex: ToolIndex, turnId?: string): AgentEvent[];
/** Serialize a tool result value to string, handling circular references */
export declare function serializeResult(value: unknown): string;
/** Check if a tool result indicates an error */
export declare function isToolResultError(result: unknown): boolean;
