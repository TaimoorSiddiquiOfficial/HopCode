/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * MCP-related constants
 */

/**
 * Maximum number of tools to display
 */
export const MAX_DISPLAY_TOOLS = 10;

/**
 * Maximum number of prompts to display
 */
export const MAX_DISPLAY_PROMPTS = 10;

/**
 * Maximum number of logs visible in the log list
 */
export const VISIBLE_LOGS_COUNT = 15;

/**
 * Maximum number of tools visible in the tool list
 */
export const VISIBLE_TOOLS_COUNT = 10;

export const SOURCE_ORDER = ['user', 'project', 'extension'] as const;

/**
 * Status display text
 */
export const STATUS_TEXT: Record<string, string> = {
  connected: 'connected',
  connecting: 'connecting',
  disconnected: 'failed',
};
