/**
 * Integration tests for SourceCredentialManager with multi-header auth
 *
 * Tests the credential parsing flow:
 * - When source.config.api.headerNames exists, parse credential as JSON
 * - When missing, return raw string credential
 * - Handle malformed JSON gracefully
 */
export {};
