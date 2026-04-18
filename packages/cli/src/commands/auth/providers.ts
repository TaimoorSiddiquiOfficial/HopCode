/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AI SDK provider registry for HopCode authentication.
 *
 * Each provider entry drives:
 * - The interactive `hopcode auth` selector
 * - The `hopcode auth <provider>` subcommands
 * - The settings written to the user's settings.json
 *
 * Design constraints (butterfly-effect protection):
 * - We NEVER add new AuthType enum values in core — only the existing 5 are used.
 * - All OpenAI-compatible providers store selectedType = 'openai' (AuthType.USE_OPENAI).
 * - Anthropic stores selectedType = 'anthropic' (AuthType.USE_ANTHROPIC).
 * - Gemini stores selectedType = 'gemini' (AuthType.USE_GEMINI).
 * - All providers store a modelProviders.openai (or .anthropic/.gemini) entry so that
 *   validateAuthMethod can find the correct envKey via findModelConfig().
 */

import {
  AuthType,
  getErrorMessage,
  type Config,
  type ProviderModelConfig as ModelConfig,
} from '@hoptrendy/hopcode-core';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { backupSettingsFile } from '../../utils/settingsUtils.js';
import { loadSettings, type LoadedSettings } from '../../config/settings.js';
import { loadCliConfig } from '../../config/config.js';
import type { CliArgs } from '../../config/config.js';
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
    defaultModel:
      'fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct',
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
    description: 'Local models via Ollama at localhost:11434 · No API key needed',
    envKey: 'OLLAMA_API_KEY',
    baseUrl: 'http://localhost:11434/v1',
    authType: AuthType.USE_OPENAI,
    defaultModel: 'llama3.2',
    requiresApiKey: false,
  },
  {
    id: 'ollama-cloud',
    label: 'Ollama Cloud',
    description: 'DeepSeek-V3, Kimi K2, GPT-OSS cloud models · Requires OLLAMA_API_KEY',
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
  if (!modelProvidersEntry || modelProvidersEntry.length === 0) return undefined;
  const first = modelProvidersEntry[0];
  if (!first) return undefined;
  // Skip Coding Plan configs
  if (isCodingPlanConfig(first.baseUrl, first.envKey)) return undefined;
  // Match by envKey + baseUrl combination
  return PROVIDER_REGISTRY.find(
    (p) => p.envKey === first.envKey && p.baseUrl === first.baseUrl,
  );
}

/**
 * Prompts the user for an API key with masked input.
 * @param providerLabel - Provider name shown in the prompt
 */
export async function promptForApiKey(providerLabel: string): Promise<string> {
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdout.write(t('Enter your {{provider}} API key: ', { provider: providerLabel }));

  const wasRaw = stdin.isRaw;
  if (stdin.setRawMode) {
    stdin.setRawMode(true);
  }
  stdin.resume();

  return new Promise<string>((resolve, reject) => {
    let input = '';

    const onData = (chunk: string) => {
      for (const char of chunk) {
        switch (char) {
          case '\r':
          case '\n':
            stdin.removeListener('data', onData);
            if (stdin.setRawMode) stdin.setRawMode(wasRaw);
            stdout.write('\n');
            resolve(input);
            return;
          case '\x03':
            stdin.removeListener('data', onData);
            if (stdin.setRawMode) stdin.setRawMode(wasRaw);
            stdout.write('^C\n');
            reject(new Error('Interrupted'));
            return;
          case '\x08':
          case '\x7F':
            if (input.length > 0) {
              input = input.slice(0, -1);
              stdout.write('\x1B[D \x1B[D');
            }
            break;
          default:
            input += char;
            stdout.write('*');
            break;
        }
      }
    };

    stdin.on('data', onData);
  });
}

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
 */
