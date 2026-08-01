/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { GitHubAppAuth } from '../auth/github-app-auth.js';
import { createDebugLogger } from '../utils/debugLogger.js';
const debugLogger = createDebugLogger('GITHUB_MCP');
/**
 * GitHub MCP Client for interacting with GitHub API
 */
export class GitHubMCPClient {
    auth;
    baseUrl;
    constructor(_config) {
        const githubAuth = new GitHubAppAuth({
            appId: process.env.GITHUB_APP_ID || '',
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY || '',
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        });
        this.auth = githubAuth;
        this.baseUrl = githubAuth.getBaseUrl();
    }
    /**
     * Get authorization headers for API requests
     */
    async getAuthHeaders(owner, repo) {
        const token = await this.auth.getTokenForRepository(owner, repo);
        return {
            Authorization: `Bearer ${token.token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'HopCode-GitHub-MCP',
        };
    }
    /**
     * Make authenticated GET request
     */
    async get(owner, repo, path) {
        const url = `${this.baseUrl}/repos/${owner}/${repo}${path}`;
        const headers = await this.getAuthHeaders(owner, repo);
        debugLogger.debug(`GET ${url}`);
        const response = await fetch(url, { headers });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitHub API error: ${response.status} ${error}`);
        }
        return (await response.json());
    }
    /**
     * Make authenticated POST request
     */
    async post(owner, repo, path, body) {
        const url = `${this.baseUrl}/repos/${owner}/${repo}${path}`;
        const headers = await this.getAuthHeaders(owner, repo);
        debugLogger.debug(`POST ${url}`, body);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitHub API error: ${response.status} ${error}`);
        }
        return (await response.json());
    }
    /**
     * Make authenticated PATCH request
     */
    async patch(owner, repo, path, body) {
        const url = `${this.baseUrl}/repos/${owner}/${repo}${path}`;
        const headers = await this.getAuthHeaders(owner, repo);
        debugLogger.debug(`PATCH ${url}`, body);
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitHub API error: ${response.status} ${error}`);
        }
        return (await response.json());
    }
    /**
     * Make authenticated PUT request
     */
    async put(owner, repo, path, body) {
        const url = `${this.baseUrl}/repos/${owner}/${repo}${path}`;
        const headers = await this.getAuthHeaders(owner, repo);
        debugLogger.debug(`PUT ${url}`, body);
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`GitHub API error: ${response.status} ${error}`);
        }
        return (await response.json());
    }
    // ==================== ISSUES ====================
    /**
     * List issues with filters
     */
    async listIssues(owner, repo, options) {
        const params = new URLSearchParams();
        if (options?.state)
            params.append('state', options.state);
        if (options?.labels)
            params.append('labels', options.labels.join(','));
        if (options?.sort)
            params.append('sort', options.sort);
        if (options?.direction)
            params.append('direction', options.direction);
        if (options?.since)
            params.append('since', options.since);
        if (options?.per_page)
            params.append('per_page', String(options.per_page));
        if (options?.page)
            params.append('page', String(options.page));
        const queryString = params.toString();
        const path = `/issues${queryString ? `?${queryString}` : ''}`;
        return await this.get(owner, repo, path);
    }
    /**
     * Get issue by number
     */
    async getIssue(owner, repo, issueNumber) {
        return await this.get(owner, repo, `/issues/${issueNumber}`);
    }
    /**
     * Create new issue
     */
    async createIssue(owner, repo, data) {
        return await this.post(owner, repo, '/issues', data);
    }
    /**
     * Update issue
     */
    async updateIssue(owner, repo, issueNumber, data) {
        return await this.patch(owner, repo, `/issues/${issueNumber}`, data);
    }
    /**
     * Add comment to issue
     */
    async addIssueComment(owner, repo, issueNumber, body) {
        return await this.post(owner, repo, `/issues/${issueNumber}/comments`, {
            body,
        });
    }
    // ==================== PULL REQUESTS ====================
    /**
     * List pull requests
     */
    async listPullRequests(owner, repo, options) {
        const params = new URLSearchParams();
        if (options?.state)
            params.append('state', options.state);
        if (options?.head)
            params.append('head', options.head);
        if (options?.base)
            params.append('base', options.base);
        if (options?.sort)
            params.append('sort', options.sort);
        if (options?.direction)
            params.append('direction', options.direction);
        if (options?.per_page)
            params.append('per_page', String(options.per_page));
        if (options?.page)
            params.append('page', String(options.page));
        const queryString = params.toString();
        const path = `/pulls${queryString ? `?${queryString}` : ''}`;
        return await this.get(owner, repo, path);
    }
    /**
     * Get pull request by number
     */
    async getPullRequest(owner, repo, prNumber) {
        return await this.get(owner, repo, `/pulls/${prNumber}`);
    }
    /**
     * Get pull request files
     */
    async getPullRequestFiles(owner, repo, prNumber) {
        return await this.get(owner, repo, `/pulls/${prNumber}/files`);
    }
    /**
     * Create pull request
     */
    async createPullRequest(owner, repo, data) {
        return await this.post(owner, repo, '/pulls', data);
    }
    /**
     * Update pull request
     */
    async updatePullRequest(owner, repo, prNumber, data) {
        return await this.patch(owner, repo, `/pulls/${prNumber}`, data);
    }
    /**
     * Merge pull request
     */
    async mergePullRequest(owner, repo, prNumber, options) {
        return await this.put(owner, repo, `/pulls/${prNumber}/merge`, options);
    }
    // ==================== WORKFLOWS ====================
    /**
     * List workflows
     */
    async listWorkflows(owner, repo) {
        return await this.get(owner, repo, '/actions/workflows');
    }
    /**
     * Trigger workflow
     */
    async triggerWorkflow(owner, repo, workflowId, data) {
        return await this.post(owner, repo, `/actions/workflows/${workflowId}/dispatches`, data);
    }
    /**
     * List workflow runs
     */
    async listWorkflowRuns(owner, repo, workflowId, options) {
        const params = new URLSearchParams();
        if (options?.branch)
            params.append('branch', options.branch);
        if (options?.event)
            params.append('event', options.event);
        if (options?.status)
            params.append('status', options.status);
        if (options?.per_page)
            params.append('per_page', String(options.per_page));
        if (options?.page)
            params.append('page', String(options.page));
        const queryString = params.toString();
        const path = `/actions/workflows/${workflowId}/runs${queryString ? `?${queryString}` : ''}`;
        return await this.get(owner, repo, path);
    }
    /**
     * Get workflow run
     */
    async getWorkflowRun(owner, repo, runId) {
        return await this.get(owner, repo, `/actions/runs/${runId}`);
    }
    /**
     * Cancel workflow run
     */
    async cancelWorkflowRun(owner, repo, runId) {
        await this.post(owner, repo, `/actions/runs/${runId}/cancel`);
    }
    /**
     * Rerun workflow run
     */
    async rerunWorkflowRun(owner, repo, runId) {
        await this.post(owner, repo, `/actions/runs/${runId}/rerun`);
    }
    // ==================== CHECKS ====================
    /**
     * List check runs for commit
     */
    async listCheckRuns(owner, repo, ref, options) {
        const params = new URLSearchParams();
        if (options?.check_name)
            params.append('check_name', options.check_name);
        if (options?.status)
            params.append('status', options.status);
        if (options?.filter)
            params.append('filter', options.filter);
        if (options?.per_page)
            params.append('per_page', String(options.per_page));
        if (options?.page)
            params.append('page', String(options.page));
        const queryString = params.toString();
        const path = `/commits/${ref}/check-runs${queryString ? `?${queryString}` : ''}`;
        return await this.get(owner, repo, path);
    }
    /**
     * Create check run
     */
    async createCheckRun(owner, repo, data) {
        return await this.post(owner, repo, '/check-runs', data);
    }
    /**
     * Update check run
     */
    async updateCheckRun(owner, repo, checkRunId, data) {
        return await this.patch(owner, repo, `/check-runs/${checkRunId}`, data);
    }
}
/**
 * Create GitHub MCP Client instance from Config
 */
export function createGitHubMCPClient(config) {
    return new GitHubMCPClient(config);
}
//# sourceMappingURL=github-mcp-client.js.map