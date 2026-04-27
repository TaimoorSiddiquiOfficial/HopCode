/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// Shim: re-exports useHopCodeAuth with the names expected by upstream-merged files.

export type { HopCodeAuthState as QwenAuthState } from './useHopCodeAuth.js';

export type ExternalAuthState = {
  title: string;
  message: string;
  detail?: string;
};

import { useHopCodeAuth } from './useHopCodeAuth.js';
import type { AuthType } from '@hoptrendy/hopcode-core';

export const useQwenAuth = (
  pendingAuthType: AuthType | undefined,
  isAuthenticating: boolean,
) => {
  const { hopCodeAuthState, cancelHopCodeAuth } = useHopCodeAuth(
    pendingAuthType,
    isAuthenticating,
  );
  return { qwenAuthState: hopCodeAuthState, cancelQwenAuth: cancelHopCodeAuth };
};
