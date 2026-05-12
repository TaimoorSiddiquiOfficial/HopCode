/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ToolInvocation, ToolResult } from './tools.js';
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import { ToolNames, ToolDisplayNames } from './tool-names.js';
import type { Config } from '../config/config.js';

export interface BgStopParams {
  task_id: string;
  reason?: string;
}

class BgStopToolInvocation extends BaseToolInvocation<
  BgStopParams,
  ToolResult
> {
  constructor(
    private readonly config: Config,
    params: BgStopParams,
  ) {
    super(params);
  }

  getDescription(): string {
    return `Stop background shell: ${this.params.task_id}${
      this.params.reason ? ` (${this.params.reason})` : ''
    }`;
  }

  async execute(_signal: AbortSignal): Promise<ToolResult> {
    const registry = this.config.getBackgroundShellRegistry();
    const entry = registry.get(this.params.task_id);

    if (!entry) {
      const msg = `No background shell task with ID "${this.params.task_id}".`;
      return {
        llmContent: msg,
        returnDisplay: msg,
        error: { message: msg },
      };
    }

    if (entry.status !== 'running') {
      const msg = `Background shell "${this.params.task_id}" already finished with status "${entry.status}".`;
      return { llmContent: msg, returnDisplay: msg };
    }

    // Immediate termination via AbortController + registry cancel.
    // The shell tool's spawn handler is wired to the AbortController
    // and will tear down the child process.
    registry.cancel(this.params.task_id, Date.now());

    const msg = `Background shell "${this.params.task_id}" stopped${
      this.params.reason ? ` (${this.params.reason})` : ''
    }.\nCommand: ${entry.command}`;
    return { llmContent: msg, returnDisplay: msg };
  }
}

export class BgStopTool extends BaseDeclarativeTool<BgStopParams, ToolResult> {
  static readonly Name: string = ToolNames.BG_STOP;

  constructor(private readonly config: Config) {
    super(
      BgStopTool.Name,
      ToolDisplayNames.BG_STOP,
      'Stops a long-running background shell task spawned by the shell tool with is_background=true. Cancels the shell via its AbortController and marks the registry entry as cancelled.',
      Kind.Think,
      {
        type: 'object',
        properties: {
          task_id: {
            type: 'string',
            description: 'The ID of the background shell task to stop.',
            minLength: 1,
          },
          reason: {
            type: 'string',
            description: 'Optional reason for stopping (audit only).',
          },
        },
        required: ['task_id'],
        $schema: 'http://json-schema.org/draft-07/schema#',
      },
    );
  }

  protected createInvocation(
    params: BgStopParams,
  ): ToolInvocation<BgStopParams, ToolResult> {
    return new BgStopToolInvocation(this.config, params);
  }
}
