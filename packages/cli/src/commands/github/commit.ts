/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode github commit`
 *
 * AI-generated conventional commit messages from staged diff.
 *
 * Flow:
 * 1. Get staged diff (git diff --cached)
 * 2. Call active HopCode AI provider to generate: type(scope): description + body
 * 3. Show preview → user confirms or edits
 * 4. Run git commit -m "<message>"
 *
 * Note: This command does NOT require GitHub auth — it only reads the
 * local git staging area. GitHub auth is optional (for future push integration).
 */

import type { CommandModule, Argv } from 'yargs';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import { execSync, exec } from 'node:child_process';
import { promisify } from 'node:util';
import { createInterface } from 'node:readline';

const execAsync = promisify(exec);

// ── Git helpers ───────────────────────────────────────────────────────────────

function getStagedDiff(): string {
  try {
    const diff = execSync('git diff --cached', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim();
    if (!diff) {
      // Try last commit diff as fallback (useful for amend)
      return execSync('git diff HEAD~1', { stdio: ['pipe', 'pipe', 'pipe'] })
        .toString()
        .trim();
    }
    return diff;
  } catch {
    return '';
  }
}

function getStagedFiles(): string[] {
  try {
    return execSync('git diff --cached --name-only', {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function runGitCommit(message: string): Promise<void> {
  // Escape for shell — write message to a temp file to avoid shell injection
  const { execSync: syncExec } = await import('node:child_process');
  const os = await import('node:os');
  const fs = await import('node:fs');
  const path = await import('node:path');

  const tmpFile = path.join(os.tmpdir(), `hopcode-commit-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, message, 'utf8');
  try {
    syncExec(`git commit -F "${tmpFile}"`, { stdio: 'inherit' });
  } finally {
    fs.unlinkSync(tmpFile);
  }
}

// ── AI commit message generation ──────────────────────────────────────────────

/**
 * Calls the system `hopcode` CLI in non-interactive mode to generate a commit message.
 * Uses the currently-configured AI provider.
 * Falls back to a simple diff-based heuristic if the AI call fails.
 */
async function generateCommitMessage(
  diff: string,
  files: string[],
): Promise<string> {
  const fileList = files.slice(0, 10).join(', ');
  const truncatedDiff = diff.slice(0, 8000); // Keep prompt manageable

  const prompt = [
    'Generate a conventional commit message for the following git diff.',
    'Format: type(scope): short description\\n\\nOptional longer body.',
    'Types: feat, fix, refactor, docs, style, test, chore, perf',
    'Rules: imperative mood, max 72 chars first line, no period at end.',
    '',
    `Files changed: ${fileList}`,
    '',
    '```diff',
    truncatedDiff,
    '```',
    '',
    'Reply with ONLY the commit message, no markdown code block, no explanation.',
  ].join('\n');

  try {
    // Use the CLI itself in non-interactive mode
    const { stdout } = await execAsync(
      `hopcode --non-interactive --output-format text "${prompt.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
      { timeout: 30000 },
    );
    const msg = stdout.trim();
    if (msg && msg.length > 5) return msg;
  } catch {
    // Fall through to heuristic
  }

  // Heuristic fallback
  const mainFile = files[0] ?? 'code';
  const ext = mainFile.split('.').pop() ?? '';
  const type =
    ext === 'md' ? 'docs' : ext === 'test' || ext === 'spec' ? 'test' : 'chore';
  return `${type}: update ${files.length > 1 ? `${files.length} files` : mainFile}`;
}

// ── Confirmation prompt ────────────────────────────────────────────────────────

async function confirmCommit(
  message: string,
): Promise<'commit' | 'edit' | 'cancel'> {
  writeStdoutLine(
    t('\n  ── Proposed commit message ───────────────────────────'),
  );
  writeStdoutLine('');
  message.split('\n').forEach((line) => writeStdoutLine(`  ${line}`));
  writeStdoutLine('');
  writeStdoutLine(t('  [c] Commit  [e] Edit  [n] Cancel'));
  process.stdout.write('  Choice: ');

  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, terminal: false });
    rl.once('line', (line) => {
      rl.close();
      const choice = line.trim().toLowerCase();
      if (choice === 'c' || choice === '') resolve('commit');
      else if (choice === 'e') resolve('edit');
      else resolve('cancel');
    });
  });
}

// ── Handler ────────────────────────────────────────────────────────────────────

async function handleCommit(argv: {
  message?: string;
  all?: boolean;
  push?: boolean;
}): Promise<void> {
  // -a flag: stage all tracked changes
  if (argv.all) {
    execSync('git add -u', { stdio: 'inherit' });
  }

  const files = getStagedFiles();
  if (!files.length) {
    writeStderrLine(
      t('No staged changes. Stage files first with: git add <files>'),
    );
    writeStderrLine(
      t('Or use: hopcode github commit --all  (stages all tracked changes)'),
    );
    process.exit(1);
  }

  writeStdoutLine(
    t('\n  Staged files ({{count}}): {{files}}', {
      count: String(files.length),
      files:
        files.slice(0, 5).join(', ') +
        (files.length > 5 ? ` +${files.length - 5} more` : ''),
    }),
  );

  let message = argv.message;

  if (!message) {
    writeStdoutLine(t('  Generating commit message...'));
    const diff = getStagedDiff();
    if (!diff) {
      writeStderrLine(t('Could not read staged diff.'));
      process.exit(1);
    }
    message = await generateCommitMessage(diff, files);
  }

  const choice = await confirmCommit(message);

  if (choice === 'cancel') {
    writeStdoutLine(t('\n  Commit cancelled.\n'));
    return;
  }

  if (choice === 'edit') {
    // Open $EDITOR or fall back to notepad / nano
    const editor =
      process.env['EDITOR'] ??
      (process.platform === 'win32' ? 'notepad' : 'nano');
    const os = await import('node:os');
    const fs = await import('node:fs');
    const path = await import('node:path');
    const tmp = path.join(os.tmpdir(), `hopcode-commit-edit-${Date.now()}.txt`);
    fs.writeFileSync(tmp, message, 'utf8');
    execSync(`${editor} "${tmp}"`, { stdio: 'inherit' });
    message = fs.readFileSync(tmp, 'utf8').trim();
    fs.unlinkSync(tmp);
    if (!message) {
      writeStdoutLine(t('\n  Empty message — commit cancelled.\n'));
      return;
    }
  }

  await runGitCommit(message);

  if (argv.push) {
    writeStdoutLine(t('\n  Pushing...'));
    execSync('git push', { stdio: 'inherit' });
  }

  writeStdoutLine(t('\n  ✓ Committed successfully!\n'));
}

// ── Command export ─────────────────────────────────────────────────────────────

export const githubCommitCommand: CommandModule = {
  command: 'commit',
  describe: t('Generate an AI commit message from staged changes'),
  builder: (yargs: Argv) =>
    yargs
      .option('message', {
        alias: 'm',
        type: 'string',
        description: t('Use this commit message instead of AI-generated one'),
      })
      .option('all', {
        alias: 'a',
        type: 'boolean',
        description: t('Stage all tracked changes before committing'),
        default: false,
      })
      .option('push', {
        alias: 'p',
        type: 'boolean',
        description: t('Push after committing'),
        default: false,
      }),
  handler: async (argv) => {
    try {
      await handleCommit({
        message: argv['message'] as string | undefined,
        all: argv['all'] as boolean,
        push: argv['push'] as boolean,
      });
    } catch (err: unknown) {
      writeStderrLine(
        `Error: ${err instanceof Error ? err.message : String(err)}`,
      );
      process.exit(1);
    }
  },
};
