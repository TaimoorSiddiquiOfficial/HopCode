/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Typed GitHub REST v3 client.
 * Uses fetch + GITHUB_TOKEN from settings or process.env.
 * No extra npm packages needed — Node 18+ has native fetch.
 */
import { requireGitHubToken } from './githubTokenStore.js';

const GITHUB_API = 'https://api.github.com';

// ── Core request helper ──────────────────────────────────────────────────────

async function ghRequest<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const token = requireGitHubToken();
  const url = path.startsWith('http') ? path : `${GITHUB_API}${path}`;
  const resp = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    let msg = `GitHub API error ${resp.status}: ${resp.statusText}`;
    try {
      const json = JSON.parse(text) as { message?: string };
      if (json.message) msg = `GitHub API error: ${json.message}`;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  if (resp.status === 204) return {} as T; // No content
  return (await resp.json()) as T;
}

// ── Types ────────────────────────────────────────────────────────────────────

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
  commit: { sha: string };
}

export interface GHPR {
  number: number;
  title: string;
  body: string | null;
  state: string;
  user: { login: string };
  html_url: string;
  head: { ref: string; sha: string };
  base: { ref: string };
  created_at: string;
  updated_at: string;
  draft: boolean;
}

export interface GHIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  user: { login: string };
  html_url: string;
  labels: Array<{ name: string }>;
  assignees: Array<{ login: string }>;
  created_at: string;
  updated_at: string;
}

export interface GHCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string };
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

// ── API methods ──────────────────────────────────────────────────────────────

export async function getAuthenticatedUser(): Promise<GHUser> {
  return ghRequest<GHUser>('GET', '/user');
}

export async function getRepo(owner: string, repo: string): Promise<GHRepo> {
  return ghRequest<GHRepo>('GET', `/repos/${owner}/${repo}`);
}

export async function listBranches(
  owner: string,
  repo: string,
): Promise<GHBranch[]> {
  return ghRequest<GHBranch[]>(
    'GET',
    `/repos/${owner}/${repo}/branches?per_page=30`,
  );
}

export async function listPRs(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
): Promise<GHPR[]> {
  return ghRequest<GHPR[]>(
    'GET',
    `/repos/${owner}/${repo}/pulls?state=${state}&per_page=30`,
  );
}

export async function getPRDiff(
  owner: string,
  repo: string,
  prNumber: number,
): Promise<string> {
  const token = requireGitHubToken();
  const resp = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.diff',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  if (!resp.ok) throw new Error(`GitHub API error ${resp.status}`);
  return resp.text();
}

export async function createPR(
  owner: string,
  repo: string,
  params: CreatePRParams,
): Promise<GHPR> {
  return ghRequest<GHPR>('POST', `/repos/${owner}/${repo}/pulls`, params);
}

export async function listIssues(
  owner: string,
  repo: string,
  state: 'open' | 'closed' | 'all' = 'open',
): Promise<GHIssue[]> {
  return ghRequest<GHIssue[]>(
    'GET',
    `/repos/${owner}/${repo}/issues?state=${state}&per_page=30`,
  );
}

export async function createIssue(
  owner: string,
  repo: string,
  params: CreateIssueParams,
): Promise<GHIssue> {
  return ghRequest<GHIssue>('POST', `/repos/${owner}/${repo}/issues`, params);
}

