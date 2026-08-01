/**
 * Source Types
 *
 * Sources are external data connections (MCP servers, APIs, local filesystems).
 * They replace the old "connections" concept with a more flexible, folder-based architecture.
 *
 * File structure:
 * ~/.craft-agent/workspaces/{workspaceId}/sources/{sourceSlug}/
 *   ├── config.json   - Source settings
 *   └── guide.md      - Usage guidelines + cached data (in YAML frontmatter)
 */
/**
 * Source types - how we connect to the source
 */
export type SourceType = 'mcp' | 'api' | 'local';
/**
 * MCP source authentication types (for individual source connections)
 * Note: Different from workspace McpAuthType which uses 'workspace_oauth' | 'workspace_bearer' | 'public'
 */
export type SourceMcpAuthType = 'oauth' | 'bearer' | 'none';
/**
 * API authentication types
 */
export type HttpAuthType = 'bearer' | 'header' | 'query' | 'basic' | 'oauth' | 'none';
/**
 * Google service types for OAuth scope selection
 */
export type GoogleService = 'gmail' | 'calendar' | 'drive' | 'docs' | 'sheets' | 'youtube' | 'searchconsole';
/**
 * Slack service types for OAuth scope selection
 */
export type SlackService = 'messaging' | 'channels' | 'users' | 'files' | 'full';
/**
 * Microsoft service types for OAuth scope selection
 */
export type MicrosoftService = 'outlook' | 'microsoft-calendar' | 'onedrive' | 'teams' | 'sharepoint';
/**
 * Infer Google service from API baseUrl.
 * Returns undefined if URL doesn't match a known Google API pattern.
 *
 * Uses proper URL parsing to avoid false positives from arbitrary path matching.
 */
export declare function inferGoogleServiceFromUrl(baseUrl: string | undefined): GoogleService | undefined;
/**
 * Infer Slack service from API baseUrl.
 * Returns 'full' by default if URL matches Slack API pattern.
 */
export declare function inferSlackServiceFromUrl(baseUrl: string | undefined): SlackService | undefined;
/**
 * Infer Microsoft service from API baseUrl.
 * Microsoft Graph API uses graph.microsoft.com for all services.
 * Returns undefined if service cannot be determined from URL path.
 */
export declare function inferMicrosoftServiceFromUrl(baseUrl: string | undefined): MicrosoftService | undefined;
/**
 * Known providers for special handling (OAuth flows, icons, etc.)
 * These have well-known OAuth endpoints or special behavior.
 */
export type KnownProvider = 'google' | 'microsoft' | 'linear' | 'github' | 'notion' | 'slack' | 'exa';
/**
 * API providers that use OAuth for authentication.
 * These providers store credentials as source_oauth and use SourceCredentialManager.
 */
export declare const API_OAUTH_PROVIDERS: readonly ["google", "microsoft", "slack"];
export type ApiOAuthProvider = typeof API_OAUTH_PROVIDERS[number];
/**
 * Check if a provider uses OAuth for API authentication
 */
export declare function isApiOAuthProvider(provider: string | undefined): provider is ApiOAuthProvider;
/**
 * Check if a source uses OAuth authentication (for proactive token refresh).
 *
 * Returns true for:
 * - MCP sources with authType: 'oauth'
 * - API sources with OAuth providers (google, slack, microsoft)
 */
export declare function isOAuthSource(source: LoadedSource): boolean;
/**
 * Check if a source uses generic OAuth (not Google/Slack/Microsoft provider-specific).
 * Matches API sources with authType 'oauth' — either explicit oauth config block
 * or auto-discovery from baseUrl via RFC 9728/8414.
 */
export declare function isGenericOAuthSource(source: LoadedSource): boolean;
/**
 * Check if an API source has a token renew endpoint configured.
 */
export declare function hasRenewEndpoint(source: LoadedSource): boolean;
/**
 * Check if a source can auto-refresh its token.
 * Returns true for OAuth sources OR sources with a renewEndpoint.
 *
 * Use this as the single guard for "can this source refresh?" instead of
 * sprinkling provider/authType/renewEndpoint checks in multiple places.
 */
