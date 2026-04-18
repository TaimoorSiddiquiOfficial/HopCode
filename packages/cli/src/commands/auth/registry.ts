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
import { isCodingPlanConfig } from '../../constants/codingPlan.js';

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
}

/**
 * Registry of all supported third-party AI providers.
 * Ordering here determines the display order in `hopcode auth` interactive selector.
 */
export const PROVIDER_REGISTRY: readonly ProviderConfig[] = [
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o, o3 · Requires OPENAI_API_KEY',
    envKey: 'OPENAI_API_KEY',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'gpt-4o',
    requiresApiKey: true,
  },
  {
    id: 'anthropic',
    label: 'Anthropic',
    description: 'Claude Opus 4.5, Sonnet 4.5 · Requires ANTHROPIC_API_KEY',
    envKey: 'ANTHROPIC_API_KEY',
    baseUrl: 'https://api.anthropic.com',
    authType: AuthType.USE_ANTHROPIC,
    defaultModel: 'claude-opus-4-5',
    requiresApiKey: true,
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    description: 'Gemini 2.5 Pro · Requires GEMINI_API_KEY',
    envKey: 'GEMINI_API_KEY',
    authType: AuthType.USE_GEMINI,
    defaultModel: 'gemini-2.5-pro',
    requiresApiKey: true,
  },
  {
    id: 'deepseek',
    label: 'DeepSeek',
    description: 'DeepSeek-V3, R1 · Requires DEEPSEEK_API_KEY',
    envKey: 'DEEPSEEK_API_KEY',
    baseUrl: 'https://api.deepseek.com/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'deepseek/deepseek-chat',
    requiresApiKey: true,
  },
  {
    id: 'groq',
    label: 'Groq',
    description: 'Llama, Mistral (fast inference) · Requires GROQ_API_KEY',
    envKey: 'GROQ_API_KEY',
    baseUrl: 'https://api.groq.com/openai/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'groq/llama-3.3-70b-versatile',
    requiresApiKey: true,
  },
  {
    id: 'mistral',
    label: 'Mistral AI',
    description: 'Mistral Large, Codestral · Requires MISTRAL_API_KEY',
    envKey: 'MISTRAL_API_KEY',
    baseUrl: 'https://api.mistral.ai/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'mistral/mistral-large-latest',
    requiresApiKey: true,
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    description: 'Unified API for 200+ models · Requires OPENROUTER_API_KEY',
    envKey: 'OPENROUTER_API_KEY',
    baseUrl: 'https://openrouter.ai/api/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'openrouter/auto',
    requiresApiKey: true,
  },
  {
    id: 'togetherai',
    label: 'Together AI',
    description: 'Open source models · Requires TOGETHER_API_KEY',
    envKey: 'TOGETHER_API_KEY',
    baseUrl: 'https://api.together.xyz/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'togetherai/meta-llama/Llama-3-70b-chat-hf',
    requiresApiKey: true,
  },
  {
    id: 'fireworks',
    label: 'Fireworks AI',
    description: 'Fast open source inference · Requires FIREWORKS_API_KEY',
    envKey: 'FIREWORKS_API_KEY',
    baseUrl: 'https://api.fireworks.ai/openai/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct',
    requiresApiKey: true,
  },
  {
    id: 'xai',
    label: 'xAI',
    description: 'Grok 3 · Requires XAI_API_KEY',
    envKey: 'XAI_API_KEY',
    baseUrl: 'https://api.x.ai/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'xai/grok-3-mini',
    requiresApiKey: true,
  },
  {
    id: 'perplexity',
    label: 'Perplexity',
    description: 'Search-augmented AI · Requires PERPLEXITY_API_KEY',
    envKey: 'PERPLEXITY_API_KEY',
    baseUrl: 'https://api.perplexity.ai',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'perplexity/sonar',
    requiresApiKey: true,
  },
  {
    id: 'cohere',
    label: 'Cohere',
    description: 'Command R+ · Requires COHERE_API_KEY',
    envKey: 'COHERE_API_KEY',
    baseUrl: 'https://api.cohere.ai/compatibility/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'cohere/command-r-plus',
    requiresApiKey: true,
  },
  {
    id: 'huggingface',
    label: 'HuggingFace',
    description: 'Thousands of open models · Requires HF_TOKEN',
    envKey: 'HF_TOKEN',
    baseUrl: 'https://api-inference.huggingface.co/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'huggingface/meta-llama/Llama-3.1-8B-Instruct',
    requiresApiKey: true,
  },
  {
    id: 'replicate',
    label: 'Replicate',
    description: 'Cloud ML models · Requires REPLICATE_API_TOKEN',
    envKey: 'REPLICATE_API_TOKEN',
    baseUrl: 'https://openai-proxy.replicate.com/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'replicate/meta/meta-llama-3-70b-instruct',
    requiresApiKey: true,
  },
  {
    id: 'ollama-local',
    label: 'Ollama (Local)',
    description:
      'Local models via Ollama at localhost:11434 · No API key needed',
    envKey: 'OLLAMA_API_KEY',
    baseUrl: 'http://localhost:11434/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'llama3.2',
    requiresApiKey: false,
  },
  {
    id: 'ollama-cloud',
    label: 'Ollama Cloud',
    description:
      'DeepSeek-V3, Kimi K2, GPT-OSS cloud models · Requires OLLAMA_API_KEY',
    envKey: 'OLLAMA_API_KEY',
    baseUrl: 'https://ollama.com/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'deepseek-v3.1:671b-cloud',
    requiresApiKey: true,
  },
];

/**
 * Look up a provider from the registry by ID.
 */
export function getProvider(id: string): ProviderConfig | undefined {
  return PROVIDER_REGISTRY.find((p) => p.id === id);
}

/**
 * Identify which registry provider is currently active based on modelProviders config.
 * Returns the provider config if recognized, or undefined if it's a Coding Plan or unknown.
 */
export function detectActiveProvider(
  modelProvidersEntry: ModelConfig[] | undefined,
): ProviderConfig | undefined {
  if (!modelProvidersEntry || modelProvidersEntry.length === 0)
    return undefined;
  const first = modelProvidersEntry[0];
  if (!first) return undefined;
  if (isCodingPlanConfig(first.baseUrl, first.envKey)) return undefined;
  return PROVIDER_REGISTRY.find(
    (p) => p.envKey === first.envKey && p.baseUrl === first.baseUrl,
  );
}
