/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SlashCommand } from './types.js';
/**
 * Python MCP Server Generator Command
 *
 * Generates a complete Python MCP (Model Context Protocol) server from a description.
 * Creates:
 * - Server implementation with tools
 * - Tool definitions and handlers
 * - Configuration files (pyproject.toml, .env.example)
 * - Tests with pytest
 * - README with usage instructions
 * - Docker support (optional)
 */
export declare const pythonMcpServerCommand: SlashCommand;
