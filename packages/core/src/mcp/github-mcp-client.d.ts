/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '../config/config.js';
/**
 * GitHub API response types
 */
export interface GitHubIssue {
    number: number;
    title: string;
    body: string | null;
    state: 'open' | 'closed';
    labels: Array<{
        name: string;
        color: string;
    }>;
    assignees: Array<{
        login: string;
    }>;
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
    user: {
        login: string;
    };
    head: {
        ref: string;
        sha: string;
        repo: {
            name: string;
            full_name: string;
        };
    };
    base: {
        ref: string;
        sha: string;
        repo: {
            name: string;
            full_name: string;
        };
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
export declare class GitHubMCPClient {
    private readonly auth;
    private readonly baseUrl;
    constructor(_config: Config);
    /**
     * Get authorization headers for API requests
     */
    private getAuthHeaders;
    /**
     * Make authenticated GET request
     */
    private get;
    /**
     * Make authenticated POST request
     */
    private post;
    /**
     * Make authenticated PATCH request
     */
    private patch;
    /**
     * Make authenticated PUT request
     */
    private put;
    /**
     * List issues with filters
     */
    listIssues(owner: string, repo: string, options?: {
        state?: 'open' | 'closed' | 'all';
        labels?: string[];
        sort?: 'created' | 'updated' | 'comments';
        direction?: 'asc' | 'desc';
        since?: string;
        per_page?: number;
        page?: number;
    }): Promise<GitHubIssue[]>;
    /**
     * Get issue by number
     */
    getIssue(owner: string, repo: string, issueNumber: number): Promise<GitHubIssue>;
    /**
     * Create new issue
     */
    createIssue(owner: string, repo: string, data: {
        title: string;
        body?: string;
        labels?: string[];
        assignees?: string[];
        milestone?: number;
    }): Promise<GitHubIssue>;
    /**
     * Update issue
     */
    updateIssue(owner: string, repo: string, issueNumber: number, data: {
        title?: string;
        body?: string;
        state?: 'open' | 'closed';
        labels?: string[];
        assignees?: string[];
        milestone?: number | null;
    }): Promise<GitHubIssue>;
    /**
     * Add comment to issue
     */
    addIssueComment(owner: string, repo: string, issueNumber: number, body: string): Promise<{
        id: number;
        body: string;
        created_at: string;
    }>;
    /**
     * List pull requests
     */
    listPullRequests(owner: string, repo: string, options?: {
        state?: 'open' | 'closed' | 'all';
        head?: string;
        base?: string;
        sort?: 'created' | 'updated' | 'popularity' | 'long-running';
        direction?: 'asc' | 'desc';
        per_page?: number;
        page?: number;
    }): Promise<GitHubPullRequest[]>;
    /**
     * Get pull request by number
     */
    getPullRequest(owner: string, repo: string, prNumber: number): Promise<GitHubPullRequest>;
    /**
     * Get pull request files
     */
    getPullRequestFiles(owner: string, repo: string, prNumber: number): Promise<GitHubPullRequestFile[]>;
    /**
     * Create pull request
     */
    createPullRequest(owner: string, repo: string, data: {
        title: string;
        body?: string;
        head: string;
        base: string;
        draft?: boolean;
        maintainer_can_modify?: boolean;
    }): Promise<GitHubPullRequest>;
    /**
     * Update pull request
     */
    updatePullRequest(owner: string, repo: string, prNumber: number, data: {
        title?: string;
        body?: string;
        state?: 'open' | 'closed';
        base?: string;
        maintainer_can_modify?: boolean;
    }): Promise<GitHubPullRequest>;
    /**
     * Merge pull request
     */
    mergePullRequest(owner: string, repo: string, prNumber: number, options?: {
        commit_title?: string;
        commit_message?: string;
        merge_method?: 'merge' | 'squash' | 'rebase';
    }): Promise<{
        merged: boolean;
        message: string;
        sha: string;
    }>;
    /**
     * List workflows
     */
    listWorkflows(owner: string, repo: string): Promise<{
        workflows: GitHubWorkflow[];
    }>;
    /**
     * Trigger workflow
     */
    triggerWorkflow(owner: string, repo: string, workflowId: string | number, data: {
        ref: string;
        inputs?: Record<string, string>;
    }): Promise<{
        id: number;
        node_id: string;
    }>;
    /**
     * List workflow runs
     */
    listWorkflowRuns(owner: string, repo: string, workflowId: string | number, options?: {
        branch?: string;
        event?: string;
        status?: 'completed' | 'in_progress' | 'queued';
        per_page?: number;
        page?: number;
    }): Promise<{
        workflow_runs: GitHubWorkflowRun[];
    }>;
    /**
     * Get workflow run
     */
    getWorkflowRun(owner: string, repo: string, runId: number): Promise<GitHubWorkflowRun>;
    /**
     * Cancel workflow run
     */
    cancelWorkflowRun(owner: string, repo: string, runId: number): Promise<void>;
    /**
     * Rerun workflow run
     */
    rerunWorkflowRun(owner: string, repo: string, runId: number): Promise<void>;
    /**
     * List check runs for commit
     */
    listCheckRuns(owner: string, repo: string, ref: string, options?: {
        check_name?: string;
        status?: 'queued' | 'in_progress' | 'completed';
        filter?: 'latest' | 'all';
        per_page?: number;
        page?: number;
    }): Promise<{
        check_runs: GitHubCheckRun[];
    }>;
    /**
     * Create check run
     */
    createCheckRun(owner: string, repo: string, data: {
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
    }): Promise<GitHubCheckRun>;
    /**
     * Update check run
     */
    updateCheckRun(owner: string, repo: string, checkRunId: number, data: {
        name?: string;
        status?: 'queued' | 'in_progress' | 'completed';
        conclusion?: 'success' | 'failure' | 'neutral' | 'cancelled' | 'skipped' | 'stale';
        output?: {
            title: string;
            summary: string;
            text?: string;
        };
    }): Promise<GitHubCheckRun>;
}
/**
 * Create GitHub MCP Client instance from Config
 */
export declare function createGitHubMCPClient(config: Config): GitHubMCPClient;
