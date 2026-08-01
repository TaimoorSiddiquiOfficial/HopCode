/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { detectActiveProvider } from '../commands/auth/registry.js';
import { isCodingPlanConfig } from '../constants/codingPlan.js';
/**
 * Resolve the currently active provider from loaded settings.
 *
 * Priority:
 *   1. Coding Plan — detected via envKey/baseUrl heuristic on modelProviders.openai
 *   2. Registry provider — matched by envKey + baseUrl against modelProviders.openai
 *   3. Gemini fallback — when selectedType === 'gemini' but no registry match
 *   4. Anthropic fallback — when selectedType === 'anthropic'
 *
 * Returns null when no provider is configured.
 */
export function resolveActiveProvider(settings) {
    const allSettings = settings.merged;
    const authType = allSettings?.security?.auth?.selectedType;
    if (!authType)
        return null;
    const modelName = allSettings?.model?.name ?? '';
    // Extract the openai providers array from settings (not the full settings object).
    const openaiProviders = allSettings?.modelProviders?.['openai'] ?? [];
    // 1. Coding Plan detection
    const first = openaiProviders[0];
    if (first && isCodingPlanConfig(first.baseUrl, first.envKey)) {
        return {
            providerId: 'coding-plan',
            providerLabel: 'Alibaba Cloud Coding Plan',
            currentModel: modelName,
            authTypeKey: 'openai',
            baseUrl: first.baseUrl,
        };
    }
    // 2. Registry provider detection — pass only the openai providers array
    const regProvider = detectActiveProvider(openaiProviders);
    if (regProvider) {
        const atKey = regProvider.authType === 'anthropic'
            ? 'anthropic'
            : regProvider.authType === 'gemini'
                ? 'gemini'
                : 'openai';
        return {
            providerId: regProvider.id,
            providerLabel: regProvider.label,
            currentModel: modelName,
            authTypeKey: atKey,
            baseUrl: regProvider.baseUrl,
        };
    }
    // 3. Gemini fallback (no modelProviders entry — uses GEMINI_API_KEY directly)
    if (authType === 'gemini') {
        return {
            providerId: 'gemini',
            providerLabel: 'Google Gemini',
            currentModel: modelName,
            authTypeKey: 'gemini',
        };
    }
    // 4. Anthropic fallback
    if (authType === 'anthropic') {
        const anthropicProviders = allSettings?.modelProviders?.['anthropic'] ?? [];
        const anthropicFirst = anthropicProviders[0];
        return {
            providerId: 'anthropic',
            providerLabel: 'Anthropic',
            currentModel: modelName,
            authTypeKey: 'anthropic',
            baseUrl: anthropicFirst?.baseUrl,
        };
    }
    return null;
}
//# sourceMappingURL=providerDetection.js.map