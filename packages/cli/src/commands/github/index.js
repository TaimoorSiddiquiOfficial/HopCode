/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { githubAuthCommand } from './auth.js';
import { githubStatusCommand } from './status.js';
import { githubCommitCommand } from './commit.js';
import { githubPrCommand } from './pr.js';
import { githubIssuesCommand } from './issues.js';
import { t } from '../../i18n/index.js';
export const githubCommand = {
    command: 'github',
    describe: t('GitHub integration — auth, PRs, issues, AI commits'),
    builder: (yargs) => yargs
        .command(githubAuthCommand)
        .command(githubStatusCommand)
        .command(githubCommitCommand)
        .command(githubPrCommand)
        .command(githubIssuesCommand)
        .demandCommand(1, t('Specify a subcommand: auth, status, commit, pr, issues'))
        .strict(false),
    handler: () => { },
};
//# sourceMappingURL=index.js.map