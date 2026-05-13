/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { t } from '../../../i18n/index.js';
import type { MCPServerDisplayInfo, GroupedServers } from './types.js';
import { SOURCE_ORDER } from './constants.js';

function getSourceDisplayName(source: string): string {
  switch (source) {
    case 'user':
      return t('User MCPs');
    case 'project':
      return t('Project MCPs');
    case 'extension':
      return t('Extension MCPs');
    default:
      return source;
  }
}

/**
 * ????????
 */
export function groupServersBySource(
  servers: MCPServerDisplayInfo[],
): GroupedServers[] {
  const groups = new Map<string, MCPServerDisplayInfo[]>();

  for (const server of servers) {
    const existing = groups.get(server.source);
    if (existing) {
      existing.push(server);
    } else {
      groups.set(server.source, [server]);
    }
  }

  // Sort by priority: user > project > extension
  const result: GroupedServers[] = [];

  for (const source of SOURCE_ORDER) {
    const servers = groups.get(source);
    if (servers && servers.length > 0) {
      result.push({
        source,
        displayName: getSourceDisplayName(source),
        servers,
      });
    }
  }

  return result;
}

/**
 * ??????
 */
export function getStatusColor(
  status: string,
): 'green' | 'yellow' | 'red' | 'gray' {
  switch (status) {
    case 'connected':
      return 'green';
    case 'connecting':
      return 'yellow';
    case 'disconnected':
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * ??????
 */
export function getStatusIcon(status: string): string {
  switch (status) {
    case 'connected':
      return '\u2713';
    case 'connecting':
      return '\u2026';
    case 'disconnected':
      return '\u2717';
    default:
      return '?';
  }
}

/**
 * ????
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * ??????????
 */
export function formatServerCommand(server: MCPServerDisplayInfo): string {
  const config = server.config;
  if (config.httpUrl) {
    return `${config.httpUrl} (http)`;
  }
  if (config.url) {
    return `${config.url} (sse)`;
  }
  if (config.command) {
    const args = config.args?.join(' ') || '';
    return `${config.command} ${args} (stdio)`.trim();
  }
  return t('Unknown');
}

/**
 * Check if a tool is valid (has both name and description required by LLM)
 * @param name - Tool name
 * @param description - Tool description
 * @returns boolean indicating if the tool is valid
 */
export function isToolValid(name?: string, description?: string): boolean {
  return !!name && !!description;
}

/**
 * Get the reason why a tool is invalid
 * @param name - Tool name
 * @param description - Tool description
 * @returns Array of missing fields
 */
export function getToolInvalidReasons(
  name?: string,
  description?: string,
): string[] {
  const reasons: string[] = [];
  if (!name) reasons.push(t('missing name'));
  if (!description) reasons.push(t('missing description'));
  return reasons;
}
