/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { TaskStore } from '../services/task-store.js';
import type { Task } from '../services/task-store.js';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  },
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

vi.mock('node:crypto', () => ({
  default: { randomUUID: vi.fn() },
  randomUUID: vi.fn(),
}));

const mockFs = fs as unknown as {
  readFileSync: ReturnType<typeof vi.fn>;
  writeFileSync: ReturnType<typeof vi.fn>;
  mkdirSync: ReturnType<typeof vi.fn>;
};

// After vi.mock hoisting, get ref to mocked randomUUID
import { randomUUID } from 'node:crypto';
const mockRandomUUID = randomUUID as unknown as ReturnType<typeof vi.fn>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const RUNTIME_DIR = path.join(path.sep, 'tmp', 'hopcode-test');
const SESSION_ID = 'test-session-1';
const expectedTasksDir = path.join(RUNTIME_DIR, 'tasks');
const expectedPersistPath = path.join(expectedTasksDir, `${SESSION_ID}.json`);

let uuidCounter = 0;

beforeEach(() => {
  vi.clearAllMocks();
  uuidCounter = 0;
  mockRandomUUID.mockImplementation(() => {
    const n = ++uuidCounter;
    // Put the counter at the START so slice(0, 8) captures it
    return `${String(n).padStart(8, '0')}0000-0000-0000-000000000000`;
  });
  mockFs.mkdirSync.mockReturnValue(undefined);
  mockFs.writeFileSync.mockReturnValue(undefined);
  // Default: ENOENT -> fresh start
  mockFs.readFileSync.mockImplementation(() => {
    throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
  });
});

function makeStore(): TaskStore {
  return new TaskStore(RUNTIME_DIR, SESSION_ID);
}

// ---------------------------------------------------------------------------

