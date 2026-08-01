/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type CommandModule } from 'yargs';
interface DisableArgs {
    name: string;
    scope?: string;
}
export declare function handleDisable(args: DisableArgs): Promise<void>;
export declare const disableCommand: CommandModule;
export {};
