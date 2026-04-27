/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FileFilteringOptions {
  respectGitIgnore: boolean;
  respectHopCodeIgnore: boolean;
  respectQwenIgnore?: boolean;
  customExcludes?: string[];
}

// For memory files
export const DEFAULT_MEMORY_FILE_FILTERING_OPTIONS: FileFilteringOptions = {
  respectGitIgnore: false,
  respectHopCodeIgnore: true,
  respectQwenIgnore: false,
};

// For all other files
export const DEFAULT_FILE_FILTERING_OPTIONS: FileFilteringOptions = {
  respectGitIgnore: true,
  respectHopCodeIgnore: true,
  respectQwenIgnore: true,
};
