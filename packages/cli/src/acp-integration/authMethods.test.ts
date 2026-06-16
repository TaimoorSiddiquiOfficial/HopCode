/**
 * @license
 * Copyright 2025-2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { AuthType } from '@hoptrendy/hopcode-core';
import {
  buildAuthMethods,
  pickAuthMethodsForAuthRequired,
} from './authMethods.js';

describe('ACP auth methods', () => {
  it('does not advertise discontinued HopCode OAuth', () => {
    const authMethods = buildAuthMethods();

    expect(authMethods.map((method) => method.id)).toEqual([
      AuthType.USE_OPENAI,
    ]);
  });

  it('falls back to working methods for a stored discontinued HopCode OAuth selection', () => {
    const authMethods = pickAuthMethodsForAuthRequired('hopcode-oauth');

    expect(authMethods.map((method) => method.id)).toEqual([
      AuthType.USE_OPENAI,
    ]);
  });
});
