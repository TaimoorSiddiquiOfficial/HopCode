/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Test-only: reset the bootstrap latch. */
export declare function resetEnvBootstrapForTesting(): void;
/**
 * Returns the global HopCode home directory (config, credentials, etc.).
 *
 * Priority: HOPCODE_HOME env var > ~/.hopcode
 */
export declare function getGlobalHopcodeDir(): string;
/**
 * Returns the runtime base directory for ephemeral data (tmp, debug, IDE
 * lock files, sessions, etc.).
 *
 * Priority: HOPCODE_RUNTIME_DIR env var > HOPCODE_HOME env var > ~/.hopcode
 *
 * This mirrors the fallback chain in packages/core Storage.getRuntimeBaseDir()
 * without importing from core to avoid cross-package dependencies.
 */
export declare function getRuntimeBaseDir(): string;
