/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export interface Task {
    id: string;
    parentTaskId?: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority?: TaskPriority;
    createdBy: string;
    assignee?: string;
    createdAt: number;
    updatedAt: number;
    completedAt?: number;
    output?: string;
}
export interface TaskFilter {
    status?: TaskStatus | TaskStatus[];
    parentTaskId?: string | null;
    createdBy?: string;
    assignee?: string | null;
}
/**
 * Lightweight task store backed by a JSON file.
 * Supports full CRUD operations, subtask hierarchy, and status transitions.
 */
export declare class TaskStore {
    private tasks;
    private readonly persistPath;
    constructor(runtimeDir: string, sessionId: string);
    private load;
    private save;
    create(params: {
        title: string;
        description?: string;
        parentTaskId?: string;
        priority?: TaskPriority;
        createdBy?: string;
    }): Task;
    get(id: string): Task | undefined;
    getSubtaskCount(parentTaskId: string): number;
    list(filter?: TaskFilter): Task[];
    /**
     * Returns tasks that are pending and have no incomplete dependencies.
     * Simple heuristic: a pending root-level task with no in_progress parent.
     */
    listReady(): Task[];
    update(id: string, changes: {
        status?: TaskStatus;
        title?: string;
        description?: string;
        priority?: TaskPriority;
        output?: string;
        assignee?: string;
    }): Task | undefined;
    /**
     * Cancel a task and all its subtasks recursively.
     * Returns the list of cancelled tasks.
     */
    stop(id: string, _reason?: string): Task[];
    setOutput(id: string, output: string): Task | undefined;
    clear(): void;
}
