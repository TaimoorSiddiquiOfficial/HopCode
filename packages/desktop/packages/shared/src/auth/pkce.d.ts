/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0
 *
 * Implements RFC 7636 for secure authorization code exchange.
 */
export interface PKCEChallenge {
    codeVerifier: string;
    codeChallenge: string;
}
/**
 * Generate a PKCE code verifier and challenge pair.
 *
 * The code verifier is a cryptographically random string.
 * The code challenge is a base64url-encoded SHA256 hash of the verifier.
 *
 * @returns PKCE challenge pair
 */
export declare function generatePKCE(): PKCEChallenge;
/**
 * Generate a cryptographically secure state parameter for CSRF protection.
 *
 * @returns Random state string
 */
export declare function generateState(): string;
