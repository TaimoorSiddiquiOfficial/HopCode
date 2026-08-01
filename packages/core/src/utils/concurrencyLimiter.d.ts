/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface ConcurrencyLimiter {
    /**
     * Schedule a single thunk. Resolves/rejects with the thunk's own
     * settlement (rejections are propagated raw — the caller decides whether
     * to treat them as data). At most `limit` scheduled thunks run at once,
     * across ALL callers sharing this limiter.
     */
    run<T>(thunk: () => Promise<T>): Promise<T>;
}
export declare function createConcurrencyLimiter(limit: number, signal?: AbortSignal): ConcurrencyLimiter;
