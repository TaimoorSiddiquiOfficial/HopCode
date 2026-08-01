/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import { ToolNames, ToolDisplayNames } from './tool-names.js';
class TaskGetToolInvocation extends BaseToolInvocation {
    config;
    constructor(config, params) {
        super(params);
        this.config = config;
    }
    getDescription() {
        return `Get task: ${this.params.taskId}`;
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
        const task = store.get(this.params.taskId);
        if (!task) {
            return {
                llmContent: `Task "${this.params.taskId}" not found.`,
                returnDisplay: `Task not found: ${this.params.taskId}`,
                error: { message: `Task "${this.params.taskId}" not found.` },
            };
        }
        const subtaskCount = store.getSubtaskCount(task.id);
        const subtasks = store.list({ parentTaskId: task.id });
        return {
            llmContent: `Task details:\n\n${JSON.stringify({ ...task, subtaskCount, subtasks }, null, 2)}`,
            returnDisplay: `Task ${task.id}: ${task.title} [${task.status}]`,
        };
    }
}
export class TaskGetTool extends BaseDeclarativeTool {
    config;
    static Name = ToolNames.TASK_GET;
    constructor(config) {
        super(TaskGetTool.Name, ToolDisplayNames.TASK_GET, 'Retrieves a single task by ID, including its subtasks and current status.', Kind.Think, {
            type: 'object',
            properties: {
                taskId: {
                    type: 'string',
                    description: 'The ID of the task to retrieve.',
                    minLength: 1,
                },
            },
            required: ['taskId'],
            $schema: 'http://json-schema.org/draft-07/schema#',
        });
        this.config = config;
    }
    createInvocation(params) {
        return new TaskGetToolInvocation(this.config, params);
    }
}
//# sourceMappingURL=task-get.js.map