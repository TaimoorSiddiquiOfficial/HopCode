/**
 * @license
 * Copyright 2026 HopCode Team (adapted from protoCLI)
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Config } from '../config/config.js';
/**
 * Call after each agent turn completes. Runs skill candidate detection every
 * SKILL_REVIEW_INTERVAL turns. Fire-and-forget; errors are logged only.
 */
export declare function runEvolvePass(config: Config, recentMessages: Array<{
    role: string;
    text: string;
}>): Promise<void>;
