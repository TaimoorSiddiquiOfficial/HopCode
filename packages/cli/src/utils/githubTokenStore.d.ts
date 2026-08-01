/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface GitHubTokens {
    accessToken: string;
    refreshToken?: string;
    /** ISO timestamp when the access token expires */
    expiresAt?: string;
}
/** Load the stored GitHub token from settings. Returns null if not configured. */
export declare function loadGitHubToken(): GitHubTokens | null;
/** Persist GitHub tokens to user settings and process.env. */
export declare function saveGitHubToken(tokens: GitHubTokens): void;
/** Remove GitHub tokens from settings. */
export declare function clearGitHubToken(): void;
/** Returns the token string or throws if not authenticated. */
export declare function requireGitHubToken(): string;
