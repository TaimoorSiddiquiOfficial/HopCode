/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ProviderModelConfig } from '@hoptrendy/hopcode-core';
import type { ProviderConfig } from '../../providerConfig.js';
import { OPENROUTER_ENV_KEY, OPENROUTER_BASE_URL } from './openrouterOAuth.js';
import type { ProviderInstallPlan } from '../../types.js';
export { OPENROUTER_ENV_KEY, OPENROUTER_BASE_URL };
export declare const openRouterProvider: ProviderConfig;
export declare function createOpenRouterProviderInstallPlan({ apiKey, models, }: {
    apiKey: string;
    models?: ProviderModelConfig[];
}): Promise<ProviderInstallPlan>;
