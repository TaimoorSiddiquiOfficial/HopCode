/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode github status`
 *
 * Shows a quick overview of the current Git repo:
 *  - Current branch
 *  - Open pull requests (count + titles)
 *  - Last N commits
 *  - Repo stats (stars, issues)
 */

import type { CommandModule } from 'yargs';
import { getRepo, listPRs, listCommits } from '../../utils/githubApi.js';
import { loadGitHubToken } from '../../utils/githubTokenStore.js';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import { execSync } from 'node:child_process';

function getCurrentBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
  } catch {
    return '(unknown)';
  }
}

function getRemoteOwnerRepo(): { owner: string; repo: string } | null {
  try {
    const remote = execSync('git remote get-url origin', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
    // Handles https://github.com/owner/repo and git@github.com:owner/repo
    const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  } catch {
    return null;
  }
}

async function handleGithubStatus(): Promise<void> {
  if (!loadGitHubToken()) {
    writeStderrLine(t('Not authenticated. Run: hopcode github auth'));
    process.exit(1);
  }

  const remote = getRemoteOwnerRepo();
  if (!remote) {
    writeStderrLine(
      t('Not in a GitHub repository. Navigate to a git repo first.'),
    );
    process.exit(1);
  }

  const { owner, repo: repoName } = remote;
  const branch = getCurrentBranch();

  writeStdoutLine(
    t('\n  ── GitHub Status ─────────────────────────────────────'),
  );
  writeStdoutLine(
    t('  Repo:    {{owner}}/{{repo}}', { owner, repo: repoName }),
  );
  writeStdoutLine(t('  Branch:  {{branch}}', { branch }));

  const [repoInfo, openPRs, recentCommits] = await Promise.all([
    getRepo(owner, repoName),
    listPRs(owner, repoName, 'open'),
    listCommits(owner, repoName, 5),
  ]);

  writeStdoutLine(
    t('  Stars:   {{stars}}  ·  Open Issues: {{issues}}', {
      stars: repoInfo.stargazers_count,
      issues: repoInfo.open_issues_count,
    }),
  );

  // Open PRs
  writeStdoutLine(
    t('\n  ── Open Pull Requests ({{count}}) ─────────────────────', {
      count: openPRs.length,
    }),
  );
  if (openPRs.length === 0) {
    writeStdoutLine(t('  (none)'));
  } else {
    for (const pr of openPRs.slice(0, 8)) {
      const draft = pr.draft ? ' [draft]' : '';
      writeStdoutLine(
        t('  #{{num}}  {{title}}{{draft}}', {
          num: pr.number,
          title: pr.title.slice(0, 60),
          draft,
        }),
      );
      writeStdoutLine(
        t('       {{head}} → {{base}}  by @{{user}}', {
          head: pr.head.ref,
          base: pr.base.ref,
          user: pr.user.login,
        }),
      );
    }
  }

  // Recent commits
  writeStdoutLine(
    t('\n  ── Recent Commits ──────────────────────────────────'),
  );
  for (const commit of recentCommits) {
    const msg = commit.commit.message.split('\n')[0].slice(0, 70);
    const sha = commit.sha.slice(0, 7);
    const author = commit.commit.author.name;
    writeStdoutLine(
      t('  {{sha}}  {{msg}}  ({{author}})', { sha, msg, author }),
    );
  }
  writeStdoutLine('');
}

export const githubStatusCommand: CommandModule = {
  command: 'status',
  describe: t('Show GitHub repo overview: branch, PRs, recent commits'),
  builder: (yargs) => yargs,
  handler: async () => {
    try {
      await handleGithubStatus();
    } catch (err: unknown) {
      writeStderrLine(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
      process.exit(1);
    }
  },
};