export declare function isRefreshableSource(source: LoadedSource): boolean;
/**
 * MCP transport type for sources
 * - 'http': HTTP-based MCP server (URL endpoint)
 * - 'sse': Server-Sent Events MCP server (URL endpoint)
 * - 'stdio': Local subprocess MCP server (spawned command)
 */
export type McpTransport = 'http' | 'sse' | 'stdio';
/**
 * MCP-specific configuration
 * Supports both HTTP-based and local stdio-based MCP servers.
 */
export interface McpSourceConfig {
    /**
     * Transport type. Defaults to 'http' if not specified.
     */
    transport?: McpTransport;
    /**
     * URL endpoint for HTTP or SSE transport.
     * Required when transport is 'http' or 'sse' (or undefined).
     */
    url?: string;
    /**
     * Authentication type for HTTP/SSE servers.
     */
    authType?: SourceMcpAuthType;
    /**
     * OAuth client ID (stored in config, not secret).
     */
    clientId?: string;
    /**
     * Command to spawn for stdio transport.
     * Required when transport is 'stdio'.
     */
    command?: string;
    /**
     * Arguments to pass to the command.
     */
    args?: string[];
    /**
     * Environment variables for the spawned process.
     */
    env?: Record<string, string>;
    /**
     * Custom headers to include in every MCP request.
     * Auth headers (e.g. Authorization) are merged on top when authType is set.
     */
    headers?: Record<string, string>;
    /**
     * Header names for credential-store auth (e.g., ["X-API-Key"]).
     * Values are stored as JSON in the credential store, same as API multi-header auth.
     * Precedence: static headers < credential-store headerNames < Authorization bearer.
     */
    headerNames?: string[];
}
/**
 * API test endpoint configuration for connection validation
 */
export interface ApiTestEndpoint {
    method: 'GET' | 'POST';
    path: string;
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}
/**
 * Generic OAuth configuration for API sources.
 * Allows any OAuth 2.0 provider to be configured via config.json
 * without needing an MCP server or manual PAT.
 */
export interface ApiOAuthConfig {
    /** OAuth authorization endpoint URL (REQUIRED) */
    authorizationUrl: string;
    /** OAuth token exchange endpoint URL (REQUIRED) */
    tokenUrl: string;
    /** OAuth client ID (REQUIRED) */
    clientId: string;
    /** OAuth client secret (optional for public PKCE clients) */
    clientSecret?: string;
    /** Requested OAuth scopes */
    scopes?: string[];
    /** Auth0-style audience parameter */
    audience?: string;
    /** Additional parameters to include in the authorization URL */
    extraParams?: Record<string, string>;
}
/**
 * Token renewal endpoint configuration for non-OAuth API sources.
 * Allows custom bearer-token APIs to auto-renew expired tokens by calling
 * a provider-specific endpoint (not OAuth-compliant).
 *
 * MVP scope: access-token-based renewal only. The current access token is
 * sent via the Authorization header and/or substituted into body/headers
 * using the {{token}} placeholder.
 */
export interface ApiRenewEndpoint {
    /** Renew URL — relative path (resolved against baseUrl) or absolute URL */
    path: string;
    /** HTTP method (default: POST) */
    method?: 'GET' | 'POST';
    /** Request body — {{token}} in string leaves is substituted with current access token.
     *  Supports nested objects (recursive substitution on string leaves). */
    body?: Record<string, unknown>;
    /** Extra headers for the renew request — {{token}} substitution applies here too.
     *  Merged on top of defaultHeaders. Authorization header is always sent unless
     *  explicitly overridden here. */
    headers?: Record<string, string>;
    /** JSON field name for the new access token in response (default: "access_token") */
    tokenField?: string;
    /** JSON field name for expiry in seconds in response (default: "expires_in") */
    expiresInField?: string;
    /** Fallback TTL in seconds when renew response doesn't include expiry (optional).
     *  Without this, missing expiry causes refresh on every session start (safe but noisy). */
    fallbackTtlSecs?: number;
}
/**
 * API-specific configuration
 */
