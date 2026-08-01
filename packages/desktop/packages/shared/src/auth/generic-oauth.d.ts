/**
 * Generic OAuth 2.0 for API Sources
 *
 * Supports any OAuth 2.0 provider (GitHub, Linear, Notion, Spotify, etc.)
 * configured via ApiOAuthConfig in source config.json.
 *
 * Uses PKCE for all flows. Handles both JSON and application/x-www-form-urlencoded
 * token responses (GitHub returns form-encoded by default).
 */
import type { ApiOAuthConfig } from '../sources/types.ts';
import type { PreparedOAuthFlow, OAuthExchangeParams, OAuthExchangeResult } from './oauth-flow-types.ts';
export interface PrepareGenericOAuthOptions {
    oauthConfig: ApiOAuthConfig;
    callbackPort?: number;
    callbackUrl?: string;
}
/**
 * Prepare the authorization URL for a generic OAuth flow.
 * Generates PKCE challenge and builds the auth URL with all configured parameters.
 */
export declare function prepareGenericOAuth(options: PrepareGenericOAuthOptions): PreparedOAuthFlow;
/**
 * Exchange an authorization code for tokens at the generic OAuth token endpoint.
 * Handles both JSON and form-urlencoded responses.
 */
export declare function exchangeGenericOAuth(params: OAuthExchangeParams): Promise<OAuthExchangeResult>;
/**
 * Refresh a generic OAuth token.
 * tokenUrl and clientId come from the source config (not stored in credential).
 * clientSecret comes from stored credential, falling back to config.
 */
export declare function refreshGenericOAuthToken(refreshToken: string, tokenUrl: string, clientId: string, clientSecret?: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
}>;
