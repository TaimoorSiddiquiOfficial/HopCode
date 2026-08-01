/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Batch execution planning for tool calls.
 *
 * Partitions a list of scheduled tool calls into consecutive batches
 * based on concurrency safety, then executes them with optional
 * parallelism for safe tools and sequential execution for unsafe ones.
 *
 * Extracted from `CoreToolScheduler` to keep concurrency planning
 * independently testable.
 */
import type { ScheduledToolCall } from './coreToolScheduler.js';
interface ToolBatch {
    concurrent: boolean;
    calls: ScheduledToolCall[];
}
/**
 * Determines whether a single tool call is safe for concurrent execution
 * with other safe tools (no side effects, no shared mutable state).
 */
export declare function isConcurrencySafe(call: ScheduledToolCall): boolean;
/**
 * Partition tool calls into consecutive batches by concurrency safety.
 *
 * Consecutive safe tools are merged into a single parallel batch.
 * Each unsafe tool forms its own sequential batch.
 *
 * Example: [Read, Read, Edit, Read] → [[Read,Read](parallel), [Edit](seq), [Read](seq)]
 */
export declare function partitionToolCalls(calls: ScheduledToolCall[]): ToolBatch[];
/**
 * Executor signature: runs a single tool call and returns when done.
 * The batch planner receives this as a callback so it stays agnostic
 * to the underlying execution mechanism.
 */
export type ToolCallExecutor = (call: ScheduledToolCall, signal: AbortSignal) => Promise<void>;
/**
 * Plans and executes batches of tool calls.
 *
 * Usage:
 *   const planner = new BatchExecutionPlanner();
 *   await planner.execute(calls, executor, signal);
 */
export declare class BatchExecutionPlanner {
    private readonly maxConcurrency;
    constructor(maxConcurrency?: number);
    /**
     * Partition the given calls into batches and execute them:
     * parallel batches run with a concurrency cap; sequential
     * batches run one at a time.
     */
    execute(calls: ScheduledToolCall[], executor: ToolCallExecutor, signal: AbortSignal): Promise<void>;
    private runConcurrently;
}
export {};
