/**
 * Provider metadata for user-facing error messages and recovery actions.
 * Maps provider identifiers to their status pages and dashboards.
 */
/**
 * Metadata for the Qwen backend.
 */
const PROVIDER_METADATA = {
    qwen: {
        name: 'HopCode',
        dashboardUrl: 'https://chat.hopcode.ai',
    },
};
/**
 * Look up provider metadata by provider type.
 */
export function getProviderMetadata(providerType) {
    if (providerType === 'hopcode') {
        return PROVIDER_METADATA.hopcode;
    }
    return undefined;
}
/**
 * Get just the display name for a provider, with a fallback.
 */
export function getProviderDisplayName(providerType) {
    return getProviderMetadata(providerType)?.name ?? 'AI provider';
}
//# sourceMappingURL=provider-metadata.js.map