export async function handleApiKeyAuth(
  providerId: string,
  options: { apiKey?: string } = {},
): Promise<void> {
  const provider = getProvider(providerId);
  if (!provider) {
    writeStderrLine(t('Unknown provider: {{id}}', { id: providerId }));
    process.exit(1);
  }

  try {
    const settings = loadSettings();

    const minimalArgv: CliArgs = {
      query: undefined,
      model: undefined,
      sandbox: undefined,
      sandboxImage: undefined,
      debug: undefined,
      prompt: undefined,
      promptInteractive: undefined,
      yolo: undefined,
      approvalMode: undefined,
      telemetry: undefined,
      checkpointing: undefined,
      telemetryTarget: undefined,
      telemetryOtlpEndpoint: undefined,
      telemetryOtlpProtocol: undefined,
      telemetryLogPrompts: undefined,
      telemetryOutfile: undefined,
      allowedMcpServerNames: undefined,
      allowedTools: undefined,
      acp: undefined,
      experimentalAcp: undefined,
      experimentalLsp: undefined,
      extensions: [],
      listExtensions: undefined,
      openaiLogging: undefined,
      openaiApiKey: undefined,
      openaiBaseUrl: undefined,
      openaiLoggingDir: undefined,
      proxy: undefined,
      includeDirectories: undefined,
      tavilyApiKey: undefined,
      googleApiKey: undefined,
      googleSearchEngineId: undefined,
      webSearchDefault: undefined,
      screenReader: undefined,
      inputFormat: undefined,
      outputFormat: undefined,
      includePartialMessages: undefined,
      chatRecording: undefined,
      continue: undefined,
      resume: undefined,
      sessionId: undefined,
      maxSessionTurns: undefined,
      coreTools: undefined,
      excludeTools: undefined,
      authType: undefined,
      channel: undefined,
      systemPrompt: undefined,
      appendSystemPrompt: undefined,
    };

    const config = await loadCliConfig(
      settings.merged,
      minimalArgv,
      process.cwd(),
      [],
      {
        userHooks: settings.getUserHooks(),
        projectHooks: settings.getProjectHooks(),
      },
    );

    // Determine API key
    let apiKey = options.apiKey;
    if (!apiKey) {
      if (provider.requiresApiKey) {
        apiKey = await promptForApiKey(provider.label);
      } else {
        // Ollama local uses a dummy key so the OpenAI SDK doesn't complain
        apiKey = 'ollama';
      }
    }

    writeStdoutLine(
      t('Configuring {{provider}} authentication...', { provider: provider.label }),
    );

    const authTypeScope = getPersistScopeForModelSelection(settings);

    // Backup before modification
    const settingsFile = settings.forScope(authTypeScope);
    backupSettingsFile(settingsFile.path);

    // 1. Persist API key to settings.env and process.env
    if (provider.envKey) {
      settings.setValue(authTypeScope, `env.${provider.envKey}`, apiKey);
      process.env[provider.envKey] = apiKey;
    }

    // 2. Build the model provider config entry
    const newModelConfig: ModelConfig = {
      id: provider.defaultModel,
      name: `[${provider.label}] ${provider.defaultModel}`,
      envKey: provider.envKey || undefined,
      ...(provider.baseUrl ? { baseUrl: provider.baseUrl } : {}),
    };

    // 3. Persist to the correct modelProviders bucket
    //    For USE_ANTHROPIC we put config under 'anthropic'; all others under 'openai'
    const modelProvidersKey =
      provider.authType === AuthType.USE_ANTHROPIC
        ? AuthType.USE_ANTHROPIC
        : provider.authType === AuthType.USE_GEMINI
          ? undefined // Gemini doesn't use modelProviders
          : AuthType.USE_OPENAI;

    if (modelProvidersKey) {
      const existingConfigs =
        ((settings.merged.modelProviders as Record<string, ModelConfig[]>) ?? {})[
          modelProvidersKey
        ] ?? [];

      // Remove any existing entry with the same envKey+baseUrl to keep settings clean
      const filteredConfigs = existingConfigs.filter(
        (c) => !(c.envKey === provider.envKey && c.baseUrl === provider.baseUrl),
      );

      const updatedConfigs = [newModelConfig, ...filteredConfigs];
      settings.setValue(
        authTypeScope,
        `modelProviders.${modelProvidersKey}`,
        updatedConfigs,
      );

      // Set model.name to the default model
      settings.setValue(authTypeScope, 'model.name', provider.defaultModel);
    }

    // 4. Set selectedType
    settings.setValue(
      authTypeScope,
      'security.auth.selectedType',
      provider.authType,
    );

    // 5. Refresh auth to validate the configuration
    await config.refreshAuth(provider.authType);

    writeStdoutLine(
      t('✓ {{provider}} authentication configured successfully!', {
        provider: provider.label,
      }),
    );
    if (!provider.requiresApiKey) {
      writeStdoutLine(
        t(
          '  Ollama running at {{url}} — start Ollama first with `ollama serve`',
          { url: provider.baseUrl ?? 'http://localhost:11434' },
        ),
      );
    }
    writeStdoutLine(
      t('  Default model: {{model}}', { model: provider.defaultModel }),
    );
    writeStdoutLine(
      t('  Switch model anytime with: hopcode -m <model-id>'),
    );
    process.exit(0);
  } catch (error) {
    writeStderrLine(
      t('Failed to configure {{provider}}: {{error}}', {
        provider: provider.label,
        error: getErrorMessage(error),
      }),
    );
    process.exit(1);
  }
}
