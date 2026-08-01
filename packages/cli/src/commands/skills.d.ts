/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * `hopcode skills` command
 *
 * Manages skills at the user and project level.
 *
 * Sub-commands:
 *   hopcode skills list                  — list all skills grouped by level
 *   hopcode skills show <name>           — show SKILL.md content + metadata
 *   hopcode skills add <url|path>        — install skill to ~/.hopcode/skills/<name>/
 *   hopcode skills remove <name>         — remove a user-level skill
 */
import type { CommandModule } from 'yargs';
export declare const skillsCommand: CommandModule;
