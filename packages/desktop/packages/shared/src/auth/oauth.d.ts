import { type OAuthSessionContext } from './types.ts';
import type { PreparedOAuthFlow, OAuthExchangeParams, OAuthExchangeResult } from './oauth-flow-types.ts';
export interface OAuthConfig {
    mcpUrl: string;
}
export interface OAuthTokens {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    tokenType: string;
}
export interface OAuthCallbacks {
    onStatus: (message: string) => void;
    onError: (error: string) => void;
}
export declare class CraftOAuth {
    private config;
    private server;
    private callbacks;
    private sessionContext?;
    constructor(config: OAuthConfig, callbacks: OAuthCallbacks, sessionContext?: OAuthSessionContext);
    private getServerMetadata;
    private registerClient;
    private exchangeCodeForTokens;
    refreshAccessToken(refreshToken: string, clientId: string): Promise<OAuthTokens>;
    checkAuthRequired(): Promise<boolean>;
    authenticate(): Promise<{
        tokens: OAuthTokens;
        clientId: string;
    }>;
    /**
     * Start the OAuth callback server by binding directly to a port in the range
     * CALLBACK_PORT_START .. CALLBACK_PORT_END.
     *
     * Eliminates the TOCTOU race condition: the port returned is the port the
     * server is actually listening on — there is no gap between checking and
     * binding. On EADDRINUSE the candidate server is closed and the next port
     * is tried.
     *
     * Returns immediately once the server is bound, with a `codePromise` that
     * resolves when the OAuth callback delivers the authorization code.
     */
    private startCallbackServer;
    private stopServer;
    cancel(): void;
}
/**
 * Prepare an MCP OAuth flow without starting a callback server or opening a browser.
 *
 * Performs metadata discovery, PKCE generation, optional client registration,
 * and auth URL construction. Accepts either callbackPort (Electron) or
 * callbackUrl (WebUI) to construct the redirect URI.
 */
export declare function prepareMcpOAuth(mcpUrl: string, options: {
    callbackPort?: number;
    callbackUrl?: string;
}): Promise<PreparedOAuthFlow>;
/**
 * Exchange an MCP authorization code for tokens (server-side).
 */
export declare function exchangeMcpOAuth(params: OAuthExchangeParams): Promise<OAuthExchangeResult>;
/**
 * Extract the origin (scheme + host + port) from an MCP URL.
 * This is the base URL for OAuth discovery per RFC 8414.
 */
export declare function getMcpBaseUrl(mcpUrl: string): string;
export interface OAuthMetadata {
    authorization_endpoint: string;
    token_endpoint: string;
    registration_endpoint?: string;
}
/**
 * Discovers OAuth metadata using progressive discovery per RFC 8414 and RFC 9728.
 * Returns the first successful metadata, or null if all fail.
 *
 * Discovery order:
 * 1. RFC 9728: Parse resource_metadata from WWW-Authenticate header on 401
 * 2. Origin root: `{origin}/.well-known/oauth-authorization-server`
 * 3. Path-scoped: `{origin}/.well-known/oauth-authorization-server{pathname}`
 */
export declare function discoverOAuthMetadata(mcpUrl: string, onLog?: (message: string) => void): Promise<OAuthMetadata | null>;
