/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode github pr`
 *
 * Subcommands:
 *   hopcode github pr create  — AI-generated PR title + body from diff → POST /pulls
 *   hopcode github pr list    — show open PRs
 *   hopcode github pr review <n> — AI review of PR diff
 */

import type { CommandModule, Argv } from 'yargs';
import { listPRs, createPR, getPRDiff } from '../../utils/githubApi.js';
import { loadGitHubToken } from '../../utils/githubTokenStore.js';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import { execSync, exec } from 'node:child_process';
import { promisify } from 'node:util';
import { createInterface } from 'node:readline';

const execAsync = promisify(exec);

// ── Git helpers ───────────────────────────────────────────────────────────────

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

function getCurrentBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
  } catch {
    return '';
  }
}

function getDefaultBranch(): string {
  try {
    const remote = execSync('git remote show origin', {
      stdio: ['pipe', 'pipe', 'pipe'],
    }).toString();
    const m = remote.match(/HEAD branch: (\S+)/);
    return m?.[1] ?? 'main';
  } catch {
    return 'main';
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

// ── AI PR generation ──────────────────────────────────────────────────────────

async function generatePRContent(
  diff: string,
  branch: string,
): Promise<{ title: string; body: string }> {
  const truncated = diff.slice(0, 10000);
  const prompt = [
    `Generate a GitHub pull request title and description for a branch named "${branch}".`,
    'Format your response as:',
    'TITLE: <concise title, max 72 chars>',
    'BODY:',
    '<markdown body with ## Summary, ## Changes, ## Testing sections>',
    '',
    'Diff:',
    '```diff',
    truncated,
    '```',
    '',
    'Reply with ONLY the title and body in the format above.',
  ].join('\n');

  try {
    const { stdout } = await execAsync(
      `hopcode --non-interactive --output-format text "${prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
      { timeout: 45000 },
    );
    const text = stdout.trim();
    const titleMatch = text.match(/^TITLE:\s*(.+)/m);
    const bodyMatch = text.match(/^BODY:\s*\n([\s\S]+)/m);
    if (titleMatch && bodyMatch) {
      return { title: titleMatch[1].trim(), body: bodyMatch[1].trim() };
    }
  } catch {
    // Fall through to heuristic
  }

  return {
    title: `feat: changes from ${branch}`,
    body: `## Summary\n\nChanges from branch \`${branch}\`.\n\n## Changes\n\n_Auto-generated PR — please update this description._`,
  };
}

// ── Confirm prompt ────────────────────────────────────────────────────────────

async function confirm(message: string): Promise<boolean> {
  process.stdout.write(`${message} [y/N] `);
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, terminal: false });
    rl.once('line', (line) => {
      rl.close();
      resolve(line.trim().toLowerCase() === 'y');
    });
  });
}

// ── Subcommands ───────────────────────────────────────────────────────────────

const createCommand: CommandModule = {
  command: 'create',
  describe: t('Create a PR with an AI-generated title and description'),
  builder: (yargs: Argv) =>
    yargs
      .option('title', {
        type: 'string',
        alias: 't',
        description: t('PR title'),
      })
      .option('body', { type: 'string', alias: 'b', description: t('PR body') })
      .option('base', {
        type: 'string',
        description: t('Target branch (default: repo default)'),
      })
      .option('draft', {
        type: 'boolean',
        default: false,
        description: t('Create as draft PR'),
      }),
  handler: async (argv) => {
    const { owner, repo } = requireRepo();
    const head = getCurrentBranch();
    const base = (argv['base'] as string | undefined) ?? getDefaultBranch();

    if (!head || head === base) {
      writeStderrLine(
        t(
          'Cannot create PR: current branch is {{head}}. Switch to a feature branch first.',
          { head },
        ),
      );
      process.exit(1);
    }

    let title = argv['title'] as string | undefined;
    let body = argv['body'] as string | undefined;

    if (!title || !body) {
      writeStdoutLine(t('  Generating PR content from diff...'));
      try {
        const diff = execSync(`git diff ${base}...${head}`, {
          stdio: ['pipe', 'pipe', 'pipe'],
        }).toString();
        const generated = await generatePRContent(diff, head);
        title = title ?? generated.title;
        body = body ?? generated.body;
      } catch {
        title = title ?? `feat: changes from ${head}`;
        body = body ?? '## Summary\n\n_Please describe your changes._';
      }
    }

    writeStdoutLine(t('\n  PR Preview:'));
    writeStdoutLine(t('  Title: {{title}}', { title }));
    writeStdoutLine(t('  Base:  {{base}} ← {{head}}', { base, head }));
    writeStdoutLine(
      t('  Draft: {{draft}}', { draft: argv['draft'] ? 'yes' : 'no' }),
    );
    writeStdoutLine('');

    const ok = await confirm('  Create this PR?');
    if (!ok) {
      writeStdoutLine(t('  Cancelled.'));
      return;
    }

    const pr = await createPR(owner, repo, {
      title: title!,
      body: body!,
      head,
      base,
      draft: argv['draft'] as boolean,
    });

    writeStdoutLine(
      t('\n  ✓ PR created: #{{num}} — {{title}}', {
        num: String(pr.number),
        title: pr.title,
      }),
    );
    writeStdoutLine(t('  {{url}}\n', { url: pr.html_url }));
  },
};

