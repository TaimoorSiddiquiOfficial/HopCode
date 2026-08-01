/**
 * Provider metadata for user-facing error messages and recovery actions.
 * Maps provider identifiers to their status pages and dashboards.
 */
export interface ProviderMetadata {
    /** Display name */
    name: string;
    /** Provider status page URL */
    statusPageUrl?: string;
    /** Provider dashboard/billing URL */
    dashboardUrl?: string;
}
/**
 * Look up provider metadata by provider type.
 */
export declare function getProviderMetadata(providerType: string): ProviderMetadata | undefined;
/**
 * Get just the display name for a provider, with a fallback.
 */
export declare function getProviderDisplayName(providerType: string): string;
