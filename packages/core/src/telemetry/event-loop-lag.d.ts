/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface EventLoopLagSnapshot {
    meanMs: number;
    p50Ms: number;
    p99Ms: number;
    maxMs: number;
}
export interface EventLoopLagMonitor {
    snapshot(): EventLoopLagSnapshot;
    dispose(): void;
}
export interface EventLoopLagMonitorOptions {
    resolutionMs?: number;
    stallThresholdMs?: number;
    onNewMaxStall?: (maxMs: number) => void;
}
export declare function startEventLoopLagMonitor(options?: EventLoopLagMonitorOptions): EventLoopLagMonitor;
