/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * `hopcode dashboard` command — starts the web dashboard server
 */
import type { CommandModule } from 'yargs';
interface DashboardArgs {
    port: number;
    open: boolean;
}
export declare const dashboardCommand: CommandModule<object, DashboardArgs>;
export {};
