/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
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
import { applyProviderInstallPlan } from '../../auth/install/applyProviderInstallPlan.js';
import { codingPlanProvider } from '../../auth/providers/alibaba/codingPlan.js';
import { createOpenRouterProviderInstallPlan } from '../../auth/providers/oauth/openrouter.js';
import {
  buildInstallPlan,
  resolveBaseUrl,
  resolveMetadataKey,
  getDefaultModelIds,
  PROVIDER_METADATA_NS,
} from '../../auth/providerConfig.js';
import { findProviderByCredentials } from '../../auth/allProviders.js';
import { loadSettings, type LoadedSettings } from '../../config/settings.js';
import { loadCliConfig } from '../../config/config.js';
import type { CliArgs } from '../../config/config.js';
import { InteractiveSelector } from './interactiveSelector.js';
import {
  createOpenRouterOAuthSession,
  isOpenRouterConfig,
  OPENROUTER_ENV_KEY,
  runOpenRouterOAuthLogin,
} from '../../auth/providers/oauth/openrouterOAuth.js';

function formatElapsedTime(startMs: number): string {
  return `${((Date.now() - startMs) / 1000).toFixed(2)}s`;
}

interface QwenAuthOptions {
  baseUrl?: string;
  key?: string;
}

interface MergedSettingsWithCodingPlan {
  security?: {
    auth?: {
      selectedType?: string;
      apiKey?: string;
      baseUrl?: string;
    };
  };
  model?: {
    name?: string;
  };
  modelProviders?: Record<string, ModelConfig[]>;
  env?: Record<string, string>;
}

/**
 * Handles the authentication process based on the specified command and options
 */
export async function handleQwenAuth(
  command: 'qwen-oauth' | 'coding-plan' | 'openrouter',
  options: QwenAuthOptions,
) {
  try {
    const settings = loadSettings();

    // Create a minimal argv for config loading
    const minimalArgv: CliArgs = {
      query: undefined,
      model: undefined,
      sandbox: undefined,
      sandboxImage: undefined,
      debug: undefined,
      prompt: undefined,
      promptInteractive: undefined,
      izn: undefined,
      bare: undefined,
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
      disabledSlashCommands: undefined,
      authType: undefined,
      channel: undefined,
      systemPrompt: undefined,
      appendSystemPrompt: undefined,
    };

    // Create a minimal config to access settings and storage
    const config = await loadCliConfig(
      settings.merged,
      minimalArgv,
      process.cwd(),
      [], // No extensions for auth command
      // Pass separated hooks for proper source attribution
      {
        userHooks: settings.getUserHooks(),
        projectHooks: settings.getProjectHooks(),
      },
    );

    if (command === 'qwen-oauth') {
      await handleQwenOAuth(config, settings);
    } else if (command === 'coding-plan') {
      await handleCodePlanAuth(config, settings, options);
    } else if (command === 'openrouter') {
      await handleOpenRouterAuth(config, settings, options);
    }

    // Exit after authentication is complete
    writeStdoutLine(t('Authentication completed successfully.'));
    process.exit(0);
  } catch (error) {
    writeStderrLine(getErrorMessage(error));
    process.exit(1);
  }
}

/**
 * Handles Qwen OAuth authentication
 */
async function handleQwenOAuth(
  config: Config,
  settings: LoadedSettings,
): Promise<void> {
  writeStdoutLine(t('Starting Qwen OAuth authentication...'));

  try {
    await config.refreshAuth(AuthType.HOPCODE_OAUTH);

    // Persist the auth type
    const authTypeScope = getPersistScopeForModelSelection(settings);
    settings.setValue(
      authTypeScope,
      'security.auth.selectedType',
      AuthType.HOPCODE_OAUTH,
    );

    writeStdoutLine(t('Successfully authenticated with Qwen OAuth.'));
    process.exit(0);
  } catch (error) {
    writeStderrLine(
      t('Failed to authenticate with Qwen OAuth: {{error}}', {
        error: getErrorMessage(error),
      }),
    );
    process.exit(1);
  }
}

