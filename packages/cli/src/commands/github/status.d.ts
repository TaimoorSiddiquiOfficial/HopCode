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
export declare const githubStatusCommand: CommandModule;
