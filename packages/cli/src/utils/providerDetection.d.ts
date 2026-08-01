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
export declare function resolveActiveProvider(settings: ReturnType<typeof loadSettings>): ActiveProviderInfo | null;
