/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Provider registry — imports all provider definitions and assembles the
 * lookup tables used by the UI and CLI commands.
 */
import { type ProviderConfig } from './providerConfig.js';
import { codingPlanProvider } from './providers/alibaba/codingPlan.js';
import { tokenPlanProvider } from './providers/alibaba/tokenPlan.js';
import { alibabaStandardProvider } from './providers/alibaba/alibabaStandard.js';
import { openRouterProvider } from './providers/oauth/openrouter.js';
import { deepseekProvider } from './providers/thirdParty/deepseek.js';
import { minimaxProvider } from './providers/thirdParty/minimax.js';
import { zaiProvider } from './providers/thirdParty/zai.js';
import { idealabProvider } from './providers/thirdParty/idealab.js';
import { modelscopeProvider } from './providers/thirdParty/modelscope.js';
import { customProvider } from './providers/custom/customProvider.js';
export { codingPlanProvider, tokenPlanProvider, alibabaStandardProvider, openRouterProvider, deepseekProvider, minimaxProvider, zaiProvider, idealabProvider, modelscopeProvider, customProvider, };
export { CUSTOM_API_KEY_ENV_PREFIX, generateCustomEnvKey, } from './providers/custom/customProvider.js';
/** All known providers, in display order. */
export declare const ALL_PROVIDERS: readonly ProviderConfig[];
/** Providers grouped by uiGroup. */
export declare const ALIBABA_PROVIDERS: ProviderConfig[];
export declare const THIRD_PARTY_PROVIDERS: ProviderConfig[];
export declare const OAUTH_PROVIDERS: ProviderConfig[];
export declare function findProviderById(id: string): ProviderConfig | undefined;
/** Find a provider by model credentials (baseUrl + envKey). */
export declare function findProviderByCredentials(baseUrl: string | undefined, envKey: string | undefined): ProviderConfig | undefined;
/** All known provider base URLs (for preconnect, validation, etc.). */
export declare function getAllProviderBaseUrls(): string[];
export { buildInstallPlan, resolveBaseUrl, getDefaultModelIds, shouldShowStep, computeModelListVersion, } from './providerConfig.js';
