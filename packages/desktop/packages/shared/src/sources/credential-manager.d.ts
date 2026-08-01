/**
 * SourceCredentialManager
 *
 * Unified credential management for sources. Consolidates credential CRUD,
 * credential ID resolution, expiry checking, and OAuth flows.
 *
 * This replaces scattered credential logic across:
 * - SourceService.getSourceToken()
 * - SourceService.getApiCredential()
 * - SourceService.getCredentialId()
 * - session-scoped-tools OAuth triggers
 * - IPC handlers for credential storage
 */
import { type LoadedSource } from './types.ts';
import type { CredentialId, StoredCredential } from '../credentials/types.ts';
import { type OAuthCallbacks } from '../auth/oauth.ts';
import { type OAuthSessionContext } from '../auth/types.ts';
import type { PreparedOAuthFlow, OAuthExchangeParams, OAuthProvider } from '../auth/oauth-flow-types.ts';
/**
 * Result of authentication attempt
 */
export interface AuthResult {
    success: boolean;
    error?: string;
    /** For Gmail OAuth, includes user's email */
    email?: string;
}
/**
 * API credential types (string for simple auth, object for basic auth or multi-header)
 */
export interface BasicAuthCredential {
    username: string;
    password: string;
}
/**
 * Multi-header credentials stored as Record<string, string>
 * Used for APIs like Datadog that require multiple auth headers (DD-API-KEY + DD-APPLICATION-KEY)
 */
export type MultiHeaderCredential = Record<string, string>;
export type ApiCredential = string | BasicAuthCredential | MultiHeaderCredential;
/**
 * Type guard to check if credential is a MultiHeaderCredential.
 * Returns true for Record<string, string> objects that are NOT BasicAuthCredential.
 */
export declare function isMultiHeaderCredential(cred: ApiCredential): cred is MultiHeaderCredential;
/**
 * SourceCredentialManager - unified credential operations for sources
 *
 * Usage:
 * ```typescript
 * const credManager = new SourceCredentialManager();
 *
 * // Save credentials
 * await credManager.save(source, { value: 'token123' });
 *
 * // Load credentials
 * const cred = await credManager.load(source);
 *
 * // Run OAuth flow
 * const result = await credManager.authenticate(source, {
 *   onStatus: (msg) => console.log(msg),
 *   onError: (err) => console.error(err),
 * });
 * ```
 */
