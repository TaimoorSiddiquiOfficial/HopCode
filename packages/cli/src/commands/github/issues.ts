/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode github issues`
 *
 * Subcommands:
 *   hopcode github issues list     — list open issues
 *   hopcode github issues create   — create an issue (AI-generated description)
 *   hopcode github issues close <n> — close an issue
 */

import type { CommandModule, Argv } from 'yargs';
import { listIssues, createIssue, closeIssue } from '../../utils/githubApi.js';
import { loadGitHubToken } from '../../utils/githubTokenStore.js';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import { execSync } from 'node:child_process';
import { promptForSecretInput } from '../../utils/promptUtils.js';

function getRemoteOwnerRepo(): { owner: string; repo: string } | null {
  try {
    const remote = execSync('git remote get-url origin', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
    const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  } catch {
    return null;
  }
}

function requireRepo(): { owner: string; repo: string } {
  if (!loadGitHubToken()) {
    writeStderrLine(t('Not authenticated. Run: hopcode github auth'));
    process.exit(1);
  }
  const r = getRemoteOwnerRepo();
  if (!r) {
    writeStderrLine(t('Not in a GitHub repository.'));
    process.exit(1);
  }
  return r;
}

// ── list ──────────────────────────────────────────────────────────────────────

const listCommand: CommandModule = {
  command: 'list',
  describe: t('List open issues'),
  builder: (yargs: Argv) =>
    yargs.option('state', {
      type: 'string',
      choices: ['open', 'closed', 'all'],
      default: 'open',
    }),
  handler: async (argv) => {
    const { owner, repo } = requireRepo();
    const state = (argv['state'] as 'open' | 'closed' | 'all') ?? 'open';
    const issues = await listIssues(owner, repo, state);

    if (!issues.length) {
      writeStdoutLine(t('No {{state}} issues.', { state }));
      return;
    }

    writeStdoutLine(
      t('\n  ── Issues ({{state}}) ─────────────────────────────────', {
        state,
      }),
    );
    for (const issue of issues) {
      const labels = issue.labels.map((l) => l.name).join(', ');
      writeStdoutLine(
        t('  #{{num}}  {{title}}', {
          num: String(issue.number),
          title: issue.title.slice(0, 70),
        }),
      );
      if (labels) writeStdoutLine(t('       Labels: {{labels}}', { labels }));
      writeStdoutLine(t('       {{url}}', { url: issue.html_url }));
    }
    writeStdoutLine('');
  },
};

// ── create ────────────────────────────────────────────────────────────────────

const createCommand: CommandModule = {
  command: 'create',
  describe: t('Create a new issue'),
  builder: (yargs: Argv) =>
    yargs
      .option('title', {
        type: 'string',
        alias: 't',
        description: t('Issue title'),
      })
      .option('body', {
        type: 'string',
        alias: 'b',
        description: t('Issue body'),
      })
      .option('label', {
        type: 'array',
        alias: 'l',
        description: t('Labels to apply'),
        default: [],
      }),
  handler: async (argv) => {
    const { owner, repo } = requireRepo();

    let title = argv['title'] as string | undefined;
    if (!title) {
      title = await promptForSecretInput(t('Issue title: '));
    }

    let body = argv['body'] as string | undefined;
    if (!body) {
      writeStdoutLine(
        t('Issue body (leave blank to skip, press Enter twice if multiline):'),
      );
      body = await promptForSecretInput('> ');
    }

    const labels = ((argv['label'] as string[] | undefined) ?? []).filter(
      Boolean,
    );

    const issue = await createIssue(owner, repo, { title, body, labels });
    writeStdoutLine(
      t('\n  ✓ Issue created: #{{num}} — {{title}}', {
        num: String(issue.number),
        title: issue.title,
      }),
    );
    writeStdoutLine(t('  {{url}}\n', { url: issue.html_url }));
  },
};

// ── close ─────────────────────────────────────────────────────────────────────

const closeCommand: CommandModule = {
  command: 'close <number>',
  describe: t('Close an issue by number'),
  builder: (yargs: Argv) =>
    yargs.positional('number', {
      type: 'number',
      description: t('Issue number'),
    }),
  handler: async (argv) => {
    const { owner, repo } = requireRepo();
    const num = argv['number'] as number;
    await closeIssue(owner, repo, num);
    writeStdoutLine(t('✓ Issue #{{num}} closed.', { num: String(num) }));
  },
};

// ── Parent command ────────────────────────────────────────────────────────────

export const githubIssuesCommand: CommandModule = {
  command: 'issues',
  describe: t('Manage GitHub issues'),
  builder: (yargs: Argv) =>
    yargs
      .command(listCommand)
      .command(createCommand)
      .command(closeCommand)
      .demandCommand(1, t('Specify a subcommand: list, create, close')),
  handler: () => {},
};
