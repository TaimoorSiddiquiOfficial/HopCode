/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
/**
 * Lightweight task store backed by a JSON file.
 * Supports full CRUD operations, subtask hierarchy, and status transitions.
 */
export class TaskStore {
    tasks = new Map();
    persistPath;
    constructor(runtimeDir, sessionId) {
        const tasksDir = path.join(runtimeDir, 'tasks');
        fs.mkdirSync(tasksDir, { recursive: true });
        this.persistPath = path.join(tasksDir, `${sessionId}.json`);
        this.load();
    }
    load() {
        try {
            const raw = fs.readFileSync(this.persistPath, 'utf-8');
            const data = JSON.parse(raw);
            for (const task of data.tasks ?? []) {
                this.tasks.set(task.id, task);
            }
        }
        catch {
            // Start fresh
        }
    }
    save() {
        try {
            const data = { tasks: Array.from(this.tasks.values()) };
            fs.writeFileSync(this.persistPath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch {
            // Non-fatal
        }
    }
    create(params) {
        const now = Date.now();
        const task = {
            id: randomUUID().slice(0, 8),
            title: params.title,
            description: params.description,
            status: 'pending',
            priority: params.priority ?? 'medium',
            createdBy: params.createdBy ?? 'agent',
            parentTaskId: params.parentTaskId,
            createdAt: now,
            updatedAt: now,
        };
        this.tasks.set(task.id, task);
        this.save();
        return task;
    }
    get(id) {
        return this.tasks.get(id);
    }
    getSubtaskCount(parentTaskId) {
        let count = 0;
        for (const t of this.tasks.values()) {
            if (t.parentTaskId === parentTaskId)
                count++;
        }
        return count;
    }
    list(filter) {
        const all = Array.from(this.tasks.values());
        return all.filter((task) => {
            if (filter?.status) {
                const statuses = Array.isArray(filter.status)
                    ? filter.status
                    : [filter.status];
                if (!statuses.includes(task.status))
                    return false;
            }
            if (filter?.parentTaskId !== undefined) {
                if (filter.parentTaskId === null) {
                    if (task.parentTaskId != null)
                        return false;
                }
                else {
                    if (task.parentTaskId !== filter.parentTaskId)
                        return false;
                }
            }
            if (filter?.createdBy != null && task.createdBy !== filter.createdBy)
                return false;
            if (filter?.assignee !== undefined) {
                if (filter.assignee === null) {
                    if (task.assignee != null)
                        return false;
                }
                else {
                    if (task.assignee !== filter.assignee)
                        return false;
                }
            }
            return true;
        });
    }
    /**
     * Returns tasks that are pending and have no incomplete dependencies.
     * Simple heuristic: a pending root-level task with no in_progress parent.
     */
    listReady() {
        return this.list({ status: 'pending' }).filter((task) => {
            if (!task.parentTaskId)
                return true;
            const parent = this.tasks.get(task.parentTaskId);
            return !parent || parent.status === 'in_progress';
        });
    }
    update(id, changes) {
        const task = this.tasks.get(id);
        if (!task)
            return undefined;
        const now = Date.now();
        const updated = { ...task, ...changes, updatedAt: now };
        if (changes.status === 'completed' && task.status !== 'completed') {
            updated.completedAt = now;
        }
        this.tasks.set(id, updated);
        this.save();
        return updated;
    }
    /**
     * Cancel a task and all its subtasks recursively.
     * Returns the list of cancelled tasks.
     */
    stop(id, _reason) {
        const cancelled = [];
        const queue = [id];
        while (queue.length > 0) {
            const current = queue.shift();
            const task = this.tasks.get(current);
            if (!task)
                continue;
            const updated = this.update(current, { status: 'cancelled' });
            if (updated)
                cancelled.push(updated);
            for (const t of this.tasks.values()) {
                if (t.parentTaskId === current && t.status !== 'cancelled') {
                    queue.push(t.id);
                }
            }
        }
        return cancelled;
    }
    setOutput(id, output) {
        return this.update(id, { output });
    }
    clear() {
        this.tasks.clear();
        this.save();
    }
}
//# sourceMappingURL=task-store.js.map