/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SubagentConfig } from '../subagents/types.js';
/**
 * Registry of GitHub-specific subagents.
 *
 * GitHub operations are performed via the `gh` CLI through the Shell tool,
 * since dedicated GitHub MCP tools are not registered in ToolNames.
 */
export declare class GitHubSubagentRegistry {
    private static readonly GITHUB_AGENTS;
    /**
     * Get all GitHub subagents
     */
    static getGitHubAgents(): SubagentConfig[];
    /**
     * Get a specific GitHub agent by name
     */
    static getGitHubAgent(name: string): SubagentConfig | null;
    /**
     * Check if an agent is a GitHub agent
     */
    static isGitHubAgent(name: string): boolean;
    /**
     * Get names of all GitHub agents
     */
    static getGitHubAgentNames(): string[];
}
