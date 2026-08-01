/**
 * Connection Setup Logic
 *
 * Pure functions extracted from ipc.ts for testability.
 * No dependency on ipcMain, sessionManager, credential manager, or file I/O.
 */
import type { ModelDefinition } from '@craft-agent/shared/config/models';
import { type LlmConnection } from '@craft-agent/shared/config';
/**
 * Parse an error message from a connection test into a user-friendly string.
 */
export declare function parseTestConnectionError(msg: string): string;
/**
 * Validate setup test input for the Qwen-only backend.
 */
export declare function validateSetupTestInput(params: {
    provider: 'hopcode';
    baseUrl?: string;
}): {
    valid: true;
} | {
    valid: false;
    error: string;
};
/**
 * Returns true when a URL points to local loopback.
 * Used to permit keyless setup tests for local model runtimes (e.g. Ollama).
 */
export declare function isLoopbackBaseUrl(baseUrl?: string): boolean;
/**
 * Setup tests require API keys for non-local endpoints, but local loopback
 * endpoints may be keyless.
 */
export declare function setupTestRequiresApiKey(baseUrl?: string): boolean;
/**
 * Built-in connection templates for the onboarding flow.
 * Each template defines the default configuration for a known connection slug.
 */
export declare const BUILT_IN_CONNECTION_TEMPLATES: Record<string, {
    name: string | ((hasCustomEndpoint: boolean) => string);
    providerType: LlmConnection['providerType'] | ((hasCustomEndpoint: boolean) => LlmConnection['providerType']);
    authType: LlmConnection['authType'] | ((hasCustomEndpoint: boolean) => LlmConnection['authType']);
}>;
/**
 * Create an LLM connection configuration from a connection slug.
 * Uses built-in templates for known slugs, throws for unknown slugs
 * (custom connections are created through the settings UI).
 */
export declare function createBuiltInConnection(slug: string, baseUrl?: string | null): LlmConnection;
/**
 * Validate that the default model exists in the provided model list.
 * Handles both string and ModelDefinition model entries.
 *
 * This was extracted from inline logic in the setupLlmConnection IPC handler
 * to fix a bug where Array.includes() compared strings against ModelDefinition
 * objects.
 */
export declare function validateModelList(models: Array<ModelDefinition | string>, defaultModel: string | undefined): {
    valid: boolean;
    error?: string;
    resolvedDefaultModel?: string;
};
