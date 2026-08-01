/**
 * Feature flags read from environment variables.
 * These control experimental or gated behaviour in core.
 */
export declare const Flag: {
    /**
     * Override the maximum output tokens. 0 means use the model default (32_000 fallback).
     * Set OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX=<number> to override.
     */
    readonly OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX: number;
    /**
     * Show models with status "alpha" in the model catalog.
     * Set OPENCODE_ENABLE_EXPERIMENTAL_MODELS=true to enable.
     */
    readonly OPENCODE_ENABLE_EXPERIMENTAL_MODELS: boolean;
    readonly OPENCODE_MODELS_URL: string | undefined;
    readonly OPENCODE_MODELS_PATH: string | undefined;
    readonly OPENCODE_DISABLE_MODELS_FETCH: boolean;
};
