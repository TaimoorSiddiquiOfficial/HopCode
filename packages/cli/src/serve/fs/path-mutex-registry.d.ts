/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare class PathMutexRegistry {
    private readonly tails;
    runExclusive<T>(key: string, fn: () => Promise<T>): Promise<T>;
}
