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
 * Run a quick connectivity check against an Ollama endpoint.
 * Returns a human-readable status line, never throws.
 */
async function checkOllamaConnectivity(
  baseUrl: string,
  apiKey?: string,
): Promise<string> {
  const rootUrl = baseUrl.replace(/\/v1\/?$/, '');
  const headers: Record<string, string> = {};
  if (apiKey && apiKey !== 'ollama') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  try {
    const res = await fetch(`${rootUrl}/api/tags`, {
      headers,
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const data = (await res.json()) as { models?: unknown[] };
      const count = data.models?.length ?? 0;
      return count > 0
        ? `✓ Connected · ${count} model${count === 1 ? '' : 's'} available`
        : '✓ Connected · No models installed yet (run: ollama pull llama3.2)';
    }
    if (res.status === 401 || res.status === 403) {
      return `✕ Auth error (${res.status}) — check OLLAMA_CLOUD_API_KEY`;
    }
    return `✕ HTTP ${res.status} from Ollama endpoint`;
  } catch {
    const isLocal = /localhost|127\.0\.0\.1/.test(rootUrl);
    if (isLocal) {
      return '✕ Cannot connect — start Ollama with: ollama serve';
    }
    return `✕ Cannot reach Ollama Cloud at ${rootUrl} (check your network or API key)`;
  }
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
 * @param overrideBaseUrl - Override the provider's default baseUrl (used by ollama-local --host)
 */
export async function handleApiKeyAuth(
  providerId: string,
  options: { apiKey?: string } = {},
  overrideBaseUrl?: string,
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
      izn: undefined,
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
      maxWallTime: undefined,
      maxToolCalls: undefined,
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
        if (providerId === 'ollama-cloud') {
          writeStdoutLine(
            t('  Get your API key at: https://ollama.com → Account → API Keys'),
          );
        }
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
    const effectiveBaseUrl = overrideBaseUrl ?? provider.baseUrl;
    const newModelConfig: ModelConfig = {
      id: provider.defaultModel,
      name: `[${provider.label}] ${provider.defaultModel}`,
      envKey: provider.envKey || undefined,
      ...(effectiveBaseUrl ? { baseUrl: effectiveBaseUrl } : {}),
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
          !(c.envKey === provider.envKey && c.baseUrl === effectiveBaseUrl),
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

    // Run a quick connectivity check for Ollama providers
    if (providerId.startsWith('ollama')) {
      const testUrl = effectiveBaseUrl ?? 'http://localhost:11434/v1';
      const cloudApiKey = providerId === 'ollama-cloud' ? apiKey : undefined;
      const status = await checkOllamaConnectivity(testUrl, cloudApiKey);
      writeStdoutLine(`  ${status}`);
    } else if (!provider.requiresApiKey) {
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
export async function handleOllamaLocalAuth(
  options: { host?: string } = {},
): Promise<void> {
  const { host } = options;

  // Normalise the host: ensure it has a scheme and no trailing slash
  let overrideBaseUrl: string | undefined;
  if (host) {
    const normalised = host.startsWith('http') ? host : `http://${host}`;
    overrideBaseUrl = `${normalised.replace(/\/$/, '')}/v1`;
    // Persist the host override to OLLAMA_HOST so the service layer uses it
    process.env['OLLAMA_HOST'] = normalised.replace(/\/$/, '');
  }

  return handleApiKeyAuth('ollama-local', {}, overrideBaseUrl);
}
