/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export interface ThrottledOnceOptions {
    markerPath: string;
    lockPath: string;
    minIntervalMs?: number;
    staleLockMs?: number;
    name: string;
}
export declare function runThrottledOnce(opts: ThrottledOnceOptions, task: () => Promise<void>): Promise<boolean>;
