/**
 * Google OAuth flow using Google's OAuth 2.0 with PKCE
 *
 * This module handles the complete Google OAuth flow for any Google API:
 * 1. Opens browser for Google consent screen
 * 2. Receives authorization code via local callback server
 * 3. Exchanges code for access and refresh tokens
 * 4. Returns tokens and user email
 *
 * Supports multiple Google services (Gmail, Calendar, Drive) with predefined
 * scope sets, or custom scopes for other Google APIs.
 */
import { type AppType } from './callback-server.ts';
import { type GoogleService } from '../sources/types.ts';
import { type OAuthSessionContext } from './types.ts';
import type { PreparedOAuthFlow, OAuthExchangeParams, OAuthExchangeResult } from './oauth-flow-types.ts';
export type { GoogleService };
/**
 * Predefined scope sets for common Google services
 */
export declare const GOOGLE_SERVICE_SCOPES: Record<GoogleService, string[]>;
/**
 * Options for starting Google OAuth flow
 */
export interface GoogleOAuthOptions {
    /** Google service to authenticate (uses predefined scopes) */
    service?: GoogleService;
    /** Custom scopes (overrides service scopes if provided) */
    scopes?: string[];
    /** App type for callback server styling */
    appType?: AppType;
    /** OAuth client ID (user-provided, falls back to env var) */
    clientId?: string;
    /** OAuth client secret (user-provided, falls back to env var) */
    clientSecret?: string;
    /** Session context for building deeplink back to chat after OAuth */
    sessionContext?: OAuthSessionContext;
}
/**
 * Result of Google OAuth flow
 */
export interface GoogleOAuthResult {
    success: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    email?: string;
    error?: string;
    /** OAuth client ID used (for storage alongside tokens) */
    clientId?: string;
    /** OAuth client secret used (for storage alongside tokens - needed for refresh) */
    clientSecret?: string;
}
/**
 * Refresh Google access token using refresh token
 *
 * @param refreshToken - The refresh token from initial OAuth
 * @param clientId - OAuth client ID (falls back to env var if not provided)
 * @param clientSecret - OAuth client secret (falls back to env var if not provided)
 */
export declare function refreshGoogleToken(refreshToken: string, clientId?: string, clientSecret?: string): Promise<{
    accessToken: string;
    expiresAt?: number;
}>;
/**
 * Check if Google OAuth is configured (client ID and secret are available)
 *
 * @param clientId - Optional user-provided client ID
 * @param clientSecret - Optional user-provided client secret
 * @returns true if credentials are available (either provided or from env vars)
 */
export declare function isGoogleOAuthConfigured(clientId?: string, clientSecret?: string): boolean;
/**
 * Get scopes for a Google service or use custom scopes
 */
export declare function getGoogleScopes(options: GoogleOAuthOptions): string[];
/**
 * Options for preparing a Google OAuth flow (server-side, no browser interaction)
 */
export interface PrepareGoogleOAuthOptions {
    service?: GoogleService;
    scopes?: string[];
    /** Port for the local callback server (Electron). One of callbackPort or callbackUrl required. */
    callbackPort?: number;
    /** Full callback URL (WebUI). Takes precedence over callbackPort. */
    callbackUrl?: string;
    clientId?: string;
    clientSecret?: string;
}
/**
 * Prepare a Google OAuth flow without starting a callback server or opening a browser.
 * Returns everything needed to construct the auth URL and later exchange the code.
 */
export declare function prepareGoogleOAuth(options: PrepareGoogleOAuthOptions): PreparedOAuthFlow;
/**
 * Exchange a Google authorization code for tokens (server-side).
 * Also fetches the user's email address.
 */
export declare function exchangeGoogleOAuth(params: OAuthExchangeParams): Promise<OAuthExchangeResult>;
/**
 * Start Google OAuth flow
 *
 * Opens browser for Google consent, handles callback, and returns tokens + email.
 * Supports multiple Google services via the service option, or custom scopes.
 *
 * @example
 * // Authenticate for Gmail
 * const result = await startGoogleOAuth({ service: 'gmail' });
 *
 * @example
 * // Authenticate for Google Calendar
 * const result = await startGoogleOAuth({ service: 'calendar' });
 *
 * @example
 * // Authenticate with custom scopes
 * const result = await startGoogleOAuth({
 *   scopes: ['https://www.googleapis.com/auth/spreadsheets']
 * });
 */
export declare function startGoogleOAuth(options?: GoogleOAuthOptions): Promise<GoogleOAuthResult>;
