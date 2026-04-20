/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import {
  readProfileStore,
  saveProfile,
  deleteProfile,
  setActiveProfile,
  getActiveProfile,
  getProfileStorePath,
  type HopCodeProfile,
} from './profileStore.js';

// ─── helpers ──────────────────────────────────────────────────────────────────

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return rl.question(question);
}

function log(msg: string): void {
  process.stdout.write(msg + '\n');
}

function err(msg: string): void {
  process.stderr.write(`✖ ${msg}\n`);
}

// ─── init handler ─────────────────────────────────────────────────────────────

export async function handleProfileInit(name?: string): Promise<void> {
  const rl = readline.createInterface({ input, output });

  try {
    const profileName =
      name ||
      (await prompt(rl, 'Profile name (e.g. "fast-local", "gpt4-work"): '));

    if (!profileName.trim()) {
      err('Profile name cannot be empty.');
      return;
    }

    const provider = await prompt(
      rl,
      'Provider (e.g. openai, anthropic, ollama, openrouter): ',
    );
    const model = await prompt(
      rl,
      'Model (e.g. gpt-4o, llama3.2, claude-3-5-sonnet): ',
    );
    const baseUrl = await prompt(
      rl,
      'Base URL (leave blank to use provider default): ',
    );
    const apiKey = await prompt(rl, 'API key (leave blank to use env var): ');
    const description = await prompt(rl, 'Description (optional): ');

    const profile: HopCodeProfile = {
      name: profileName.trim(),
      provider: provider.trim(),
      model: model.trim(),
      baseUrl: baseUrl.trim() || undefined,
      apiKey: apiKey.trim() || undefined,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await saveProfile(profile);
    log(`\n✔ Profile "${profile.name}" saved to ${getProfileStorePath()}`);
    log(`  Provider: ${profile.provider}`);
    log(`  Model:    ${profile.model}`);
    if (profile.baseUrl) log(`  Base URL: ${profile.baseUrl}`);
  } finally {
    rl.close();
  }
}

// ─── list handler ─────────────────────────────────────────────────────────────

export async function handleProfileList(): Promise<void> {
  const store = await readProfileStore();

  if (store.profiles.length === 0) {
    log('No profiles configured. Run `hopcode profile init` to create one.');
    return;
  }

  log(`\nProfiles (stored at ${getProfileStorePath()}):\n`);

  for (const p of store.profiles) {
    const active = store.active === p.name ? ' ← active' : '';
    log(`  ${p.name}${active}`);
    log(`    Provider: ${p.provider}  Model: ${p.model}`);
    if (p.baseUrl) log(`    Base URL: ${p.baseUrl}`);
    if (p.description) log(`    ${p.description}`);
  }

  log('');
}

// ─── use handler ──────────────────────────────────────────────────────────────

export async function handleProfileUse(name: string): Promise<void> {
  try {
    await setActiveProfile(name);
    log(`✔ Active profile set to "${name}".`);
    log(
      `  HopCode will use this provider/model configuration on next startup.`,
    );
  } catch (e) {
    err((e as Error).message);
    process.exitCode = 1;
  }
}

// ─── delete handler ───────────────────────────────────────────────────────────

export async function handleProfileDelete(name: string): Promise<void> {
  const deleted = await deleteProfile(name);
  if (deleted) {
    log(`✔ Profile "${name}" deleted.`);
  } else {
    err(`Profile "${name}" not found.`);
    process.exitCode = 1;
  }
}

// ─── show (current) handler ───────────────────────────────────────────────────

export async function handleProfileShow(): Promise<void> {
  const active = await getActiveProfile();
  if (!active) {
    log('No active profile. Use `hopcode profile use <name>` to activate one.');
    return;
  }

  log(`\nActive profile: ${active.name}`);
  log(`  Provider:    ${active.provider}`);
  log(`  Model:       ${active.model}`);
  if (active.baseUrl) log(`  Base URL:    ${active.baseUrl}`);
  if (active.description) log(`  Description: ${active.description}`);
  log('');
}
