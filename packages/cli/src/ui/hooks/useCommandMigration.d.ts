/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { Storage } from '@hoptrendy/hopcode-core';
import type { LoadedSettings } from '../../config/settings.js';
/**
 * Hook to detect TOML command files and manage migration nudge visibility.
 * Checks all command directories: workspace, user, and global levels.
 */
export declare function useCommandMigration(settings: LoadedSettings, storage: Storage): {
    showMigrationNudge: boolean;
    tomlFiles: string[];
    setShowMigrationNudge: import("react").Dispatch<import("react").SetStateAction<boolean>>;
};
