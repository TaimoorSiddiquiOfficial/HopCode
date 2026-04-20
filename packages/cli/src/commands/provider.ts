/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode provider` command
 *
 * Full provider management TUI:
 * - Lists all providers in categories (Cloud / Local / Legacy)
 * - Shows [ACTIVE] indicator and current model for configured providers
 * - Press Enter on a provider → configure it (prompts for API key)
 * - Select "← Exit" to quit
 *
 * UX example:
 *   $ hopcode provider
 *
 *   Available Providers  (Enter to configure, select ← Exit to quit)
 *
 *   ── Cloud ─────────────────────────────────
 * > ✓ DeepSeek  [deepseek/deepseek-chat]  [ACTIVE]
 *     OpenAI    [gpt-4o]
 *     Anthropic [claude-opus-4-5]
 *   ── Local ─────────────────────────────────
 *     Ollama (Local)  [not configured]
 *   ── Legacy ────────────────────────────────
 *     Alibaba Cloud Coding Plan
 *     Qwen OAuth
 *   ──────────────────────────────────────────
 *     ← Exit
 */

import type { CommandModule } from 'yargs';
import { loadSettings } from '../config/settings.js';
import { PROVIDER_REGISTRY, detectActiveProvider } from './auth/registry.js';
import { handleApiKeyAuth } from './auth/providers.js';
import { isCodingPlanConfig } from '../constants/codingPlan.js';
import { InteractiveSelector } from './auth/interactiveSelector.js';
import { writeStdoutLine } from '../utils/stdioHelpers.js';
import { t } from '../i18n/index.js';

// Sentinel value returned when the user picks "Exit"
const EXIT_VALUE = '__exit__' as const;

// ── Helpers ─────────────────────────────────────────────────────────────────

/** True if the given provider id is currently active. */
function isActive(
  providerId: string,
  activeProviderId: string | undefined,
): boolean {
  return activeProviderId === providerId;
}

/** True if the given provider appears to be configured (env key set). */
function isConfigured(envKey: string): boolean {
  return !!process.env[envKey];
}

function buildSelectorOptions(activeProviderId: string | undefined): Array<{
  value: string;
  label: string;
  description: string;
}> {
  const options: Array<{ value: string; label: string; description: string }> =
    [];

  // ── Cloud providers ─────────────────────────────────────────────────────
  options.push({
    value: '__header_cloud__',
    label: '── Cloud ─────────────────────────────────────────',
    description: '',
  });

  const cloudIds = [
    'openai',
    'anthropic',
    'gemini',
    'deepseek',
    'groq',
    'mistral',
    'openrouter',
    'togetherai',
    'fireworks',
    'xai',
    'perplexity',
    'cohere',
    'huggingface',
    'replicate',
    'ollama-cloud',
  ];

  for (const id of cloudIds) {
    const p = PROVIDER_REGISTRY.find((r) => r.id === id);
    if (!p) continue;
    const active = isActive(p.id, activeProviderId);
    const configured = p.requiresApiKey ? isConfigured(p.envKey) : true;
    const indicator = active ? '✓ ' : configured ? '  ' : '  ';
    const status = active ? '  [ACTIVE]' : configured ? '  [configured]' : '';
    options.push({
      value: p.id,
      label: `${indicator}${p.label}${status}`,
      description: p.description,
    });
  }

  // ── Local providers ──────────────────────────────────────────────────────
  options.push({
    value: '__header_local__',
    label: '── Local ─────────────────────────────────────────',
    description: '',
  });

  const localProvider = PROVIDER_REGISTRY.find((r) => r.id === 'ollama-local');
  if (localProvider) {
    const active = isActive(localProvider.id, activeProviderId);
    options.push({
      value: localProvider.id,
      label: `${active ? '✓ ' : '  '}${localProvider.label}${active ? '  [ACTIVE]' : ''}`,
      description: localProvider.description,
    });
  }

  // ── Legacy providers ──────────────────────────────────────────────────────
  options.push({
    value: '__header_legacy__',
    label: '── Legacy ────────────────────────────────────────',
    description: '',
  });

  const legacyActive = !activeProviderId || activeProviderId === 'coding-plan';
  options.push({
    value: 'coding-plan',
    label: `${legacyActive ? '✓ ' : '  '}Alibaba Cloud Coding Plan${legacyActive ? '  [ACTIVE]' : ''}`,
    description: 'Paid · Alibaba Cloud Coding Plan',
  });
  options.push({
    value: 'qwen-oauth',
    label: '  Legacy OAuth',
    description: 'Discontinued — switch to Coding Plan or API Key',
  });

  // ── Exit ──────────────────────────────────────────────────────────────────
  options.push({
    value: '__divider__',
    label: '─────────────────────────────────────────────────',
    description: '',
  });
  options.push({
    value: EXIT_VALUE,
    label: '  ← Exit',
    description: '',
  });

  return options;
}

// ── Main loop ────────────────────────────────────────────────────────────────

async function handleProviderCommand(): Promise<void> {
  const settings = loadSettings();

  // Detect currently active provider
  const activeProvider = detectActiveProvider(
    settings.merged as Parameters<typeof detectActiveProvider>[0],
  );
  const openaiProviders =
    (settings.merged?.modelProviders?.openai as
      | Array<{ envKey?: string; baseUrl?: string }>
      | undefined) ?? [];
  const isCodingPlan =
    openaiProviders[0] &&
    isCodingPlanConfig(openaiProviders[0].baseUrl, openaiProviders[0].envKey);
  const activeProviderId = isCodingPlan ? 'coding-plan' : activeProvider?.id;

  writeStdoutLine(t('\n  HopCode Provider Manager'));
  writeStdoutLine(t('  (Enter to configure, select ← Exit to quit)\n'));

  while (true) {
    const options = buildSelectorOptions(activeProviderId);

    const selector = new InteractiveSelector(
      options,
      t('Available Providers:'),
    );

    const chosen = await selector.select();

    // Skip header/divider rows — they're not real actions
    if (
      typeof chosen === 'string' &&
      (chosen.startsWith('__header_') || chosen === '__divider__')
    ) {
      // Re-render the menu (user selected a section header, ignore it)
      continue;
    }

    if (chosen === EXIT_VALUE) {
      writeStdoutLine(t('\n  Exiting provider manager.\n'));
      return;
    }

    // Legacy Coding Plan / Qwen OAuth — tell user to use auth command
    if (chosen === 'coding-plan') {
      writeStdoutLine(t('\n  → Run: hopcode auth coding-plan'));
      writeStdoutLine(
        t('    Use the Coding Plan flow to configure Alibaba Cloud.\n'),
      );
      continue;
    }
    if (chosen === 'qwen-oauth') {
      writeStdoutLine(
        t(
          '\n  → Legacy OAuth is discontinued. Use: hopcode auth coding-plan\n',
        ),
      );
      continue;
    }

    // Registry providers — configure inline
    const providerConfig = PROVIDER_REGISTRY.find((p) => p.id === chosen);
    if (!providerConfig) continue;

    writeStdoutLine(
      t('\n  Configuring: {{label}}', { label: providerConfig.label }),
    );
    if (providerConfig.id === 'ollama-local') {
      writeStdoutLine(
        t('  Make sure Ollama is running at http://localhost:11434'),
      );
    }

    try {
      await handleApiKeyAuth(providerConfig.id, {});
      writeStdoutLine(
        t('  ✓ {{label}} configured successfully!\n', {
          label: providerConfig.label,
        }),
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Interrupted') {
        writeStdoutLine(t('\n  Cancelled.\n'));
        continue;
      }
      writeStdoutLine(
        t('  ✗ Error: {{msg}}\n', {
          msg: err instanceof Error ? err.message : String(err),
        }),
      );
    }

    // Re-load settings to update active indicator
    // (handleApiKeyAuth has already written to settings; we just continue the loop)
  }
}

// ── Command definition ────────────────────────────────────────────────────────

export const providerCommand: CommandModule = {
  command: 'provider',
  describe: t(
    'Manage AI providers — list, configure, or switch the active provider',
  ),
  builder: (yargs) => yargs,
  handler: async () => {
    try {
      await handleProviderCommand();
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Interrupted')
        process.exit(0);
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`Error: ${msg}\n`);
      process.exit(1);
    }
  },
};
