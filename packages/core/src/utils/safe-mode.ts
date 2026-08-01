/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { isTruthy } from './bareMode.js';

const SAFE_MODE_ENV_VAR = 'HOPCODE_CODE_SAFE_MODE';

export function isSafeModeEnv(): boolean {
  return isTruthy(process.env[SAFE_MODE_ENV_VAR]);
}