export async function closeIssue(
  owner: string,
  repo: string,
  issueNumber: number,
): Promise<GHIssue> {
  return ghRequest<GHIssue>(
    'PATCH',
    `/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      state: 'closed',
    },
  );
}

export async function listCommits(
  owner: string,
  repo: string,
  perPage = 10,
): Promise<GHCommit[]> {
  return ghRequest<GHCommit[]>(
    'GET',
    `/repos/${owner}/${repo}/commits?per_page=${perPage}`,
  );
}

// ── Actions / CI types ───────────────────────────────────────────────────────

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
  status:
    | 'queued'
    | 'in_progress'
    | 'completed'
    | 'waiting'
    | 'requested'
    | 'pending';
  conclusion:
    | 'success'
    | 'failure'
    | 'cancelled'
    | 'skipped'
    | 'timed_out'
    | 'action_required'
    | 'neutral'
    | 'stale'
    | null;
  head_branch: string;
  head_sha: string;
  created_at: string;
  updated_at: string;
  run_number: number;
  event: string;
  actor: { login: string };
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

// ── Actions / CI API methods ─────────────────────────────────────────────────

/**
 * Returns a single status icon character for a workflow run conclusion/status.
 */
export function workflowRunIcon(run: GHWorkflowRun): string {
  if (run.status !== 'completed') {
    return run.status === 'in_progress' ? '⏳' : '⏸';
  }
  switch (run.conclusion) {
    case 'success':
      return '✅';
    case 'failure':
      return '❌';
    case 'cancelled':
    case 'skipped':
      return '⊘';
    case 'timed_out':
      return '⏰';
    default:
      return '⚪';
  }
}

/**
 * Formats ms between two ISO timestamps as "Xm Ys".
 */
export function formatRunDuration(startIso: string, endIso: string): string {
  const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
  if (ms <= 0 || isNaN(ms)) return '–';
  const secs = Math.floor(ms / 1000);
  const mins = Math.floor(secs / 60);
  return mins > 0 ? `${mins}m ${secs % 60}s` : `${secs}s`;
}

/** List workflow files in a repo. */
export async function listWorkflows(
  owner: string,
  repo: string,
): Promise<GHWorkflow[]> {
  const data = await ghRequest<{ workflows: GHWorkflow[] }>(
    'GET',
    `/repos/${owner}/${repo}/actions/workflows`,
  );
  return data.workflows;
}

/** List workflow runs for a repo, optionally filtered by branch. */
export async function listWorkflowRuns(
  owner: string,
  repo: string,
  branch?: string,
  perPage = 10,
): Promise<GHWorkflowRun[]> {
  const params = new URLSearchParams({ per_page: String(perPage) });
  if (branch) params.set('branch', branch);
  const data = await ghRequest<{ workflow_runs: GHWorkflowRun[] }>(
    'GET',
    `/repos/${owner}/${repo}/actions/runs?${params}`,
  );
  return data.workflow_runs;
}

/** Get details for a specific workflow run. */
export async function getWorkflowRun(
  owner: string,
  repo: string,
  runId: number,
): Promise<GHWorkflowRun> {
  return ghRequest<GHWorkflowRun>(
    'GET',
    `/repos/${owner}/${repo}/actions/runs/${runId}`,
  );
}

/** List jobs for a workflow run. */
export async function listJobsForRun(
  owner: string,
  repo: string,
  runId: number,
): Promise<GHWorkflowJob[]> {
  const data = await ghRequest<{ jobs: GHWorkflowJob[] }>(
    'GET',
    `/repos/${owner}/${repo}/actions/runs/${runId}/jobs`,
  );
  return data.jobs;
}

/** Fetch raw log text for a specific job (follows GitHub's redirect). */
export async function getJobLogs(
  owner: string,
  repo: string,
  jobId: number,
): Promise<string> {
  const token = requireGitHubToken();
  const resp = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      redirect: 'follow',
    },
  );
  if (!resp.ok) throw new Error(`GitHub API error ${resp.status}`);
  return resp.text();
}

/** Re-run only the failed jobs in a workflow run. */
export async function rerunFailedJobs(
  owner: string,
  repo: string,
  runId: number,
): Promise<void> {
  await ghRequest(
    'POST',
    `/repos/${owner}/${repo}/actions/runs/${runId}/rerun-failed-jobs`,
  );
}

/** Re-run an entire workflow run from the start. */
export async function rerunWorkflow(
  owner: string,
  repo: string,
  runId: number,
): Promise<void> {
  await ghRequest(
    'POST',
    `/repos/${owner}/${repo}/actions/runs/${runId}/rerun`,
  );
}

/** Cancel an in-progress workflow run. */
export async function cancelRun(
  owner: string,
  repo: string,
  runId: number,
): Promise<void> {
  await ghRequest(
    'POST',
    `/repos/${owner}/${repo}/actions/runs/${runId}/cancel`,
  );
}

/** Trigger a workflow_dispatch event. */
export async function dispatchWorkflow(
  owner: string,
  repo: string,
  workflowId: string | number,
  ref: string,
  inputs?: Record<string, string>,
): Promise<void> {
  await ghRequest(
    'POST',
    `/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
    { ref, inputs: inputs ?? {} },
  );
}
