/**
 * Provider Icons
 *
 * Maps the built-in Qwen backend to display metadata.
 * Used in AI Settings page and anywhere connection logos are needed.
 */
import type { LlmProviderType } from '@craft-agent/shared/config/llm-connections';
/**
 * Icon URLs for each provider
 */
export declare const providerIcons: {};
export type ProviderIconKey = keyof typeof providerIcons;
/** Get a human-readable provider name from provider type and optional base URL */
export declare function getProviderDisplayName(providerType: string, _baseUrl?: string | null): string;
/**
 * Get provider icon URL for a given provider type and optional base URL.
 *
 * @param providerType - The LLM provider type
 * @param baseUrl - Ignored for the Qwen-only backend
 * @param authProvider - Ignored for the Qwen-only backend
 * @returns Icon URL string or null if no matching icon
 */
export declare function getProviderIcon(_providerType: LlmProviderType | string, _baseUrl?: string | null, _authProvider?: string | null): string | null;
