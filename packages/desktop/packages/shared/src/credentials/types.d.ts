/**
 * Credential Storage Types
 *
 * Defines the types for secure credential storage using AES-256-GCM encryption.
 * Supports global and source-scoped credentials.
 *
 * Credential key format: "{type}::{scope...}"
 *
 * Examples:
 *   - source_oauth::{workspaceId}::{sourceId}
 *   - source_bearer::{workspaceId}::{sourceId}
 *
 * Note: Using "::" as delimiter to avoid conflicts with "/" in URLs or paths.
 */
/** Types of credentials we store */
export type CredentialType = 'llm_api_key' | 'llm_oauth' | 'llm_iam' | 'llm_service_account' | 'workspace_oauth' | 'source_oauth' | 'source_bearer' | 'source_apikey' | 'source_basic' | 'messaging_bearer';
/** Credential identifier - determines credential store entry key */
export interface CredentialId {
    type: CredentialType;
    /** LLM connection slug for llm_api_key/llm_oauth credentials */
    connectionSlug?: string;
    /** Workspace ID for workspace-scoped credentials */
    workspaceId?: string;
    /** Source ID for source credentials */
    sourceId?: string;
    /** Server name or API name */
    name?: string;
}
/**
 * Stored credential value in encrypted file.
 *
 * This is a generic type for all credential types (OAuth, bearer tokens, API keys, IAM, service accounts).
 * All fields except `value` are optional since not all credential types use them.
 *
 * Note: `clientId` is optional here unlike `OAuthCredentials` (in storage.ts)
 * where it's required, because this type also covers bearer tokens and API keys
 * which don't have a clientId.
 */
export interface StoredCredential {
    /** The secret value (API key, access token, or primary credential) */
    value: string;
    /** OAuth refresh token */
    refreshToken?: string;
    /** OAuth token expiration (Unix timestamp ms) */
    expiresAt?: number;
    /** OAuth client ID (needed for token refresh) */
    clientId?: string;
    /** OAuth client secret (needed for Google token refresh - Google requires both ID and secret) */
    clientSecret?: string;
    /** Token type (e.g., "Bearer") */
    tokenType?: string;
    /** Where the credential came from. */
    source?: 'native' | 'cli';
    /**
     * OIDC id_token (JWT with user identity claims).
     * Used by OIDC providers that return both id_token and access_token.
     * The `value` field stores access_token, this field stores id_token.
     */
    idToken?: string;
    /** AWS Access Key ID (for IAM credentials) */
    awsAccessKeyId?: string;
    /** AWS Secret Access Key (for IAM credentials) - stored in `value` field */
    /** AWS Region (for IAM credentials) */
    awsRegion?: string;
    /** AWS Session Token (for temporary credentials) */
    awsSessionToken?: string;
    /** GCP Project ID (for service account) */
    gcpProjectId?: string;
    /** GCP Region (for service account) */
    gcpRegion?: string;
    /** Service account email (for identification) */
    serviceAccountEmail?: string;
}
/** Source credential types */
export declare const SOURCE_CREDENTIAL_TYPES: readonly ["source_oauth", "source_bearer", "source_apikey", "source_basic"];
/** Convert CredentialId to credential store account string */
export declare function credentialIdToAccount(id: CredentialId): string;
/** Types of credential health issues detected at startup */
export type CredentialHealthIssueType = 'file_corrupted' | 'decryption_failed' | 'no_default_credentials';
/** A single credential health issue */
export interface CredentialHealthIssue {
    type: CredentialHealthIssueType;
    /** Human-readable error message */
    message: string;
    /** Original error if available */
    error?: string;
}
/** Result of credential store health check */
export interface CredentialHealthStatus {
    /** True if credential store is healthy and usable */
    healthy: boolean;
    /** List of issues found (empty if healthy) */
    issues: CredentialHealthIssue[];
}
/** Parse credential store account string back to CredentialId. Returns null if invalid. */
export declare function accountToCredentialId(account: string): CredentialId | null;