/**
 * Handles Alibaba Cloud Coding Plan authentication
 */
async function handleCodePlanAuth(
  config: Config,
  settings: LoadedSettings,
  options: QwenAuthOptions,
): Promise<void> {
  const { baseUrl, key } = options;

  let selectedBaseUrl: string;
  let selectedKey: string;

  if (baseUrl && key) {
    selectedBaseUrl = baseUrl;
    selectedKey = key;
  } else {
    selectedBaseUrl = await promptForCodingPlanBaseUrl();
    selectedKey = await promptForKey(t('Enter your Coding Plan API key: '));
  }

  writeStdoutLine(t('Processing Alibaba Cloud Coding Plan authentication...'));

  try {
    const resolved = resolveBaseUrl(codingPlanProvider, selectedBaseUrl);
    const installPlan = buildInstallPlan(codingPlanProvider, {
      baseUrl: resolved,
      apiKey: selectedKey,
      modelIds: getDefaultModelIds(codingPlanProvider),
    });
    await applyProviderInstallPlan(installPlan, { settings, config });

    writeStdoutLine(
      t('Successfully authenticated with Alibaba Cloud Coding Plan.'),
    );
  } catch (error) {
    writeStderrLine(
      t('Failed to authenticate with Coding Plan: {{error}}', {
        error: getErrorMessage(error),
      }),
    );
    process.exit(1);
  }
}

/**
 * Handles OpenRouter API key setup.
 */
async function handleOpenRouterAuth(
  config: Config,
  settings: LoadedSettings,
  options: QwenAuthOptions,
): Promise<void> {
  writeStdoutLine(t('Processing OpenRouter authentication...'));

  try {
    const authStartMs = Date.now();
    let selectedKey = options.key;

    if (!selectedKey) {
      const oauthStartMs = Date.now();
      const oauthSession = createOpenRouterOAuthSession();
      writeStdoutLine(
        t(
          'Starting OpenRouter OAuth in your browser. If needed, open this link manually: {{authorizationUrl}}',
          {
            authorizationUrl: oauthSession.authorizationUrl,
          },
        ),
      );
      const oauthResult = await runOpenRouterOAuthLogin(undefined, {
        session: oauthSession,
      });
      writeStdoutLine(
        t('Waited for OpenRouter browser authorization in {{elapsed}}.', {
          elapsed:
            typeof oauthResult.authorizationCodeWaitMs === 'number'
              ? `${(oauthResult.authorizationCodeWaitMs / 1000).toFixed(2)}s`
              : formatElapsedTime(oauthStartMs),
        }),
      );
      writeStdoutLine(
        t('Exchanged OpenRouter auth code for API key in {{elapsed}}.', {
          elapsed:
            typeof oauthResult.apiKeyExchangeMs === 'number'
              ? `${(oauthResult.apiKeyExchangeMs / 1000).toFixed(2)}s`
              : formatElapsedTime(oauthStartMs),
        }),
      );
      writeStdoutLine(
        t('OpenRouter OAuth callback completed in {{elapsed}}.', {
          elapsed: formatElapsedTime(oauthStartMs),
        }),
      );
      selectedKey = oauthResult.apiKey;
    }

    if (!selectedKey) {
      throw new Error(
        'OpenRouter authentication completed without an API key.',
      );
    }

    const modelsStartMs = Date.now();
    const installPlan = await createOpenRouterProviderInstallPlan({
      apiKey: selectedKey,
    });
    await applyProviderInstallPlan(installPlan, { settings, config });
    writeStdoutLine(
      t('Fetched OpenRouter models in {{elapsed}}.', {
        elapsed: formatElapsedTime(modelsStartMs),
      }),
    );

    writeStdoutLine(
      t('Total OpenRouter setup time: {{elapsed}}.', {
        elapsed: formatElapsedTime(authStartMs),
      }),
    );

    writeStdoutLine(t('Successfully configured OpenRouter.'));
  } catch (error) {
    writeStderrLine(
      t('Failed to configure OpenRouter: {{error}}', {
        error: getErrorMessage(error),
      }),
    );
    process.exit(1);
  }
}

