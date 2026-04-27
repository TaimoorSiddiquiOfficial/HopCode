/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Shared provider detection utility.
 *
 * Centralises the logic for resolving which AI provider is currently active,
 * what its display label is, and which settings key it uses.
 *
 * Previously this logic was duplicated between model/index.ts and provider.ts.
 * Fixes a latent bug in model/index.ts that passed the full settings object
 * to detectActiveProvider instead of the modelProviders.openai array.
 */

import type { loadSettings } from '../config/settings.js';
import { detectActiveProvider } from '../commands/auth/registry.js';
import type { ProviderModelConfig as ModelConfig } from '@hoptrendy/hopcode-core';
import { isCodingPlanConfig } from '../constants/codingPlan.js';

export interface ActiveProviderInfo {
  providerId: string;
  providerLabel: string;
  currentModel: string;
  authTypeKey: 'openai' | 'anthropic' | 'gemini';
  baseUrl?: string;
}

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
export function resolveActiveProvider(
  settings: ReturnType<typeof loadSettings>,
): ActiveProviderInfo | null {
  const allSettings = settings.merged;
  const authType = allSettings?.security?.auth?.selectedType as
    | string
    | undefined;
  if (!authType) return null;

  const modelName = (allSettings?.model?.name as string | undefined) ?? '';

  // Extract the openai providers array from settings (not the full settings object).
  const openaiProviders =
    (allSettings?.modelProviders?.openai as
      | Array<{ envKey?: string; baseUrl?: string; id?: string }>
      | undefined) ?? [];

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
  const regProvider = detectActiveProvider(
    openaiProviders as ModelConfig[] | undefined,
  );
  if (regProvider) {
    const atKey =
      regProvider.authType === 'anthropic'
        ? ('anthropic' as const)
        : regProvider.authType === 'gemini'
          ? ('gemini' as const)
          : ('openai' as const);
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
    const anthropicProviders =
      (allSettings?.modelProviders?.anthropic as
        | Array<{ envKey?: string; baseUrl?: string }>
        | undefined) ?? [];
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
