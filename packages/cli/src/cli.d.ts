/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
type BootstrapRoute = 'serve' | 'mcp' | 'help' | 'version' | 'default';
export declare const TOP_LEVEL_COMMANDS: readonly [readonly ["auth", "Configure authentication (removed)"], readonly ["channel <command>", "Manage messaging channels (Telegram, Discord, etc.)"], readonly ["extensions <command>", "Manage HopCode extensions."], readonly ["hooks", "Manage HopCode hooks (use /hooks in interactive mode)."], readonly ["mcp", "Manage MCP servers"], readonly ["review <command>", "Internal helpers used by the /review skill (PR worktree setup, context fetch, rules loading, presubmit checks, cleanup)"], readonly ["serve", "Run HopCode as a local HTTP daemon (Stage 1 experimental: --http-bridge)"], readonly ["sessions <command>", "Manage Qwen Code sessions"], readonly ["update", "Check for Qwen Code updates and install if available"]];
export declare const MCP_COMMANDS: readonly [readonly ["add <name> <commandOrUrl> [args...]", "Add a server"], readonly ["remove <name>", "Remove a server"], readonly ["list", "List all configured MCP servers"], readonly ["reconnect [server-name]", "Reconnect to MCP servers"], readonly ["approve [name]", "Approve a pending MCP server"], readonly ["reject [name]", "Reject a pending MCP server"]];
export declare function resolveBootstrapRoute(rawArgv: readonly string[]): BootstrapRoute;
export declare function runCliEntry(rawArgv?: readonly string[]): Promise<void>;
export declare function isExpectedPtyRaceError(error: unknown): boolean;
export declare function handleCriticalError(error: unknown): Promise<void>;
export declare function runCliEntryPoint(run?: () => Promise<void>, handleError?: (error: unknown) => Promise<void>): Promise<void>;
export {};
