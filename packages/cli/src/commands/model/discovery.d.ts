/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Generic live model discovery for any OpenAI-compatible provider.
 *
 * Inspired by OpenClaude's listOpenAICompatibleModels (providerDiscovery.ts).
 * Fetches GET /v1/models (or /models if /v1 is already in the baseUrl),
 * filters out non-chat entries, and returns categorised results.
 *
 * Usage:
 *   const cats = await fetchOpenAICompatibleModels('https://api.groq.com/openai/v1', apiKey);
 *   const cats = await fetchOpenRouterModels(apiKey);  // free-tier aware
 */
import type { ModelCategory } from './catalog.js';
/**
 * Fetch the live model list from any OpenAI-compatible provider.
 *
 * Returns a ModelCategory array ready for the interactive selector,
 * or null if the request failed / returned no usable models.
 *
 * @param baseUrl   - Provider base URL (e.g. https://api.groq.com/openai/v1)
 * @param apiKey    - Bearer token for authentication
 * @param timeoutMs - How long to wait before giving up
 */
export declare function fetchOpenAICompatibleModels(baseUrl: string, apiKey?: string, timeoutMs?: number): Promise<ModelCategory[] | null>;
/**
 * Fetch live model list from OpenRouter, splitting free-tier (`:free` suffix)
 * models into a dedicated category shown first.
 *
 * OpenRouter exposes 300+ models; many have a `:free` variant that requires
 * no credits. Surfacing them separately makes it easy for users to get started.
 *
 * @param apiKey    - OPENROUTER_API_KEY (optional — free models work without one)
 * @param timeoutMs - How long to wait before giving up
 */
export declare function fetchOpenRouterModels(apiKey?: string, timeoutMs?: number): Promise<ModelCategory[] | null>;
