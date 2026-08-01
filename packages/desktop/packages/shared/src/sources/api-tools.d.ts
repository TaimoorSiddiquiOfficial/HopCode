/**
 * Dynamic API Tool Factory
 *
 * Creates a single flexible MCP tool per API configuration.
 * Each tool accepts { path, method, params } and auto-injects authentication.
 */
import type { ApiConfig } from './types.ts';
import type { ApiCredential } from './credential-manager.ts';
import { createLocalMcpServer } from '../mcp/local-tools.ts';
export type { ApiCredential, BasicAuthCredential } from './credential-manager.ts';
/**
 * Build an Authorization header value for bearer-style authentication.
 *
 * Supports three cases:
 * - `authScheme: undefined` → defaults to "Bearer {token}"
 * - `authScheme: "Token"` → "Token {token}" (custom prefix)
 * - `authScheme: ""` → "{token}" (no prefix, for APIs that expect raw tokens)
 *
 * The empty string case is needed for APIs like some GraphQL endpoints or
 * internal services that expect the raw JWT/token without a "Bearer" prefix.
 *
 * @param authScheme - The auth scheme prefix (undefined defaults to "Bearer", empty string means no prefix)
 * @param token - The authentication token
 * @returns The full Authorization header value
 */
export declare function buildAuthorizationHeader(authScheme: string | undefined, token: string): string;
/**
 * API credential source - can be a static credential or a function that returns a token.
 * Token getter functions are used for OAuth sources that need auto-refresh.
 */
export type ApiCredentialSource = ApiCredential | (() => Promise<string>);
/** Summarize callback type — typically agent.runMiniCompletion.bind(agent) */
export type SummarizeCallback = (prompt: string) => Promise<string | null>;
/**
 * Build headers for an API request, injecting authentication and default headers
 */
export declare function buildHeaders(auth: ApiConfig['auth'], credential: ApiCredential, defaultHeaders?: Record<string, string>): Record<string, string>;
/**
 * Create a single flexible MCP tool for an API configuration.
 * The tool accepts { path, method, params } and handles auth automatically.
 *
 * @param config - API configuration with documentation
 * @param credential - API credential source (string for API key/token, BasicAuthCredential for basic auth,
 *                     empty string for public APIs, or async function for OAuth token refresh)
 * @param sessionPath - Optional path to session folder for saving large responses
 * @returns SDK tool that can be included in an MCP server
 */
export declare function createApiTool(config: ApiConfig, credential: ApiCredentialSource, sessionPath?: string, summarize?: SummarizeCallback): import("../mcp/local-tools.ts").LocalTool;
/**
 * Create an in-process MCP server with a single flexible API tool.
 *
 * @param config - API configuration
 * @param credential - API credential source (string for API key/token, BasicAuthCredential for basic auth,
 *                     empty string for public APIs, or async function for OAuth token refresh)
 * @param sessionPath - Optional path to session folder for saving large responses
 * @returns Local MCP server that can be exposed through the source pool
 */
export declare function createApiServer(config: ApiConfig, credential: ApiCredentialSource, sessionPath?: string, summarize?: SummarizeCallback): ReturnType<typeof createLocalMcpServer>;
