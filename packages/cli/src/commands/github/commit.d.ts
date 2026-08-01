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
import type { CommandModule } from 'yargs';
export declare const githubCommitCommand: CommandModule;
