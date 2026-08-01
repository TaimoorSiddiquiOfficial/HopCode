/**
 * TokenRefreshManager - Handles OAuth token refresh with rate limiting.
 *
 * This class encapsulates token refresh logic following SOLID principles:
 * - Single Responsibility: Only handles token refresh orchestration
 * - Open/Closed: Delegates to SourceCredentialManager for actual refresh
 * - Dependency Inversion: Takes credential manager as dependency
 *
 * Rate limiting is instance-scoped, not module-level, making it:
 * - Testable (can create fresh instances)
 * - Session-isolated (each session can have its own manager)
 */
import { type LoadedSource } from './types.ts';
import type { SourceCredentialManager } from './credential-manager.ts';
export interface TokenRefreshResult {
    /** Whether the token was successfully refreshed */
    success: boolean;
    /** The fresh token if successful */
    token?: string;
    /** Error reason if failed */
    reason?: string;
    /** Whether this was skipped due to rate limiting */
    rateLimited?: boolean;
}
export interface RefreshManagerOptions {
    /** Cooldown period after failed refresh (default: 5 minutes) */
    cooldownMs?: number;
    /** Logger function for debug output */
    log?: (message: string) => void;
}
export declare class TokenRefreshManager {
    private failedAttempts;
    private cooldownMs;
    private log;
    private credManager;
    constructor(credManager: SourceCredentialManager, options?: RefreshManagerOptions);
    /**
     * Check if a source is in cooldown after a recent failed refresh.
     */
    isInCooldown(sourceSlug: string): boolean;
    /**
     * Record a failed refresh attempt for rate limiting.
     */
    private recordFailure;
    /**
     * Clear the failure record when refresh succeeds.
     */
    private clearFailure;
    /**
     * Clear cooldown for a source (e.g. after successful re-authentication).
     */
    clearCooldown(sourceSlug: string): void;
    /**
     * Reset all rate limiting state (useful for testing).
     */
    reset(): void;
    /**
     * Check if a source needs token refresh.
     * Returns true if the token is expired or expiring soon (within 5 min).
     */
    needsRefresh(source: LoadedSource): Promise<boolean>;
    /**
     * Ensure a source has a fresh token, refreshing if needed.
     * This is the single entry point for token refresh (DRY principle).
     *
     * @param source - The source to refresh
     * @returns Result with success status, token, or error reason
     */
    ensureFreshToken(source: LoadedSource): Promise<TokenRefreshResult>;
    /**
     * Get all refreshable sources that need token refresh.
     * Includes MCP OAuth, API OAuth (Google, Slack, Microsoft), and renew-endpoint sources.
     * Filters out sources in cooldown.
     */
    getSourcesNeedingRefresh(sources: LoadedSource[]): Promise<LoadedSource[]>;
    /**
     * Refresh multiple sources in parallel.
     * Returns list of sources that were successfully refreshed and list of failures.
     */
    refreshSources(sources: LoadedSource[]): Promise<{
        refreshed: LoadedSource[];
        failed: Array<{
            source: LoadedSource;
            reason: string;
        }>;
    }>;
}
/**
 * Create a token getter function for refreshable API sources (OAuth or renew-endpoint).
 * This wraps the refresh manager for use with the server builder.
 */
export declare function createTokenGetter(refreshManager: TokenRefreshManager, source: LoadedSource): () => Promise<string>;
