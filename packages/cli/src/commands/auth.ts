/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { CommandModule, Argv } from 'yargs';
import {
  handleQwenAuth,
  runInteractiveAuth,
  showAuthStatus,
} from './auth/handler.js';
import { PROVIDER_REGISTRY } from './auth/registry.js';
import { handleApiKeyAuth } from './auth/providers.js';
import { t } from '../i18n/index.js';

// Define subcommands separately
const qwenOauthCommand = {
  command: 'qwen-oauth',
  describe: t('Authenticate using HopCode OAuth'),
  handler: async () => {
    await handleQwenAuth('qwen-oauth', {});
  },
};

const codePlanCommand = {
  command: 'coding-plan',
  describe: t('Authenticate using Alibaba Cloud Coding Plan'),
  builder: (yargs: Argv) =>
    yargs
      .option('region', {
        alias: 'r',
        describe: t('Region for Coding Plan (china/global)'),
        type: 'string',
      })
      .option('key', {
        alias: 'k',
        describe: t('API key for Coding Plan'),
        type: 'string',
      }),
  handler: async (argv: { region?: string; key?: string }) => {
    const region = argv['region'] as string | undefined;
    const key = argv['key'] as string | undefined;

    // If region and key are provided, use them directly
    if (region && key) {
      await handleQwenAuth('coding-plan', { region, key });
    } else {
      // Otherwise, prompt interactively
      await handleQwenAuth('coding-plan', {});
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

// Dynamically build one subcommand per provider in PROVIDER_REGISTRY
const providerCommands = PROVIDER_REGISTRY.map((provider) => ({
  command: provider.id,
  describe: t('Authenticate using {{label}}', { label: provider.label }),
  builder: (yargs: Argv) =>
    yargs.option('key', {
      alias: 'k',
      describe: t('API key for {{label}}', { label: provider.label }),
      type: 'string',
    }),
  handler: async (argv: { key?: string }) => {
    await handleApiKeyAuth(provider.id, { apiKey: argv['key'] });
  },
}));

export const authCommand: CommandModule = {
  command: 'auth',
  describe: t(
    'Configure HopCode authentication — Coding Plan, Qwen OAuth, or any AI provider',
  ),
  builder: (yargs: Argv) => {
    let y = yargs
      .command(qwenOauthCommand)
      .command(codePlanCommand)
      .command(statusCommand);

    // Register all provider subcommands
    for (const cmd of providerCommands) {
      y = y.command(cmd);
    }

    return y.demandCommand(0).version(false);
  },
  handler: async () => {
    // No subcommand provided — show interactive menu
    await runInteractiveAuth();
  },
};
