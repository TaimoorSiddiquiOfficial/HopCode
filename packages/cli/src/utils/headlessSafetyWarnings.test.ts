/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { ApprovalMode, type Config } from '@hoptrendy/hopcode-core';
import {
  HEADLESS_IZN_NO_SANDBOX_WARNING,
  getHeadlessIznSafetyWarning,
} from './headlessSafetyWarnings.js';

function makeConfig(
  approvalMode: ApprovalMode,
  sandbox: unknown,
): Pick<Config, 'getApprovalMode' | 'getSandbox'> {
  return {
    getApprovalMode: () => approvalMode,
    // Real return type is `SandboxConfig | undefined`; the warning policy
    // only cares about truthiness so the tests model it as such.
    getSandbox: () => sandbox as ReturnType<Config['getSandbox']>,
  };
}

describe('getHeadlessIznSafetyWarning', () => {
  it('warns when approval mode is IZN and no sandbox is configured', () => {
    const cfg = makeConfig(ApprovalMode.IZN, undefined);
    expect(getHeadlessIznSafetyWarning(cfg, {})).toBe(
      HEADLESS_IZN_NO_SANDBOX_WARNING,
    );
  });

  it('does not warn when approval mode is not IZN', () => {
    const cfg = makeConfig(ApprovalMode.DEFAULT, undefined);
    expect(getHeadlessIznSafetyWarning(cfg, {})).toBeNull();
  });

  it('does not warn when a sandbox is configured', () => {
    const cfg = makeConfig(ApprovalMode.IZN, {
      command: 'docker',
      image: 'hopcode-sandbox',
    });
    expect(getHeadlessIznSafetyWarning(cfg, {})).toBeNull();
  });

  it('does not warn when SANDBOX env is set to the value the sandbox transport actually writes', () => {
    const cfg = makeConfig(ApprovalMode.IZN, undefined);
    // macOS seatbelt
    expect(
      getHeadlessIznSafetyWarning(cfg, { SANDBOX: 'sandbox-exec' }),
    ).toBeNull();
    // Docker / Podman container name
    expect(
      getHeadlessIznSafetyWarning(cfg, { SANDBOX: 'hopcode-sandbox' }),
    ).toBeNull();
    // Generic truthy values
    expect(getHeadlessIznSafetyWarning(cfg, { SANDBOX: '1' })).toBeNull();
    expect(getHeadlessIznSafetyWarning(cfg, { SANDBOX: 'true' })).toBeNull();
  });

  it('warns when SANDBOX env is unset or empty string', () => {
    const cfg = makeConfig(ApprovalMode.IZN, undefined);
    expect(getHeadlessIznSafetyWarning(cfg, {})).toBe(
      HEADLESS_IZN_NO_SANDBOX_WARNING,
    );
    expect(getHeadlessIznSafetyWarning(cfg, { SANDBOX: '' })).toBe(
      HEADLESS_IZN_NO_SANDBOX_WARNING,
    );
  });

  it('respects the explicit suppression env var when set to 1 or true', () => {
    const cfg = makeConfig(ApprovalMode.IZN, undefined);
    expect(
      getHeadlessIznSafetyWarning(cfg, {
        QWEN_CODE_SUPPRESS_IZN_WARNING: '1',
      }),
    ).toBeNull();
    expect(
      getHeadlessIznSafetyWarning(cfg, {
        QWEN_CODE_SUPPRESS_IZN_WARNING: 'true',
      }),
    ).toBeNull();
  });

  it('does NOT suppress when QWEN_CODE_SUPPRESS_IZN_WARNING is 0 / false / empty', () => {
    const cfg = makeConfig(ApprovalMode.IZN, undefined);
    for (const val of ['0', 'false', '', 'no']) {
      expect(
        getHeadlessIznSafetyWarning(cfg, {
          QWEN_CODE_SUPPRESS_IZN_WARNING: val,
        }),
      ).toBe(HEADLESS_IZN_NO_SANDBOX_WARNING);
    }
  });
});
