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
import {
  getCodingPlanConfig,
  isCodingPlanConfig,
  CodingPlanRegion,
  CODING_PLAN_ENV_KEY,
} from '../../constants/codingPlan.js';
import { backupSettingsFile } from '../../utils/settingsUtils.js';
import { loadSettings, type LoadedSettings } from '../../config/settings.js';
import { loadCliConfig } from '../../config/config.js';
import type { CliArgs } from '../../config/config.js';
import { InteractiveSelector } from './interactiveSelector.js';
import {
  applyOpenRouterModelsConfiguration,
  createOpenRouterOAuthSession,
  runOpenRouterOAuthLogin,
} from './openrouterOAuth.js';
import { PROVIDER_REGISTRY, getProvider } from './registry.js';
import { handleApiKeyAuth } from './providers.js';
import { resolveActiveProvider } from '../../utils/providerDetection.js';

function formatElapsedTime(startMs: number): string {
  return `${((Date.now() - startMs) / 1000).toFixed(2)}s`;
}

interface QwenAuthOptions {
  region?: string;
  key?: string;
}

interface CodingPlanSettings {
  region?: CodingPlanRegion;
  version?: string;
}

interface MergedSettingsWithCodingPlan {
  security?: {
    auth?: {
      selectedType?: string;
      apiKey?: string;
      baseUrl?: string;
    };
  };
  codingPlan?: CodingPlanSettings;
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
      yolo: undefined,
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
  const { region, key } = options;

  let selectedRegion: CodingPlanRegion;
  let selectedKey: string;

  // If region and key are provided as options, use them
  if (region && key) {
    selectedRegion =
      region.toLowerCase() === 'global'
        ? CodingPlanRegion.GLOBAL
        : CodingPlanRegion.CHINA;
    selectedKey = key;
  } else {
    // Otherwise, prompt interactively
    selectedRegion = await promptForRegion();
    selectedKey = await promptForAuthKey(t('Enter your Coding Plan API key: '));
  }

  writeStdoutLine(t('Processing Alibaba Cloud Coding Plan authentication...'));

