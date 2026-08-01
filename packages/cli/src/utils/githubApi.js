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
async function ghRequest(method, path, body) {
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
            const json = JSON.parse(text);
            if (json.message)
                msg = `GitHub API error: ${json.message}`;
        }
        catch {
            /* ignore */
        }
        throw new Error(msg);
    }
    if (resp.status === 204)
        return {}; // No content
    return (await resp.json());
}
// ── API methods ──────────────────────────────────────────────────────────────
export async function getAuthenticatedUser() {
    return ghRequest('GET', '/user');
}
export async function getRepo(owner, repo) {
    return ghRequest('GET', `/repos/${owner}/${repo}`);
}
export async function listBranches(owner, repo) {
    return ghRequest('GET', `/repos/${owner}/${repo}/branches?per_page=30`);
}
export async function listPRs(owner, repo, state = 'open') {
    return ghRequest('GET', `/repos/${owner}/${repo}/pulls?state=${state}&per_page=30`);
}
export async function getPRDiff(owner, repo, prNumber) {
    const token = requireGitHubToken();
    const resp = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3.diff',
            'X-GitHub-Api-Version': '2022-11-28',
        },
    });
    if (!resp.ok)
        throw new Error(`GitHub API error ${resp.status}`);
    return resp.text();
}
export async function createPR(owner, repo, params) {
    return ghRequest('POST', `/repos/${owner}/${repo}/pulls`, params);
}
export async function listIssues(owner, repo, state = 'open') {
    return ghRequest('GET', `/repos/${owner}/${repo}/issues?state=${state}&per_page=30`);
}
export async function createIssue(owner, repo, params) {
    return ghRequest('POST', `/repos/${owner}/${repo}/issues`, params);
}
export async function closeIssue(owner, repo, issueNumber) {
    return ghRequest('PATCH', `/repos/${owner}/${repo}/issues/${issueNumber}`, {
        state: 'closed',
    });
}
export async function listCommits(owner, repo, perPage = 10) {
    return ghRequest('GET', `/repos/${owner}/${repo}/commits?per_page=${perPage}`);
}
// ── Actions / CI API methods ─────────────────────────────────────────────────
/**
 * Returns a single status icon character for a workflow run conclusion/status.
 */
export function workflowRunIcon(run) {
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
export function formatRunDuration(startIso, endIso) {
    const ms = new Date(endIso).getTime() - new Date(startIso).getTime();
    if (ms <= 0 || isNaN(ms))
        return '–';
    const secs = Math.floor(ms / 1000);
    const mins = Math.floor(secs / 60);
    return mins > 0 ? `${mins}m ${secs % 60}s` : `${secs}s`;
}
/** List workflow files in a repo. */
export async function listWorkflows(owner, repo) {
    const data = await ghRequest('GET', `/repos/${owner}/${repo}/actions/workflows`);
    return data.workflows;
}
/** List workflow runs for a repo, optionally filtered by branch. */
export async function listWorkflowRuns(owner, repo, branch, perPage = 10) {
    const params = new URLSearchParams({ per_page: String(perPage) });
    if (branch)
        params.set('branch', branch);
    const data = await ghRequest('GET', `/repos/${owner}/${repo}/actions/runs?${params}`);
    return data.workflow_runs;
}
/** Get details for a specific workflow run. */
export async function getWorkflowRun(owner, repo, runId) {
    return ghRequest('GET', `/repos/${owner}/${repo}/actions/runs/${runId}`);
}
/** List jobs for a workflow run. */
export async function listJobsForRun(owner, repo, runId) {
    const data = await ghRequest('GET', `/repos/${owner}/${repo}/actions/runs/${runId}/jobs`);
    return data.jobs;
}
/** Fetch raw log text for a specific job (follows GitHub's redirect). */
export async function getJobLogs(owner, repo, jobId) {
    const token = requireGitHubToken();
    const resp = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/actions/jobs/${jobId}/logs`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        },
        redirect: 'follow',
    });
    if (!resp.ok)
        throw new Error(`GitHub API error ${resp.status}`);
    return resp.text();
}
/** Re-run only the failed jobs in a workflow run. */
export async function rerunFailedJobs(owner, repo, runId) {
    await ghRequest('POST', `/repos/${owner}/${repo}/actions/runs/${runId}/rerun-failed-jobs`);
}
/** Re-run an entire workflow run from the start. */
export async function rerunWorkflow(owner, repo, runId) {
    await ghRequest('POST', `/repos/${owner}/${repo}/actions/runs/${runId}/rerun`);
}
/** Cancel an in-progress workflow run. */
export async function cancelRun(owner, repo, runId) {
    await ghRequest('POST', `/repos/${owner}/${repo}/actions/runs/${runId}/cancel`);
}
/** Trigger a workflow_dispatch event. */
export async function dispatchWorkflow(owner, repo, workflowId, ref, inputs) {
    await ghRequest('POST', `/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`, { ref, inputs: inputs ?? {} });
}
//# sourceMappingURL=githubApi.js.map