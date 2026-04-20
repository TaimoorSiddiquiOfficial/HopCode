/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import { ToolNames, ToolDisplayNames } from './tool-names.js';
import type { Config } from '../config/config.js';

export interface TaskReadyParams {
  parentTaskId?: string;
}

class TaskReadyToolInvocation extends BaseToolInvocation<
  TaskReadyParams,
  ToolResult
> {
  constructor(
    private readonly config: Config,
    params: TaskReadyParams,
  ) {
    super(params);
  }

  getDescription(): string {
    return this.params.parentTaskId
      ? `List ready subtasks of ${this.params.parentTaskId}`
      : 'List ready tasks';
  }

  async execute(_signal: AbortSignal): Promise<ToolResult> {
    const store = this.config.getTaskStore();
    const ready = this.params.parentTaskId
      ? store.list({
          status: 'pending',
          parentTaskId: this.params.parentTaskId,
        })
      : store.listReady();

    if (ready.length === 0) {
      return {
        llmContent:
          'No ready tasks found.\n\n<system-reminder>\nAll tasks are either completed, in progress, or blocked. Check task_list for the full picture.\n</system-reminder>',
        returnDisplay: { type: 'todo_list' as const, todos: [] },
      };
    }

    return {
      llmContent: `Ready tasks (${ready.length}):\n\n${JSON.stringify(ready, null, 2)}\n\n<system-reminder>\nPick one of these ready tasks and update its status to in_progress before starting.\n</system-reminder>`,
      returnDisplay: {
        type: 'todo_list' as const,
        todos: ready.map((t) => ({
          id: t.id,
          content: t.title,
          status: (t.status === 'blocked' || t.status === 'cancelled'
            ? 'pending'
            : t.status) as 'pending' | 'in_progress' | 'completed',
        })),
      },
    };
  }
}

export class TaskReadyTool extends BaseDeclarativeTool<
  TaskReadyParams,
  ToolResult
> {
  static readonly Name: string = ToolNames.TASK_READY;

  constructor(private readonly config: Config) {
    super(
      TaskReadyTool.Name,
      ToolDisplayNames.TASK_READY,
      'Returns tasks that are pending and ready to work on (no incomplete dependencies).',
      Kind.Think,
      {
        type: 'object',
        properties: {
          parentTaskId: {
            type: 'string',
            description: 'Optional: return only ready subtasks of this parent.',
          },
        },
        $schema: 'http://json-schema.org/draft-07/schema#',
      },
    );
  }

  protected createInvocation(
    params: TaskReadyParams,
  ): ToolInvocation<TaskReadyParams, ToolResult> {
    return new TaskReadyToolInvocation(this.config, params);
  }
}
