/**
 * Base Event Adapter
 *
 * Abstract base class for provider-specific event adapters. Provides shared
 * state management (Maps, lifecycle) that was previously duplicated across
 * shared backend event adapters.
 *
 * Subclasses implement provider-specific event dispatch (adapt*() methods)
 * while inheriting:
 * - Block reason tracking (for permission-declined tool results)
 * - Read command classification (bash commands → Read tool display)
 * - Command output accumulation (streaming deltas → final tool result)
 * - Tool start/result construction helpers
 * - Turn lifecycle (reset on new turn)
 */
import type { AgentEvent } from '@craft-agent/core/types';
import { type ReadCommandInfo } from './read-patterns.ts';
import { createLogger } from '../../utils/debug.ts';
export { type ReadCommandInfo } from './read-patterns.ts';
type Logger = ReturnType<typeof createLogger>;
export declare abstract class BaseEventAdapter {
    protected log: Logger;
    protected turnIndex: number;
    protected currentTurnId: string | null;
    /** Session directory for toolMetadataStore lookups (concurrent-session safe) */
    protected sessionDir: string | undefined;
    protected commandOutput: Map<string, string>;
    protected readCommands: Map<string, ReadCommandInfo>;
    protected blockReasons: Map<string, string>;
    constructor(logScope: string);
    /**
     * Set the session directory for concurrent-safe toolMetadataStore lookups.
     * Called by the agent after creating the adapter.
     */
    setSessionDir(dir: string): void;
    /**
     * Start a new turn — resets shared state and calls subclass hook.
     */
    startTurn(turnId?: string): void;
    /**
     * Subclass hook called during startTurn() for resetting provider-specific state.
     */
    protected abstract onTurnStart(): void;
    /**
     * Store the block reason for a tool call that will be declined.
     * Called from the agent when PreToolUse/permission check blocks a tool.
     */
    setBlockReason(id: string, reason: string): void;
    /**
     * Consume and delete the block reason for a tool call.
     * Returns undefined if no block reason was stored.
     */
    protected consumeBlockReason(...keys: string[]): string | undefined;
    /**
     * Attempt to classify a bash command as a file read.
     * If classified, stores the ReadCommandInfo for later tool_result mapping.
     *
     * @returns ReadCommandInfo if the command was classified as a read, null otherwise
     */
    protected classifyReadCommand(id: string, command: string): ReadCommandInfo | null;
    /**
     * Consume and delete the read command info for a tool call.
     */
    protected consumeReadCommand(id: string): ReadCommandInfo | undefined;
    /**
     * Accumulate streaming command output for a tool call.
     * Called from output delta handlers (not emitted as an event).
     */
    accumulateOutput(id: string, delta: string): void;
    /**
     * Consume and delete accumulated command output for a tool call.
     */
    protected consumeOutput(id: string): string | undefined;
    /**
     * Build the canonical proxy tool name for an MCP tool call.
     *
     * Pool server tools already include the source slug in their name
     * (e.g., "craft__search_spaces") because the pool strips the `mcp__` prefix.
     * We just need to re-add `mcp__` to produce "mcp__craft__search_spaces".
     * Without this, we'd get "mcp__sources__craft__search_spaces" which breaks
     * source lookup in resolveToolDisplayMeta().
     */
    protected buildMcpToolName(serverName: string, toolName: string): string;
    /**
     * Create a tool_start AgentEvent.
     */
    protected createToolStart(id: string, toolName: string, input: Record<string, unknown>, intent?: string, displayName?: string, parentToolUseId?: string): AgentEvent;
    /**
     * Create a tool_result AgentEvent.
     */
    protected createToolResult(id: string, toolName: string, result: string, isError: boolean, parentToolUseId?: string): AgentEvent;
    /**
     * Build a Read-classified tool_start event from a ReadCommandInfo.
     */
    protected createReadToolStart(id: string, readInfo: ReadCommandInfo, intent?: string, displayName?: string, parentToolUseId?: string): AgentEvent;
}
