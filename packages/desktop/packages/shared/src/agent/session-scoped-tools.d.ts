/**
 * Session-Scoped Tools
 *
 * Tools that are scoped to a specific session. Each session gets its own
 * instance of these tools with session-specific callbacks and state.
 *
 * This file is a thin adapter that wraps the shared handlers from
 * @craft-agent/session-tools-core for use as local MCP tools.
 *
 * All tool definitions, schemas, and handlers live in session-tools-core.
 * This adapter only handles:
 * - Session callback registry (per-session onPlanSubmitted, onAuthRequest, queryFn)
 * - Plan state management
 * - Local MCP tool wrapping with DOC_REF-enriched descriptions
 * - call_llm (backend-specific, not in registry)
 */
import { createLocalMcpServer } from '../mcp/local-tools.ts';
export type { CredentialInputMode, AuthRequestType, AuthRequest, AuthResult, CredentialAuthRequest, McpOAuthAuthRequest, GoogleOAuthAuthRequest, SlackOAuthAuthRequest, MicrosoftOAuthAuthRequest, GoogleService, SlackService, MicrosoftService, } from '@craft-agent/session-tools-core';
export type { BrowserPaneFns } from './browser-tools.ts';
export { type SessionScopedToolCallbacks, registerSessionScopedToolCallbacks, mergeSessionScopedToolCallbacks, unregisterSessionScopedToolCallbacks, getSessionScopedToolCallbacks, } from './session-scoped-tool-callback-registry.ts';
/** Backend-executed session tools currently supported by the local adapter layer. */
export declare const BACKEND_SESSION_TOOL_NAMES: Set<string>;
/**
 * Get the last submitted plan file path for a session
 */
export declare function getLastPlanFilePath(sessionId: string): string | null;
/**
 * Set the last submitted plan file path for a session
 */
export declare function setLastPlanFilePath(sessionId: string, path: string): void;
/**
 * Clear plan file state for a session
 */
export declare function clearPlanFileState(sessionId: string): void;
/**
 * Get the plans directory for a session
 */
export declare function getSessionPlansDir(workspacePath: string, sessionId: string): string;
/**
 * Check if a path is within a session's plans directory
 */
export declare function isPathInPlansDir(path: string, workspacePath: string, sessionId: string): boolean;
/**
 * Invalidate ALL session tool caches (e.g., when a global setting like browserToolEnabled changes).
 * This forces tools to be rebuilt on the next message for every session.
 */
export declare function invalidateAllSessionToolsCaches(): void;
/**
 * Clean up cached tools for a session
 */
export declare function cleanupSessionScopedTools(sessionId: string): void;
/**
 * Get or create session-scoped tools for a session.
 * Returns an MCP server with all session-scoped tools registered.
 *
 * All tools come from the canonical SESSION_TOOL_DEFS registry in session-tools-core,
 * except call_llm which is backend-specific.
 */
export declare function getSessionScopedTools(sessionId: string, workspaceRootPath: string, workspaceId?: string): ReturnType<typeof createLocalMcpServer>;
