/**
 * Credential Manager
 *
 * Main interface for credential storage. Uses encrypted file storage
 * for cross-platform compatibility without OS keychain prompts.
 */
import type { CredentialId, StoredCredential, CredentialHealthStatus } from './types.ts';
import type { LlmAuthType, LlmProviderType } from '../config/llm-connections.ts';
export declare class CredentialManager {
    private backends;
    private writeBackend;
    private initialized;
    private initPromise;
    /**
     * Explicitly initialize the credential manager.
     * This is optional - methods auto-initialize via ensureInitialized().
     * Use this for eager initialization at app startup if desired.
     */
    initialize(): Promise<void>;
    /**
     * Internal: ensure initialization has completed.
     * Called automatically by all public methods.
     */
    private ensureInitialized;
    private _doInitialize;
    /** Get the name of the active write backend */
    getActiveBackendName(): string | null;
    /**
     * Get a credential by ID, trying all backends.
     * Automatically initializes if needed.
     */
    get(id: CredentialId): Promise<StoredCredential | null>;
    /**
     * Set a credential using the write backend.
     * Automatically initializes if needed.
     */
    set(id: CredentialId, credential: StoredCredential): Promise<void>;
    /**
     * Delete a credential from all backends.
     * Automatically initializes if needed.
     */
    delete(id: CredentialId): Promise<boolean>;
    /**
     * List credentials matching a filter.
     * Automatically initializes if needed.
     */
    list(filter?: Partial<CredentialId>): Promise<CredentialId[]>;
    /** Get workspace MCP OAuth credentials */
    getWorkspaceOAuth(workspaceId: string): Promise<{
        accessToken: string;
        tokenType?: string;
        clientId?: string;
    } | null>;
    /** Set workspace MCP OAuth credentials */
    setWorkspaceOAuth(workspaceId: string, credentials: {
        accessToken: string;
        tokenType?: string;
        clientId?: string;
    }): Promise<void>;
    /** Delete all credentials for a workspace (source credentials) */
    deleteWorkspaceCredentials(workspaceId: string): Promise<void>;
    /**
     * Get API key for an LLM connection.
     * @param connectionSlug - The connection slug
     * @returns API key or null if not found
     */
    getLlmApiKey(connectionSlug: string): Promise<string | null>;
    /**
     * Set API key for an LLM connection.
     * @param connectionSlug - The connection slug
     * @param apiKey - The API key to store
     */
    setLlmApiKey(connectionSlug: string, apiKey: string): Promise<void>;
    /**
     * Delete API key for an LLM connection.
     * @param connectionSlug - The connection slug
     * @returns true if deleted, false if not found
     */
    deleteLlmApiKey(connectionSlug: string): Promise<boolean>;
    /**
     * Get OAuth token for an LLM connection.
     * @param connectionSlug - The connection slug
     * @returns OAuth credentials or null if not found
     */
    getLlmOAuth(connectionSlug: string): Promise<{
        accessToken: string;
        refreshToken?: string;
        expiresAt?: number;
        /** OIDC id_token (used by providers that return identity claims) */
        idToken?: string;
    } | null>;
    /**
     * Set OAuth token for an LLM connection.
     * @param connectionSlug - The connection slug
     * @param credentials - OAuth credentials to store
     */
    setLlmOAuth(connectionSlug: string, credentials: {
        accessToken: string;
        refreshToken?: string;
        expiresAt?: number;
        /** OIDC id_token (used by providers that return identity claims) */
        idToken?: string;
    }): Promise<void>;
    /**
     * Delete all credentials for an LLM connection.
     * @param connectionSlug - The connection slug
     */
    deleteLlmCredentials(connectionSlug: string): Promise<void>;
    /**
     * Get IAM credentials for an LLM connection.
     * @param connectionSlug - The connection slug
     * @returns IAM credentials or null if not found
     */
    getLlmIamCredentials(connectionSlug: string): Promise<{
        accessKeyId: string;
        secretAccessKey: string;
        region?: string;
        sessionToken?: string;
    } | null>;
    /**
     * Set IAM credentials for an LLM connection.
     * @param connectionSlug - The connection slug
     * @param credentials - IAM credentials to store
     */
    setLlmIamCredentials(connectionSlug: string, credentials: {
        accessKeyId: string;
        secretAccessKey: string;
        region?: string;
        sessionToken?: string;
    }): Promise<void>;
    /**
     * Get service account credentials for an LLM connection.
     * @param connectionSlug - The connection slug
     * @returns Service account JSON and metadata or null if not found
     */
    getLlmServiceAccount(connectionSlug: string): Promise<{
        serviceAccountJson: string;
        projectId?: string;
        region?: string;
        email?: string;
    } | null>;
    /**
     * Set service account credentials for an LLM connection.
     * @param connectionSlug - The connection slug
     * @param credentials - Service account credentials to store
     */
    setLlmServiceAccount(connectionSlug: string, credentials: {
        serviceAccountJson: string;
        projectId?: string;
        region?: string;
        email?: string;
    }): Promise<void>;
    /**
     * Check if an LLM connection has valid credentials.
     * Uses the new LlmAuthType system - routes by auth mechanism.
     *
     * @param connectionSlug - The connection slug
     * @param authType - The auth type to check
     * @param providerType - Optional provider type for OAuth routing
     * @returns true if credentials exist and are valid
     */
    hasLlmCredentials(connectionSlug: string, authType: LlmAuthType, providerType?: LlmProviderType): Promise<boolean>;
    /**
     * Check if connection has valid API key credential.
     * @internal
     */
    private hasLlmApiKeyCredential;
    /**
     * Check if connection has valid OAuth credential.
     * @internal
     */
    private hasLlmOAuthCredential;
    /**
     * Check if connection has valid IAM credential.
     * @internal
     */
    private hasLlmIamCredential;
    /**
     * Check if connection has valid service account credential.
     * @internal
     */
    private hasLlmServiceAccountCredential;
    /**
     * Check if a credential is expired (with 5-minute buffer).
     *
     * If expiresAt is not set:
     * - OAuth tokens (have refreshToken): treated as expired to force refresh attempt
     * - API keys (no refreshToken): treated as never expiring
     *
     * This prevents OAuth tokens from being treated as valid forever when
     * the provider doesn't return expires_in in the token response.
     */
    isExpired(credential: StoredCredential): boolean;
    /**
     * Check the health of the credential store.
     *
     * This validates:
     * 1. The credential file can be read and decrypted (if it exists)
     * 2. The default LLM connection has valid credentials
     *
     * Use this on app startup to detect issues before users hit cryptic errors.
     *
     * @returns Health status with any issues found
     */
    checkHealth(): Promise<CredentialHealthStatus>;
}
export declare function getCredentialManager(): CredentialManager;
