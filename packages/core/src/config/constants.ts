/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_HOPCODE_CUSTOM_IGNORE_FILE_NAMES } from '../utils/hopCodeIgnoreParser.js';

export interface FileFilteringOptions {
  respectGitIgnore: boolean;
  respectHopCodeIgnore: boolean;
  customIgnoreFiles?: string[];
  customExcludes?: string[];
}

// For memory files
export const DEFAULT_MEMORY_FILE_FILTERING_OPTIONS: FileFilteringOptions = {
  respectGitIgnore: false,
  respectHopCodeIgnore: true,
  customIgnoreFiles: [...DEFAULT_HOPCODE_CUSTOM_IGNORE_FILE_NAMES],
};

// For all other files
export const DEFAULT_FILE_FILTERING_OPTIONS: FileFilteringOptions = {
  respectGitIgnore: true,
  respectHopCodeIgnore: true,
  customIgnoreFiles: [...DEFAULT_HOPCODE_CUSTOM_IGNORE_FILE_NAMES],
};

export const DEFAULT_TRUNCATE_TOOL_OUTPUT_THRESHOLD = 25_000;
export const DEFAULT_TRUNCATE_TOOL_OUTPUT_LINES = 1000;
