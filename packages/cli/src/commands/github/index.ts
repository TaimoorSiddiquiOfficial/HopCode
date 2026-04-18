/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode github` — GitHub integration command group.
 *
 * Subcommands:
 *   hopcode github auth     — authenticate via OAuth Device Flow
 *   hopcode github status   — repo overview
 *   hopcode github commit   — AI-generated commit message
 *   hopcode github pr       — PR management (list/create/review)
 *   hopcode github issues   — issue management (list/create/close)
 */

import type { CommandModule, Argv } from 'yargs';
import { githubAuthCommand } from './auth.js';
import { githubStatusCommand } from './status.js';
import { githubCommitCommand } from './commit.js';
import { githubPrCommand } from './pr.js';
import { githubIssuesCommand } from './issues.js';
import { t } from '../../i18n/index.js';

export const githubCommand: CommandModule = {
  command: 'github',
  describe: t('GitHub integration — auth, PRs, issues, AI commits'),
  builder: (yargs: Argv) =>
    yargs
      .command(githubAuthCommand)
      .command(githubStatusCommand)
      .command(githubCommitCommand)
      .command(githubPrCommand)
      .command(githubIssuesCommand)
      .demandCommand(
        1,
        t('Specify a subcommand: auth, status, commit, pr, issues'),
      )
      .strict(false),
  handler: () => {},
};
