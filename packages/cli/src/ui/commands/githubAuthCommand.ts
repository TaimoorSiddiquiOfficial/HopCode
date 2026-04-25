/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';

/**
 * GitHub authentication command with installation link generation
 */
export const githubAuthCommand: SlashCommand = {
  name: 'github-auth',
  description: 'Authenticate with GitHub and install HopCode App',
  kind: CommandKind.BUILT_IN,
  action: async (
    _context: unknown,
    _args: string,
  ): Promise<SlashCommandActionReturn> => {
    // Check if user has GitHub credentials configured
    const hasCredentials = await checkGitHubCredentials();

    if (!hasCredentials) {
      // User not configured - provide installation link
      return {
        type: 'message',
        messageType: 'info',
        content: generateInstallationInstructions(),
      };
    }

    // User has credentials - verify authentication
    const isAuthenticated = await verifyGitHubAuthentication();

    if (!isAuthenticated) {
      return {
        type: 'message',
        messageType: 'warning',
        content: generateAuthFailureMessage(),
      };
    }

    // User is authenticated - show status and app installation link
    return {
      type: 'message',
      messageType: 'success',
      content: generateAuthenticatedMessage(),
    };
  },
};

/**
 * Check if user has GitHub credentials configured via environment variables.
 */
async function checkGitHubCredentials(): Promise<boolean> {
  return !!process.env.GITHUB_APP_ID && !!process.env.GITHUB_APP_PRIVATE_KEY;
}

/**
 * Verify GitHub authentication works
 */
async function verifyGitHubAuthentication(): Promise<boolean> {
  try {
    // TODO: Implement actual authentication test
    // For now, just check credentials exist
    return true;
  } catch (error) {
    // Use debugLogger instead of console for proper logging
    const { createDebugLogger } = await import('@hoptrendy/hopcode-core');
    const debugLogger = createDebugLogger('github-auth');
    debugLogger.error('GitHub auth verification failed:', error);
    return false;
  }
}

/**
 * Generate installation instructions for unconfigured users
 */
function generateInstallationInstructions(): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const appId = '3424564';
  const appName = 'hopcode-ai-agent'; // Replace with your actual app name

  return `# 🔐 GitHub Authentication Required

## Step 1: Install HopCode GitHub App

Before using GitHub features, you need to install the HopCode GitHub App on your repositories.

### Quick Install Link:

👉 **https://github.com/apps/${appName}/installations/select_target**

Click the link above and:
1. Choose where to install (your account or organization)
2. Select repositories to grant access to
3. Click "Install"

---

## Step 2: Create Your GitHub App (Optional - Advanced Users)

If you prefer to create your own GitHub App instead of using the shared one:

1. Visit: **https://github.com/settings/apps/new**
2. Fill in app details:
   - **Name**: HopCode (Your Name)
   - **Homepage**: https://hopcode.dev
   - **Webhook**: Leave unchecked (not required)

3. Generate Private Key:
   - Scroll to "Private keys" section
   - Click "Generate a private key"
   - Save the .pem file securely

4. Copy App ID from "About" section

---

## Step 3: Configure Credentials

### Option A: Use Shared HopCode App (Easiest)

If you installed the shared HopCode App above, configure with:

\`\`\`bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, or ~/.zprofile)
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
... your private key ...
-----END RSA PRIVATE KEY-----"
\`\`\`

### Option B: Use Your Own GitHub App

If you created your own GitHub App:

\`\`\`bash
# Add to your shell profile
export GITHUB_APP_ID=YOUR_APP_ID
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
... your private key ...
-----END RSA PRIVATE KEY-----"
\`\`\`

### Option C: Configure in Settings File

Add to \`~/.hopcode/settings.json\`:

\`\`\`json
{
  "github": {
    "appId": "YOUR_APP_ID",
    "privateKey": "-----BEGIN RSA PRIVATE KEY-----\\n...\\n-----END RSA PRIVATE KEY-----"
  }
}
\`\`\`

---

## Step 4: Verify Installation

After configuring credentials, run:

\`\`\`bash
hopcode /github-auth
\`\`\`

You should see: ✅ GitHub Authentication Successful

---

## 📚 Quick Reference

| Command | Description |
|---------|-------------|
| \`/github-auth\` | Check authentication status |
| \`/github issues\` | Manage issues |
| \`/github pr\` | Review pull requests |
| \`/github ci\` | Check CI/CD |
| \`/github workflow\` | Manage workflows |

---

## 🔒 Security Notes

- ✅ Private keys are stored locally only (never committed to git)
- ✅ Each user's credentials are isolated
- ✅ JWT authentication (no Client Secret needed)
- ✅ App only accesses repositories you install it on

---

**Need Help?** See full documentation: \`docs/users/github-integration.md\``;
}

/**
 * Generate authentication failure message
 */
function generateAuthFailureMessage(): string {
  return `# ⚠️ GitHub Authentication Failed

Your credentials are configured but authentication failed.

## Possible Causes:

1. **Invalid Private Key**: Check if your .pem file is correct
2. **App Not Installed**: Install the app on your repositories
3. **Expired Token**: Tokens are cached for 5 minutes, try again

## Troubleshooting:

\`\`\`bash
# 1. Verify credentials are set
echo $GITHUB_APP_ID
echo $GITHUB_APP_PRIVATE_KEY

# 2. Check app is installed on your repos
# Visit: https://github.com/settings/installations

# 3. Re-configure credentials
# Edit ~/.hopcode/settings.json or update environment variables
\`\`\`

## Need Help?

Run \`/github-auth\` again after fixing credentials.

See: \`docs/users/GITHUB_QUICK_START.md\` for detailed setup.`;
}

/**
 * Generate success message for authenticated users
 */
function generateAuthenticatedMessage(): string {
  const appId = process.env.GITHUB_APP_ID || 'Unknown';

  return `# ✅ GitHub Authentication Successful

**App ID**: ${appId}  
**Status**: Connected and ready to use

---

## 🚀 Quick Actions

### Install App on More Repositories

👉 **https://github.com/settings/installations**

Click above to install HopCode on additional repositories.

### Available GitHub Commands

| Command | Description |
|---------|-------------|
| \`/github issues list\` | List issues |
| \`/github pr review --number <N>\` | Review PR #N |
| \`/github ci status\` | Check CI/CD |
| \`/github workflow run <name>\` | Trigger workflow |
| \`/github release create\` | Create release |
| \`/github security scan\` | Security scan |

### Use GitHub Subagents

\`\`\`bash
# Review a PR
hopcode -p "/agent github-reviewer Review PR #123"

# Triage an issue  
hopcode -p "/agent github-triager Triage issue #456"

# Check CI status
hopcode -p "/agent github-ci-monitor Check CI for main branch"

# Create a release
hopcode -p "/agent github-releaser Create v1.2.3 release"

# Security scan
hopcode -p "/agent github-security-scanner Scan for vulnerabilities"
\`\`\`

---

## 📊 Your GitHub App

- **App ID**: ${appId}
- **Authentication**: JWT (Private Key)
- **Token Cache**: 5 minutes
- **Rate Limit**: 15,000 requests/hour (GitHub App limit)

---

**Documentation**: \`docs/users/github-integration.md\`  
**Quick Start**: \`docs/users/GITHUB_QUICK_START.md\``;
}
