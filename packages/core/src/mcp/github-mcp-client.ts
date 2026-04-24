/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Config } from '../config/config.js';
import { GitHubAppAuth } from '../auth/github-app-auth.js';
import { createDebugLogger } from '../utils/debugLogger.js';

const debugLogger = createDebugLogger('GITHUB_MCP');

/**
 * GitHub API response types
 */
export interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  labels: Array<{ name: string; color: string }>;
  assignees: Array<{ login: string }>;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string | null;
  state: 'open' | 'closed';
  user: { login: string };
  head: {
    ref: string;
    sha: string;
    repo: { name: string; full_name: string };
  };
  base: {
    ref: string;
    sha: string;
    repo: { name: string; full_name: string };
  };
  mergeable: boolean | null;
  mergeable_state: string;
  additions: number;
  deletions: number;
  changed_files: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
}

export interface GitHubPullRequestFile {
  sha: string;
  filename: string;
  status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed';
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  patch?: string;
}

export interface GitHubWorkflow {
  id: number;
  node_id: string;
  name: string;
  path: string;
  state: 'active' | 'disabled' | 'disabled_inactively';
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
  badge_url: string;
}

export interface GitHubWorkflowRun {
  id: number;
  name: string;
  node_id: string;
  head_branch: string;
  head_sha: string;
  run_number: number;
  event: string;
  status: 'queued' | 'in_progress' | 'completed' | 'requested' | 'waiting';
  conclusion: string | null;
  workflow_id: number;
  created_at: string;
  updated_at: string;
  run_attempt: number;
  run_started_at: string;
  jobs_url: string;
  logs_url: string;
}

export interface GitHubCheckRun {
  id: number;
  name: string;
  node_id: string;
  head_sha: string;
  status: 'queued' | 'in_progress' | 'completed';
  conclusion: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'stale' | null;
  started_at: string;
  completed_at: string;
  output: {
    title: string;
    summary: string | null;
    text: string | null;
    annotations_count: number;
  };
}

/**
 * GitHub MCP Client for interacting with GitHub API
 */
export class GitHubMCPClient {
  private readonly auth: GitHubAppAuth;
  private readonly baseUrl: string;