  try {
    // Get configuration based on region
    const { template, version } = getCodingPlanConfig(selectedRegion);

    // Get persist scope
    const authTypeScope = getPersistScopeForModelSelection(settings);

    // Backup settings file before modification
    const settingsFile = settings.forScope(authTypeScope);
    backupSettingsFile(settingsFile.path);

    // Store api-key in settings.env (unified env key)
    settings.setValue(authTypeScope, `env.${CODING_PLAN_ENV_KEY}`, selectedKey);

    // Sync to process.env immediately so refreshAuth can read the apiKey
    process.env[CODING_PLAN_ENV_KEY] = selectedKey;

    // Generate model configs from template
    const newConfigs = template.map((templateConfig) => ({
      ...templateConfig,
      envKey: CODING_PLAN_ENV_KEY,
    }));

    // Get existing configs
    const existingConfigs =
      (settings.merged.modelProviders as Record<string, ModelConfig[]>)?.[
        AuthType.USE_OPENAI
      ] || [];

    // Filter out all existing Coding Plan configs (mutually exclusive)
    const nonCodingPlanConfigs = existingConfigs.filter(
      (existing) => !isCodingPlanConfig(existing.baseUrl, existing.envKey),
    );

    // Add new Coding Plan configs at the beginning
    const updatedConfigs = [...newConfigs, ...nonCodingPlanConfigs];

    // Persist to modelProviders
    settings.setValue(
      authTypeScope,
      `modelProviders.${AuthType.USE_OPENAI}`,
      updatedConfigs,
    );

    // Also persist authType
    settings.setValue(
      authTypeScope,
      'security.auth.selectedType',
      AuthType.USE_OPENAI,
    );

    // Persist coding plan region
    settings.setValue(authTypeScope, 'codingPlan.region', selectedRegion);

    // Persist coding plan version (single field for backward compatibility)
    settings.setValue(authTypeScope, 'codingPlan.version', version);

    // If there are configs, use the first one as the model
    if (updatedConfigs.length > 0 && updatedConfigs[0]?.id) {
      settings.setValue(
        authTypeScope,
        'model.name',
        (updatedConfigs[0] as ModelConfig).id,
      );
    }

    // Refresh auth with the new configuration
    await config.refreshAuth(AuthType.USE_OPENAI);

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

    const authTypeScope = getPersistScopeForModelSelection(settings);
    const settingsFile = settings.forScope(authTypeScope);
    backupSettingsFile(settingsFile.path);

    const modelsStartMs = Date.now();
    await applyOpenRouterModelsConfiguration({
      settings,
      config,
      apiKey: selectedKey,
      reloadConfig: true,
    });
    writeStdoutLine(
      t('Fetched OpenRouter models in {{elapsed}}.', {
        elapsed: formatElapsedTime(modelsStartMs),
      }),
    );

    const refreshStartMs = Date.now();
    await config.refreshAuth(AuthType.USE_OPENAI);
    writeStdoutLine(
      t('Refreshed OpenRouter auth in {{elapsed}}.', {
        elapsed: formatElapsedTime(refreshStartMs),
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

/**
 * Prompts the user to select a region using an interactive selector
 */
async function promptForRegion(): Promise<CodingPlanRegion> {
  const selector = new InteractiveSelector(
    [
      {
        value: CodingPlanRegion.CHINA,
        label: t('中国 (China)'),
        description: t('阿里云百炼 (aliyun.com)'),
      },
      {
        value: CodingPlanRegion.GLOBAL,
        label: t('Global'),
        description: t('Alibaba Cloud (alibabacloud.com)'),
      },
    ],
    t('Select region for Coding Plan:'),
  );

  return await selector.select();
}

/**
 * Prompts the user to enter an API key
 */
async function promptForAuthKey(prompt: string): Promise<string> {
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
 * Shows the current authentication status.
 *
 * Uses the shared resolveActiveProvider utility so provider detection
 * is consistent across the `hopcode auth status`, `hopcode model`, and
 * `hopcode provider` code paths.
 */
export async function showAuthStatus(): Promise<void> {
  try {
    const settings = loadSettings();
    const mergedSettings = settings.merged as MergedSettingsWithCodingPlan;

    writeStdoutLine(t('\n=== Authentication Status ===\n'));

    const selectedType = mergedSettings.security?.auth?.selectedType;
    if (!selectedType) {
      writeStdoutLine(t('⚠️  No authentication method configured.\n'));
      writeStdoutLine(t('Run `hopcode auth` to set up a provider.\n'));
      process.exit(0);
    }

    const info = resolveActiveProvider(settings);
    const modelName = mergedSettings.model?.name;

    if (!info) {
      writeStdoutLine(
        t('✓ Authentication Method: {{type}}', { type: selectedType }),
      );
      writeStdoutLine(t('  Status: Configured\n'));
      process.exit(0);
    }

    writeStdoutLine(
      t('✓ Authentication Method: {{label}}', { label: info.providerLabel }),
    );
    if (modelName) {
      writeStdoutLine(t('  Current Model: {{model}}', { model: modelName }));
    }

    if (info.providerId === 'coding-plan') {
      const codingPlanRegion = mergedSettings.codingPlan?.region;
      const hasApiKey =
        !!process.env[CODING_PLAN_ENV_KEY] ||
        !!mergedSettings.env?.[CODING_PLAN_ENV_KEY];
      if (codingPlanRegion) {
        const regionDisplay =
          codingPlanRegion === CodingPlanRegion.CHINA
            ? t('中国 (China) - 阿里云百炼')
            : t('Global - Alibaba Cloud');
        writeStdoutLine(t('  Region: {{region}}', { region: regionDisplay }));
      }
      writeStdoutLine(
        hasApiKey
          ? t('  Status: API key configured\n')
          : t(
              '  ⚠ API key not found. Run `hopcode auth coding-plan` to re-configure.\n',
            ),
      );
    } else if (selectedType === AuthType.HOPCODE_OAUTH) {
      writeStdoutLine(t('  Type: Legacy OAuth (discontinued 2026-04-15)'));
      writeStdoutLine(
        t('\n  ⚠ Run `hopcode auth` to switch to another provider.\n'),
      );
    } else {
      const provider = getProvider(info.providerId);
      if (info.baseUrl) {
        writeStdoutLine(t('  Base URL: {{url}}', { url: info.baseUrl }));
      }
      const hasApiKey = provider?.envKey
        ? !!process.env[provider.envKey] ||
          !!mergedSettings.env?.[provider.envKey]
        : true;
      if (hasApiKey) {
        writeStdoutLine(t('  Status: API key configured\n'));
      } else {
        writeStdoutLine(t('  ⚠ API key not found.', {}));
        if (provider?.envKey) {
          writeStdoutLine(
            t('  Set {{envKey}} or run `hopcode auth {{id}`.\n', {
              envKey: provider.envKey,
              id: info.providerId,
            }),
          );
        }
      }
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
