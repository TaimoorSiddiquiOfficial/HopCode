/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { UpdateInfo } from 'update-notifier';
export declare const FETCH_TIMEOUT_MS = 2000;
/**
 * Sentinel error thrown when `fetchInfo()` does not resolve within
 * `FETCH_TIMEOUT_MS`. `update-notifier`'s `fetchInfo()` does not accept a
 * timeout option, so slow / unreachable registries (corporate proxies, offline
 * networks, DNS failures) would otherwise hang the check indefinitely or fall
 * through to a stale configstore cache. Race the call against a bounded timer
 * and surface a real error so `/update` can report "check failed" instead of
 * silently returning "up to date". The `distTag` is carried on the message so
 * an oncall reading logs can tell which registry endpoint stalled — the
 * nightly path fires two concurrent fetches, and only one of them may be
 * blocked (e.g. a corporate proxy that lets `nightly` through but not
 * `latest`). Related: #6857.
 */
export declare class UpdateCheckTimeoutError extends Error {
    readonly distTag?: string;
    constructor(timeoutMs: number, distTag?: string);
}
export interface UpdateObject {
    message: string;
    update: UpdateInfo;
}
export type UpdateCheckResult = {
    status: 'update';
    info: UpdateObject;
} | {
    status: 'up-to-date';
    currentVersion: string;
} | {
    status: 'skipped';
    reason: string;
    currentVersion?: string;
} | {
    status: 'error';
    error: Error;
    currentVersion?: string;
};
export declare function checkForUpdatesDetailed(): Promise<UpdateCheckResult>;
export declare function checkForUpdates(): Promise<UpdateObject | null>;
