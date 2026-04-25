/**
 * @license
 * Copyright 2026 HopCode Team Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { getActiveProfile } from './profileStore.js';
import type { LoadedSettings } from '../../config/settings.js';
import { SettingScope } from '../../config/settings.js';
import type { CliArgs } from '../../config/config.js';

/**
 * At startup, apply the active profile's provider/model configuration to
 * settings so the runtime picks them up.  This makes `hopcode profile use`
 * take effect without a manual `/provider` step on next launch.
 *
 * Skips application when the user explicitly passed `--model` on the CLI
 * (explicit args should always win).
 */
export async function applyActiveProfile(
  settings: LoadedSettings,
  argv: CliArgs,
): Promise<void> {
  // Don't override explicit CLI flags
  if (argv.model) return;

  const profile = await getActiveProfile();
  if (!profile) return;

  // Write auth type
  settings.setValue(
    SettingScope.User,
    'security.auth.selectedType',
    profile.provider,
  );

  // Write model
  settings.setValue(SettingScope.User, 'model.name', profile.model);

  // Write API key to env in settings + process.env so it is picked up
  // immediately (mirrors persistProviderConfig in ProviderDialog.tsx).
  if (profile.apiKey && profile.envKey) {
    settings.setValue(
      SettingScope.User,
      `env.${profile.envKey}`,
      profile.apiKey,
    );
    process.env[profile.envKey] = profile.apiKey;
  }

  // Write base URL if provided
  if (profile.baseUrl) {
    const baseUrlKey = `${profile.provider.toUpperCase()}_BASE_URL`;
    settings.setValue(SettingScope.User, `env.${baseUrlKey}`, profile.baseUrl);
    process.env[baseUrlKey] = profile.baseUrl;
  }

  // Write modelProviders entry so the model registry picks it up
  const providerLower = profile.provider.toLowerCase();
  const modelProvidersKey =
    providerLower === 'anthropic'
      ? 'USE_ANTHROPIC'
      : providerLower === 'gemini' || providerLower === 'vertex'
        ? 'USE_GEMINI'
        : 'USE_OPENAI';

  const existingProviders =
    (settings.merged.modelProviders as Record<string, unknown[]> | undefined) ??
    {};
  const existingList = existingProviders[modelProvidersKey] ?? [];
  const newEntry = {
    id: profile.model,
    name: `[${profile.provider}] ${profile.model}`,
    envKey: profile.envKey || `${profile.provider.toUpperCase()}_API_KEY`,
    ...(profile.baseUrl ? { baseUrl: profile.baseUrl } : {}),
  };
  settings.setValue(SettingScope.User, `modelProviders.${modelProvidersKey}`, [
    newEntry,
    ...existingList,
  ]);
}
