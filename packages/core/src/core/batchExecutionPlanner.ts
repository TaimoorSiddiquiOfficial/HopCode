/**
 * @license
 * Copyright 2025 Google LLC
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
import { ToolNames } from '../tools/tool-names.js';
import { CONCURRENCY_SAFE_KINDS, Kind } from '../index.js';
import { isShellCommandReadOnly } from '../utils/shellReadOnlyChecker.js';
import { stripShellWrapper } from '../utils/shell-utils.js';

interface ToolBatch {
  concurrent: boolean;
  calls: ScheduledToolCall[];
}

/**
 * Determines whether a single tool call is safe for concurrent execution
 * with other safe tools (no side effects, no shared mutable state).
 */
export function isConcurrencySafe(call: ScheduledToolCall): boolean {
  // Agent tools spawn independent sub-agents with no shared state.
  if (call.request.name === ToolNames.AGENT) return true;
  // Shell commands: check if the command is read-only (e.g., git log, cat).
  // Uses the synchronous regex+shell-quote checker (not the async AST-based
  // one) because partitioning runs synchronously. The sync checker covers
  // the same command whitelist and is fail-closed — unknown commands remain
  // sequential. The AST version is used separately for permission decisions.
  if (call.tool.kind === Kind.Execute) {
    const command = (call.request.args as { command?: string }).command;
    if (typeof command !== 'string') return false;
    try {
      return isShellCommandReadOnly(stripShellWrapper(command));
    } catch {
      return false; // fail-closed
    }
  }
  return CONCURRENCY_SAFE_KINDS.has(call.tool.kind);
}

/**
 * Partition tool calls into consecutive batches by concurrency safety.
 *
 * Consecutive safe tools are merged into a single parallel batch.
 * Each unsafe tool forms its own sequential batch.
 *
 * Example: [Read, Read, Edit, Read] → [[Read,Read](parallel), [Edit](seq), [Read](seq)]
 */
export function partitionToolCalls(calls: ScheduledToolCall[]): ToolBatch[] {
  return calls.reduce<ToolBatch[]>((batches, call) => {
    const safe = isConcurrencySafe(call);
    const lastBatch = batches[batches.length - 1];
    if (safe && lastBatch?.concurrent) {
      lastBatch.calls.push(call);
    } else {
      batches.push({ concurrent: safe, calls: [call] });
    }
    return batches;
  }, []);
}

/**
 * Executor signature: runs a single tool call and returns when done.
 * The batch planner receives this as a callback so it stays agnostic
 * to the underlying execution mechanism.
 */
export type ToolCallExecutor = (
  call: ScheduledToolCall,
  signal: AbortSignal,
) => Promise<void>;

/**
 * Plans and executes batches of tool calls.
 *
 * Usage:
 *   const planner = new BatchExecutionPlanner();
 *   await planner.execute(calls, executor, signal);
 */
export class BatchExecutionPlanner {
  private readonly maxConcurrency: number;

  constructor(maxConcurrency = 10) {
    this.maxConcurrency = maxConcurrency;
  }

  /**
   * Partition the given calls into batches and execute them:
   * parallel batches run with a concurrency cap; sequential
   * batches run one at a time.
   */
  async execute(
    calls: ScheduledToolCall[],
    executor: ToolCallExecutor,
    signal: AbortSignal,
  ): Promise<void> {
    const batches = partitionToolCalls(calls);

    for (const batch of batches) {
      if (batch.concurrent && batch.calls.length > 1) {
        await this.runConcurrently(batch.calls, executor, signal);
      } else {
        for (const call of batch.calls) {
          await executor(call, signal);
        }
      }
    }
  }

  private async runConcurrently(
    calls: ScheduledToolCall[],
    executor: ToolCallExecutor,
    signal: AbortSignal,
  ): Promise<void> {
    const executing = new Set<Promise<void>>();

    for (const call of calls) {
      const p = executor(call, signal).finally(() => {
        executing.delete(p);
      });
      executing.add(p);
      if (executing.size >= this.maxConcurrency) {
        await Promise.race(executing);
      }
    }
    await Promise.all(executing);
  }
}