  constructor(_config: Config) {
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
  private async getAuthHeaders(owner: string, repo: string): Promise<Record<string, string>> {
    const token = await this.auth.getTokenForRepository(owner, repo);
    return {
      'Authorization': `Bearer ${token.token}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'HopCode-GitHub-MCP',
    };
  }

  /**
   * Make authenticated GET request
   */
  private async get<T>(owner: string, repo: string, path: string): Promise<T> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}${path}`;
    const headers = await this.getAuthHeaders(owner, repo);

    debugLogger.debug(`GET ${url}`);

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${error}`);
    }

    return await response.json() as T;
  }

  /**
   * Make authenticated POST request
   */
  private async post<T>(owner: string, repo: string, path: string, body?: unknown): Promise<T> {
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

    return await response.json() as T;
  }

  /**
   * Make authenticated PATCH request
   */
  private async patch<T>(owner: string, repo: string, path: string, body: unknown): Promise<T> {
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

    return await response.json() as T;
  }

  /**
   * Make authenticated PUT request
   */
  private async put<T>(owner: string, repo: string, path: string, body?: unknown): Promise<T> {
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

    return await response.json() as T;
  }

  /**
   * Make authenticated DELETE request
   */
  private async delete(owner: string, repo: string, path: string): Promise<void> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}${path}`;
    const headers = await this.getAuthHeaders(owner, repo);

    debugLogger.debug(`DELETE ${url}`);

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub API error: ${response.status} ${error}`);
    }
  }

  // ==================== ISSUES ====================

  /**
   * List issues with filters
   */
  async listIssues(
    owner: string,
    repo: string,
    options?: {
      state?: 'open' | 'closed' | 'all';
      labels?: string[];
      sort?: 'created' | 'updated' | 'comments';
      direction?: 'asc' | 'desc';
      since?: string;
      per_page?: number;
      page?: number;
    },
  ): Promise<GitHubIssue[]> {
    const params = new URLSearchParams();
    if (options?.state) params.append('state', options.state);
    if (options?.labels) params.append('labels', options.labels.join(','));
    if (options?.sort) params.append('sort', options.sort);
    if (options?.direction) params.append('direction', options.direction);
    if (options?.since) params.append('since', options.since);
    if (options?.per_page) params.append('per_page', String(options.per_page));
    if (options?.page) params.append('page', String(options.page));

    const queryString = params.toString();
    const path = `/issues${queryString ? `?${queryString}` : ''}`;
    
    return await this.get(owner, repo, path);
  }

  /**
   * Get issue by number
   */
  async getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue> {
    return await this.get(owner, repo, `/issues/${issueNumber}`);
  }

  /**
   * Create new issue
   */
  async createIssue(
    owner: string,
    repo: string,
    data: {
      title: string;
      body?: string;
      labels?: string[];
      assignees?: string[];
      milestone?: number;
    },
  ): Promise<GitHubIssue> {
    return await this.post(owner, repo, '/issues', data);
  }

  /**
   * Update issue
   */
  async updateIssue(
    owner: string,
    repo: string,
    issueNumber: number,
    data: {
      title?: string;
      body?: string;
      state?: 'open' | 'closed';
      labels?: string[];
      assignees?: string[];
      milestone?: number | null;
    },
  ): Promise<GitHubIssue> {
    return await this.patch(owner, repo, `/issues/${issueNumber}`, data);
  }

  /**
   * Add comment to issue
   */
  async addIssueComment(
    owner: string,
    repo: string,
    issueNumber: number,
    body: string,
  ): Promise<{ id: number; body: string; created_at: string }> {
    return await this.post(owner, repo, `/issues/${issueNumber}/comments`, { body });
  }

  // ==================== PULL REQUESTS ====================

  /**
   * List pull requests
   */
  async listPullRequests(
    owner: string,
    repo: string,
    options?: {
      state?: 'open' | 'closed' | 'all';
      head?: string;
      base?: string;
      sort?: 'created' | 'updated' | 'popularity' | 'long-running';
      direction?: 'asc' | 'desc';
      per_page?: number;
      page?: number;
    },
  ): Promise<GitHubPullRequest[]> {
    const params = new URLSearchParams();
    if (options?.state) params.append('state', options.state);
    if (options?.head) params.append('head', options.head);
    if (options?.base) params.append('base', options.base);
    if (options?.sort) params.append('sort', options.sort);
    if (options?.direction) params.append('direction', options.direction);
    if (options?.per_page) params.append('per_page', String(options.per_page));
    if (options?.page) params.append('page', String(options.page));

    const queryString = params.toString();
    const path = `/pulls${queryString ? `?${queryString}` : ''}`;
    
    return await this.get(owner, repo, path);
  }

  /**
   * Get pull request by number
   */
  async getPullRequest(owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest> {
    return await this.get(owner, repo, `/pulls/${prNumber}`);
  }

  /**
   * Get pull request files
   */
  async getPullRequestFiles(
    owner: string,
    repo: string,
    prNumber: number,
  ): Promise<GitHubPullRequestFile[]> {
    return await this.get(owner, repo, `/pulls/${prNumber}/files`);
  }

  /**
   * Create pull request
   */
  async createPullRequest(
    owner: string,
    repo: string,
    data: {
      title: string;
      body?: string;
      head: string;
      base: string;
      draft?: boolean;
      maintainer_can_modify?: boolean;
    },
  ): Promise<GitHubPullRequest> {
    return await this.post(owner, repo, '/pulls', data);
  }

  /**
   * Update pull request
   */
  async updatePullRequest(
    owner: string,
    repo: string,
    prNumber: number,
    data: {
      title?: string;
      body?: string;
      state?: 'open' | 'closed';
      base?: string;
      maintainer_can_modify?: boolean;
    },
  ): Promise<GitHubPullRequest> {
    return await this.patch(owner, repo, `/pulls/${prNumber}`, data);
  }

  /**
   * Merge pull request
   */
  async mergePullRequest(
    owner: string,
    repo: string,
    prNumber: number,
    options?: {
      commit_title?: string;
      commit_message?: string;
      merge_method?: 'merge' | 'squash' | 'rebase';
    },
  ): Promise<{ merged: boolean; message: string; sha: string }> {
    return await this.put(owner, repo, `/pulls/${prNumber}/merge`, options);
  }

  // ==================== WORKFLOWS ====================

  /**
   * List workflows
   */
  async listWorkflows(owner: string, repo: string): Promise<{ workflows: GitHubWorkflow[] }> {
    return await this.get(owner, repo, '/actions/workflows');
  }

  /**
   * Trigger workflow
   */
  async triggerWorkflow(
    owner: string,
    repo: string,
    workflowId: string | number,
    data: {
      ref: string;
      inputs?: Record<string, string>;
    },
  ): Promise<{ id: number; node_id: string }> {
    return await this.post(owner, repo, `/actions/workflows/${workflowId}/dispatches`, data);
  }

  /**
   * List workflow runs
   */
  async listWorkflowRuns(
    owner: string,
    repo: string,
    workflowId: string | number,
    options?: {
      branch?: string;
      event?: string;
      status?: 'completed' | 'in_progress' | 'queued';
      per_page?: number;
      page?: number;
    },
  ): Promise<{ workflow_runs: GitHubWorkflowRun[] }> {
    const params = new URLSearchParams();
    if (options?.branch) params.append('branch', options.branch);
    if (options?.event) params.append('event', options.event);
    if (options?.status) params.append('status', options.status);
    if (options?.per_page) params.append('per_page', String(options.per_page));
    if (options?.page) params.append('page', String(options.page));

    const queryString = params.toString();
    const path = `/actions/workflows/${workflowId}/runs${queryString ? `?${queryString}` : ''}`;
    
    return await this.get(owner, repo, path);
  }

  /**
   * Get workflow run
   */
  async getWorkflowRun(
    owner: string,
    repo: string,
    runId: number,
  ): Promise<GitHubWorkflowRun> {
    return await this.get(owner, repo, `/actions/runs/${runId}`);
  }

  /**
   * Cancel workflow run
   */
  async cancelWorkflowRun(owner: string, repo: string, runId: number): Promise<void> {
    await this.post(owner, repo, `/actions/runs/${runId}/cancel`);
  }

  /**
   * Rerun workflow run
   */
  async rerunWorkflowRun(owner: string, repo: string, runId: number): Promise<void> {
    await this.post(owner, repo, `/actions/runs/${runId}/rerun`);
  }

  // ==================== CHECKS ====================

  /**
   * List check runs for commit
   */
  async listCheckRuns(
    owner: string,
    repo: string,
    ref: string,
    options?: {
      check_name?: string;
      status?: 'queued' | 'in_progress' | 'completed';
      filter?: 'latest' | 'all';
      per_page?: number;
      page?: number;
    },
  ): Promise<{ check_runs: GitHubCheckRun[] }> {
    const params = new URLSearchParams();
    if (options?.check_name) params.append('check_name', options.check_name);
    if (options?.status) params.append('status', options.status);
    if (options?.filter) params.append('filter', options.filter);
    if (options?.per_page) params.append('per_page', String(options.per_page));
    if (options?.page) params.append('page', String(options.page));

    const queryString = params.toString();
    const path = `/commits/${ref}/check-runs${queryString ? `?${queryString}` : ''}`;
    
    return await this.get(owner, repo, path);
  }

  /**
   * Create check run
   */
  async createCheckRun(
    owner: string,
    repo: string,
    data: {
      name: string;
      head_sha: string;
      status?: 'queued' | 'in_progress' | 'completed';
      conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'stale';
      output?: {
        title: string;
        summary: string;
        text?: string;
        annotations?: Array<{
          path: string;
          start_line: number;
          end_line: number;
          start_column?: number;
          end_column?: number;
          annotation_level: 'notice' | 'warning' | 'failure';
          message: string;
          title?: string;
          raw_details?: string;
        }>;
      };
    },
  ): Promise<GitHubCheckRun> {
    return await this.post(owner, repo, '/check-runs', data);
  }

  /**
   * Update check run
   */
  async updateCheckRun(
    owner: string,
    repo: string,
    checkRunId: number,
    data: {
      name?: string;
      status?: 'queued' | 'in_progress' | 'completed';
      conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'stale';
      output?: {
        title: string;
        summary: string;
        text?: string;
      };
    },
  ): Promise<GitHubCheckRun> {
    return await this.patch(owner, repo, `/check-runs/${checkRunId}`, data);
  }
}

/**
 * Create GitHub MCP Client instance from Config
 */
export function createGitHubMCPClient(config: Config): GitHubMCPClient {
  return new GitHubMCPClient(config);
}
