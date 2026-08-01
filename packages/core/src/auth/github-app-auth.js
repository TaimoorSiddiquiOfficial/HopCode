/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { createSign } from 'node:crypto';
/**
 * GitHub App authentication manager
 */
export class GitHubAppAuth {
    config;
    hostname;
    tokenCache = new Map();
    CACHE_TTL_MS = 5 * 60 * 1000; // Cache tokens for 5 minutes
    constructor(config) {
        this.config = config;
        this.hostname = config.hostname || 'github.com';
    }
    /**
     * Get the base API URL
     */
    getBaseUrl() {
        if (this.hostname === 'github.com') {
            return 'https://api.github.com';
        }
        return `https://${this.hostname}/api/v3`;
    }
    /**
     * Generate a JWT token for GitHub App authentication
     * JWTs are valid for 10 minutes
     */
    generateJWT() {
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iat: now,
            exp: now + 10 * 60, // 10 minutes
            iss: this.config.appId,
        };
        const header = {
            alg: 'RS256',
            typ: 'JWT',
        };
        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
        const signInput = `${encodedHeader}.${encodedPayload}`;
        const signer = createSign('SHA256');
        signer.update(signInput);
        signer.end();
        const signature = this.base64UrlEncode(signer.sign(this.config.privateKey, 'binary'));
        return `${signInput}.${signature}`;
    }
    /**
     * Get an installation token for a specific installation ID
     * Tokens are cached for 5 minutes to avoid excessive API calls
     */
    async getInstallationToken(installationId) {
        // Check cache first
        const cached = this.tokenCache.get(installationId);
        if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL_MS) {
            return cached;
        }
        // Generate new token
        const token = await this.createInstallationToken(installationId);
        // Cache the token
        this.tokenCache.set(installationId, {
            ...token,
            cachedAt: Date.now(),
        });
        return token;
    }
    /**
     * Create a new installation token via GitHub API
     */
    async createInstallationToken(installationId) {
        const jwt = this.generateJWT();
        const url = `${this.getBaseUrl()}/app/installations/${installationId}/access_tokens`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'HopCode-GitHub-App',
            },
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to create installation token: ${response.status} ${error}`);
        }
        return (await response.json());
    }
    /**
     * Get installation ID for a repository
     */
    async getInstallationId(owner, repo) {
        const jwt = this.generateJWT();
        const url = `${this.getBaseUrl()}/repos/${owner}/${repo}/installation`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${jwt}`,
                Accept: 'application/vnd.github+json',
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': 'HopCode-GitHub-App',
            },
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Failed to get installation ID: ${response.status} ${error}`);
        }
        const data = await response.json();
        return data.id;
    }
    /**
     * Get installation token for a repository
     */
    async getTokenForRepository(owner, repo) {
        const installationId = await this.getInstallationId(owner, repo);
        return await this.getInstallationToken(installationId);
    }
    /**
     * Clear token cache (useful for testing or manual refresh)
     */
    clearTokenCache() {
        this.tokenCache.clear();
    }
    /**
     * Base64 URL encode (for JWT)
     */
    base64UrlEncode(input) {
        return Buffer.from(input)
            .toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }
}
/**
 * Load GitHub App configuration from environment variables
 */
export function loadGitHubAppConfigFromEnv() {
    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
    if (!appId || !privateKey) {
        return null;
    }
    return {
        appId,
        privateKey,
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        webhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
        hostname: process.env.GITHUB_HOSTNAME,
    };
}
/**
 * Create GitHub App Auth instance from environment variables
 */
export function createGitHubAppAuth() {
    const githubConfig = loadGitHubAppConfigFromEnv();
    if (!githubConfig) {
        return null;
    }
    return new GitHubAppAuth(githubConfig);
}
//# sourceMappingURL=github-app-auth.js.map