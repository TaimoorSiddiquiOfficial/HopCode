/**
 * Logo URL utility
 *
 * Returns Google Favicon URLs for APIs and MCP servers.
 * Browser handles caching - no need to save files locally.
 */
/**
 * Canonical domains for known providers.
 * Maps provider names to their canonical domain for proper favicon resolution.
 * This fixes issues like api.gmail.com returning a globe icon instead of Gmail logo.
 */
/**
 * Direct icon URLs for providers that need explicit URLs.
 * These take precedence over domain-based favicon fetching.
 */
export declare const PROVIDER_ICON_URLS: Record<string, string>;
export { deriveServiceUrl } from './service-url.ts';
/**
 * Get canonical domain for a provider.
 * Merges static domains with user-cached domains (static takes precedence).
 *
 * @param provider - Provider name (case-insensitive)
 * @returns Canonical domain or undefined if not found
 */
export declare function getProviderDomain(provider: string): string | undefined;
/**
 * Reset the provider domain cache (for testing).
 * Allows tests to clear cached state between test cases.
 */
export declare function _resetProviderDomainCache(): void;
/**
 * Extract domain from URL
 */
export declare function extractDomain(url: string): string | null;
/**
 * Extract root domain from hostname (strips subdomains like api., www., etc.)
 * e.g., "api.github.com" -> "github.com"
 *       "mcp.linear.app" -> "linear.app"
 */
export declare function extractRootDomain(hostname: string): string;
/**
 * Get high-quality logo URL for a service
 * Tries direct favicon paths, then parses HTML <head>, before falling back to Google API
 *
 * This function makes HTTP requests to find the best quality favicon.
 * Results should be cached (stored in source config) to avoid repeated requests.
 *
 * @param serviceUrl - The service URL to get logo for
 * @param provider - Optional provider name (e.g., 'gmail') to use canonical domain mapping
 */
export declare function getHighQualityLogoUrl(serviceUrl: string, provider?: string): Promise<string | null>;
/**
 * Get logo URL for a service (synchronous, uses Google Favicon API)
 * Returns Google Favicon URL or null for internal domains.
 *
 * Use getHighQualityLogoUrl() when possible for better quality icons.
 *
 * @param serviceUrl - The service URL to get logo for
 * @param provider - Optional provider name (e.g., 'gmail') to use canonical domain mapping
 */
export declare function getLogoUrl(serviceUrl: string, provider?: string): string | null;
