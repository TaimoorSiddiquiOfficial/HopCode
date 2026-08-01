/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * `hopcode learn` — post-session skill distillation (learning loop).
 *
 * Reads a recent (or specified) session JSONL file, summarises the
 * conversation, and invokes HopCode with a prompt that asks it to
 * generate a reusable SKILL.md from the patterns found.
 *
 * Usage:
 *   hopcode learn                   — analyse the most recent session
 *   hopcode learn <session-id>      — analyse a specific session
 *   hopcode learn --list            — list recent sessions and exit
 *   hopcode learn --dry-run         — print the generated prompt without running it
 */
import type { CommandModule } from 'yargs';
interface LearnArgs {
    sessionId?: string;
    list: boolean;
    dryRun: boolean;
    maxTurns: number;
}
export declare const learnCommand: CommandModule<object, LearnArgs>;
export {};
