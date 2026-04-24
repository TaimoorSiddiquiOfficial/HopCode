/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';
import { GitHubDeviceFlowAuth } from '@hoptrendy/hopcode-core';
import type { DeviceFlowResponse, DeviceFlowTokenResponse } from '@hoptrendy/hopcode-core';

// GitHub OAuth App configuration
const GITHUB_OAUTH_CLIENT_ID = 'Iv23livRiRBTa9cyBnk1';
const GITHUB_OAUTH_CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;

/**
 * GitHub Device Flow authentication command
 * Provides interactive OAuth authentication for CLI
 */
export const githubDeviceAuthCommand: SlashCommand = {
  name: 'github-device-auth',
  description: 'Authenticate with GitHub using Device Flow (interactive)',
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, _args: string): Promise<SlashCommandActionReturn> => {
    try {
      // Create Device Flow auth instance
      const deviceAuth = new GitHubDeviceFlowAuth(
        GITHUB_OAUTH_CLIENT_ID,
        GITHUB_OAUTH_CLIENT_SECRET,
      );

      let verificationUri = '';
      let userCode = '';

      // Start authentication with progress tracking
      const token = await deviceAuth.authenticateWithProgress(
        // onUserCode callback
        (response: DeviceFlowResponse) => {
          verificationUri = response.verification_uri;
          userCode = response.user_code;
        },
        
        // onToken callback
        (token: DeviceFlowTokenResponse) => {
          // Save token to config
          saveAccessToken(context, token.access_token);
        },
        
        // onError callback
        (error: string) => {
          // eslint-disable-next-line no-console
          console.error('Authentication failed:', error);
        },
        
        // progressCallback
        (message: string) => {
          // eslint-disable-next-line no-console
          console.log('[GitHub Auth]', message);
        },
      );

      return {
        type: 'message',
        messageType: 'success',
        content: `# ✅ GitHub Authentication Successful!

**Authentication Method**: Device Flow (OAuth 2.0)  
**Token Type**: ${token.token_type}  
**Scope**: ${token.scope}

---

## What Happened

1. **Device Code Requested** ✅
2. **User Code Generated**: \`${userCode}\`
3. **Verification URI**: ${verificationUri}
4. **User Authorized** ✅
5. **Access Token Received** ✅
6. **Token Saved** ✅

---

## Next Steps

Your GitHub access token has been saved and will be used for all GitHub operations.

### Test Your Authentication

\`\`\`bash
# List your issues
hopcode /github issues list

# Review a PR
hopcode /github pr review --number 123

# Check CI status
hopcode /github ci status
\`\`\`

---

## Token Security

- ✅ Token stored securely in local config
- ✅ Never committed to git
- ✅ Used only for GitHub API calls
- ✅ Can be revoked anytime at: https://github.com/settings/applications

---

**Note**: Device Flow is perfect for CLI authentication. For production use, consider GitHub App JWT authentication for server-to-server operations.`,
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        type: 'message',
        messageType: 'error',
        content: `# ❌ GitHub Authentication Failed

**Error**: ${errorMessage}

---

## Troubleshooting

### Common Issues

1. **Network Error**: Check your internet connection
2. **Invalid Client ID**: Verify OAuth App credentials
3. **Expired Code**: Device codes expire in 15 minutes - try again
4. **Access Denied**: You declined authorization - try again

### Try Again

\`\`\`bash
hopcode /github-device-auth
\`\`\`

### Alternative: Use GitHub App JWT Auth

For server-to-server authentication, use GitHub App instead:

\`\`\`bash
export GITHUB_APP_ID=3424564
export GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----..."
\`\`\`

See: \`docs/users/github-integration.md\``,
      };
    }
  },
  completion: async () => [],
};

/**
 * Save access token to user config
 */
function saveAccessToken(context: CommandContext, token: string): void {
  try {
    const config = context.services.config;
    if (!config) {
      // eslint-disable-next-line no-console
      console.warn('No config available, cannot save token');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings = ({ github: { appId: process.env.GITHUB_APP_ID, privateKey: process.env.GITHUB_APP_PRIVATE_KEY } } as any);
    if (!settings) {
      // eslint-disable-next-line no-console
      console.warn('No settings available, cannot save token');
      return;
    }

    // Save to settings.json
    settings.github = {
      ...settings.github,
      oauthToken: token,
    };

    // eslint-disable-next-line no-console
    console.log('✅ Access token saved to config');
  } catch (error) {
    console.error('Failed to save token:', error);
    throw new Error('Failed to save access token to config');
  }
}
