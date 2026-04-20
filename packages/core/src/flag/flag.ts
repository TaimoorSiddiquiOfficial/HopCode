/**
 * Feature flags read from environment variables.
 * These control experimental or gated behaviour in core.
 */
export const Flag = {
  /**
   * Override the maximum output tokens. 0 means use the model default (32_000 fallback).
   * Set OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=<number> to override.
   */
  OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX: process.env[
    'OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX'
  ]
    ? parseInt(process.env['OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX']!, 10)
    : 0,

  /**
   * Show models with status "alpha" in the model catalog.
   * Set OPENCODE_ENABLE_EXPERIMENTAL_MODELS=true to enable.
   */
  OPENCODE_ENABLE_EXPERIMENTAL_MODELS:
    process.env['OPENCODE_ENABLE_EXPERIMENTAL_MODELS'] === 'true' ||
    process.env['OPENCODE_ENABLE_EXPERIMENTAL_MODELS'] === '1',

  OPENCODE_MODELS_URL: process.env['OPENCODE_MODELS_URL'],
  OPENCODE_MODELS_PATH: process.env['OPENCODE_MODELS_PATH'],
  OPENCODE_DISABLE_MODELS_FETCH:
    process.env['OPENCODE_DISABLE_MODELS_FETCH'] === 'true',
} as const;