async function promptForCodingPlanBaseUrl(): Promise<string> {
  const baseUrlOptions = Array.isArray(codingPlanProvider.baseUrl)
    ? codingPlanProvider.baseUrl
    : [];
  const selector = new InteractiveSelector(
    baseUrlOptions.map((opt) => ({
      value: opt.url,
      label: t(opt.label),
      description: opt.url,
    })),
    t('Select Base URL for Coding Plan:'),
  );

  return await selector.select();
}

/**
 * Prompts the user to enter an API key
 */
async function promptForKey(prompt: string): Promise<string> {
  // Create a simple password-style input (without echoing characters)
  const stdin = process.stdin;
  const stdout = process.stdout;

  stdout.write(prompt);

  // Set raw mode to capture keystrokes
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
          case '\r': // Enter
          case '\n':
            stdin.removeListener('data', onData);
            if (stdin.setRawMode) {
              stdin.setRawMode(wasRaw);
            }
            stdout.write('\n'); // New line after input
            resolve(input);
            return;
          case '\x03': // Ctrl+C
            stdin.removeListener('data', onData);
            if (stdin.setRawMode) {
              stdin.setRawMode(wasRaw);
            }
            stdout.write('^C\n');
            reject(new Error('Interrupted'));
            return;
          case '\x08': // Backspace
          case '\x7F': // Delete
            if (input.length > 0) {
              input = input.slice(0, -1);
              // Move cursor back, print space, move back again
              stdout.write('\x1B[D \x1B[D');
            }
            break;
          default:
            // Add character to input
            input += char;
            // Print asterisk instead of the actual character for security
            stdout.write('*');
            break;
        }
      }
    };

    stdin.on('data', onData);
  });
}

/**
 * Runs the interactive authentication flow showing all registered providers.
 *
 * Providers are grouped into Cloud / Local / Legacy sections.
 * Section headers (prefixed with `__`) are re-prompted when accidentally selected.
 */
export async function runInteractiveAuth() {
  const LOCAL_IDS = new Set(['ollama-local', 'lm-studio']);

  const cloudOptions = PROVIDER_REGISTRY.filter(
    (p) => !LOCAL_IDS.has(p.id),
  ).map((p) => ({ value: p.id, label: p.label, description: p.description }));

  const localOptions = PROVIDER_REGISTRY.filter((p) => LOCAL_IDS.has(p.id)).map(
    (p) => ({ value: p.id, label: p.label, description: p.description }),
  );

  const allOptions = [
    {
      value: '__legacy__',
      label: t('── Legacy / Enterprise ───────────────────'),
      description: '',
    },
    {
      value: 'coding-plan',
      label: t('Alibaba Cloud Coding Plan'),
      description: t('Paid · Alibaba Cloud Coding Plan models'),
    },
    {
      value: '__cloud__',
      label: t('── Cloud Providers ───────────────────────'),
      description: '',
    },
    ...cloudOptions,
    {
      value: '__local__',
      label: t('── Local Providers ───────────────────────'),
      description: '',
    },
    ...localOptions,
  ];

  const selector = new InteractiveSelector(
    allOptions,
    t('Select authentication method:'),
  );

  let choice: string | undefined;
  do {
    choice = await selector.select();
  } while (choice !== undefined && choice.startsWith('__'));

  if (!choice) return;

  if (choice === 'coding-plan') {
    await handleQwenAuth('coding-plan', {});
  } else {
    await handleApiKeyAuth(choice, {});
  }
}

/**
 * Handles API Key authentication - directs user to documentation.
 *
 * Intentionally simplified: the full interactive provider setup is now
 * available through the `/auth` slash command in the UI. The CLI sub-command
 * (`hopcode auth api-key`) serves as a lightweight fallback that points users
 * to the docs. A future improvement could wire this into the provider
 * registry for a fully interactive CLI flow.
 */
export async function handleApiKeyAuth() {
  handleCustomApiKeyAuth();
}

