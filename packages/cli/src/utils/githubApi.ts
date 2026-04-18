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
