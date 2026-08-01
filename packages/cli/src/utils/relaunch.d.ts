/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
interface RelaunchOptions {
    afterSpawn?: () => void;
    onUpdateRelaunch?: () => Promise<number> | number;
}
export declare function relaunchOnExitCode(runner: () => Promise<number>, options?: Pick<RelaunchOptions, 'onUpdateRelaunch'>): Promise<void>;
export declare function relaunchAppInChildProcess(additionalNodeArgs: string[], additionalScriptArgs: string[], options?: RelaunchOptions): Promise<void>;
export {};