/**
 * Handles Custom API Key - prints docs link
 */
function handleCustomApiKeyAuth(): void {
  writeStdoutLine(
    t(
      '\nYou can configure your API key and models in settings.json.\nRefer to the documentation for setup instructions:\n  https://qwenlm.github.io/qwen-code-docs/en/users/configuration/model-providers/\n',
    ),
  );
  process.exit(0);
}

/**
 * Shows the current authentication status
 */
export async function showAuthStatus(): Promise<void> {
  try {
    const settings = loadSettings();
    const mergedSettings = settings.merged as MergedSettingsWithCodingPlan;

    writeStdoutLine(t('\n=== Authentication Status ===\n'));

    const selectedType = mergedSettings.security?.auth?.selectedType;
    if (!selectedType) {
      writeStdoutLine(t('⚠️  No authentication method configured.\n'));
      writeStdoutLine(t('Run one of the following commands to get started:\n'));
      writeStdoutLine(
        t('  hopcode auth openrouter      - Configure OpenRouter API key'),
      );
      writeStdoutLine(
        t(
          '  hopcode auth coding-plan    - Authenticate with Alibaba Cloud Coding Plan',
        ),
      );
      writeStdoutLine(
        t('  hopcode auth api-key        - Authenticate with an API key'),
      );
      writeStdoutLine(t('Or simply run:'));
      writeStdoutLine(
        t('  hopcode auth                - Interactive authentication setup\n'),
      );
      process.exit(0);
    }

    if (selectedType === AuthType.HOPCODE_OAUTH) {
      writeStdoutLine(t('✓ Authentication Method: HopCode OAuth'));
      writeStdoutLine(t('  Type: Legacy OAuth (discontinued 2026-04-15)'));
      writeStdoutLine(
        t('\n  ⚠ Run `hopcode auth` to switch to another provider.\n'),
      );
    } else if (selectedType === AuthType.USE_OPENAI) {
      const modelName = mergedSettings.model?.name;
      const openAiProviders =
        mergedSettings.modelProviders?.[AuthType.USE_OPENAI] || [];
      const activeConfig = modelName
        ? openAiProviders.find((c) => c.id === modelName)
        : openAiProviders[0];
      const isActiveOpenRouter = activeConfig
        ? isOpenRouterConfig(activeConfig)
        : false;
      const hasOpenRouterApiKey =
        !!process.env[OPENROUTER_ENV_KEY] ||
        !!mergedSettings.env?.[OPENROUTER_ENV_KEY];

      const foundProvider = activeConfig
        ? findProviderByCredentials(activeConfig.baseUrl, activeConfig.envKey)
        : undefined;
      const managedProvider =
        foundProvider && resolveMetadataKey(foundProvider)
          ? foundProvider
          : undefined;

      if (isActiveOpenRouter) {
        if (hasOpenRouterApiKey) {
          writeStdoutLine(t('✓ Authentication Method: OpenRouter'));
          if (modelName) {
            writeStdoutLine(
              t('  Current Model: {{model}}', { model: modelName }),
            );
          }
          writeStdoutLine(t('  Status: API key configured\n'));
        } else {
          writeStdoutLine(
            t('⚠️  Authentication Method: OpenRouter (Incomplete)'),
          );
          writeStdoutLine(
            t('  Issue: API key not found in environment or settings\n'),
          );
          writeStdoutLine(t('  Run `qwen auth openrouter` to re-configure.\n'));
        }
      } else if (managedProvider) {
        const envKey =
          typeof managedProvider.envKey === 'string'
            ? managedProvider.envKey
            : '';
        const metaKey = resolveMetadataKey(managedProvider)!;
        const ns = (mergedSettings as Record<string, unknown>)[
          PROVIDER_METADATA_NS
        ] as Record<string, unknown> | undefined;
        const metadata = ns?.[metaKey] as
          | { version?: string; baseUrl?: string }
          | undefined;
        const hasApiKey =
          !!process.env[envKey] || !!mergedSettings.env?.[envKey];

        if (hasApiKey) {
          writeStdoutLine(
            t('✓ Authentication Method: {{plan}}', {
              plan: t(managedProvider.label),
            }),
          );

          if (metadata?.baseUrl) {
            writeStdoutLine(
              t('  Base URL: {{baseUrl}}', { baseUrl: metadata.baseUrl }),
            );
          }
          if (modelName) {
            writeStdoutLine(
              t('  Current Model: {{model}}', { model: modelName }),
            );
          }

          if (metadata?.version) {
            writeStdoutLine(
              t('  Config Version: {{version}}', {
                version: metadata.version.substring(0, 8) + '...',
              }),
            );
          }
          writeStdoutLine(t('  Status: API key configured\n'));
        } else {
          writeStdoutLine(
            t('⚠️  Authentication Method: {{plan}} (Incomplete)', {
              plan: t(managedProvider.label),
            }),
          );
          writeStdoutLine(
            t('  Issue: API key not found in environment or settings\n'),
          );
          writeStdoutLine(
            t('  Run `qwen auth` to re-configure authentication.\n'),
          );
        }
      } else if (activeConfig) {
        let hasApiKey: boolean;
        if (activeConfig.envKey) {
          hasApiKey =
            !!process.env[activeConfig.envKey] ||
            !!mergedSettings.env?.[activeConfig.envKey];
        } else {
          hasApiKey =
            !!process.env['OPENAI_API_KEY'] ||
            !!mergedSettings.env?.['OPENAI_API_KEY'] ||
            !!mergedSettings.security?.auth?.apiKey;
        }

        if (hasApiKey) {
          writeStdoutLine(
            t('✓ Authentication Method: OpenAI-compatible Provider'),
          );
          if (modelName) {
            writeStdoutLine(
              t('  Current Model: {{model}}', { model: modelName }),
            );
          }
          const baseUrl =
            activeConfig.baseUrl || mergedSettings.security?.auth?.baseUrl;
          if (baseUrl) {
            writeStdoutLine(t('  Base URL: {{baseUrl}}', { baseUrl }));
          }
          writeStdoutLine(t('  Status: API key configured\n'));
        } else {
          writeStdoutLine(
            t(
              '⚠️  Authentication Method: OpenAI-compatible Provider (Incomplete)',
            ),
          );
          writeStdoutLine(
            t('  Issue: API key not found in environment or settings\n'),
          );
          writeStdoutLine(t('  Run `hopcode auth` to re-configure.\n'));
        }
      } else {
        const hasGenericApiKey =
          !!process.env['OPENAI_API_KEY'] ||
          !!mergedSettings.env?.['OPENAI_API_KEY'] ||
          !!mergedSettings.security?.auth?.apiKey;

        if (hasGenericApiKey) {
          writeStdoutLine(
            t('✓ Authentication Method: OpenAI-compatible Provider'),
          );
          if (modelName) {
            writeStdoutLine(
              t('  Current Model: {{model}}', { model: modelName }),
            );
          }
          const baseUrl = mergedSettings.security?.auth?.baseUrl;
          if (baseUrl) {
            writeStdoutLine(t('  Base URL: {{baseUrl}}', { baseUrl }));
          }
          writeStdoutLine(t('  Status: API key configured\n'));
        } else {
          writeStdoutLine(
            t(
              '⚠️  Authentication Method: OpenAI-compatible Provider (Incomplete)',
            ),
          );
          writeStdoutLine(
            t('  Issue: API key not found in environment or settings\n'),
          );
          writeStdoutLine(t('  Run `hopcode auth` to re-configure.\n'));
        }
      }
    } else {
      writeStdoutLine(
        t('✓ Authentication Method: {{type}}', { type: selectedType }),
      );
      writeStdoutLine(t('  Status: Configured\n'));
    }

    process.exit(0);
  } catch (error) {
    writeStderrLine(
      t('Failed to check authentication status: {{error}}', {
        error: getErrorMessage(error),
      }),
    );
    process.exit(1);
  }
}
