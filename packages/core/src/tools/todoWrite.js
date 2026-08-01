/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseDeclarativeTool, BaseToolInvocation, Kind } from './tools.js';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import { Storage } from '../config/storage.js';
import { ToolDisplayNames, ToolNames } from './tool-names.js';
import { atomicWriteFile } from '../utils/atomicFileWrite.js';
import { createDebugLogger } from '../utils/debugLogger.js';
import { detectTodoChanges, HookPhase } from '../hooks/types.js';
const debugLogger = createDebugLogger('TODO_WRITE');
const todoWriteToolSchemaData = {
    name: 'todo_write',
    description: 'Creates and manages a concise, user-visible task list for complex or multi-step work.',
    parametersJsonSchema: {
        type: 'object',
        properties: {
            todos: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            minLength: 1,
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'in_progress', 'completed'],
                        },
                        id: {
                            type: 'string',
                        },
                    },
                    required: ['content', 'status', 'id'],
                    additionalProperties: false,
                },
                description: 'The updated todo list',
            },
        },
        required: ['todos'],
        $schema: 'http://json-schema.org/draft-07/schema#',
    },
};
const todoWriteToolDescription = `
Use this tool to create and manage a user-visible task list when explicit progress tracking improves clarity.

## When to Use This Tool
Use this tool for work that is complex, ambiguous, or multi-phase; has multiple independent outcomes or important dependencies; benefits from checkpoints; or when the user explicitly asks for a todo list.

Do not use it for simple or single-step work, purely conversational or informational requests, or tasks that can be answered or completed directly unless the user explicitly requests a todo list.

## Planning with Todos

Keep the list short and outcome-oriented. Use a small number of meaningful, logically ordered, verifiable steps. Do not create a separate todo for every error, file, command, or minor edit.

Keep at most one task in_progress. When a plan exists, keep its statuses current, mark finished work completed, revise the plan when the scope or approach changes, and remove items that are no longer relevant. Do not mark incomplete or blocked work completed.
`;
const TODO_SUBDIR = 'todos';
function getTodoFilePath(sessionId) {
    const todoDir = path.join(Storage.getRuntimeBaseDir(), TODO_SUBDIR);
    // Use sessionId if provided, otherwise fall back to 'default'
    const filename = `${sessionId || 'default'}.json`;
    return path.join(todoDir, filename);
}
/**
 * Reads the current todos from the file system
 */
async function readTodosFromFile(sessionId) {
    try {
        const todoFilePath = getTodoFilePath(sessionId);
        const content = await fs.readFile(todoFilePath, 'utf-8');
        const data = JSON.parse(content);
        return Array.isArray(data.todos) ? data.todos : [];
    }
    catch (err) {
        const error = err;
        if (!(error instanceof Error) || error.code !== 'ENOENT') {
            throw err;
        }
        return [];
    }
}
/**
 * Writes todos to the file system
 */
