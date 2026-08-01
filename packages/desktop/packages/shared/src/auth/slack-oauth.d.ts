/**
 * Slack OAuth flow using Slack's OAuth 2.0 v2
 *
 * This module handles the complete Slack OAuth flow for USER authentication:
 * 1. Opens browser for Slack consent screen
 * 2. Receives authorization code via local callback server
 * 3. Exchanges code for user access token
 * 4. Returns tokens and workspace info
 *
 * Uses user_scope (not scope) to authenticate as the user, not as a bot.
 * This allows posting messages as the authenticated user.
 */
import { type AppType } from './callback-server.ts';
import type { SlackService } from '../sources/types.ts';
import { type OAuthSessionContext } from './types.ts';
import type { PreparedOAuthFlow, OAuthExchangeParams, OAuthExchangeResult } from './oauth-flow-types.ts';
export type { SlackService } from '../sources/types.ts';
/**
 * Predefined USER scope sets for common Slack services
 * These are user scopes (user_scope), not bot scopes (scope)
 * User scopes allow acting as the authenticated user
 */
export declare const SLACK_SERVICE_SCOPES: Record<SlackService, string[]>;
/**
 * Options for starting Slack OAuth flow
 */
export interface SlackOAuthOptions {
    /** Slack service to authenticate (uses predefined scopes) */
    service?: SlackService;
    /** Custom user scopes (overrides service scopes if provided) */
    userScopes?: string[];
    /** App type for callback server styling */
    appType?: AppType;
    /** Session context for building deeplink back to chat after OAuth */
    sessionContext?: OAuthSessionContext;
}
/**
 * Result of Slack OAuth flow
 */
export interface SlackOAuthResult {
    success: boolean;
    /** User access token (xoxp-...) for acting as the user */
    accessToken?: string;
    /** Refresh token for token rotation (if enabled in Slack app settings) */
    refreshToken?: string;
    /** Token expiration timestamp (ms) - only if token rotation is enabled */
    expiresAt?: number;
    /** Slack workspace ID */
    teamId?: string;
    /** Slack workspace name */
    teamName?: string;
    /** Authenticated user ID */
    userId?: string;
    /** Error message if failed */
    error?: string;
}
/**
 * Refresh Slack access token using refresh token
 * Note: Token rotation must be enabled in Slack app settings for refresh tokens
 */
export declare function refreshSlackToken(refreshToken: string, clientId?: string): Promise<{
    accessToken: string;
    expiresAt?: number;
}>;
/**
 * Check if Slack OAuth is configured (client ID and secret are set)
 */
export declare function isSlackOAuthConfigured(): boolean;
/**
 * Get user scopes for a Slack service or use custom scopes
 */
export declare function getSlackScopes(options: SlackOAuthOptions): string[];
/**
 * Options for preparing a Slack OAuth flow (server-side, no browser interaction)
 */
export interface PrepareSlackOAuthOptions {
    service?: SlackService;
    userScopes?: string[];
    /** Port for the local callback server (Electron). One of callbackPort or callbackUrl required. */
    callbackPort?: number;
    /** Full callback URL (WebUI). Takes precedence over callbackPort. */
    callbackUrl?: string;
}
/**
 * Prepare a Slack OAuth flow without starting a callback server or opening a browser.
 * Returns everything needed to construct the auth URL and later exchange the code.
 *
 * Slack uses a Cloudflare relay for HTTPS redirects since Slack requires HTTPS redirect URIs.
 */
export declare function prepareSlackOAuth(options: PrepareSlackOAuthOptions): PreparedOAuthFlow;
/**
 * Exchange a Slack authorization code for tokens (server-side).
 * Slack uses HTTP Basic auth (client_id:client_secret) for token exchange.
 */
export declare function exchangeSlackOAuth(params: OAuthExchangeParams): Promise<OAuthExchangeResult>;
/**
 * Start Slack OAuth flow for USER authentication
 *
 * Opens browser for Slack consent, handles callback, and returns user token + workspace info.
 * Uses user_scope to authenticate as the user (not a bot), allowing you to post as yourself.
 *
 * @example
 * // Authenticate with full workspace access
 * const result = await startSlackOAuth({ service: 'full' });
 *
 * @example
 * // Authenticate for messaging only
 * const result = await startSlackOAuth({ service: 'messaging' });
 *
 * @example
 * // Authenticate with custom scopes
 * const result = await startSlackOAuth({
 *   userScopes: ['chat:write', 'users:read']
 * });
 */
export declare function startSlackOAuth(options?: SlackOAuthOptions): Promise<SlackOAuthResult>;
