/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Tool name constants to avoid circular dependencies.
 * These constants are used across multiple files and should be kept in sync
 * with the actual tool class names.
 *
 * Filesystem-path-bearing tools (whose inputs name actual project files)
 * also need to be added to `FS_PATH_TOOL_NAMES` in
 * `core/coreToolScheduler.ts` so conditional rules and path-conditional
 * skill activation see the touched paths. Forgetting that registration
 * silently skips the activation pipeline for that tool — there is no
 * compile-time guard. (TODO: replace the manual allowlist with a
 * per-declaration `pathFields?: string[]` annotation on the tool class.)
 */
export const ToolNames = {
  EDIT: 'edit',
  WRITE_FILE: 'write_file',
  READ_FILE: 'read_file',
  GREP: 'grep_search',
  GLOB: 'glob',
  SHELL: 'run_shell_command',
  TODO_WRITE: 'todo_write',
  MEMORY: 'save_memory',
  AGENT: 'agent',
  SKILL: 'skill',
  EXIT_PLAN_MODE: 'exit_plan_mode',
  WEB_FETCH: 'web_fetch',
  LS: 'list_directory',
  LSP: 'lsp',
  ASK_USER_QUESTION: 'ask_user_question',
  CRON_CREATE: 'cron_create',
  CRON_LIST: 'cron_list',
  CRON_DELETE: 'cron_delete',
  TASK_STOP: 'task_stop',
  SEND_MESSAGE: 'send_message',
  MONITOR: 'monitor',
  TASK_CREATE: 'task_create',
  TASK_GET: 'task_get',
  TASK_LIST: 'task_list',
  TASK_OUTPUT: 'task_output',
  TASK_READY: 'task_ready',
  TASK_UPDATE: 'task_update',
  WEB_SEARCH: 'web_search',
  REPO_MAP: 'repo_map',
  BROWSER: 'browser',
  BG_STOP: 'bg_stop',
} as const;

/**
 * Tool display name constants to avoid circular dependencies.
 * These constants are used across multiple files and should be kept in sync
 * with the actual tool display names.
 */
export const ToolDisplayNames = {
  EDIT: 'Edit',
  WRITE_FILE: 'WriteFile',
  READ_FILE: 'ReadFile',
  GREP: 'Grep',
  GLOB: 'Glob',
  SHELL: 'Shell',
  TODO_WRITE: 'TodoWrite',
  MEMORY: 'SaveMemory',
  AGENT: 'Agent',
  SKILL: 'Skill',
  EXIT_PLAN_MODE: 'ExitPlanMode',
  WEB_FETCH: 'WebFetch',
  LS: 'ListFiles',
  LSP: 'Lsp',
  ASK_USER_QUESTION: 'AskUserQuestion',
  CRON_CREATE: 'CronCreate',
  CRON_LIST: 'CronList',
  CRON_DELETE: 'CronDelete',
  TASK_STOP: 'TaskStop',
  SEND_MESSAGE: 'SendMessage',
  MONITOR: 'Monitor',
  TASK_CREATE: 'TaskCreate',
  TASK_GET: 'TaskGet',
  TASK_LIST: 'TaskList',
  TASK_OUTPUT: 'TaskOutput',
  TASK_READY: 'TaskReady',
  TASK_UPDATE: 'TaskUpdate',
  WEB_SEARCH: 'WebSearch',
  REPO_MAP: 'RepoMap',
  BROWSER: 'Browser',
  BG_STOP: 'BgStop',
} as const;

// Migration from old tool names to new tool names
// These legacy tool names were used in earlier versions and need to be supported
// for backward compatibility with existing user configurations
export const ToolNamesMigration = {
  search_file_content: ToolNames.GREP, // Legacy name from grep tool
  replace: ToolNames.EDIT, // Legacy name from edit tool
  task: ToolNames.AGENT, // Legacy name from agent tool (renamed from task)
  todo_write: ToolNames.TASK_LIST, // Legacy name from todo_write tool (replaced by task management tools)
} as const;

// Migration from old tool display names to new tool display names
// These legacy display names were used before the tool naming standardization
export const ToolDisplayNamesMigration = {
  SearchFiles: ToolDisplayNames.GREP, // Old display name for Grep
  FindFiles: ToolDisplayNames.GLOB, // Old display name for Glob
  ReadFolder: ToolDisplayNames.LS, // Old display name for ListFiles
  Task: ToolDisplayNames.AGENT, // Old display name for Agent (renamed from Task)
  TodoWrite: ToolDisplayNames.TASK_LIST, // Old display name for TodoWrite (replaced by task management tools)
} as const;