describe('TaskStore', () => {
  // ── Construction ────────────────────────────────────────────────────

  it('creates the tasks directory on construction', () => {
    makeStore();
    expect(mockFs.mkdirSync).toHaveBeenCalledWith(expectedTasksDir, {
      recursive: true,
    });
  });

  it('starts with an empty task list when no persisted data', () => {
    const store = makeStore();
    expect(store.list()).toHaveLength(0);
  });

  it('loads existing tasks from disk', () => {
    const existing: Task = {
      id: 'abc12345',
      title: 'Fix the bug',
      status: 'pending',
      priority: 'high',
      createdBy: 'agent',
      createdAt: 1_700_000_000_000,
      updatedAt: 1_700_000_000_000,
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify({ tasks: [existing] }));
    const store = makeStore();
    const tasks = store.list();
    expect(tasks).toHaveLength(1);
    expect(tasks[0]!.title).toBe('Fix the bug');
  });

  it('handles malformed JSON on disk gracefully', () => {
    mockFs.readFileSync.mockReturnValue('not valid json {{{');
    const store = makeStore();
    expect(store.list()).toHaveLength(0);
  });

  // ── create ──────────────────────────────────────────────────────────

  it('creates a task with default values', () => {
    const store = makeStore();
    const task = store.create({ title: 'Add tests' });

    expect(task.id).toBe('00000001');
    expect(task.title).toBe('Add tests');
    expect(task.status).toBe('pending');
    expect(task.priority).toBe('medium');
    expect(task.createdBy).toBe('agent');
    expect(task.parentTaskId).toBeUndefined();
    expect(task.createdAt).toBeGreaterThan(0);
    expect(task.updatedAt).toBeGreaterThan(0);
  });

  it('creates a task with all optional params', () => {
    const store = makeStore();
    const task = store.create({
      title: 'Urgent fix',
      description: 'Fix the critical path',
      parentTaskId: 'parent1',
      priority: 'critical',
      createdBy: 'user',
    });

    expect(task.description).toBe('Fix the critical path');
    expect(task.parentTaskId).toBe('parent1');
    expect(task.priority).toBe('critical');
    expect(task.createdBy).toBe('user');
  });

  it('auto-generates short IDs from UUID', () => {
    const store = makeStore();
    const task = store.create({ title: 'Task A' });
    expect(task.id).toHaveLength(8);
    expect(task.id).toBe('00000001');
  });

  // ── get ─────────────────────────────────────────────────────────────

  it('returns a task by ID', () => {
    const store = makeStore();
    const created = store.create({ title: 'Find me' });
    const found = store.get(created.id);
    expect(found).toEqual(created);
  });

  it('returns undefined for unknown ID', () => {
    const store = makeStore();
    expect(store.get('nonexistent')).toBeUndefined();
  });

  // ── list ────────────────────────────────────────────────────────────

  it('lists all tasks', () => {
    const store = makeStore();
    store.create({ title: 'Task 1' }); // id: 00000001
    store.create({ title: 'Task 2' }); // id: 00000002
    expect(store.list()).toHaveLength(2);
  });

  it('filters by single status', () => {
    const store = makeStore();
    store.create({ title: 'Pending task' });
    const t2 = store.create({ title: 'Done task' });
    store.update(t2.id, { status: 'completed' });

    const pending = store.list({ status: 'pending' });
    expect(pending).toHaveLength(1);
    expect(pending[0]!.title).toBe('Pending task');
  });

  it('filters by multiple statuses', () => {
    const store = makeStore();
    store.create({ title: 'T1' });
    const t2 = store.create({ title: 'T2' });
    store.update(t2.id, { status: 'completed' });

    const result = store.list({ status: ['pending', 'in_progress'] });
    expect(result).toHaveLength(1);
    expect(result[0]!.title).toBe('T1');
  });

  it('filters root-level tasks (parentTaskId = null)', () => {
    const store = makeStore();
    store.create({ title: 'Root' });
    const parent = store.create({ title: 'Parent' });
    store.create({ title: 'Child', parentTaskId: parent.id });

    const roots = store.list({ parentTaskId: null });
    expect(roots).toHaveLength(2);
    expect(roots.every((t) => t.parentTaskId == null)).toBe(true);
  });

  it('filters tasks by specific parent', () => {
    const store = makeStore();
    const parent = store.create({ title: 'Parent' });
    store.create({ title: 'Child A', parentTaskId: parent.id });
    store.create({ title: 'Child B', parentTaskId: parent.id });

    const children = store.list({ parentTaskId: parent.id });
    expect(children).toHaveLength(2);
  });

  it('filters by createdBy', () => {
    const store = makeStore();
    store.create({ title: 'Agent task' });
    store.create({ title: 'User task', createdBy: 'user' });

    const agentTasks = store.list({ createdBy: 'agent' });
    expect(agentTasks).toHaveLength(1);
    expect(agentTasks[0]!.title).toBe('Agent task');
  });

  it('filters unassigned tasks (assignee = null)', () => {
    const store = makeStore();
    store.create({ title: 'Unassigned' });
    const t2 = store.create({ title: 'Assigned' });
    store.update(t2.id, { assignee: 'taimoor' });

    const unassigned = store.list({ assignee: null });
    expect(unassigned).toHaveLength(1);
    expect(unassigned[0]!.title).toBe('Unassigned');
  });

  it('filters by specific assignee', () => {
    const store = makeStore();
    store.create({ title: 'Unassigned' });
    const t2 = store.create({ title: 'Assigned' });
    store.update(t2.id, { assignee: 'taimoor' });

    const assigned = store.list({ assignee: 'taimoor' });
    expect(assigned).toHaveLength(1);
    expect(assigned[0]!.title).toBe('Assigned');
  });

  // ── update ──────────────────────────────────────────────────────────

  it('updates task status', () => {
    const store = makeStore();
    const task = store.create({ title: 'Progress' });
    const updated = store.update(task.id, { status: 'in_progress' });

    expect(updated!.status).toBe('in_progress');
    expect(store.get(task.id)!.status).toBe('in_progress');
  });

  it('sets completedAt when transitioning to completed', () => {
    const store = makeStore();
    const task = store.create({ title: 'Finish me' });
    const updated = store.update(task.id, { status: 'completed' });

    expect(updated!.status).toBe('completed');
    expect(updated!.completedAt).toBeGreaterThan(0);
  });

  it('does NOT overwrite completedAt on re-completion', () => {
    const store = makeStore();
    const task = store.create({ title: 'Already done' });
    const first = store.update(task.id, { status: 'completed' });
    const firstCompletedAt = first!.completedAt!;

    const second = store.update(task.id, {
      status: 'completed',
      title: 'Already done!',
    });
    expect(second!.completedAt).toBe(firstCompletedAt);
  });

  it('returns undefined for unknown task ID', () => {
    const store = makeStore();
    expect(
      store.update('nonexistent', { status: 'completed' }),
    ).toBeUndefined();
  });

  it('updates title and description', () => {
    const store = makeStore();
    const task = store.create({ title: 'Old title' });
    const updated = store.update(task.id, {
      title: 'New title',
      description: 'New description',
    });

    expect(updated!.title).toBe('New title');
    expect(updated!.description).toBe('New description');
  });

  // ── listReady ───────────────────────────────────────────────────────

  it('returns root-level pending tasks', () => {
    const store = makeStore();
    store.create({ title: 'Ready task' });
    const parent = store.create({ title: 'Parent' });
    store.create({ title: 'Child', parentTaskId: parent.id });

    // Both "Ready task" and "Parent" are root-level pending — both are ready
    // Child is pending but its parent is NOT in_progress — it should NOT be ready
    const ready = store.listReady();
    expect(ready).toHaveLength(2);
    // Verify child is excluded
    const readyIds = ready.map((t) => t.id);
    const child = store.list({ parentTaskId: parent.id })[0]!;
    expect(readyIds).not.toContain(child.id);
  });

  it('returns child tasks whose parent is in_progress', () => {
    const store = makeStore();
    const parent = store.create({ title: 'Parent' });
    store.update(parent.id, { status: 'in_progress' });
    store.create({ title: 'Child A', parentTaskId: parent.id });
    store.create({ title: 'Child B', parentTaskId: parent.id });

    const ready = store.listReady();
    expect(ready).toHaveLength(2);
  });

  it('excludes non-pending tasks from ready list', () => {
    const store = makeStore();
    const task = store.create({ title: 'Done' });
    store.update(task.id, { status: 'completed' });

    expect(store.listReady()).toHaveLength(0);
  });

  // ── stop ────────────────────────────────────────────────────────────

  it('cancels a task and returns it', () => {
    const store = makeStore();
    const task = store.create({ title: 'Cancel me' });
    const result = store.stop(task.id);

    expect(result).toHaveLength(1);
    expect(result[0]!.status).toBe('cancelled');
    expect(store.get(task.id)!.status).toBe('cancelled');
  });

  it('cancels a task and all its subtasks recursively', () => {
    const store = makeStore();
    const parent = store.create({ title: 'Parent' });
    const child1 = store.create({
      title: 'Child 1',
      parentTaskId: parent.id,
    });
    const child2 = store.create({
      title: 'Child 2',
      parentTaskId: parent.id,
    });
    const grandchild = store.create({
      title: 'Grandchild',
      parentTaskId: child1.id,
    });

    const result = store.stop(parent.id);
    expect(result).toHaveLength(4);

    expect(store.get(parent.id)!.status).toBe('cancelled');
    expect(store.get(child1.id)!.status).toBe('cancelled');
    expect(store.get(child2.id)!.status).toBe('cancelled');
    expect(store.get(grandchild.id)!.status).toBe('cancelled');
  });

  it('does not throw when stopping unknown task', () => {
    const store = makeStore();
    const result = store.stop('nonexistent');
    expect(result).toHaveLength(0);
  });

  // ── setOutput ───────────────────────────────────────────────────────

  it('sets output on a task', () => {
    const store = makeStore();
    const task = store.create({ title: 'Generating report' });
    const updated = store.setOutput(task.id, 'Report generated');

    expect(updated!.output).toBe('Report generated');
    expect(store.get(task.id)!.output).toBe('Report generated');
  });

  // ── getSubtaskCount ─────────────────────────────────────────────────

  it('counts subtasks for a given parent', () => {
    const store = makeStore();
    const parent = store.create({ title: 'Parent' });
    store.create({ title: 'Child 1', parentTaskId: parent.id });
    store.create({ title: 'Child 2', parentTaskId: parent.id });

    expect(store.getSubtaskCount(parent.id)).toBe(2);
  });

  it('returns 0 for tasks with no children', () => {
    const store = makeStore();
    const task = store.create({ title: 'Lonely' });
    expect(store.getSubtaskCount(task.id)).toBe(0);
  });

  // ── clear ───────────────────────────────────────────────────────────

  it('removes all tasks', () => {
    const store = makeStore();
    store.create({ title: 'Task 1' });
    store.create({ title: 'Task 2' });
    store.clear();
    expect(store.list()).toHaveLength(0);
  });

  // ── Persistence ─────────────────────────────────────────────────────

  it('saves tasks to disk on create', () => {
    makeStore().create({ title: 'Persist me' });
    expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1);
    const callData = JSON.parse(
      mockFs.writeFileSync.mock.calls[0][1] as string,
    );
    expect(mockFs.writeFileSync.mock.calls[0][0]).toBe(expectedPersistPath);
    expect(callData.tasks).toHaveLength(1);
  });

  it('saves tasks to disk on update', () => {
    const store = makeStore();
    const task = store.create({ title: 'Update test' });
    mockFs.writeFileSync.mockClear();

    store.update(task.id, { status: 'completed' });
    expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  it('saves tasks to disk on clear', () => {
    const store = makeStore();
    store.create({ title: 'T1' });
    mockFs.writeFileSync.mockClear();

    store.clear();
    expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1);
  });

  it('handles writeFileSync failure gracefully', () => {
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error('ENOSPC');
    });
    const store = makeStore();
    // Should not throw
    const task = store.create({ title: 'Resilient' });
    // Still tracked in memory
    expect(store.get(task.id)!.title).toBe('Resilient');
  });
});
