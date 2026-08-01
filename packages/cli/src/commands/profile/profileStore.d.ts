/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
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
/** Returns the path to the profile store file (user home dir). */
export declare function getProfileStorePath(): string;
/** Read the profile store from disk. Returns an empty store if missing. */
export declare function readProfileStore(): Promise<ProfileStore>;
/** Write the profile store to disk. */
export declare function writeProfileStore(store: ProfileStore): Promise<void>;
/** Add or update a profile in the store. */
export declare function saveProfile(profile: HopCodeProfile): Promise<void>;
/** Delete a profile by name. Returns true if deleted, false if not found. */
export declare function deleteProfile(name: string): Promise<boolean>;
/** Get a profile by name. */
export declare function getProfile(name: string): Promise<HopCodeProfile | undefined>;
/** Set the active profile. */
export declare function setActiveProfile(name: string): Promise<void>;
/** Get the currently active profile. */
export declare function getActiveProfile(): Promise<HopCodeProfile | undefined>;
