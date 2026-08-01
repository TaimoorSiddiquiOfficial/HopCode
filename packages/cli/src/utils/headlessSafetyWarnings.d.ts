/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { type Config } from '@hoptrendy/hopcode-core';
export declare const HEADLESS_IZN_NO_SANDBOX_WARNING: string;
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
export declare function getHeadlessIznSafetyWarning(config: Pick<Config, 'getApprovalMode' | 'getSandbox'>, env?: NodeJS.ProcessEnv): string | null;
