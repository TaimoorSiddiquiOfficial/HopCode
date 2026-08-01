/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface GHUser {
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
}
export interface GHRepo {
    full_name: string;
    description: string | null;
    default_branch: string;
    open_issues_count: number;
    stargazers_count: number;
    private: boolean;
    html_url: string;
}
export interface GHBranch {
    name: string;
    commit: {
        sha: string;
    };
}
export interface GHPR {
    number: number;
    title: string;
    body: string | null;
    state: string;
    user: {
        login: string;
    };
    html_url: string;
    head: {
        ref: string;
        sha: string;
    };
    base: {
        ref: string;
    };
    created_at: string;
    updated_at: string;
    draft: boolean;
}
export interface GHIssue {
    number: number;
    title: string;
    body: string | null;
    state: string;
    user: {
        login: string;
    };
    html_url: string;
    labels: Array<{
        name: string;
    }>;
    assignees: Array<{
        login: string;
    }>;
    created_at: string;
    updated_at: string;
}
export interface GHCommit {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            date: string;
        };
    };
    html_url: string;
}
export interface CreatePRParams {
    title: string;
    body: string;
    head: string;
    base: string;
    draft?: boolean;
}
export interface CreateIssueParams {
    title: string;
    body?: string;
    labels?: string[];
    assignees?: string[];
}
export declare function getAuthenticatedUser(): Promise<GHUser>;
export declare function getRepo(owner: string, repo: string): Promise<GHRepo>;
export declare function listBranches(owner: string, repo: string): Promise<GHBranch[]>;
export declare function listPRs(owner: string, repo: string, state?: 'open' | 'closed' | 'all'): Promise<GHPR[]>;
export declare function getPRDiff(owner: string, repo: string, prNumber: number): Promise<string>;
export declare function createPR(owner: string, repo: string, params: CreatePRParams): Promise<GHPR>;
export declare function listIssues(owner: string, repo: string, state?: 'open' | 'closed' | 'all'): Promise<GHIssue[]>;
export declare function createIssue(owner: string, repo: string, params: CreateIssueParams): Promise<GHIssue>;
export declare function closeIssue(owner: string, repo: string, issueNumber: number): Promise<GHIssue>;
export declare function listCommits(owner: string, repo: string, perPage?: number): Promise<GHCommit[]>;
export interface GHWorkflow {
    id: number;
    name: string;
    path: string;
    state: string;
    html_url: string;
}
export interface GHWorkflowRun {
    id: number;
    name: string;
    status: 'queued' | 'in_progress' | 'completed' | 'waiting' | 'requested' | 'pending';
    conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | 'neutral' | 'stale' | null;
    head_branch: string;
    head_sha: string;
    created_at: string;
    updated_at: string;
    run_number: number;
    event: string;
    actor: {
        login: string;
    };
    workflow_id: number;
    html_url: string;
    run_attempt: number;
}
export interface GHWorkflowJob {
    id: number;
    name: string;
    status: string;
    conclusion: string | null;
    started_at: string | null;
    completed_at: string | null;
    steps: Array<{
        name: string;
        status: string;
        conclusion: string | null;
        number: number;
    }>;
    html_url: string;
}
/**
 * Returns a single status icon character for a workflow run conclusion/status.
 */
export declare function workflowRunIcon(run: GHWorkflowRun): string;
/**
 * Formats ms between two ISO timestamps as "Xm Ys".
 */
export declare function formatRunDuration(startIso: string, endIso: string): string;
/** List workflow files in a repo. */
export declare function listWorkflows(owner: string, repo: string): Promise<GHWorkflow[]>;
/** List workflow runs for a repo, optionally filtered by branch. */
export declare function listWorkflowRuns(owner: string, repo: string, branch?: string, perPage?: number): Promise<GHWorkflowRun[]>;
/** Get details for a specific workflow run. */
export declare function getWorkflowRun(owner: string, repo: string, runId: number): Promise<GHWorkflowRun>;
/** List jobs for a workflow run. */
export declare function listJobsForRun(owner: string, repo: string, runId: number): Promise<GHWorkflowJob[]>;
/** Fetch raw log text for a specific job (follows GitHub's redirect). */
export declare function getJobLogs(owner: string, repo: string, jobId: number): Promise<string>;
/** Re-run only the failed jobs in a workflow run. */
export declare function rerunFailedJobs(owner: string, repo: string, runId: number): Promise<void>;
/** Re-run an entire workflow run from the start. */
export declare function rerunWorkflow(owner: string, repo: string, runId: number): Promise<void>;
/** Cancel an in-progress workflow run. */
export declare function cancelRun(owner: string, repo: string, runId: number): Promise<void>;
/** Trigger a workflow_dispatch event. */
export declare function dispatchWorkflow(owner: string, repo: string, workflowId: string | number, ref: string, inputs?: Record<string, string>): Promise<void>;
