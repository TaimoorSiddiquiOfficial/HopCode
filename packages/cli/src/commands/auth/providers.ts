/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * AI SDK provider auth handlers for HopCode.
 *
 * PROVIDER_REGISTRY, ProviderConfig, getProvider, and detectActiveProvider now
 * live in registry.ts (pure data, no heavy imports) to break the circular
 * dependency: ModelDialog → providers → config → auth → providers (TDZ crash).
 *
 * This module re-exports them for backward compatibility and adds the heavy
 * auth-handling functions (handleApiKeyAuth, promptForApiKey) that require
 * loadCliConfig from config.ts.
 */

import {
  AuthType,
  getErrorMessage,
  type ProviderModelConfig as ModelConfig,
} from '@hoptrendy/hopcode-core';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { promptForSecretInput } from '../../utils/promptUtils.js';
import { t } from '../../i18n/index.js';
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { backupSettingsFile } from '../../utils/settingsUtils.js';
import { loadSettings } from '../../config/settings.js';
import { loadCliConfig } from '../../config/config.js';
import type { CliArgs } from '../../config/config.js';

// Re-export registry data for backward compatibility.
// Source of truth: registry.ts (no circular imports).
import {
  type ProviderConfig,
  PROVIDER_REGISTRY,
  getProvider,
  detectActiveProvider,
} from './registry.js';
export type { ProviderConfig };
export { PROVIDER_REGISTRY, getProvider, detectActiveProvider };

/**
 * Prompts the user for an API key with masked input.
 * Uses readline-based approach so paste works correctly on all platforms.
 *
 * @param providerLabel - Provider name shown in the prompt
 */
export async function promptForApiKey(providerLabel: string): Promise<string> {
  return promptForSecretInput(
    t('Enter your {{provider}} API key: ', { provider: providerLabel }),
  );
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
      mcpConfig: undefined,
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
      bare: undefined,
      disabledSlashCommands: undefined,
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
      t('Configuring {{provider}} authentication...', {
        provider: provider.label,
      }),
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
        ((settings.merged.modelProviders as Record<string, ModelConfig[]>) ??
          {})[modelProvidersKey] ?? [];

      // Remove any existing entry with the same envKey+baseUrl to keep settings clean
      const filteredConfigs = existingConfigs.filter(
        (c) =>
          !(c.envKey === provider.envKey && c.baseUrl === provider.baseUrl),
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
    writeStdoutLine(t('  Switch model anytime with: hopcode -m <model-id>'));
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
