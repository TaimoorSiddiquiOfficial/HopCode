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
import type { CommandModule } from 'yargs';
export declare const githubCommand: CommandModule;
