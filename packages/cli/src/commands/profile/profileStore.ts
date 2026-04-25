/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

export interface HopCodeProfile {
  name: string;
  provider: string;
  model: string;
  baseUrl?: string;
  apiKey?: string;
  envKey?: string;
  description?: string;
  createdAt: string;
}

export interface ProfileStore {
  version: 1;
  profiles: HopCodeProfile[];
  active?: string;
}

const PROFILE_FILENAME = '.hopcode-profiles.json';

/** Returns the path to the profile store file (user home dir). */
export function getProfileStorePath(): string {
  return path.join(os.homedir(), PROFILE_FILENAME);
}

/** Read the profile store from disk. Returns an empty store if missing. */
export async function readProfileStore(): Promise<ProfileStore> {
  const filePath = getProfileStorePath();
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as ProfileStore;
  } catch {
    return { version: 1, profiles: [] };
  }
}

/** Write the profile store to disk. */
export async function writeProfileStore(store: ProfileStore): Promise<void> {
  const filePath = getProfileStorePath();
  await fs.writeFile(filePath, JSON.stringify(store, null, 2) + '\n', 'utf-8');
}

/** Add or update a profile in the store. */
export async function saveProfile(profile: HopCodeProfile): Promise<void> {
  const store = await readProfileStore();
  const existingIndex = store.profiles.findIndex(
    (p) => p.name === profile.name,
  );
  if (existingIndex >= 0) {
    store.profiles[existingIndex] = profile;
  } else {
    store.profiles.push(profile);
  }
  await writeProfileStore(store);
}

/** Delete a profile by name. Returns true if deleted, false if not found. */
export async function deleteProfile(name: string): Promise<boolean> {
  const store = await readProfileStore();
  const before = store.profiles.length;
  store.profiles = store.profiles.filter((p) => p.name !== name);
  if (store.active === name) delete store.active;
  if (store.profiles.length < before) {
    await writeProfileStore(store);
    return true;
  }
  return false;
}

/** Get a profile by name. */
export async function getProfile(
  name: string,
): Promise<HopCodeProfile | undefined> {
  const store = await readProfileStore();
  return store.profiles.find((p) => p.name === name);
}

/** Set the active profile. */
export async function setActiveProfile(name: string): Promise<void> {
  const store = await readProfileStore();
  const exists = store.profiles.some((p) => p.name === name);
  if (!exists) {
    throw new Error(`Profile "${name}" not found.`);
  }
  store.active = name;
  await writeProfileStore(store);
}

/** Get the currently active profile. */
export async function getActiveProfile(): Promise<HopCodeProfile | undefined> {
  const store = await readProfileStore();
  if (!store.active) return undefined;
  return store.profiles.find((p) => p.name === store.active);
}
