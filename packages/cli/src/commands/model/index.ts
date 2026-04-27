/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * `hopcode model` command
 *
 * Shows all accessible models for the currently-configured provider,
 * grouped by category. Interactive arrow-key selection switches the active model.
 *
 * UX flow:
 *   $ hopcode model
 *   Active provider: DeepSeek
 *   Current model:   deepseek/deepseek-chat
 *
 *   Select a model:
 *   ── Chat ───────────────────────────────────
 * > deepseek/deepseek-chat          · Best for general use
 *   ...
 *   (↑↓ navigate, Enter select, Esc cancel)
 */

import type { CommandModule, Argv } from 'yargs';
import { loadSettings, SettingScope } from '../../config/settings.js';
import { PROVIDER_REGISTRY } from '../auth/registry.js';
import { getCatalog } from './catalog.js';
import { fetchOllamaModels } from './ollama.js';
import {
  fetchOpenAICompatibleModels,
  fetchOpenRouterModels,
} from './discovery.js';
import { InteractiveSelector } from '../auth/interactiveSelector.js';
import { writeStdoutLine, writeStderrLine } from '../../utils/stdioHelpers.js';
import { t } from '../../i18n/index.js';
import type { ModelCategory } from './catalog.js';
import { resolveActiveProvider } from '../../utils/providerDetection.js';

// ── Types ───────────────────────────────────────────────────────────────────

interface ModelCommandArgs {
  list?: boolean;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Flatten categories into a flat selector option list. */
function flattenToOptions(
  categories: ModelCategory[],
): Array<{ value: string; label: string; description: string }> {
  return categories.flatMap((cat) =>
    cat.models.map((m) => ({
      value: m.id,
      label: m.label,
      description: [m.description, m.context ? `ctx ${m.context}` : '']
        .filter(Boolean)
        .join(' · '),
    })),
  );
}

/** Pretty-print model categories to stdout (--list mode). */
function printCategories(
  categories: ModelCategory[],
  currentModel: string,
): void {
  for (const cat of categories) {
    writeStdoutLine(
      `\n  ── ${cat.name} ${'─'.repeat(Math.max(0, 40 - cat.name.length))}`,
    );
    for (const m of cat.models) {
      const active = m.id === currentModel ? ' ← current' : '';
      const desc = m.description ? `  · ${m.description}` : '';
      const ctx = m.context ? ` [${m.context}]` : '';
      writeStdoutLine(`  ${m.id}${ctx}${desc}${active}`);
    }
  }
  writeStdoutLine('');
}

// ── Handler ─────────────────────────────────────────────────────────────────

async function handleModelCommand(argv: ModelCommandArgs): Promise<void> {
  const settings = loadSettings();
  const info = resolveActiveProvider(settings);

  if (!info) {
    writeStderrLine(t('No provider configured. Run: hopcode auth'));
    process.exit(1);
  }

  writeStdoutLine(
    t('\n  Active provider: {{label}}', { label: info.providerLabel }),
  );
  writeStdoutLine(
    t('  Current model:   {{model}}\n', {
      model: info.currentModel || '(none)',
    }),
  );

  // Get model categories (live fetch where supported, static fallback otherwise)
  let categories: ModelCategory[] | null = null;

  if (
    info.providerId === 'ollama-local' ||
    info.providerId === 'ollama-cloud'
  ) {
    const baseUrl =
      info.baseUrl ??
      (info.providerId === 'ollama-local'
        ? 'http://localhost:11434/v1'
        : 'https://ollama.com/v1');
    const apiKey =
      info.providerId === 'ollama-cloud'
        ? (process.env['OLLAMA_API_KEY'] ?? undefined)
        : undefined;
    process.stdout.write(t('  Fetching available models...'));
    categories = await fetchOllamaModels(baseUrl, apiKey);
    if (categories) {
      process.stdout.write(' ✓\n');
    } else {
      process.stdout.write(t(' (Ollama unreachable, showing suggestions)\n'));
    }
  } else {
    // For providers with liveModels: true, try to fetch the live model list
    const providerDef = PROVIDER_REGISTRY.find((p) => p.id === info.providerId);
    if (providerDef?.liveModels && providerDef.baseUrl) {
      const apiKey = providerDef.envKey
        ? (process.env[providerDef.envKey] ?? undefined)
        : undefined;

      process.stdout.write(t('  Fetching available models...'));

      if (info.providerId === 'openrouter') {
        categories = await fetchOpenRouterModels(apiKey);
      } else {
        categories = await fetchOpenAICompatibleModels(
          providerDef.baseUrl,
          apiKey,
        );
      }

      if (categories) {
        process.stdout.write(' ✓\n');
      } else {
        process.stdout.write(
          t(' (could not reach provider, showing catalog)\n'),
        );
      }
    }
  }

  // Fall back to static catalog
  if (!categories) {
    const catalog = getCatalog(info.providerId);
    if (!catalog) {
      writeStderrLine(
        t('No model catalog available for provider: {{id}}', {
          id: info.providerId,
        }),
      );
      process.exit(1);
    }
    categories = catalog.categories;
  }

  // --list flag: just print and exit
  if ((argv as ModelCommandArgs).list) {
    printCategories(categories, info.currentModel);
    return;
  }

  // Interactive selection
  const options = flattenToOptions(categories);
  if (!options.length) {
    writeStderrLine(
      t('No models found for provider: {{id}}', { id: info.providerId }),
    );
    process.exit(1);
  }

  const selector = new InteractiveSelector(
    options,
    t('Select a model (↑↓ navigate, Enter select, Esc cancel):'),
  );

  const chosen = await selector.select();
  if (chosen === undefined || chosen === null) {
    writeStdoutLine(t('Cancelled.'));
    return;
  }

  // Persist model choice
  const scope = SettingScope.User;

  settings.setValue(scope, 'model.name', chosen);

  // Also update the modelProviders entry so the active provider's id matches
  const providerKey = info.authTypeKey;
  const existingProviders =
    (settings.merged?.modelProviders?.[providerKey] as unknown as
      | Array<Record<string, unknown>>
      | undefined) ?? [];
  if (existingProviders.length > 0) {
    existingProviders[0]['id'] = chosen;
    settings.setValue(
      scope,
      `modelProviders.${providerKey}`,
      existingProviders,
    );
  }

  writeStdoutLine(t('\n  ✓ Model switched to: {{model}}\n', { model: chosen }));
  writeStdoutLine(
    t(
      '  Restart HopCode for the model change to take effect in a running session.\n',
    ),
  );
}

// ── Command definition ───────────────────────────────────────────────────────

export const modelCommand: CommandModule<
  Record<string, unknown>,
  ModelCommandArgs
> = {
  command: 'model',
  describe: t('Select or list available models for the active provider'),
  builder: (yargs: Argv) =>
    yargs.option('list', {
      alias: 'l',
      type: 'boolean',
      description: t('Print all models without interactive selection'),
      default: false,
    }) as Argv<ModelCommandArgs>,
  handler: async (argv: ModelCommandArgs) => {
    try {
      await handleModelCommand(argv);
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Interrupted')
        process.exit(0);
      const msg = err instanceof Error ? err.message : String(err);
      writeStderrLine(`Error: ${msg}`);
      process.exit(1);
    }
  },
};
