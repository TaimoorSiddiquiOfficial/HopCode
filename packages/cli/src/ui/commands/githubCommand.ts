/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';

// GitHub App configuration
const GITHUB_APP_ID = '3424564';
const INSTALLATION_URL = 'https://github.com/apps/hopcode-cli/installations/select_target';

/**
 * Check if user has GitHub credentials configured
 */
function hasGitHubCredentials(context: CommandContext): boolean {
  const config = context.services.config;
  if (!config) return false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = ({ github: { appId: process.env.GITHUB_APP_ID, privateKey: process.env.GITHUB_APP_PRIVATE_KEY } } as any);
  const githubConfig = settings?.github;

  // Check settings.json
  const hasSettingsAuth = !!githubConfig?.appId && !!githubConfig?.privateKey;
  
  // Check environment variables
  const hasEnvAuth = !!process.env.GITHUB_APP_ID && !!process.env.GITHUB_APP_PRIVATE_KEY;

  return hasSettingsAuth || hasEnvAuth;
}

/**
 * GitHub slash command - provides GitHub integration commands
 */
export const githubCommand: SlashCommand = {
  name: 'github',
  description: 'GitHub integration - manage issues, PRs, workflows, and more',
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string): Promise<SlashCommandActionReturn> => {
    const subCommand = args.trim();

    // If no subcommand, show installation link or status
    if (!subCommand) {
      const hasCredentials = hasGitHubCredentials(context);
      
      if (!hasCredentials) {
        // User not configured - show installation link and Device Flow option
        return {
          type: 'message',
          messageType: 'info',
          content: `# 🔐 GitHub Integration - Not Configured

## Option 1: Install GitHub App (Recommended for Full Features)

Install the HopCode GitHub App on your repositories:

### 👉 [Click here to install: ${INSTALLATION_URL}](${INSTALLATION_URL})

After installation, configure your credentials:

\`\`\`bash
# Add to ~/.bashrc or ~/.zshrc
export GITHUB_APP_ID=${GITHUB_APP_ID}
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
... your private key ...
-----END RSA PRIVATE KEY-----"
\`\`\`

## Option 2: Interactive Authentication (Quick Setup)

Authenticate with GitHub using your browser:

\`\`\`bash
hopcode /github-device-auth
\`\`\`

This will:
1. Generate a device code
2. Show you a verification URL
3. You enter code in browser
4. Authorize HopCode
5. Automatically save access token

**Best for**: Quick testing, personal use  
**Note**: Token expires after 8 hours

---

## Available Commands (after setup)

| Command | Description |
|---------|-------------|
| \`/github auth\` | Check authentication |
| \`/github-device-auth\` | Interactive login |
| \`/github issues\` | Manage issues |
| \`/github pr\` | Review PRs |
| \`/github ci\` | Check CI/CD |
| \`/github workflow\` | Workflows |
| \`/github release\` | Releases |
| \`/github security\` | Security |

See full instructions: \`docs/users/GITHUB_APP_INSTALL.md\`  
Device Flow guide: \`docs/users/GITHUB_DEVICE_FLOW_GUIDE.md\``,
        };
      }

      // User configured - show status and quick actions
      return {
        type: 'message',
        messageType: 'success',
        content: `# ✅ GitHub Integration - Ready

**App ID**: ${GITHUB_APP_ID}  
**Status**: Configured

## Quick Actions

- [Install on more repos](${INSTALLATION_URL})
- [Manage installations](https://github.com/settings/installations)

## Available Commands

| Command | Description |
|---------|-------------|
| \`/github auth\` | Check authentication |
| \`/github issues list\` | List issues |
| \`/github pr review --number <N>\` | Review PR |
| \`/github ci status\` | Check CI/CD |
| \`/github workflow run <name>\` | Trigger workflow |
| \`/github release create\` | Create release |
| \`/github security scan\` | Security scan |

## Use GitHub Subagents

\`\`\`
/agent github-reviewer Review PR #123
/agent github-triager Triage issue #456
/agent github-ci-monitor Check CI status
\`\`\``,
      };
    }

    const [action, ...rest] = subCommand.split(' ');
    const params = rest.join(' ');

    switch (action) {
      case 'auth':
        // Delegate to githubAuthCommand
        return {
          type: 'message',
          messageType: 'info',
          content: 'Run `/github-auth` for detailed authentication status',
        };

      case 'issues':
        return {
          type: 'startImmediateSubagent',
          subagent: 'github-triager',
          prompt: `Manage GitHub issues: ${params}`,
        };

      case 'pr':
      case 'pull-request':
      case 'pull-requests':
        return {
          type: 'startImmediateSubagent',
          subagent: 'github-reviewer',
          prompt: `Manage pull requests: ${params}`,
        };

      case 'ci':
        return {
          type: 'startImmediateSubagent',
          subagent: 'github-ci-monitor',
          prompt: `Check CI/CD status: ${params}`,
        };

      case 'workflow':
      case 'workflows':
        return {
          type: 'message',
          messageType: 'info',
          content: `Workflow commands:

  /github workflow list              List all workflows
  /github workflow run <name>        Trigger workflow
  /github workflow status <id>       Check workflow status
  /github workflow logs <run-id>     View workflow logs

Example: /github workflow run Deploy --ref main`,
        };

      case 'release':
      case 'releases':
        return {
          type: 'startImmediateSubagent',
          subagent: 'github-releaser',
          prompt: `Manage releases: ${params}`,
        };

      case 'security':
        return {
          type: 'startImmediateSubagent',
          subagent: 'github-security-scanner',
          prompt: `Security scan: ${params}`,
        };

      default:
        return {
          type: 'message',
          messageType: 'error',
          content: `Unknown GitHub command: ${action}

Available commands:
  /github auth          Check authentication
  /github issues        Manage issues
  /github pr            Manage PRs
  /github ci            Check CI
  /github workflow      Workflows
  /github release       Releases
  /github security      Security`,
        };
    }
  },
  completion: async (context: CommandContext, partialArg: string) => {
    const hasCredentials = hasGitHubCredentials(context);
    
    const suggestions = hasCredentials
      ? [
          { label: 'auth', description: 'Check authentication' },
          { label: 'issues', description: 'Manage issues' },
          { label: 'pr', description: 'Manage pull requests' },
          { label: 'ci', description: 'Check CI/CD status' },
          { label: 'workflow', description: 'Manage workflows' },
          { label: 'release', description: 'Manage releases' },
          { label: 'security', description: 'Security scanning' },
        ]
      : [
          { label: 'auth', description: 'Check authentication' },
          { label: 'install', description: 'Install GitHub App' },
        ];

    return suggestions
      .filter((s) => s.label.startsWith(partialArg))
      .map((s) => s.label);
  },
};
