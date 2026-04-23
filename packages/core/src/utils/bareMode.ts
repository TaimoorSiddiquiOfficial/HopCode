/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */

export const HOPCODE_SIMPLE_ENV_VAR = 'HOPCODE_SIMPLE';

// Backward compatibility with the old Qwen Code env var name
export const QWEN_CODE_SIMPLE_ENV_VAR = 'QWEN_CODE_SIMPLE';

function isTruthy(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase().trim());
}

export function isBareMode(cliFlag?: boolean): boolean {
  return (
    cliFlag === true ||
    isTruthy(process.env[HOPCODE_SIMPLE_ENV_VAR]) ||
    isTruthy(process.env[QWEN_CODE_SIMPLE_ENV_VAR])
  );
}
