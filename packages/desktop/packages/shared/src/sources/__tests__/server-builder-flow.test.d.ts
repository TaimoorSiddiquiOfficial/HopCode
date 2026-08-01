/**
 * Tests for SourceServerBuilder → API Tools credential flow
 *
 * Verifies that credentials flow correctly from:
 * 1. SourceServerBuilder.buildApiConfig() - creates correct auth config
 * 2. SourceServerBuilder.buildApiServer() - passes credential to createApiServer
 * 3. buildHeaders() - applies credentials to HTTP request headers
 */
export {};