export declare class SourceCredentialManager {
    private pendingRefreshes;
    /**
     * Save credential for a source
     */
    save(source: LoadedSource, credential: StoredCredential): Promise<void>;
    /**
     * Load credential for a source
     *
     * For MCP sources, tries both OAuth and bearer credentials as fallback
     * (credentials may have been stored via different auth modes)
     */
    load(source: LoadedSource): Promise<StoredCredential | null>;
    /**
     * Load MCP credential with fallback (OAuth -> bearer)
     */
    private loadMcpCredential;
    /**
     * Delete credential for a source
     */
    delete(source: LoadedSource): Promise<boolean>;
    /**
     * Get token value for a source (convenience method)
     * Returns null if no credential exists or if expired
     */
    getToken(source: LoadedSource): Promise<string | null>;
    /**
     * Get API credential for a source (handles basic auth and multi-header JSON parsing)
     */
    getApiCredential(source: LoadedSource): Promise<ApiCredential | null>;
    /**
     * Get the credential ID for a source
     *
     * Determines the correct credential type based on:
     * - Source type (mcp, api, local)
     * - Auth type (oauth, bearer, header, etc.)
     */
    getCredentialId(source: LoadedSource): CredentialId;
    /**
     * Check if a credential is expired
     */
    isExpired(credential: StoredCredential): boolean;
    /**
     * Check if a credential needs refresh (within 5 min of expiry)
     */
    needsRefresh(credential: StoredCredential): boolean;
    /**
     * Mark a source as needing re-authentication.
     * Called when token is missing/expired or token refresh fails.
     * Updates config.json so the UI shows "needs auth" and the agent gets proper context.
     */
    markSourceNeedsReauth(source: LoadedSource, errorMessage: string): void;
    /**
     * Check if source has valid (non-expired) credentials
     */
    hasValidCredentials(source: LoadedSource): Promise<boolean>;
    /**
     * Detect the OAuth provider for a source.
     */
    detectProvider(source: LoadedSource): OAuthProvider;
    /**
     * Prepare an OAuth flow for a source (server-side).
     *
     * Generates PKCE, state, and auth URL without opening a browser or starting
     * a callback server. The caller provides either callbackPort (Electron local
     * server) or callbackUrl (WebUI server endpoint) for the redirect URI.
     *
     * Returns a PreparedOAuthFlow that should be stored in the flow store
     * and partially returned to the client (authUrl, state, flowId).
     */
    prepareOAuth(source: LoadedSource, options: {
        callbackPort?: number;
        callbackUrl?: string;
    }): Promise<PreparedOAuthFlow>;
    /**
     * Exchange an authorization code for tokens and store them (server-side).
     *
     * Called after the client forwards the code from the OAuth callback.
     * Routes to the correct provider exchange, saves credentials, and marks
     * the source as authenticated.
     */
    exchangeAndStore(source: LoadedSource, provider: OAuthProvider, params: OAuthExchangeParams): Promise<AuthResult>;
    /**
     * Authenticate source via OAuth
     *
     * Handles both MCP OAuth and Gmail OAuth flows.
     * On success, credentials are automatically saved.
     */
    authenticate(source: LoadedSource, callbacks?: OAuthCallbacks, sessionContext?: OAuthSessionContext): Promise<AuthResult>;
    /**
     * Authenticate MCP source via OAuth
     */
    private authenticateMcp;
    /**
     * Authenticate Google API source via Google OAuth
     *
     * Supports multiple Google services (Gmail, Calendar, Drive) via:
     * - provider: "google" with googleService field
     * - provider: "google" with custom googleScopes
     * - Inferred from baseUrl (e.g., gmail.googleapis.com → gmail)
     */
    private authenticateGoogle;
    /**
     * Authenticate Slack API source via Slack OAuth
     *
     * Supports multiple Slack services via:
     * - provider: "slack" with slackService field
     * - provider: "slack" with custom slackBotScopes/slackUserScopes
     * - Inferred from baseUrl (slack.com → full)
     */
    private authenticateSlack;
    /**
     * Authenticate Microsoft API source via Microsoft OAuth
     *
     * Supports multiple Microsoft services (Outlook, OneDrive, Calendar, Teams) via:
     * - provider: "microsoft" with microsoftService field
     * - provider: "microsoft" with custom microsoftScopes
     * - Inferred from baseUrl (e.g., graph.microsoft.com → outlook)
     */
    private authenticateMicrosoft;
    /**
     * Refresh token for a source
     *
     * Returns the new access token, or null if refresh fails.
     * On success, credentials are automatically updated.
     *
     * Uses promise deduplication to prevent concurrent refresh requests for the same source.
     * This is important because:
     * - Multiple API calls may hit refresh simultaneously when token is expiring
     * - Microsoft rotates refresh tokens, so concurrent refreshes could cause token invalidation
     */
    refresh(source: LoadedSource): Promise<string | null>;
    /**
     * Internal refresh implementation
     */
    private doRefresh;
    /**
     * Refresh token via a custom API renew endpoint (non-OAuth).
     * Uses the current access token for renewal — no separate refresh token needed.
     */
    private refreshApiRenew;
    /**
     * Refresh Google OAuth token
     */
    private refreshGoogle;
    /**
     * Refresh Slack OAuth token
     */
    private refreshSlack;
    /**
     * Refresh Microsoft OAuth token
     */
    private refreshMicrosoft;
    /**
     * Authenticate source via generic OAuth flow (CLI/test convenience wrapper).
     * Note: The session-based UI flow goes through prepareOAuth() + exchangeAndStore() instead.
     */
    private authenticateGeneric;
    /**
     * Refresh generic OAuth token.
     * tokenUrl from source config, clientId/clientSecret from stored credential falling back to config.
     */
    private refreshGeneric;
    /**
     * Refresh MCP OAuth token
     */
    private refreshMcp;
}
/**
 * Check if a single source needs authentication.
 * Returns true if the source requires auth but isn't yet authenticated.
 *
 * This is the **inverse** of the auth portion of isSourceUsable().
 * - isSourceUsable() → Is the source ready to use? (enabled AND auth OK)
 * - sourceNeedsAuthentication() → Does the source need auth to become usable?
 *
 * Use this to prompt users for authentication, not for filtering sources.
 * For filtering sources, use isSourceUsable() from storage.ts.
 *
 * This correctly handles:
 * - MCP sources with authType: "none" → never needs auth
 * - MCP sources with stdio transport → never needs auth (runs locally)
 * - MCP sources with oauth/bearer → needs auth if not authenticated
 * - API sources with authType: "none" → never needs auth
 * - API sources with bearer/basic/header/query auth → needs auth if not authenticated
 */
export declare function sourceNeedsAuthentication(source: LoadedSource): boolean;
/**
 * Get sources that need authentication
 * Returns enabled sources that require auth but aren't yet authenticated
 */
export declare function getSourcesNeedingAuth(sources: LoadedSource[]): LoadedSource[];
/**
 * Get shared SourceCredentialManager instance
 */
export declare function getSourceCredentialManager(): SourceCredentialManager;
