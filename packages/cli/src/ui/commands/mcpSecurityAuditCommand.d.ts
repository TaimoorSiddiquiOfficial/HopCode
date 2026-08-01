/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SlashCommand } from './types.js';
/**
 * MCP Security Audit Command
 *
 * Audits MCP server configurations for security issues:
 * - Hardcoded secrets and API keys
 * - Unpinned versions (supply chain risk)
 * - Insecure permissions
 * - Missing validation
 * - Dangerous command execution
 */
export declare const mcpSecurityAuditCommand: SlashCommand;
