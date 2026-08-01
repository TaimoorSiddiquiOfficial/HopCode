/**
 * Shared environment sanitization for script-execution tools.
 */
import type { ScriptRuntimeLanguage } from './resolve-script-runtime.ts';
/**
 * Env vars stripped from subprocesses to prevent credential leakage.
 * NOTE: Keep in sync with packages/shared/src/mcp/client.ts (BLOCKED_ENV_VARS).
 */
export declare const BLOCKED_ENV_VARS: readonly ["LLM_API_KEY", "HOPCODE_API_KEY", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN", "GITHUB_TOKEN", "GH_TOKEN", "GOOGLE_API_KEY", "STRIPE_SECRET_KEY", "NPM_TOKEN"];
/**
 * Return a shallow-copied environment with sensitive variables removed.
 */
export declare function createSanitizedEnv(baseEnv?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
export interface ScriptRuntimeEnvOptions {
    language: ScriptRuntimeLanguage;
    dataDir: string;
}
/**
 * Build a sanitized subprocess env with runtime-local cache/temp paths.
 *
 * For Python/uv, redirect caches away from home-directory defaults (e.g. ~/.cache/uv)
 * into the writable session data directory so sandboxed execution remains reliable.
 */
export declare function createScriptRuntimeEnv(options: ScriptRuntimeEnvOptions, baseEnv?: NodeJS.ProcessEnv): NodeJS.ProcessEnv;
