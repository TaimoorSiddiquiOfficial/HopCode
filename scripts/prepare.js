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

if (skipPrepare) {
  // The heavy build/bundle/husky are skipped, but git-commit.ts (gitignored,
  // imported by e.g. cli's systemInfo) is still required to build or typecheck
  // the packages that import it. Generate it here so a later per-workspace
  // build/typecheck — such as the review tooling's — doesn't fail on the
  // missing module. The non-skip path generates it via `npm run build`.
  run('npm', ['run', 'generate']);
  console.log(
    'Skipping prepare build/bundle/husky because QWEN_SKIP_PREPARE is set.',
  );
  process.exit(0);
}

run('husky');
run('npm', ['run', 'build']);
run('npm', ['run', 'bundle']);

function run(command, args = []) {
  const result = spawnSync(command, args, {
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  const label = args.length ? `${command} ${args.join(' ')}` : command;

  if (result.error) {
    console.error(`prepare: ${label} failed: ${result.error.message}`);
    process.exit(1);
  }

  if (result.signal) {
    console.error(`prepare: ${label} killed by signal ${result.signal}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`prepare: ${label} exited with status ${result.status}`);
    process.exit(result.status ?? 1);
  }
}
