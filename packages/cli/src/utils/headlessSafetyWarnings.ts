/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApprovalMode, type Config } from '@hoptrendy/hopcode-core';

export const HEADLESS_IZN_NO_SANDBOX_WARNING =
  'Warning: running headless with --izn / approval-mode=izn and no sandbox. ' +
  "All tool calls (shell, write, edit) auto-execute at this process's privilege level. " +
  'Enable a sandbox via --sandbox / HOPCODE_SANDBOX, or set ' +
  'HOPCODE_CODE_SUPPRESS_IZN_WARNING=1 to silence this notice.';

/**
 * Returns a warning line to emit when running in IZN without a sandbox in a
 * non-interactive run, or `null` when no warning is warranted: sandbox is
 * configured, we're already inside a sandbox, approval mode is not IZN, or
 * the user explicitly suppressed the notice.
 *
 * The call site (gemini.tsx) is responsible for gating on
 * `!config.isInteractive()` — this helper deliberately ignores interactivity
 * so it stays pure and unit-testable.
 *
 * The `env` argument is injectable for tests; production callers omit it and
 * fall through to `process.env`.
 */
export function getHeadlessIznSafetyWarning(
  config: Pick<Config, 'getApprovalMode' | 'getSandbox'>,
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  if (config.getApprovalMode() !== ApprovalMode.IZN) return null;
  if (config.getSandbox()) return null;
  // `SANDBOX` is set by the sandbox transport itself: macOS seatbelt sets
  // it to `sandbox-exec`, Docker/Podman to the container name (e.g.
  // `hopcode-sandbox`). Match the rest of the codebase
  // (sandboxConfig.ts, gemini.tsx, Footer.tsx, prompts.ts, …) which all
  // treat any non-empty value as "inside a sandbox". A strict 1/true
  // check here misfires inside real sandboxes, where the helper would
  // wrongly emit a "no sandbox" warning despite the run being contained.
  if (env['SANDBOX']) return null;
  if (isTruthyEnv(env['HOPCODE_CODE_SUPPRESS_IZN_WARNING'])) return null;
  return HEADLESS_IZN_NO_SANDBOX_WARNING;
}

function isTruthyEnv(val: string | undefined): boolean {
  return val === '1' || val === 'true';
}
