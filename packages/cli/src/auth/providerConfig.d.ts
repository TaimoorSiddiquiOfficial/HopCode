/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AuthType, InputModalities, ProviderModelConfig } from '@hoptrendy/hopcode-core';
import type { ProviderInstallPlan } from './types.js';
export interface ModelSpec {
    id: string;
    contextWindowSize?: number;
    enableThinking?: boolean;
    modalities?: InputModalities;
    description?: string;
}
export interface BaseUrlOption {
    id: string;
    label: string;
    url: string;
    documentationUrl?: string;
    apiKeyUrl?: string;
}
export interface ProviderConfig {
    id: string;
    label: string;
    description: string;
    /** Always fixed for current providers. */
    protocol: AuthType;
    /**
     * - `string`            → fixed, skip UI step
     * - `BaseUrlOption[]`   → show option selector
     * - `undefined`         → user types freely (custom provider)
     */
    baseUrl?: string | BaseUrlOption[];
    /** Environment variable key, or a function to generate one. */
    envKey: string | ((protocol: AuthType, baseUrl: string) => string);
    /** API key acquisition method. */
    authMethod: 'input' | 'oauth';
    /**
     * - `ModelSpec[]`  → model definitions with optional per-model metadata
     * - `undefined`    → user must type all model IDs (custom provider)
     */
    models?: ModelSpec[];
    /**
     * Whether the user can add/remove models in the setup UI.
     * - `true`  → show model editing step; known IDs inherit their ModelSpec metadata
     * - `false` → skip model step; use models as-is (e.g. Coding Plan)
     * Defaults to `false` when `models` is set, ignored when `models` is `undefined`.
     */
    modelsEditable?: boolean;
    /** Display name prefix for model entries, or a function of baseUrl. */
    modelNamePrefix: string | ((baseUrl: string) => string);
    /**
     * Protocol options for manual selection (custom provider only).
     * If provided with >1 entry, shows a protocol selection step.
     */
    protocolOptions?: AuthType[];
    /** Show advanced config step (thinking, modalities). */
    showAdvancedConfig?: boolean;
    /** Validate the API key before submission. */
    validateApiKey?: (key: string, baseUrl: string) => string | null;
    /** API key input placeholder. */
    apiKeyPlaceholder?: string;
    /** Documentation URL for the provider. */
    documentationUrl?: string | ((baseUrl: string) => string);
    /**
     * Custom ownership check — identifies models belonging to this provider.
     * Auto-derived from `envKey` (string) + `modelNamePrefix` (string) when omitted.
     * Only needed for providers with function-typed envKey/prefix or non-standard logic.
     */
    ownsModel?: (model: ProviderModelConfig) => boolean;
    /**
     * UI grouping hint — used by AuthDialog to organize providers into sections.
     * Providers with the same `uiGroup` appear together under a shared heading.
     */
    uiGroup?: string;
    /** Step label overrides for the UI. */
    uiLabels?: {
        flowTitle?: string;
        baseUrlStepTitle?: string;
    };
}
export interface ProviderSetupInputs {
    /** Override protocol (only for custom provider). Defaults to config.protocol. */
    protocol?: AuthType;
    baseUrl: string;
    apiKey: string;
    modelIds: string[];
    /** Pre-built model configs (e.g. OpenRouter fetches models from API). Overrides modelIds. */
    prebuiltModels?: ProviderModelConfig[];
    advancedConfig?: {
        enableThinking?: boolean;
        multimodal?: InputModalities;
        contextWindowSize?: number;
        maxTokens?: number;
    };
}
export declare function resolveOwnsModel(config: ProviderConfig): ((model: ProviderModelConfig) => boolean) | undefined;
/**
 * Returns the provider's metadata key (same as `config.id`).
 * Only defined for providers with a static `models` list.
 */
export declare function resolveMetadataKey(config: ProviderConfig): string | undefined;
/**
 * Namespace prefix used for all provider metadata in settings.
 * e.g. `providerMetadata.coding-plan.version`
 */
export declare const PROVIDER_METADATA_NS = "providerMetadata";
export declare function buildInstallPlan(config: ProviderConfig, inputs: ProviderSetupInputs): ProviderInstallPlan;
export declare function computeModelListVersion(models: ProviderModelConfig[]): string;
export declare function resolveBaseUrl(config: ProviderConfig, selectedBaseUrl?: string): string;
export declare function getDefaultModelIds(config: ProviderConfig): string[];
export declare function shouldShowStep(config: ProviderConfig, step: 'protocol' | 'baseUrl' | 'apiKey' | 'models' | 'advancedConfig'): boolean;
export declare function providerMatchesCredentials(config: ProviderConfig, baseUrl: string | undefined, envKey: string | undefined): boolean;
export declare function buildProviderTemplate(config: ProviderConfig, baseUrl?: string): ProviderModelConfig[];
