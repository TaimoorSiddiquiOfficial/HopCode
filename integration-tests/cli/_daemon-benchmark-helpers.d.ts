/**
 * @license
 * Copyright 2025 hopcode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type SpawnDaemonOptions, type SpawnedDaemon } from './_daemon-harness.js';
export interface ProcessResourceMetrics {
    peakRssMB: number | null;
    userTimeMs: number | null;
    sysTimeMs: number | null;
    voluntaryCtxSwitches: number | null;
    involuntaryCtxSwitches: number | null;
    pageFaults: number | null;
    pageReclaims: number | null;
    instructionsRetired: number | null;
    cyclesElapsed: number | null;
}
export interface CliResult extends ProcessResourceMetrics {
    wallClockMs: number;
    exitCode: number | null;
    stdout: string;
    stderr: string;
}
export interface ProcessTreeRss {
    daemonRssMB: number;
    acpChildRssMB: number;
    mcpChildrenRssMB: number;
    totalRssMB: number;
}
export interface StartupPhasesResult {
    moduleLoadMs: number | null;
    configInitMs: number | null;
    mcpSettledMs: number | null;
    fullStartupMs: number | null;
    wallClockMs: number;
    peakRssMB: number | null;
}
export declare function parseTimeOutput(stderr: string): ProcessResourceMetrics;
export declare function spawnCliWithTime(args: string[], opts?: {
    cwd?: string;
    env?: Record<string, string>;
}): Promise<CliResult>;
export declare function measureProcessTreeRss(daemonPid: number): ProcessTreeRss;
export declare function measureCliStartupWithProfiler(opts?: {
    cwd?: string;
}): Promise<StartupPhasesResult>;
export declare function spawnDaemonWithTime(opts?: SpawnDaemonOptions): Promise<SpawnedDaemon & {
    getResourceMetrics: () => ProcessResourceMetrics;
}>;
