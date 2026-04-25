/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { promises as fs } from 'node:fs';
import { join } from 'node:path';
import { Storage } from '@hoptrendy/hopcode-core';

const cleanupFunctions: Array<(() => void) | (() => Promise<void>)> = [];

/**
 * Resets the cleanup functions array for testing.
 * @internal
 */
export function _resetCleanupFunctionsForTest(): void {
  cleanupFunctions.length = 0;
}

export function registerCleanup(fn: (() => void) | (() => Promise<void>)) {
  cleanupFunctions.push(fn);
}

/**
 * Per-cleanup ceiling. Caps any single hung cleanup so it can't starve the
 * rest of the cleanup chain.
 * Increased from 2s to 5s to handle complex cleanup scenarios like
 * MCP server disconnections, LSP shutdown, and file system operations.
 */
const PER_CLEANUP_TIMEOUT_MS = 5_000;

/**
 * Wall-clock ceiling for the whole cleanup pass.
 * Increased from 5s to 15s to accommodate multiple cleanup operations
 * that may involve network I/O (MCP servers) and process termination.
 */
const OVERALL_CLEANUP_TIMEOUT_MS = 15_000;

/**
 * Awaits a promise but resolves to `undefined` if the timeout elapses first.
 * The timer is unref'd so it cannot keep the event loop alive by itself.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | void> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(undefined), ms);
    timer.unref?.();
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(undefined);
      },
    );
  });
}

export interface RunExitCleanupOptions {
  /** TEST ONLY - override per-cleanup-function timeout (default 2s). */
  _testPerFnTimeoutMs?: number;
  /** TEST ONLY - override overall wall-clock timeout (default 5s). */
  _testOverallTimeoutMs?: number;
}

/**
 * Runs all registered cleanup functions.
 *
 * Bounds execution with two failsafes:
 * 1. Per-function timeout: prevents a single hung cleanup from blocking later ones.
 * 2. Overall timeout: ensures the process eventually exits even if many cleanups hang.
 */
export async function runExitCleanup(
  options: RunExitCleanupOptions = {},
): Promise<void> {
  const perFn = options._testPerFnTimeoutMs ?? PER_CLEANUP_TIMEOUT_MS;
  const overall = options._testOverallTimeoutMs ?? OVERALL_CLEANUP_TIMEOUT_MS;

  const drain = (async () => {
    for (const fn of cleanupFunctions) {
      try {
        await withTimeout(Promise.resolve().then(fn), perFn);
      } catch {
        // Ignore errors during cleanup.
      }
    }
  })();

  let wallClockTimer: NodeJS.Timeout | undefined;
  const wallClock = new Promise<void>((resolve) => {
    wallClockTimer = setTimeout(resolve, overall);
    wallClockTimer.unref?.();
  });

  try {
    await Promise.race([drain, wallClock]);
  } finally {
    if (wallClockTimer) {
      clearTimeout(wallClockTimer);
    }
    cleanupFunctions.length = 0;
  }
}

export async function cleanupCheckpoints() {
  const storage = new Storage(process.cwd());
  const tempDir = storage.getProjectTempDir();
  const checkpointsDir = join(tempDir, 'checkpoints');
  try {
    await fs.rm(checkpointsDir, { recursive: true, force: true });
  } catch {
    // Ignore errors if the directory doesn't exist or fails to delete.
  }
}
