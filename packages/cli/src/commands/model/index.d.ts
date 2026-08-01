/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * `hopcode model` command
 *
 * Shows all accessible models for the currently-configured provider,
 * grouped by category. Interactive arrow-key selection switches the active model.
 *
 * UX flow:
 *   $ hopcode model
 *   Active provider: DeepSeek
 *   Current model:   deepseek/deepseek-chat
 *
 *   Select a model:
 *   ── Chat ───────────────────────────────────
 * > deepseek/deepseek-chat          · Best for general use
 *   ...
 *   (↑↓ navigate, Enter select, Esc cancel)
 */
import type { CommandModule } from 'yargs';
interface ModelCommandArgs {
    list?: boolean;
}
export declare const modelCommand: CommandModule<Record<string, unknown>, ModelCommandArgs>;
export {};
