/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * GitHub token persistence.
 * Reads/writes GITHUB_TOKEN (and refresh token) from the user's settings.env.
 */
import { loadSettings, SettingScope } from '../config/settings.js';

export interface GitHubTokens {
  accessToken: string;
  refreshToken?: string;
  /** ISO timestamp when the access token expires */
  expiresAt?: string;
}

/** Load the stored GitHub token from settings. Returns null if not configured. */
export function loadGitHubToken(): GitHubTokens | null {
  const settings = loadSettings();
  const env = settings.merged?.env as Record<string, string> | undefined;
  const token = env?.['GITHUB_TOKEN'];
  if (!token) return null;
  return {
    accessToken: token,
    refreshToken: env?.['GITHUB_REFRESH_TOKEN'],
    expiresAt: env?.['GITHUB_TOKEN_EXPIRES_AT'],
  };
}

/** Persist GitHub tokens to user settings and process.env. */
export function saveGitHubToken(tokens: GitHubTokens): void {
  const settings = loadSettings();
  const scope = SettingScope.User;
  settings.setValue(scope, 'env.GITHUB_TOKEN', tokens.accessToken);
  process.env['GITHUB_TOKEN'] = tokens.accessToken;
  if (tokens.refreshToken) {
    settings.setValue(scope, 'env.GITHUB_REFRESH_TOKEN', tokens.refreshToken);
    process.env['GITHUB_REFRESH_TOKEN'] = tokens.refreshToken;
  }
  if (tokens.expiresAt) {
    settings.setValue(scope, 'env.GITHUB_TOKEN_EXPIRES_AT', tokens.expiresAt);
  }
}

/** Remove GitHub tokens from settings. */
export function clearGitHubToken(): void {
  const settings = loadSettings();
  const scope = SettingScope.User;
  settings.setValue(scope, 'env.GITHUB_TOKEN', undefined);
  settings.setValue(scope, 'env.GITHUB_REFRESH_TOKEN', undefined);
  settings.setValue(scope, 'env.GITHUB_TOKEN_EXPIRES_AT', undefined);
  delete process.env['GITHUB_TOKEN'];
  delete process.env['GITHUB_REFRESH_TOKEN'];
}

/** Returns the token string or throws if not authenticated. */
export function requireGitHubToken(): string {
  const stored = loadGitHubToken();
  const envToken = process.env['GITHUB_TOKEN'];
  const token = stored?.accessToken ?? envToken;
  if (!token) {
    throw new Error('Not authenticated with GitHub. Run: hopcode github auth');
  }
  return token;
}
