/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { ToolNames } from '../tools/tool-names.js';
import type { SubagentConfig } from '../subagents/types.js';

/**
 * Registry of GitHub-specific subagents.
 *
 * GitHub operations are performed via the `gh` CLI through the Shell tool,
 * since dedicated GitHub MCP tools are not registered in ToolNames.
 */
export class GitHubSubagentRegistry {
  private static readonly GITHUB_AGENTS: Array<
    Omit<SubagentConfig, 'level' | 'filePath'>
  > = [
    {
      name: 'github-reviewer',
      description:
        'GitHub pull request reviewer agent. Use this agent to review PRs, analyze code changes, check for best practices, and provide constructive feedback.',
      systemPrompt: `You are a GitHub pull request reviewer specialist. You excel at:
- Analyzing code changes in pull requests
- Checking for code quality and best practices
- Identifying potential bugs and security issues
- Providing constructive, actionable feedback
- Ensuring consistency with project conventions

When reviewing a PR:
1. Use Shell tool with gh CLI commands to get PR details and changed files
2. Analyze changed files for quality, bugs, security, performance, and docs
3. Check CI/CD status and test results using gh CLI
4. Provide structured review with summary, feedback, and suggestions

Use these tools:
- ${ToolNames.SHELL} - Run gh CLI commands for GitHub operations
- ${ToolNames.READ_FILE} - Read file contents
- ${ToolNames.GREP} - Search for patterns
- ${ToolNames.GLOB} - Find files by pattern

For clear communication, avoid using emojis.`,
      tools: [
        ToolNames.SHELL,
        ToolNames.READ_FILE,
        ToolNames.GREP,
        ToolNames.GLOB,
      ],
      approvalMode: 'auto-edit',
    },
    {
      name: 'github-triager',
      description:
        'GitHub issue triage agent. Use this agent to analyze new issues, apply appropriate labels, suggest assignees, and provide helpful initial responses.',
      systemPrompt: `You are a GitHub issue triage specialist. You excel at:
- Categorizing issues by type (bug, enhancement, question, documentation)
- Identifying duplicates
- Applying appropriate labels
- Suggesting assignees based on expertise
- Writing helpful initial responses
- Determining priority and urgency

Use Shell tool with gh CLI commands for all GitHub operations (gh issue, gh label, etc).
Use Grep to search for duplicate issues and patterns.

For clear communication, avoid using emojis.`,
      tools: [ToolNames.SHELL, ToolNames.GREP],
      approvalMode: 'auto-edit',
    },
    {
      name: 'github-ci-monitor',
      description:
        'GitHub Actions CI/CD monitoring agent. Use this agent to check workflow runs, analyze failures, view logs, and suggest fixes for CI issues.',
      systemPrompt: `You are a GitHub Actions CI/CD monitoring specialist. You excel at:
- Monitoring workflow run status
- Analyzing CI failures
- Reading and interpreting logs
- Identifying root causes
- Suggesting fixes for common issues

Use Shell tool with gh CLI commands (gh run list, gh run view, gh run view --log) for CI operations.

For clear communication, avoid using emojis.`,
      tools: [ToolNames.SHELL, ToolNames.READ_FILE],
      approvalMode: 'plan',
    },
    {
      name: 'github-releaser',
      description:
        'GitHub release management agent. Use this agent to create releases, generate changelogs, manage version tags, and coordinate release activities.',
      systemPrompt: `You are a GitHub release management specialist. You excel at:
- Creating semantic version releases
- Generating changelogs from PRs
- Managing release notes
- Coordinating release activities

Use Shell tool with gh CLI commands (gh release create, gh pr list) for release operations.

For clear communication, avoid using emojis.`,
      tools: [ToolNames.SHELL, ToolNames.READ_FILE, ToolNames.EDIT],
      approvalMode: 'plan',
    },
    {
      name: 'github-security-scanner',
      description:
        'GitHub security scanning agent. Use this agent to check for security alerts, review code scanning results, and identify potential vulnerabilities.',
      systemPrompt: `You are a GitHub security scanning specialist. You excel at:
- Reviewing code scanning alerts
- Analyzing security vulnerabilities
- Checking dependency vulnerabilities
- Identifying secret exposures
- Recommending security fixes

Use Shell tool with gh CLI commands (gh api) for security scanning operations.

For clear communication, avoid using emojis.`,
      tools: [ToolNames.SHELL, ToolNames.GREP, ToolNames.READ_FILE],
      approvalMode: 'plan',
    },
  ];

  /**
   * Get all GitHub subagents
   */
  static getGitHubAgents(): SubagentConfig[] {
    return this.GITHUB_AGENTS.map((agent) => ({
      ...agent,
      level: 'builtin' as const,
      filePath: `<builtin:github:${agent.name}>`,
      isBuiltin: true,
    }));
  }

  /**
   * Get a specific GitHub agent by name
   */
  static getGitHubAgent(name: string): SubagentConfig | null {
    const lowerName = name.toLowerCase();
    const agent = this.GITHUB_AGENTS.find(
      (a) => a.name.toLowerCase() === lowerName,
    );

    if (!agent) {
      return null;
    }

    return {
      ...agent,
      level: 'builtin' as const,
      filePath: `<builtin:github:${agent.name}>`,
      isBuiltin: true,
    };
  }

  /**
   * Check if an agent is a GitHub agent
   */
  static isGitHubAgent(name: string): boolean {
    const lowerName = name.toLowerCase();
    return this.GITHUB_AGENTS.some(
      (agent) => agent.name.toLowerCase() === lowerName,
    );
  }

  /**
   * Get names of all GitHub agents
   */
  static getGitHubAgentNames(): string[] {
    return this.GITHUB_AGENTS.map((agent) => agent.name);
  }
}
