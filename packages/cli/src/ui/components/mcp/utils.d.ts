/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { MCPServerDisplayInfo, GroupedServers } from './types.js';
/**
 * ????????
 */
export declare function groupServersBySource(servers: MCPServerDisplayInfo[]): GroupedServers[];
/**
 * ??????
 */
export declare function getStatusColor(status: string): 'green' | 'yellow' | 'red' | 'gray';
/**
 * ??????
 */
export declare function getStatusIcon(status: string): string;
/**
 * ????
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * ??????????
 */
export declare function formatServerCommand(server: MCPServerDisplayInfo): string;
/**
 * Check if a tool is valid (has both name and description required by LLM)
 * @param name - Tool name
 * @param description - Tool description
 * @returns boolean indicating if the tool is valid
 */
export declare function isToolValid(name?: string, description?: string): boolean;
/**
 * Get the reason why a tool is invalid
 * @param name - Tool name
 * @param description - Tool description
 * @returns Array of missing fields
 */
export declare function getToolInvalidReasons(name?: string, description?: string): string[];
