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
 * Runs all registered cleanup functions.
 *
 * Bounds execution with two failsafes:
 * 1. Per-function timeout (2s): prevents a single hung syscall (e.g. slow NFS,
 *    stuck MCP socket) from blocking other cleanups.
 * 2. Overall wall-clock timeout (5s): ensures the process eventually exits
 *    even if many cleanups are slow or the event loop is saturated.
 */
export async function runExitCleanup() {
  const overallTimeout = 5000;
  const perFnTimeout = 2000;

  const cleanupPromise = (async () => {
    for (const fn of cleanupFunctions) {
      try {
        // Race each cleanup function against a per-function timeout
        await Promise.race([
          Promise.resolve(fn()),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Cleanup function timed out')),
              perFnTimeout,
            ),
          ),
        ]);
      } catch (_) {
        // Ignore errors and timeouts during cleanup.
      }
    }
  })();

  await Promise.race([
    cleanupPromise,
    new Promise((resolve) => setTimeout(resolve, overallTimeout)),
  ]);

  cleanupFunctions.length = 0; // Clear the array
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