const listCommand: CommandModule = {
  command: 'list',
  describe: t('List open pull requests'),
  builder: (yargs: Argv) =>
    yargs.option('state', {
      type: 'string',
      choices: ['open', 'closed', 'all'],
      default: 'open',
    }),
  handler: async (argv) => {
    const { owner, repo } = requireRepo();
    const state = (argv['state'] as 'open' | 'closed' | 'all') ?? 'open';
    const prs = await listPRs(owner, repo, state);

    if (!prs.length) {
      writeStdoutLine(t('No {{state}} pull requests.', { state }));
      return;
    }

    writeStdoutLine(
      t('\n  ── Pull Requests ({{state}}) ──────────────────────────', {
        state,
      }),
    );
    for (const pr of prs) {
      const draft = pr.draft ? ' [DRAFT]' : '';
      writeStdoutLine(
        t('  #{{num}}  {{title}}{{draft}}', {
          num: String(pr.number),
          title: pr.title.slice(0, 65),
          draft,
        }),
      );
      writeStdoutLine(
        t('       {{head}} → {{base}}  @{{user}}  {{url}}', {
          head: pr.head.ref,
          base: pr.base.ref,
          user: pr.user.login,
          url: pr.html_url,
        }),
      );
    }
    writeStdoutLine('');
  },
};

const reviewCommand: CommandModule = {
  command: 'review <number>',
  describe: t('AI review of a pull request'),
  builder: (yargs: Argv) =>
    yargs.positional('number', { type: 'number', description: t('PR number') }),
  handler: async (argv) => {
    const { owner, repo } = requireRepo();
    const num = argv['number'] as number;

    writeStdoutLine(t('  Fetching PR #{{num}} diff...', { num: String(num) }));
    const diff = await getPRDiff(owner, repo, num);
    const truncated = diff.slice(0, 12000);

    const prompt = [
      `Review this GitHub pull request diff and provide constructive feedback.`,
      `Focus on: bugs, security issues, performance, code quality, missing tests.`,
      `Be concise and actionable.`,
      '',
      '```diff',
      truncated,
      '```',
    ].join('\n');

    writeStdoutLine(t('  Generating AI review...\n'));
    try {
      const { stdout } = await execAsync(
        `hopcode --non-interactive --output-format text "${prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
        { timeout: 60000 },
      );
      writeStdoutLine(stdout);
    } catch {
      writeStderrLine(
        t(
          'AI review failed. Make sure hopcode is configured with an AI provider.',
        ),
      );
    }
  },
};

// ── Parent command ─────────────────────────────────────────────────────────────

export const githubPrCommand: CommandModule = {
  command: 'pr',
  describe: t('Manage GitHub pull requests'),
  builder: (yargs: Argv) =>
    yargs
      .command(listCommand)
      .command(createCommand)
      .command(reviewCommand)
      .demandCommand(1, t('Specify a subcommand: list, create, review')),
  handler: () => {},
};
