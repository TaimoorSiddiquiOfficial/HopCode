/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import { ToolNames, ToolDisplayNames } from './tool-names.js';
class TaskReadyToolInvocation extends BaseToolInvocation {
    config;
    constructor(config, params) {
        super(params);
        this.config = config;
    }
    getDescription() {
        return this.params.parentTaskId
            ? `List ready subtasks of ${this.params.parentTaskId}`
            : 'List ready tasks';
    }
    async execute(_signal) {
        const store = this.config.getTaskStore();
        if (!store) {
            return {
                llmContent: 'Task store is not available.',
                returnDisplay: 'Task store is not available.',
                error: { message: 'Task store is not available.' },
            };
        }
        const ready = this.params.parentTaskId
            ? store.list({
                status: 'pending',
                parentTaskId: this.params.parentTaskId,
            })
            : store.listReady();
        if (ready.length === 0) {
            return {
                llmContent: 'No ready tasks found.\n\n<system-reminder>\nAll tasks are either completed, in progress, or blocked. Check task_list for the full picture.\n</system-reminder>',
                returnDisplay: { type: 'todo_list', todos: [] },
            };
        }
        return {
            llmContent: `Ready tasks (${ready.length}):\n\n${JSON.stringify(ready, null, 2)}\n\n<system-reminder>\nPick one of these ready tasks and update its status to in_progress before starting.\n</system-reminder>`,
            returnDisplay: {
                type: 'todo_list',
                todos: ready.map((t) => ({
                    id: t.id,
                    content: t.title,
                    status: (t.status === 'blocked' || t.status === 'cancelled'
                        ? 'pending'
                        : t.status),
                })),
            },
        };
    }
}
export class TaskReadyTool extends BaseDeclarativeTool {
    config;
    static Name = ToolNames.TASK_READY;
    constructor(config) {
        super(TaskReadyTool.Name, ToolDisplayNames.TASK_READY, 'Returns tasks that are pending and ready to work on (no incomplete dependencies).', Kind.Think, {
            type: 'object',
            properties: {
                parentTaskId: {
                    type: 'string',
                    description: 'Optional: return only ready subtasks of this parent.',
                },
            },
            $schema: 'http://json-schema.org/draft-07/schema#',
        });
        this.config = config;
    }
    createInvocation(params) {
        return new TaskReadyToolInvocation(this.config, params);
    }
}
//# sourceMappingURL=task-ready.js.map