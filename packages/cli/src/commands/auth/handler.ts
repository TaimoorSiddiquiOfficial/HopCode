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
import { promptForSecretInput } from '../../utils/promptUtils.js';
import { t } from '../../i18n/index.js';
import {
  getCodingPlanConfig,
  isCodingPlanConfig,
  CodingPlanRegion,
  CODING_PLAN_ENV_KEY,
} from '../../constants/codingPlan.js';
import { getPersistScopeForModelSelection } from '../../config/modelProvidersScope.js';
import { backupSettingsFile } from '../../utils/settingsUtils.js';
import { loadSettings, type LoadedSettings } from '../../config/settings.js';
import { loadCliConfig } from '../../config/config.js';
import type { CliArgs } from '../../config/config.js';
import { InteractiveSelector } from './interactiveSelector.js';
import { PROVIDER_REGISTRY, detectActiveProvider } from './registry.js';
import { handleApiKeyAuth } from './providers.js';

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
  command: 'qwen-oauth' | 'coding-plan',
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
    await config.refreshAuth(AuthType.QWEN_OAUTH);

    // Persist the auth type
    const authTypeScope = getPersistScopeForModelSelection(settings);
    settings.setValue(
      authTypeScope,
      'security.auth.selectedType',
      AuthType.QWEN_OAUTH,
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
    selectedKey = await promptForKey();
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
 * Prompts the user to enter an API key with masked input.
 * Uses readline-based approach so paste works correctly on all platforms.
 */
async function promptForKey(): Promise<string> {
  return promptForSecretInput(t('Enter your Coding Plan API key: '));
}

/**
 * Runs the interactive authentication flow
 */
export async function runInteractiveAuth() {
  // Build selector options: start with Coding Plan + Qwen OAuth, then add all registry providers
  type AuthChoice =
    | 'coding-plan'
    | 'qwen-oauth'
    | (typeof PROVIDER_REGISTRY)[number]['id'];

  const providerOptions = PROVIDER_REGISTRY.map((p) => ({
    value: p.id as AuthChoice,
    label: t(p.label),
    description: t(p.description),
  }));

  const selector = new InteractiveSelector<AuthChoice>(
    [
      {
        value: 'coding-plan' as const,
        label: t('Alibaba Cloud Coding Plan'),
        description: t(
          'Paid · Up to 6,000 requests/5 hrs · All Alibaba Cloud Coding Plan Models',
        ),
      },
      {
        value: 'qwen-oauth' as const,
        label: t('Qwen OAuth'),
        description: t('Discontinued — switch to Coding Plan or API Key'),
      },
      ...providerOptions,
    ],
    t('Select authentication method:'),
  );

  let choice = await selector.select();

  // If user selects discontinued Qwen OAuth, warn and re-prompt
  while (choice === 'qwen-oauth') {
    writeStdoutLine(
      t(
        '\n⚠ Qwen OAuth free tier was discontinued on 2026-04-15. Please select another option.\n',
      ),
    );
    choice = await selector.select();
  }

  if (choice === 'coding-plan') {
    await handleQwenAuth('coding-plan', {});
  } else {
    // Delegate all registry providers to handleApiKeyAuth
    await handleApiKeyAuth(choice, {});
  }
}

/**
 * Shows the current authentication status
 */
export async function showAuthStatus(): Promise<void> {
  try {
    const settings = loadSettings();
    const mergedSettings = settings.merged as MergedSettingsWithCodingPlan;

    writeStdoutLine(t('\n=== Authentication Status ===\n'));

    // Check for selected auth type
    const selectedType = mergedSettings.security?.auth?.selectedType;

    if (!selectedType) {
      writeStdoutLine(t('⚠️  No authentication method configured.\n'));
      writeStdoutLine(t('Run one of the following commands to get started:\n'));
      writeStdoutLine(
        t(
          '  hopcode auth qwen-oauth     - Authenticate with Qwen OAuth (free tier)',
        ),
      );
      writeStdoutLine(
        t(
          '  hopcode auth coding-plan      - Authenticate with Alibaba Cloud Coding Plan\n',
        ),
      );
      writeStdoutLine(t('Or simply run:'));
      writeStdoutLine(
        t('  hopcode auth                - Interactive authentication setup\n'),
      );
      process.exit(0);
    }

    // Display status based on auth type
    if (selectedType === AuthType.QWEN_OAUTH) {
      writeStdoutLine(t('✓ Authentication Method: Qwen OAuth'));
      writeStdoutLine(t('  Type: Free tier (discontinued 2026-04-15)'));
      writeStdoutLine(t('  Limit: No longer available'));
      writeStdoutLine(t('  Models: Qwen latest models'));
      writeStdoutLine(
        t('\n  ⚠ Run /auth to switch to Coding Plan or another provider.\n'),
      );
    } else if (selectedType === AuthType.USE_OPENAI) {
      // Detect which provider is actually configured
      const openaiModelProviders = (
        mergedSettings.modelProviders as
          | Record<string, ModelConfig[]>
          | undefined
      )?.[AuthType.USE_OPENAI];

      const activeProvider = detectActiveProvider(openaiModelProviders);

      // Check for Coding Plan first (uses CODING_PLAN_ENV_KEY)
      const firstEntry = openaiModelProviders?.[0];
      const isCodingPlan =
        firstEntry && isCodingPlanConfig(firstEntry.baseUrl, firstEntry.envKey);

      if (isCodingPlan) {
        const codingPlanRegion = mergedSettings.codingPlan?.region;
        const codingPlanVersion = mergedSettings.codingPlan?.version;
        const modelName = mergedSettings.model?.name;
        const hasApiKey =
          !!process.env[CODING_PLAN_ENV_KEY] ||
          !!mergedSettings.env?.[CODING_PLAN_ENV_KEY];

        if (hasApiKey) {
          writeStdoutLine(
            t('✓ Authentication Method: Alibaba Cloud Coding Plan'),
          );

          if (codingPlanRegion) {
            const regionDisplay =
              codingPlanRegion === CodingPlanRegion.CHINA
                ? t('中国 (China) - 阿里云百炼')
                : t('Global - Alibaba Cloud');
            writeStdoutLine(
              t('  Region: {{region}}', { region: regionDisplay }),
            );
          }

          if (modelName) {
            writeStdoutLine(
              t('  Current Model: {{model}}', { model: modelName }),
            );
          }

          if (codingPlanVersion) {
            writeStdoutLine(
              t('  Config Version: {{version}}', {
                version: codingPlanVersion.substring(0, 8) + '...',
              }),
            );
          }

          writeStdoutLine(t('  Status: API key configured\n'));
        } else {
          writeStdoutLine(
            t(
              '⚠️  Authentication Method: Alibaba Cloud Coding Plan (Incomplete)',
            ),
          );
          writeStdoutLine(
            t('  Issue: API key not found in environment or settings\n'),
          );
          writeStdoutLine(
            t('  Run `hopcode auth coding-plan` to re-configure.\n'),
          );
        }
      } else if (activeProvider) {
        // A known registry provider is configured
        const hasApiKey = activeProvider.envKey
          ? !!process.env[activeProvider.envKey] ||
            !!mergedSettings.env?.[activeProvider.envKey]
          : true; // Ollama local has no real key requirement

        if (hasApiKey) {
          writeStdoutLine(
            t('✓ Authentication Method: {{provider}}', {
              provider: activeProvider.label,
            }),
          );
          const modelName =
            mergedSettings.model?.name ?? activeProvider.defaultModel;
          writeStdoutLine(
            t('  Default Model: {{model}}', { model: modelName }),
          );
          writeStdoutLine(t('  Status: API key configured\n'));
        } else {
          writeStdoutLine(
            t('⚠️  Authentication Method: {{provider}} (Incomplete)', {
              provider: activeProvider.label,
            }),
          );
          writeStdoutLine(
            t('  Issue: {{key}} not found\n', { key: activeProvider.envKey }),
          );
          writeStdoutLine(
            t('  Run `hopcode auth {{id}}` to re-configure.\n', {
              id: activeProvider.id,
            }),
          );
        }
      } else {
        // Unknown OpenAI-compatible configuration
        writeStdoutLine(t('✓ Authentication Method: OpenAI-compatible'));
        writeStdoutLine(t('  Status: Configured\n'));
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
