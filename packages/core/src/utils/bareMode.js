/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */
export const HOPCODE_SIMPLE_ENV_VAR = 'HOPCODE_SIMPLE';
export function isTruthy(value) {
    if (!value) {
        return false;
    }
    return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase().trim());
}
export function isBareMode(cliFlag) {
    return cliFlag === true || isTruthy(process.env[HOPCODE_SIMPLE_ENV_VAR]);
}
//# sourceMappingURL=bareMode.js.map