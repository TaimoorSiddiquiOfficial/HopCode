/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SlashCommand } from './types.js';
/**
 * Make Skill Template Command
 *
 * Generates a complete MCP server implementation from a natural language description.
 * Creates tool definitions, handler code, tests, and registers the server in .hopcode/mcp.json.
 *
 * Usage: /make-skill-template <description>
 * Example: /make-skill-template "Create a skill for interacting with Linear API for issue tracking"
 */
export declare const makeSkillTemplateCommand: SlashCommand;
