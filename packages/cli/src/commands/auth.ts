/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import {
  handleHopCodeAuth,
  runInteractiveAuth,
  showAuthStatus,
  handleApiKeyAuthSetup,
} from './auth/handler.js';
import { PROVIDER_REGISTRY } from './auth/registry.js';
import { handleApiKeyAuth, handleOllamaLocalAuth } from './auth/providers.js';
import { t } from '../i18n/index.js';

/**
 * Providers that have bespoke auth flows and their own explicitly defined
 * subcommands below. All other PROVIDER_REGISTRY providers get a generic
 * `hopcode auth <id> [--key <apikey>]` subcommand generated automatically.
 */
const SPECIAL_AUTH_PROVIDERS = new Set([
  'coding-plan',
  'openrouter',
  'ollama-local',
  'api-key',
]);

const ollamaLocalCommand = {
  command: 'ollama-local',
  describe: t('Configure local Ollama (runs at localhost:11434 by default)'),
  builder: (yargs: Argv) =>
    yargs.option('host', {
      alias: 'H',
      describe: t(
        'Custom Ollama host (e.g. http://192.168.1.50:11434). Defaults to http://localhost:11434',
      ),
      type: 'string',
    }),
  handler: async (argv: { host?: string }) => {
    await handleOllamaLocalAuth({ host: argv['host'] });
  },
};

const codePlanCommand = {
  command: 'coding-plan',
  describe: t('Authenticate using Alibaba Cloud Coding Plan'),
  builder: (yargs: Argv) =>
    yargs
      .option('base-url', {
        alias: 'u',
        describe: t('Base URL for Coding Plan'),
        type: 'string',
      })
      .option('key', {
        alias: 'k',
        describe: t('API key for Coding Plan'),
        type: 'string',
      }),
  handler: async (argv: { 'base-url'?: string; key?: string }) => {
    const baseUrl = argv['base-url'];
    const key = argv['key'] as string | undefined;

    if (baseUrl && key) {
      await handleHopCodeAuth('coding-plan', { baseUrl, key });
    } else {
      await handleHopCodeAuth('coding-plan', {});
    }
  },
};

const apiKeyCommand = {
  command: 'api-key',
  describe: t('Authenticate using an API key'),
  handler: async () => {
    await handleApiKeyAuthSetup();
  },
};

const openRouterCommand = {
  command: 'openrouter',
  describe: t(
    'Authenticate using OpenRouter (OAuth browser flow or --key for API key)',
  ),
  builder: (yargs: Argv) =>
    yargs.option('key', {
      alias: 'k',
      describe: t('OpenRouter API key (skips browser OAuth flow)'),
      type: 'string',
    }),
  handler: async (argv: { key?: string }) => {
    const key = argv['key'] as string | undefined;
    if (key) {
      await handleApiKeyAuth('openrouter', { apiKey: key });
    } else {
      await handleHopCodeAuth('openrouter', {});
    }
  },
};

const statusCommand = {
  command: 'status',
  describe: t('Show current authentication status'),
  handler: async () => {
    await showAuthStatus();
  },
};

export const authCommand: CommandModule = {
  command: 'auth',
  describe: t(
    'Configure authentication — supports all AI providers (OpenRouter, Groq, Mistral, OpenAI, Anthropic, Gemini, and more)',
  ),
  builder: (yargs: Argv) => {
    let y = yargs
      .command(ollamaLocalCommand)
      .command(codePlanCommand)
      .command(apiKeyCommand)
      .command(openRouterCommand)
      .command(statusCommand);

    // Auto-generate a subcommand for every provider in the registry that
    // doesn't have a bespoke handler above.
    for (const provider of PROVIDER_REGISTRY) {
      if (SPECIAL_AUTH_PROVIDERS.has(provider.id)) continue;
      const p = provider; // capture for closure
      y = y.command({
        command: p.id,
        describe: p.description,
        builder: (y2: Argv) =>
          y2.option('key', {
            alias: 'k',
            describe: t('API key for {{label}}', { label: p.label }),
            type: 'string',
          }),
        handler: async (argv: { key?: string }) => {
          await handleApiKeyAuth(p.id, { apiKey: argv['key'] });
        },
      });
    }

    return y.demandCommand(0).version(false);
  },
  handler: async () => {
    await runInteractiveAuth();
  },
};
