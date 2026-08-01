/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */
import { CODING_PLAN_ENV_KEY, CODING_PLAN_CHINA_BASE_URL, CODING_PLAN_GLOBAL_BASE_URL, } from '../auth/providers/alibaba/codingPlan.js';
/**
 * Returns true when the given credentials belong to the Alibaba Coding Plan
 * provider (checked by env key and known base URLs).
 */
export function isCodingPlanConfig(baseUrl, envKey) {
    return (envKey === CODING_PLAN_ENV_KEY &&
        typeof baseUrl === 'string' &&
        (baseUrl === CODING_PLAN_CHINA_BASE_URL ||
            baseUrl === CODING_PLAN_GLOBAL_BASE_URL));
}
//# sourceMappingURL=codingPlan.js.map