export interface ApiSourceConfig {
    baseUrl: string;
    authType: HttpAuthType;
    headerName?: string;
    headerNames?: string[];
    queryParam?: string;
    authScheme?: string;
    defaultHeaders?: Record<string, string>;
    testEndpoint?: ApiTestEndpoint;
    renewEndpoint?: ApiRenewEndpoint;
    googleService?: GoogleService;
    googleScopes?: string[];
    googleOAuthClientId?: string;
    googleOAuthClientSecret?: string;
    slackService?: SlackService;
    slackUserScopes?: string[];
    microsoftService?: MicrosoftService;
    microsoftScopes?: string[];
    oauth?: ApiOAuthConfig;
}
/**
 * Local filesystem/app configuration
 */
export interface LocalSourceConfig {
    path: string;
    format?: string;
}
/**
 * Source connection status
 * - 'connected': Source is connected and working
 * - 'needs_auth': Source requires authentication
 * - 'failed': Connection failed with error
 * - 'untested': Connection has not been tested
 * - 'local_disabled': Stdio source is disabled (local MCP servers off)
 */
export type SourceConnectionStatus = 'connected' | 'needs_auth' | 'failed' | 'untested' | 'local_disabled';
/**
 * Brand theming for a source's UI elements.
 * Uses the EntityColor system for light/dark mode support.
 */
export interface SourceBrand {
    /** Primary brand color — used for source-branded UI elements.
     *  Can be a system color name ("accent", "info") or custom { light, dark } values.
     *  Defaults to "accent" if not set. */
    color?: import('../colors/types').EntityColor;
}
/**
 * Main source configuration (stored in config.json)
 */
export interface FolderSourceConfig {
    id: string;
    name: string;
    slug: string;
    enabled: boolean;
    provider: string;
    type: SourceType;
    mcp?: McpSourceConfig;
    api?: ApiSourceConfig;
    local?: LocalSourceConfig;
    icon?: string;
    tagline?: string;
    brand?: SourceBrand;
    isAuthenticated?: boolean;
    connectionStatus?: SourceConnectionStatus;
    connectionError?: string;
    lastTestedAt?: number;
    createdAt?: number;
    updatedAt?: number;
}
/**
 * Parsed guide.md content with embedded cache
 */
export interface SourceGuide {
    raw: string;
    scope?: string;
    guidelines?: string;
    context?: string;
    apiNotes?: string;
    cache?: Record<string, unknown>;
}
/**
 * Fully loaded source with all files
 */
export interface LoadedSource {
    config: FolderSourceConfig;
    guide: SourceGuide | null;
    /** Absolute path to source folder (for resolving relative icon paths) */
    folderPath: string;
    /** Absolute path to workspace folder (e.g., ~/.craft-agent/workspaces/xxx) */
    workspaceRootPath: string;
    /**
     * Workspace this source belongs to.
     * Used for credential lookups: source_oauth::{workspaceId}::{sourceSlug}
     */
    workspaceId: string;
    /**
     * Whether this is a built-in source (e.g., craft-agents-docs).
     * Built-in sources are always available and not shown in the sources UI.
     */
    isBuiltin?: boolean;
    /**
     * Pre-computed path to local icon file (icon.svg, icon.png, etc.) if it exists.
     * Computed during source loading so renderer doesn't need filesystem access.
     */
    iconPath?: string;
}
/**
 * Source creation input (without auto-generated fields)
 */
export interface CreateSourceInput {
    name: string;
    provider: string;
    type: SourceType;
    mcp?: McpSourceConfig;
    api?: ApiSourceConfig;
    local?: LocalSourceConfig;
    icon?: string;
    enabled?: boolean;
}
/**
 * REST API configuration for API sources
 * Used by api-tools.ts to create dynamic API tools
 */
export interface ApiConfig {
    name: string;
    baseUrl: string;
    auth?: {
        type: 'none' | 'header' | 'bearer' | 'query' | 'basic';
        headerName?: string;
        headerNames?: string[];
        queryParam?: string;
        authScheme?: string;
        credentialLabel?: string;
        secretLabel?: string;
    };
    headers?: Record<string, string>;
    documentation?: string;
    docsUrl?: string;
    defaultHeaders?: Record<string, string>;
    logo?: string;
    workspaceId?: string;
}
