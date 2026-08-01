/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type ProviderConfig, PROVIDER_REGISTRY, getProvider, detectActiveProvider } from './registry.js';
export type { ProviderConfig };
export { PROVIDER_REGISTRY, getProvider, detectActiveProvider };
/**
 * Prompts the user for an API key with masked input.
 * Uses readline-based approach so paste works correctly on all platforms.
 *
 * @param providerLabel - Provider name shown in the prompt
 */
export declare function promptForApiKey(providerLabel: string): Promise<string>;
/**
 * Handles authentication for a third-party API key provider.
 *
 * Follows the same pattern as handleCodePlanAuth:
 * 1. Prompt for API key (if not provided and required)
 * 2. Set process.env immediately so refreshAuth can read it
 * 3. Persist to settings.env, modelProviders, selectedType, model.name
 * 4. Call config.refreshAuth to validate the setup
 *
 * @param providerId - Provider ID from PROVIDER_REGISTRY
 * @param options - Optional pre-supplied API key (e.g. from --key CLI flag)
 * @param overrideBaseUrl - Override the provider's default baseUrl (used by ollama-local --host)
 */
export declare function handleApiKeyAuth(providerId: string, options?: {
    apiKey?: string;
}, overrideBaseUrl?: string): Promise<void>;
/**
 * Dedicated auth handler for Ollama Local.
 *
 * Differs from the generic `handleApiKeyAuth` path by:
 * - Accepting an optional `--host` flag to override the default localhost endpoint
 * - Persisting the host as `OLLAMA_HOST` so `ollamaService.ts` picks it up
 * - Running a connectivity check after configuration
 *
 * @param options.host - Custom host (e.g. http://192.168.1.50:11434)
 */
export declare function handleOllamaLocalAuth(options?: {
    host?: string;
}): Promise<void>;
