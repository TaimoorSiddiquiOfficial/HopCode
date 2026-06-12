/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Prepare script runs after `npm install` / `npm ci`.
 *
 * On CI (where `CI=true` is set by GitHub Actions and other providers),
 * we skip the build and bundle — CI workflows have explicit build steps
 * that are faster and more reliable than running a full build inside
 * a lifecycle script.
 *
 * Locally, we run the full pipeline: husky (git hooks) → build → bundle.
 */

import { execSync } from 'node:child_process';

if (process.env.CI) {
  console.log('CI environment detected — skipping build & bundle.');
  console.log('CI workflows handle builds via explicit steps.');
} else {
  execSync('husky', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });
  execSync('npm run bundle', { stdio: 'inherit' });
}
