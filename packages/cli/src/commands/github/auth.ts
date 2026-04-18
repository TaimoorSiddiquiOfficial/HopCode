/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode github auth`
 *
 * Authenticates with GitHub using the OAuth Device Flow (RFC 8628).
 * No browser redirect or callback URL needed — the user enters a short code
 * at https://github.com/login/device.
 *
 * Flow:
 * 1. POST /login/device/code → get device_code + user_code
 * 2. Show user_code + verification_uri to user
 * 3. Poll POST /login/oauth/access_token until user completes auth
 * 4. Save access_token + refresh_token to settings.env.GITHUB_TOKEN
 *
 * IMPORTANT: Replace HOPCODE_GITHUB_APP_CLIENT_ID below with the actual
 * Client ID obtained after registering the "HopCode CLI" GitHub App at:
 * https://github.com/settings/apps/new
 *
 * Required App settings:
 *   - Device flow: enabled
 *   - No callback URL needed
 *   - Permissions: Contents R/W, Issues R/W, Pull Requests R/W,
 *                  Metadata R, Workflows R/W
 */

import type { CommandModule } from 'yargs';
import {
  saveGitHubToken,
  clearGitHubToken,
  loadGitHubToken,
} from '../../utils/githubTokenStore.js';
import { getAuthenticatedUser } from '../../utils/githubApi.js';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';

// ── Configuration ─────────────────────────────────────────────────────────────

/**
 * Public client ID of the registered "HopCode CLI" GitHub App.
 * This is NOT a secret — device flow requires only the client ID.
 * Replace this placeholder once the app is registered.
 */
const HOPCODE_GITHUB_APP_CLIENT_ID =
  process.env['HOPCODE_GITHUB_CLIENT_ID'] ?? 'Iv23livRiRBTa9cyBnk1';

const GITHUB_DEVICE_CODE_URL = 'https://github.com/login/device/code';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const DEVICE_FLOW_GRANT_TYPE = 'urn:ietf:params:oauth:grant-type:device_code';
const AUTH_SCOPES = 'repo issues pull_request user:email';

// ── Types ─────────────────────────────────────────────────────────────────────

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface TokenSuccessResponse {
  access_token: string;
  token_type: string;
  scope: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
}

interface TokenPendingResponse {
  error:
    | 'authorization_pending'
    | 'slow_down'
    | 'expired_token'
    | 'access_denied';
  error_description?: string;
}

type TokenResponse = TokenSuccessResponse | TokenPendingResponse;

// ── Device flow implementation ────────────────────────────────────────────────

async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const resp = await fetch(GITHUB_DEVICE_CODE_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: HOPCODE_GITHUB_APP_CLIENT_ID,
      scope: AUTH_SCOPES,
    }),
  });
  if (!resp.ok) {
    throw new Error(
      `Failed to start device flow: ${resp.status} ${resp.statusText}`,
    );
  }
  return (await resp.json()) as DeviceCodeResponse;
}

async function pollForToken(
  deviceCode: string,
  intervalSecs: number,
): Promise<string> {
  while (true) {
    await new Promise((r) => setTimeout(r, intervalSecs * 1000));

    const resp = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: HOPCODE_GITHUB_APP_CLIENT_ID,
        device_code: deviceCode,
        grant_type: DEVICE_FLOW_GRANT_TYPE,
      }),
    });

    const data = (await resp.json()) as TokenResponse;

    if ('access_token' in data) {
      // Calculate expiry timestamp
      const expiresAt = data.expires_in
        ? new Date(Date.now() + data.expires_in * 1000).toISOString()
        : undefined;

      saveGitHubToken({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
      });
      return data.access_token;
    }

    if ('error' in data) {
      switch (data.error) {
        case 'authorization_pending':
          process.stdout.write('.');
          break;
        case 'slow_down':
          intervalSecs += 5;
          process.stdout.write('.');
          break;
        case 'expired_token':
          throw new Error(
            'Device code expired. Please run: hopcode github auth',
          );
        case 'access_denied':
          throw new Error('Authorization denied by user.');
        default:
          throw new Error(
            `Unexpected error: ${data.error_description ?? data.error}`,
          );
      }
    }
  }
}

// ── Subcommand handlers ────────────────────────────────────────────────────────

async function handleGithubAuth(options: { logout?: boolean }): Promise<void> {
  if (options.logout) {
    clearGitHubToken();
    writeStdoutLine(t('✓ GitHub authentication cleared.'));
    return;
  }

  if (HOPCODE_GITHUB_APP_CLIENT_ID === 'REPLACE_WITH_CLIENT_ID') {
    writeStderrLine(
      t(
        [
          '⚠ GitHub App not yet registered.',
          '',
          'To enable GitHub integration:',
          '1. Go to https://github.com/settings/apps/new',
          '2. App name: HopCode CLI',
          '3. Enable Device Flow, no callback URL needed',
          '4. Permissions: Contents R/W, Issues R/W, PRs R/W, Metadata R, Workflows R/W',
          '5. Copy the Client ID',
          '6. Set env var: HOPCODE_GITHUB_CLIENT_ID=<your-client-id>',
          '   or update HOPCODE_GITHUB_APP_CLIENT_ID in packages/cli/src/commands/github/auth.ts',
        ].join('\n'),
      ),
    );
    process.exit(1);
  }

  // Check if already authenticated
  const existing = loadGitHubToken();
  if (existing?.accessToken) {
    try {
      const user = await getAuthenticatedUser();
      writeStdoutLine(
        t('✓ Already authenticated as: {{login}} ({{name}})', {
          login: user.login,
          name: user.name ?? user.login,
        }),
      );
      writeStdoutLine(
        t(
          '  To re-authenticate, run: hopcode github auth --logout && hopcode github auth',
        ),
      );
      return;
    } catch {
      // Token invalid — proceed with fresh auth
    }
  }

  writeStdoutLine(t('\n  Authenticating with GitHub...\n'));

  const deviceData = await requestDeviceCode();

  writeStdoutLine(t('  ┌─────────────────────────────────────────┐'));
  writeStdoutLine(
    t('  │  Open:  {{url}}', {
      url: deviceData.verification_uri.padEnd(38) + '│',
    }),
  );
  writeStdoutLine(
    t('  │  Code:  {{code}}', { code: deviceData.user_code.padEnd(38) + '│' }),
  );
  writeStdoutLine(t('  └─────────────────────────────────────────┘'));
  writeStdoutLine(t('\n  Waiting for authorization'));
  process.stdout.write('  ');

  const token = await pollForToken(deviceData.device_code, deviceData.interval);

  // Verify token works
  const user = await getAuthenticatedUser();
  process.stdout.write('\n');
  writeStdoutLine(
    t('\n  ✓ Authenticated as: {{login}} ({{name}})', {
      login: user.login,
      name: user.name ?? user.login,
    }),
  );
  writeStdoutLine(t('  GITHUB_TOKEN saved to settings.'));
  writeStdoutLine(
    t(
      '  You can now use: hopcode github pr, hopcode github issues, hopcode github commit\n',
    ),
  );

  void token; // used indirectly via saveGitHubToken
}

// ── Command export ─────────────────────────────────────────────────────────────

export const githubAuthCommand: CommandModule = {
  command: 'auth',
  describe: t('Authenticate with GitHub using OAuth Device Flow'),
  builder: (yargs) =>
    yargs.option('logout', {
      type: 'boolean',
      description: t('Remove stored GitHub credentials'),
      default: false,
    }),
  handler: async (argv) => {
    try {
      await handleGithubAuth({ logout: argv['logout'] as boolean });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Interrupted')
        process.exit(0);
      writeStderrLine(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
      process.exit(1);
    }
  },
};
