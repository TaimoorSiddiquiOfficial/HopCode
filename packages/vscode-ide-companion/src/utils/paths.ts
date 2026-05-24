/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';
import * as dotenv from 'dotenv';

/**
 * Expands tilde and resolves relative paths to absolute.
 * Mirrors Storage.resolvePath() in packages/core.
 */
function resolvePath(dir: string): string {
  let resolved = dir;
  if (
    resolved === '~' ||
    resolved.startsWith('~/') ||
    resolved.startsWith('~\\')
  ) {
    const relativeSegments =
      resolved === '~'
        ? []
        : resolved
            .slice(2)
            .split(/[/\\]+/)
            .filter(Boolean);
    resolved = path.join(os.homedir(), ...relativeSegments);
  }
  if (!path.isAbsolute(resolved)) {
    resolved = path.resolve(resolved);
  }
  return resolved;
}

let envBootstrapped = false;

/**
 * Pre-resolves HOPCODE_HOME / HOPCODE_RUNTIME_DIR from `<homedir>/.hopcode/.env` and
 * `<homedir>/.env`. Mirrors the CLI's `preResolveHomeEnvOverrides` so the
 * companion's lock-file location agrees with the CLI even when these vars
 * are only configured via `.env`. Idempotent.
 */
function bootstrapHomeEnvOverrides(): void {
  if (envBootstrapped) {
    return;
  }
  envBootstrapped = true;

  if (process.env['HOPCODE_HOME'] && process.env['HOPCODE_RUNTIME_DIR']) {
    return;
  }

  const homeDir = os.homedir();
  if (!homeDir) {
    return;
  }

  const initialHopcodeHome = process.env['HOPCODE_HOME'];
  const currentHopcodeDir = initialHopcodeHome
    ? resolvePath(initialHopcodeHome)
    : path.join(homeDir, '.hopcode');

  const KEYS = ['HOPCODE_HOME', 'HOPCODE_RUNTIME_DIR'] as const;
  const readInto = (file: string) => {
    try {
      const parsed = dotenv.parse(fs.readFileSync(file, 'utf-8'));
      for (const key of KEYS) {
        if (parsed[key] && !Object.hasOwn(process.env, key)) {
          process.env[key] = parsed[key];
        }
      }
    } catch {
      // Match the dotenv quiet-mode behavior used by the CLI.
    }
  };

  readInto(path.join(currentHopcodeDir, '.env'));
  if (!initialHopcodeHome) {
    readInto(path.join(homeDir, '.env'));
  }

  // If HOPCODE_HOME was just discovered, also read <new HOPCODE_HOME>/.env so
  // HOPCODE_RUNTIME_DIR can be sourced from there — otherwise the companion
  // would write lock files into a different runtime dir than the CLI reads.
  const discoveredHopcodeHome = process.env['HOPCODE_HOME'];
  if (discoveredHopcodeHome && discoveredHopcodeHome !== initialHopcodeHome) {
    const discoveredDir = resolvePath(discoveredHopcodeHome);
    if (discoveredDir !== currentHopcodeDir) {
      readInto(path.join(discoveredDir, '.env'));
    }
  }
}

/** Test-only: reset the bootstrap latch. */
export function resetEnvBootstrapForTesting(): void {
  envBootstrapped = false;
}

/**
 * Returns the global HopCode home directory (config, credentials, etc.).
 *
 * Priority: HOPCODE_HOME env var > ~/.hopcode
 */
export function getGlobalHopcodeDir(): string {
  bootstrapHomeEnvOverrides();
  const envDir = process.env['HOPCODE_HOME'];
  if (envDir) {
    return resolvePath(envDir);
  }
  const homeDir = os.homedir();
  return homeDir
    ? path.join(homeDir, '.hopcode')
    : path.join(os.tmpdir(), '.hopcode');
}

/**
 * Returns the runtime base directory for ephemeral data (tmp, debug, IDE
 * lock files, sessions, etc.).
 *
 * Priority: HOPCODE_RUNTIME_DIR env var > HOPCODE_HOME env var > ~/.hopcode
 *
 * This mirrors the fallback chain in packages/core Storage.getRuntimeBaseDir()
 * without importing from core to avoid cross-package dependencies.
 */
export function getRuntimeBaseDir(): string {
  bootstrapHomeEnvOverrides();
  const runtimeDir = process.env['HOPCODE_RUNTIME_DIR'];
  if (runtimeDir) {
    return resolvePath(runtimeDir);
  }
  return getGlobalHopcodeDir();
}
