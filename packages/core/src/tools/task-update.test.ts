/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskUpdateTool } from './task-update.js';
import type { Config } from '../config/config.js';
import type { Task } from '../services/task-store.js';
import { ToolErrorType } from './tool-error.js';

function createStoredTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 'task-1',
    title: 'Original title',
    description: 'Original description',
    status: 'pending',
    priority: 'medium',
    createdBy: 'test',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides,
  } as Task;
}

function createMockConfig(
  tasks: Task[],
  updateImpl?: (id: string, updates: Partial<Task>) => Task | undefined,
): Config {
  return {
    getTaskStore: () => ({
      update: updateImpl ?? vi.fn(),
      list: () => tasks,
    }),
  } as unknown as Config;
}

describe('TaskUpdateTool', () => {
  let tool: TaskUpdateTool;
  let config: Config;
  let storedTasks: Task[];
  const mockUpdate = vi.fn();

  beforeEach(() => {
    storedTasks = [createStoredTask()];
    mockUpdate.mockReset();
    mockUpdate.mockImplementation((id: string, updates: Partial<Task>) => {
      const task = storedTasks.find((t) => t.id === id);
      if (!task) return undefined;
      const updated = { ...task, ...updates, updatedAt: Date.now() };
      const idx = storedTasks.findIndex((t) => t.id === id);
      storedTasks[idx] = updated;
      return updated;
    });
    config = createMockConfig(storedTasks, mockUpdate);
    tool = new TaskUpdateTool(config);
  });

  it('has the correct tool name', () => {
    expect(tool.name).toBe('task_update');
  });

  it('has a non-empty description', () => {
    expect(tool.description.length).toBeGreaterThan(0);
  });

  it('rejects params with no update fields', async () => {
    const result = await tool.validateBuildAndExecute(
      { taskId: 'task-1' },
      new AbortController().signal,
    );
    expect(result.error).toBeDefined();
    expect(result.error!.type).toBe(ToolErrorType.INVALID_TOOL_PARAMS);
  });

  it('updates task status successfully', async () => {
    const result = await tool.validateBuildAndExecute(
      { taskId: 'task-1', status: 'in_progress' },
      new AbortController().signal,
    );
    expect(result.llmContent).toContain('updated successfully');
    expect(mockUpdate).toHaveBeenCalledWith('task-1', {
      status: 'in_progress',
      title: undefined,
      description: undefined,
      priority: undefined,
    });
  });

  it('updates task title successfully', async () => {
    const result = await tool.validateBuildAndExecute(
      { taskId: 'task-1', title: 'New title' },
      new AbortController().signal,
    );
    expect(result.llmContent).toContain('updated successfully');
    expect(mockUpdate).toHaveBeenCalledWith('task-1', {
      status: undefined,
      title: 'New title',
      description: undefined,
      priority: undefined,
    });
  });

  it('returns error for unknown task ID', async () => {
    const result = await tool.validateBuildAndExecute(
      { taskId: 'nonexistent', status: 'completed' },
      new AbortController().signal,
    );
    expect(result.llmContent).toContain('not found');
    expect(result.error).toBeDefined();
  });

  it('returns todo list display format', async () => {
    const result = await tool.validateBuildAndExecute(
      { taskId: 'task-1', status: 'completed' },
      new AbortController().signal,
    );
    expect(result.returnDisplay).toHaveProperty('type', 'todo_list');
    expect(Array.isArray(result.returnDisplay.todos)).toBe(true);
  });

  it('updates task with all fields', async () => {
    const result = await tool.validateBuildAndExecute(
      {
        taskId: 'task-1',
        status: 'blocked',
        title: 'Blocked task',
        description: 'Waiting for dependency',
        priority: 'high',
      },
      new AbortController().signal,
    );
    expect(result.llmContent).toContain('updated successfully');
    expect(mockUpdate).toHaveBeenCalledWith('task-1', {
      status: 'blocked',
      title: 'Blocked task',
      description: 'Waiting for dependency',
      priority: 'high',
    });
  });
});
