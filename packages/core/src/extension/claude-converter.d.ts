/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ExtensionConfig } from './extensionManager.js';
import type { ExtensionInstallMetadata, MCPServerConfig } from '../config/config.js';
import type { HookEventName, HookDefinition } from '../hooks/types.js';
export interface ClaudePluginConfig {
    name: string;
    version: string;
    description?: string;
    author?: {
        name?: string;
        email?: string;
        url?: string;
    };
    homepage?: string;
    repository?: string;
    license?: string;
    keywords?: string[];
    commands?: string | string[];
    agents?: string | string[];
    skills?: string | string[];
    hooks?: string | {
        [K in HookEventName]?: HookDefinition[];
    };
    mcpServers?: string | Record<string, MCPServerConfig>;
    outputStyles?: string | string[];
    lspServers?: string | Record<string, unknown>;
}
/**
 * Claude Code subagent configuration format.
 * Based on https://code.claude.com/docs/en/sub-agents
 */
export interface ClaudeAgentConfig {
    /** Unique identifier using lowercase letters and hyphens */
    name: string;
    /** When Claude should delegate to this subagent */
    description: string;
    /** Tools the subagent can use. Inherits all tools if omitted */
    tools?: string[];
    /** Tools to deny, removed from inherited or specified list */
    disallowedTools?: string[];
    /** Model to use: sonnet, opus, haiku, or inherit */
    model?: string;
    /** Permission mode: default, acceptEdits, dontAsk, bypassPermissions, or plan */
    permissionMode?: string;
    /** Skills to load into the subagent's context at startup */
    skills?: string[];
    /** Hooks configuration (CC `TKO` shape; nested per HookEventName) */
    hooks?: unknown;
    /** Per-agent MCP server overrides (CC `gS8` shape; record of server-name → spec) */
    mcpServers?: unknown;
    /** System prompt content */
    systemPrompt?: string;
    /** subagent color */
    color?: string;
}
export type ClaudePluginSource = {
    source: 'github';
    repo: string;
} | {
    source: 'url';
    url: string;
} | {
    source: 'git-subdir';
    url: string;
    path: string;
    ref?: string;
    sha?: string;
};
export interface ClaudeMarketplacePluginConfig extends ClaudePluginConfig {
    source: string | ClaudePluginSource;
    category?: string;
    strict?: boolean;
    tags?: string[];
}
export interface ClaudeMarketplaceConfig {
    name: string;
    owner: {
        name: string;
        email: string;
    };
    plugins: ClaudeMarketplacePluginConfig[];
    metadata?: {
        description?: string;
        version?: string;
        pluginRoot?: string;
    };
}
/**
 * Converts a Claude agent config to HopCode Code subagent format.
 * @param claudeAgent Claude agent configuration
 * @returns Converted agent config compatible with HopCode Code SubagentConfig
 */
export declare function convertClaudeAgentConfig(claudeAgent: ClaudeAgentConfig): Record<string, unknown>;
/**
 * Maps a single Claude `.mcp.json` server entry to HopCode's MCPServerConfig
 * shape. Claude discriminates transport with a `type` field
 * (`http`/`sse`/`stdio`), whereas HopCode keys off which field is set:
 * `httpUrl` (streamable HTTP), `url` (SSE) or `command` (stdio).
 */
export declare function normalizeClaudeMcpServer(raw: MCPServerConfig): MCPServerConfig;
/**
 * Converts a Claude plugin config to HopCode Code format.
 * @param claudeConfig Claude plugin configuration
 * @returns HopCode ExtensionConfig
 */
export declare function convertClaudeToHopCodeConfig(claudeConfig: ClaudePluginConfig): ExtensionConfig;
/**
 * Converts a complete Claude plugin package to HopCode Code format.
 * Creates a new temporary directory with:
 * 1. Converted hopcode-extension.json
 * 2. Commands, skills, and agents collected to respective folders
 * 3. MCP servers resolved from JSON files if needed
 * 4. All other files preserved
 */
export declare function convertClaudePluginPackage(extensionDir: string, pluginName: string, networkPolicy?: ExtensionInstallMetadata['networkPolicy'], signal?: AbortSignal): Promise<{
    config: ExtensionConfig;
    convertedDir: string;
}>;
/**
 * Converts a standalone Claude plugin to HopCode format. A standalone plugin
 * is a repo whose root holds `.claude-plugin/plugin.json` (no marketplace.json),
 * as produced by installing a Claude Code plugin directly from a git URL.
 *
 * MCP servers declared in a root `.mcp.json` are folded into the config when
 * plugin.json does not list them itself.
 */
export declare function convertClaudePluginStandalone(extensionDir: string): Promise<{
    config: ExtensionConfig;
    convertedDir: string;
}>;
/**
 * Merges marketplace plugin config with the actual plugin.json config.
 * Marketplace config takes precedence for conflicting fields.
 * @param marketplacePlugin Marketplace plugin definition
 * @param pluginConfig Actual plugin.json config (optional if strict=false)
 * @returns Merged Claude plugin config
 */
export declare function mergeClaudeConfigs(marketplacePlugin: ClaudeMarketplacePluginConfig, pluginConfig?: ClaudePluginConfig): ClaudePluginConfig;
/**
 * Checks if a config object is in Claude plugin format.
 * @param config Configuration object to check
 * @returns true if config appears to be Claude format
 */
export declare function isClaudePluginConfig(extensionDir: string, marketplace: {
    extensionSource: string;
    pluginName: string;
}): boolean;
