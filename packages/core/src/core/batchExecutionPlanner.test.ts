/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import {
  isConcurrencySafe,
  partitionToolCalls,
  BatchExecutionPlanner,
} from './batchExecutionPlanner.js';
import type { ScheduledToolCall } from './coreToolScheduler.js';
import { ToolNames } from '../tools/tool-names.js';
import { Kind, BaseDeclarativeTool } from '../index.js';

function makeScheduledCall(
  overrides: Partial<ScheduledToolCall['request']> & {
    tool?: ScheduledToolCall['tool'];
  } = {},
): ScheduledToolCall {
  const tool =
    overrides.tool ??
    (new BaseDeclarativeTool(
      'mock_tool',
      'mock',
      'A mock tool',
      Kind.Read,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool']);
  return {
    status: 'scheduled',
    request: {
      callId: `call-${Math.random().toString(36).slice(2)}`,
      name: overrides.name ?? 'mock_tool',
      args: overrides.args ?? {},
      ...overrides,
    },
    tool,
    invocation: {} as ScheduledToolCall['invocation'],
  };
}

describe('isConcurrencySafe', () => {
  it('returns true for agent tools', () => {
    const call = makeScheduledCall({
      name: ToolNames.AGENT,
    });
    expect(isConcurrencySafe(call)).toBe(true);
  });

  it('returns true for read-kind tools', () => {
    const tool = new BaseDeclarativeTool(
      'read_file',
      'read',
      'Reads a file',
      Kind.Read,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];
    const call = makeScheduledCall({ tool });
    expect(isConcurrencySafe(call)).toBe(true);
  });

  it('returns false for edit-kind tools', () => {
    const tool = new BaseDeclarativeTool(
      'edit',
      'edit',
      'Edits a file',
      Kind.Edit,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];
    const call = makeScheduledCall({ tool });
    expect(isConcurrencySafe(call)).toBe(false);
  });

  it('returns false for execute-kind tools with no command', () => {
    const tool = new BaseDeclarativeTool(
      'run_shell_command',
      'execute',
      'Runs a command',
      Kind.Execute,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];
    const call = makeScheduledCall({ tool, args: {} });
    expect(isConcurrencySafe(call)).toBe(false);
  });
});

describe('partitionToolCalls', () => {
  it('groups consecutive safe tools into one batch', () => {
    const readTool = new BaseDeclarativeTool(
      'read_file',
      'read',
      '',
      Kind.Read,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];

    const calls = [
      makeScheduledCall({ tool: readTool, name: 'read_file' }),
      makeScheduledCall({ tool: readTool, name: 'read_file' }),
      makeScheduledCall({ tool: readTool, name: 'read_file' }),
    ];

    const batches = partitionToolCalls(calls);
    expect(batches).toHaveLength(1);
    expect(batches[0].concurrent).toBe(true);
    expect(batches[0].calls).toHaveLength(3);
  });

  it('splits unsafe tools into individual sequential batches', () => {
    const editTool = new BaseDeclarativeTool(
      'edit',
      'edit',
      '',
      Kind.Edit,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];

    const calls = [
      makeScheduledCall({ tool: editTool, name: 'edit' }),
      makeScheduledCall({ tool: editTool, name: 'edit' }),
    ];

    const batches = partitionToolCalls(calls);
    expect(batches).toHaveLength(2);
    expect(batches[0].concurrent).toBe(false);
    expect(batches[1].concurrent).toBe(false);
  });

  it('mixes safe and unsafe: Read,Read,Edit,Read', () => {
    const readTool = new BaseDeclarativeTool(
      'read',
      'read',
      '',
      Kind.Read,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];
    const editTool = new BaseDeclarativeTool(
      'edit',
      'edit',
      '',
      Kind.Edit,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];

    const calls = [
      makeScheduledCall({ tool: readTool, name: 'read1' }),
      makeScheduledCall({ tool: readTool, name: 'read2' }),
      makeScheduledCall({ tool: editTool, name: 'edit1' }),
      makeScheduledCall({ tool: readTool, name: 'read3' }),
    ];

    const batches = partitionToolCalls(calls);
    expect(batches).toHaveLength(3);
    // [Read,Read](parallel)
    expect(batches[0].concurrent).toBe(true);
    expect(batches[0].calls).toHaveLength(2);
    // [Edit](seq)
    expect(batches[1].concurrent).toBe(false);
    expect(batches[1].calls).toHaveLength(1);
    // [Read](concurrent, single) — safe tool after unsafe = new concurrent batch
    // (runtime only parallelizes when concurrent && calls.length > 1)
    expect(batches[2].concurrent).toBe(true);
    expect(batches[2].calls).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(partitionToolCalls([])).toEqual([]);
  });
});

describe('BatchExecutionPlanner', () => {
  it('executes concurrent batch in parallel', async () => {
    const readTool = new BaseDeclarativeTool(
      'read',
      'read',
      '',
      Kind.Read,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];

    const calls = [
      makeScheduledCall({ tool: readTool, name: 'read1' }),
      makeScheduledCall({ tool: readTool, name: 'read2' }),
      makeScheduledCall({ tool: readTool, name: 'read3' }),
    ];

    const executionOrder: string[] = [];
    const executor = vi.fn(async (call: ScheduledToolCall) => {
      executionOrder.push(call.request.name);
    });

    const planner = new BatchExecutionPlanner();
    const signal = new AbortController().signal;
    await planner.execute(calls, executor, signal);

    // All three executed
    expect(executionOrder).toHaveLength(3);
    expect(executor).toHaveBeenCalledTimes(3);
  });

  it('executes sequential batches one at a time', async () => {
    const editTool = new BaseDeclarativeTool(
      'edit',
      'edit',
      '',
      Kind.Edit,
      {},
      async () => {},
    ) as unknown as ScheduledToolCall['tool'];

    const calls = [
      makeScheduledCall({ tool: editTool, name: 'edit1' }),
      makeScheduledCall({ tool: editTool, name: 'edit2' }),
    ];

    const executionOrder: string[] = [];
    const executor = vi.fn(async (call: ScheduledToolCall) => {
      executionOrder.push(call.request.name);
    });

    const planner = new BatchExecutionPlanner();
    const signal = new AbortController().signal;
    await planner.execute(calls, executor, signal);

    expect(executionOrder).toEqual(['edit1', 'edit2']);
  });
});
