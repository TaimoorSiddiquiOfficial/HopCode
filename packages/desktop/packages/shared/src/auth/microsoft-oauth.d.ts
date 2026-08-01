/**
 * Microsoft OAuth flow using Azure AD OAuth 2.0 with PKCE
 *
 * This module handles the complete Microsoft OAuth flow for Microsoft 365 APIs:
 * 1. Opens browser for Microsoft consent screen
 * 2. Receives authorization code via local callback server
 * 3. Exchanges code for access and refresh tokens
 * 4. Returns tokens and user email
 *
 * Supports multiple Microsoft services (Outlook, OneDrive, Calendar, Teams)
 * with predefined scope sets, or custom scopes for other Microsoft Graph APIs.
 *
 * Uses "common" tenant endpoint to support both personal Microsoft accounts
 * and work/school (Azure AD) accounts.
 */
import { type AppType } from './callback-server.ts';
import { type MicrosoftService } from '../sources/types.ts';
import { type OAuthSessionContext } from './types.ts';
import type { PreparedOAuthFlow, OAuthExchangeParams, OAuthExchangeResult } from './oauth-flow-types.ts';
export type { MicrosoftService };
/**
 * Predefined scope sets for common Microsoft services
 *
 * Microsoft Graph uses delegated permissions with format:
 * https://graph.microsoft.com/{permission}
 *
 * Common permissions:
 * - User.Read: Sign in and read user profile
 * - Mail.Read/ReadWrite/Send: Email access
 * - Calendars.Read/ReadWrite: Calendar access
 * - Files.Read/ReadWrite: OneDrive access
 * - Chat.Read/ReadWrite: Teams chat access
 * - offline_access: Required for refresh tokens
 */
export declare const MICROSOFT_SERVICE_SCOPES: Record<MicrosoftService, string[]>;
/**
 * Options for starting Microsoft OAuth flow
 */
export interface MicrosoftOAuthOptions {
    /** Microsoft service to authenticate (uses predefined scopes) */
    service?: MicrosoftService;
    /** Custom scopes (overrides service scopes if provided) */
    scopes?: string[];
    /** App type for callback server styling */
    appType?: AppType;
    /** Session context for building deeplink back to chat after OAuth */
    sessionContext?: OAuthSessionContext;
}
/**
 * Result of Microsoft OAuth flow
 */
export interface MicrosoftOAuthResult {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    email?: string;
    error?: string;
}
/**
 * Refresh Microsoft access token using refresh token
 */
export declare function refreshMicrosoftToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
}>;
/**
 * Check if Microsoft OAuth is configured (client ID is set)
 * Note: Client secret is optional for public clients using PKCE
 */
export declare function isMicrosoftOAuthConfigured(): boolean;
/**
 * Get scopes for a Microsoft service or use custom scopes
 */
export declare function getMicrosoftScopes(options: MicrosoftOAuthOptions): string[];
/**
 * Options for preparing a Microsoft OAuth flow (server-side, no browser interaction)
 */
export interface PrepareMicrosoftOAuthOptions {
    service?: MicrosoftService;
    scopes?: string[];
    /** Port for the local callback server (Electron). One of callbackPort or callbackUrl required. */
    callbackPort?: number;
    /** Full callback URL (WebUI). Takes precedence over callbackPort. */
    callbackUrl?: string;
}
/**
 * Prepare a Microsoft OAuth flow without starting a callback server or opening a browser.
 * Returns everything needed to construct the auth URL and later exchange the code.
 */
export declare function prepareMicrosoftOAuth(options: PrepareMicrosoftOAuthOptions): PreparedOAuthFlow;
/**
 * Exchange a Microsoft authorization code for tokens (server-side).
 * Also fetches the user's email/UPN via Microsoft Graph.
 */
export declare function exchangeMicrosoftOAuth(params: OAuthExchangeParams): Promise<OAuthExchangeResult>;
/**
 * Start Microsoft OAuth flow
 *
 * Opens browser for Microsoft consent, handles callback, and returns tokens + email.
 * Supports multiple Microsoft services via the service option, or custom scopes.
 *
 * @example
 * // Authenticate for Outlook
 * const result = await startMicrosoftOAuth({ service: 'outlook' });
 *
 * @example
 * // Authenticate for OneDrive
 * const result = await startMicrosoftOAuth({ service: 'onedrive' });
 *
 * @example
 * // Authenticate with custom scopes
 * const result = await startMicrosoftOAuth({
 *   scopes: ['https://graph.microsoft.com/Tasks.ReadWrite']
 * });
 */
export declare function startMicrosoftOAuth(options?: MicrosoftOAuthOptions): Promise<MicrosoftOAuthResult>;
