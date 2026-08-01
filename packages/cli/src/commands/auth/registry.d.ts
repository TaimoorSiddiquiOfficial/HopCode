/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Provider registry — pure data, no heavy imports.
 *
 * Kept in its own file so that UI components (e.g. ModelDialog) can import
 * PROVIDER_REGISTRY without pulling in the full providers.ts module, which
 * transitively imports config.ts → auth.ts → providers.ts, creating a
 * circular dependency that leaves PROVIDER_REGISTRY undefined at runtime.
 */
import { AuthType } from '@hoptrendy/hopcode-core';
import type { ProviderModelConfig as ModelConfig } from '@hoptrendy/hopcode-core';
/**
 * Configuration for a third-party AI provider.
 */
export interface ProviderConfig {
    /** Unique identifier — used as the yargs subcommand name and for lookup */
    id: string;
    /** Human-readable display label */
    label: string;
    /** Short description shown in the interactive selector */
    description: string;
    /** Environment variable that holds the API key (empty string if no key needed) */
    envKey: string;
    /** Base URL for OpenAI-compatible providers (omit for native AuthType providers) */
    baseUrl?: string;
    /** Which core AuthType to set as security.auth.selectedType */
    authType: AuthType;
    /** Default model ID to configure in modelProviders */
    defaultModel: string;
    /** Whether the user must supply an API key (false for Ollama local) */
    requiresApiKey: boolean;
    /**
     * When true the model command will attempt to fetch the live model list
     * from the provider's /v1/models endpoint rather than using the static catalog.
     * Only set for providers whose model list changes frequently or is too large
     * to maintain statically (e.g. OpenRouter 300+, Groq, Mistral).
     */
    liveModels?: boolean;
}
/**
 * Registry of all supported third-party AI providers.
 * Ordering here determines the display order in `hopcode auth` interactive selector.
 */
export declare const PROVIDER_REGISTRY: readonly ProviderConfig[];
/**
 * Look up a provider from the registry by ID.
 */
export declare function getProvider(id: string): ProviderConfig | undefined;
/**
 * Identify which registry provider is currently active based on modelProviders config.
 * Returns the provider config if recognized, or undefined if it's a Coding Plan or unknown.
 */
export declare function detectActiveProvider(modelProvidersEntry: ModelConfig[] | undefined): ProviderConfig | undefined;
