/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * GitHub App authentication configuration
 */
export interface GitHubAppConfig {
    /** GitHub App ID */
    appId: string;
    /** App private key (PEM format) */
    privateKey: string;
    /** OAuth Client ID */
    clientId?: string;
    /** OAuth Client Secret */
    clientSecret?: string;
    /** Webhook secret */
    webhookSecret?: string;
    /** GitHub Enterprise hostname (optional, defaults to github.com) */
    hostname?: string;
}
/**
 * GitHub App installation token response
 */
export interface GitHubInstallationToken {
    /** Access token */
    token: string;
    /** Token expiration timestamp */
    expires_at: string;
    /** Token permissions */
    permissions: {
        contents?: 'read' | 'write';
        issues?: 'read' | 'write';
        pull_requests?: 'read' | 'write';
        workflows?: 'read' | 'write';
        actions?: 'read' | 'write';
        checks?: 'read' | 'write';
        statuses?: 'read' | 'write';
        members?: 'read' | 'write';
        organization_projects?: 'read' | 'write';
        [key: string]: 'read' | 'write' | undefined;
    };
    /** Repository selection */
    repository_selection: 'all' | 'selected';
    /** Selected repositories (if repository_selection is 'selected') */
    repositories?: Array<{
        id: number;
        node_id: string;
        name: string;
        full_name: string;
    }>;
}
/**
 * GitHub App authentication manager
 */
export declare class GitHubAppAuth {
    private readonly config;
    private readonly hostname;
    private tokenCache;
    private readonly CACHE_TTL_MS;
    constructor(config: GitHubAppConfig);
    /**
     * Get the base API URL
     */
    getBaseUrl(): string;
    /**
     * Generate a JWT token for GitHub App authentication
     * JWTs are valid for 10 minutes
     */
    generateJWT(): string;
    /**
     * Get an installation token for a specific installation ID
     * Tokens are cached for 5 minutes to avoid excessive API calls
     */
    getInstallationToken(installationId: number): Promise<GitHubInstallationToken>;
    /**
     * Create a new installation token via GitHub API
     */
    private createInstallationToken;
    /**
     * Get installation ID for a repository
     */
    getInstallationId(owner: string, repo: string): Promise<number>;
    /**
     * Get installation token for a repository
     */
    getTokenForRepository(owner: string, repo: string): Promise<GitHubInstallationToken>;
    /**
     * Clear token cache (useful for testing or manual refresh)
     */
    clearTokenCache(): void;
    /**
     * Base64 URL encode (for JWT)
     */
    private base64UrlEncode;
}
/**
 * Load GitHub App configuration from environment variables
 */
export declare function loadGitHubAppConfigFromEnv(): GitHubAppConfig | null;
/**
 * Create GitHub App Auth instance from environment variables
 */
export declare function createGitHubAppAuth(): GitHubAppAuth | null;
