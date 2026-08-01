/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AuthType } from '../core/contentGenerator.js';
import type { ModelConfig } from './types.js';
type ContentGeneratorConfig = import('../core/contentGenerator.js').ContentGeneratorConfig;
/**
 * Field keys for model-scoped generation config.
 *
 * Kept in a small standalone module to avoid circular deps. The `import('...')`
 * usage is type-only and does not emit runtime imports.
 */
export declare const MODEL_GENERATION_CONFIG_FIELDS: readonly ["samplingParams", "timeout", "maxRetries", "retryErrorCodes", "enableCacheControl", "forceGlobalCacheScope", "schemaCompliance", "reasoning", "contextWindowSize", "customHeaders", "extra_body", "modalities", "splitToolMedia", "toolResultContentFormat"];
export type ModelGenerationConfigField = (typeof MODEL_GENERATION_CONFIG_FIELDS)[number];
/**
 * Type-safe setter for dynamic field assignment on ContentGeneratorConfig.
 * Eliminates the need for `as any` when iterating over MODEL_GENERATION_CONFIG_FIELDS.
 */
export declare function setGenerationConfigField<T extends ContentGeneratorConfig | Partial<ContentGeneratorConfig>>(config: T, field: ModelGenerationConfigField, value: unknown): void;
/**
 * Credential-related fields that are part of ContentGeneratorConfig
 * but not ModelGenerationConfig.
 */
export declare const CREDENTIAL_FIELDS: readonly ["model", "apiKey", "apiKeyEnvKey", "baseUrl"];
/**
 * All provider-sourced fields that need to be tracked for source attribution
 * and cleared when switching from provider to manual credentials.
 */
export declare const PROVIDER_SOURCED_FIELDS: readonly ["model", "apiKey", "apiKeyEnvKey", "baseUrl", "samplingParams", "timeout", "maxRetries", "retryErrorCodes", "enableCacheControl", "forceGlobalCacheScope", "schemaCompliance", "reasoning", "contextWindowSize", "customHeaders", "extra_body", "modalities", "splitToolMedia", "toolResultContentFormat"];
/**
 * Environment variable mappings per authType.
 */
export interface AuthEnvMapping {
    apiKey: string[];
    baseUrl: string[];
    model: string[];
}
export declare const AUTH_ENV_MAPPINGS: {
    readonly openai: {
        readonly apiKey: ["OPENAI_API_KEY", "DEEPSEEK_API_KEY", "GROQ_API_KEY", "MISTRAL_API_KEY", "OPENROUTER_API_KEY", "TOGETHER_API_KEY", "FIREWORKS_API_KEY", "XAI_API_KEY", "PERPLEXITY_API_KEY", "COHERE_API_KEY", "DASHSCOPE_API_KEY", "MOONSHOT_API_KEY", "AZURE_OPENAI_API_KEY", "OLLAMA_API_KEY"];
        readonly baseUrl: ["OPENAI_BASE_URL"];
        readonly model: ["OPENAI_MODEL", "HOPCODE_MODEL"];
    };
    readonly anthropic: {
        readonly apiKey: ["ANTHROPIC_API_KEY"];
        readonly baseUrl: ["ANTHROPIC_BASE_URL"];
        readonly model: ["ANTHROPIC_MODEL"];
    };
    readonly gemini: {
        readonly apiKey: ["GEMINI_API_KEY"];
        readonly baseUrl: [];
        readonly model: ["GEMINI_MODEL"];
    };
    readonly 'vertex-ai': {
        readonly apiKey: ["GOOGLE_API_KEY"];
        readonly baseUrl: [];
        readonly model: ["GOOGLE_MODEL"];
    };
    readonly 'hopcode-oauth': {
        readonly apiKey: [];
        readonly baseUrl: [];
        readonly model: [];
    };
};
export declare const DEFAULT_MODELS: Partial<Record<AuthType, string>>;
/**
 * Hard-coded HopCode OAuth models that are always available.
 * These cannot be overridden by user configuration.
 */
export declare const HOPCODE_OAUTH_MODELS: ModelConfig[];
/**
 * Derive allowed models from HOPCODE_OAUTH_MODELS for authorization.
 * This ensures single source of truth (SSOT).
 */
export declare const HOPCODE_OAUTH_ALLOWED_MODELS: readonly string[];
export {};
