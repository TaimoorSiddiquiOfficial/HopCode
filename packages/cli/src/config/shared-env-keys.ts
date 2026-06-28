/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

export const DEFAULT_EXCLUDED_ENV_VARS = ['DEBUG', 'DEBUG_MODE'];

export const ENV_CORRUPTED_PATH = 'HOPCODE_CODE_SETTINGS_CORRUPTED_PATH';
export const ENV_WAS_RECOVERED = 'HOPCODE_CODE_SETTINGS_WAS_RECOVERED';

// HOPCODE_HOME and HOPCODE_RUNTIME_DIR control where global state (settings, OAuth
// credentials, installation IDs, etc.) is written. A project `.env` must never
// redirect these — that would split global state between the real home and a
// project-controlled directory. Always excluded from project .env files,
// regardless of user-configurable `advanced.excludedEnvVars`.
export const PROJECT_ENV_HARDCODED_EXCLUSIONS = [
  'HOPCODE_HOME',
  'HOPCODE_RUNTIME_DIR',
  'HOPCODE_CODE_MCP_APPROVALS_PATH',
  'HOPCODE_CODE_TRUSTED_FOLDERS_PATH',
  ENV_CORRUPTED_PATH,
  ENV_WAS_RECOVERED,
];

export const HOME_ENV_BOOTSTRAP_KEYS = [
  'HOPCODE_HOME',
  'HOPCODE_RUNTIME_DIR',
  'HOPCODE_CODE_MCP_APPROVALS_PATH',
  'HOPCODE_CODE_TRUSTED_FOLDERS_PATH',
] as const;
