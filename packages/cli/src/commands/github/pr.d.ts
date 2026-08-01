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
import type { CommandModule } from 'yargs';
export declare const githubPrCommand: CommandModule;