async function writeTodosToFile(todos, sessionId) {
    const todoFilePath = getTodoFilePath(sessionId);
    const todoDir = path.dirname(todoFilePath);
    await fs.mkdir(todoDir, { recursive: true });
    const data = {
        todos,
        sessionId: sessionId || 'default',
    };
    await atomicWriteFile(todoFilePath, JSON.stringify(data, null, 2), {
        encoding: 'utf-8',
    });
}
function createBlockedTodoResult(message, systemMessage) {
    return {
        llmContent: `${message}

<system-reminder>
${systemMessage}
</system-reminder>`,
        returnDisplay: message,
    };
}
class TodoWriteToolInvocation extends BaseToolInvocation {
    config;
    operationType;
    constructor(config, params, operationType = 'update') {
        super(params);
        this.config = config;
        this.operationType = operationType;
    }
    getDescription() {
        return this.operationType === 'create' ? 'Create todos' : 'Update todos';
    }
    async execute(_signal) {
        const { todos, modified_by_user, modified_content } = this.params;
        const sessionId = this.config.getSessionId();
        try {
            // 1. Read current todos (for change detection)
            const oldTodos = await readTodosFromFile(sessionId);
            let finalTodos;
            if (modified_by_user && modified_content !== undefined) {
                // User modified the content in external editor, parse it directly
                const data = JSON.parse(modified_content);
                finalTodos = Array.isArray(data.todos) ? data.todos : [];
            }
            else {
                // Use the normal todo logic - simply replace with new todos
                finalTodos = todos;
            }
            // 2. Detect changes
            const changes = detectTodoChanges(oldTodos, finalTodos);
            const oldTodosMap = new Map(oldTodos.map((t) => [t.id, t]));
            // 3. VALIDATION PHASE: Execute all hooks with Validation phase
            // Hooks should only check and return block/approve decisions, no side effects
            const hookSystem = this.config.getHookSystem();
            // Validate TodoCreated hooks
            if (hookSystem && changes.created.length > 0) {
                const createdResults = await Promise.all(changes.created.map((todo) => hookSystem.fireTodoCreatedEvent(todo.id, todo.content, todo.status, finalTodos, HookPhase.Validation, _signal)));
                const blockedCreatedResult = createdResults.find((result) => result.finalOutput?.decision === 'block');
                if (blockedCreatedResult?.finalOutput) {
                    const reason = blockedCreatedResult.finalOutput.reason ||
                        'Hook blocked todo creation';
                    return createBlockedTodoResult(`Todo creation blocked: ${reason}`, `Todo list was not modified because a TodoCreated hook blocked the operation: ${reason}`);
                }
            }
            // Validate TodoCompleted hooks
            if (hookSystem && changes.completed.length > 0) {
                const completedResults = await Promise.all(changes.completed.map((todo) => {
                    const oldTodo = oldTodosMap.get(todo.id);
                    const previousStatus = oldTodo?.status ?? 'pending';
                    return hookSystem.fireTodoCompletedEvent(todo.id, todo.content, previousStatus, finalTodos, HookPhase.Validation, _signal);
                }));
                const blockedCompletedResult = completedResults.find((result) => result.finalOutput?.decision === 'block');
                if (blockedCompletedResult?.finalOutput) {
                    const reason = blockedCompletedResult.finalOutput.reason ||
                        'Hook blocked todo completion';
                    return createBlockedTodoResult(`Todo completion blocked: ${reason}`, `Todo list was not modified because a TodoCompleted hook blocked the operation: ${reason}`);
                }
            }
            // 4. Write new todos AFTER all validation passes
            await writeTodosToFile(finalTodos, sessionId);
            // 5. POST-WRITE PHASE: Execute hooks for side effects (logging, HTTP sync, etc.)
            // These hooks can now safely perform side effects knowing data is persisted
            // We don't check for blocking here since validation already passed.
            //
            // Dispatch sequentially in list order (NOT Promise.all). A single
            // todo_write call can change several items' statuses at once (the model is
            // encouraged to batch status updates that complete together), and these
            // post-write hooks run real side effects — logging, external HTTP sync,
            // stateful read-modify-write. Firing them concurrently for sibling items
            // could interleave a shared stateful/external-sync hook, lose an update,
            // or publish completions out of order. Serial, in-order dispatch keeps
            // the observable side effects deterministic.
            let postWriteError;
            try {
                if (hookSystem && changes.created.length > 0) {
                    for (const todo of changes.created) {
                        await hookSystem.fireTodoCreatedEvent(todo.id, todo.content, todo.status, finalTodos, HookPhase.PostWrite, _signal);
                    }
                }
                if (hookSystem && changes.completed.length > 0) {
                    for (const todo of changes.completed) {
                        const oldTodo = oldTodosMap.get(todo.id);
                        const previousStatus = oldTodo?.status ?? 'pending';
                        await hookSystem.fireTodoCompletedEvent(todo.id, todo.content, previousStatus, finalTodos, HookPhase.PostWrite, _signal);
                    }
                }
            }
            catch (error) {
                postWriteError =
                    error instanceof Error ? error : new Error(String(error));
                debugLogger.error(`[TodoWriteTool] Post-write hooks failed after todos were persisted: ${postWriteError.message}`);
            }
            // 6. Create structured display object for rich UI rendering
            const todoResultDisplay = {
                type: 'todo_list',
                todos: finalTodos,
                changes,
            };
            // Create plain string format with system reminder
            const todosJson = JSON.stringify(finalTodos);
            let llmContent;
            const postWriteReminder = postWriteError
                ? `

<system-reminder>
Todos were persisted successfully, but post-write hooks failed with error: ${postWriteError.message}. Do not tell the user the write failed; only handle any follow-up hook issues if needed.
</system-reminder>`
                : '';
            if (finalTodos.length === 0) {
                // Special message for empty todos
                llmContent = `Todo list has been cleared.

<system-reminder>
Your todo list is now empty. DO NOT mention this explicitly to the user. You have no pending tasks in your todo list.
</system-reminder>${postWriteReminder}`;
            }
            else {
                // Normal message for todos with items
                llmContent = `Todos have been modified successfully. Ensure that you continue to use the todo list to track your progress. Please proceed with the current tasks if applicable

<system-reminder>
Your todo list has changed. DO NOT mention this explicitly to the user. Here are the latest contents of your todo list:

${todosJson}. Continue on with the tasks at hand if applicable.
</system-reminder>${postWriteReminder}`;
            }
            return {
                llmContent,
                returnDisplay: todoResultDisplay,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            debugLogger.error(`[TodoWriteTool] Error executing todo_write: ${errorMessage}`);
            // Create plain string format for error with system reminder
            const errorLlmContent = `Failed to modify todos. An error occurred during the operation.

<system-reminder>
Todo list modification failed with error: ${errorMessage}. You may need to retry or handle this error appropriately.
</system-reminder>`;
            return {
                llmContent: errorLlmContent,
                returnDisplay: `Error writing todos: ${errorMessage}`,
            };
        }
    }
}
/**
 * Utility function to read todos for a specific session (useful for session recovery)
 */
export async function readTodosForSession(sessionId) {
    return readTodosFromFile(sessionId);
}
/**
 * Utility function to list all todo files in the todos directory
 */
export async function listTodoSessions() {
    try {
        const todoDir = path.join(Storage.getRuntimeBaseDir(), TODO_SUBDIR);
        const files = await fs.readdir(todoDir);
        return files
            .filter((file) => file.endsWith('.json'))
            .map((file) => file.replace('.json', ''));
    }
    catch (err) {
        const error = err;
        if (!(error instanceof Error) || error.code !== 'ENOENT') {
            throw err;
        }
        return [];
    }
}
export class TodoWriteTool extends BaseDeclarativeTool {
    config;
    static Name = ToolNames.TODO_WRITE;
    constructor(config) {
        super(TodoWriteTool.Name, ToolDisplayNames.TODO_WRITE, todoWriteToolDescription, Kind.Think, todoWriteToolSchemaData.parametersJsonSchema);
        this.config = config;
    }
    validateToolParams(params) {
        // Validate todos array
        if (!Array.isArray(params.todos)) {
            return 'Parameter "todos" must be an array.';
        }
        // Validate individual todos
        for (const todo of params.todos) {
            if (!todo.id || typeof todo.id !== 'string' || todo.id.trim() === '') {
                return 'Each todo must have a non-empty "id" string.';
            }
            if (!todo.content ||
                typeof todo.content !== 'string' ||
                todo.content.trim() === '') {
                return 'Each todo must have a non-empty "content" string.';
            }
            if (!['pending', 'in_progress', 'completed'].includes(todo.status)) {
                return 'Each todo must have a valid "status" (pending, in_progress, completed).';
            }
        }
        // Check for duplicate IDs
        const ids = params.todos.map((todo) => todo.id);
        const uniqueIds = new Set(ids);
        if (ids.length !== uniqueIds.size) {
            return 'Todo IDs must be unique within the array.';
        }
        return null;
    }
    createInvocation(params) {
        // Determine if this is a create or update operation by checking if todos file exists
        const sessionId = this.config.getSessionId();
        const todoFilePath = getTodoFilePath(sessionId);
        const operationType = fsSync.existsSync(todoFilePath) ? 'update' : 'create';
        return new TodoWriteToolInvocation(this.config, params, operationType);
    }
}
//# sourceMappingURL=todoWrite.js.map