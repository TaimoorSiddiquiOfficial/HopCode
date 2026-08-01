/**
 * Workspace and authentication types
 */
/**
 * How MCP server should be authenticated (workspace-level)
 * Note: Different from SourceMcpAuthType which uses 'oauth' | 'bearer' | 'none' for individual sources
 */
export type McpAuthType = 'workspace_oauth' | 'workspace_bearer' | 'public';
export type WorkspaceKind = 'project' | 'conversation';
/**
 * Configuration for a remote HopCode Server.
 * When set on a workspace, handler calls are proxied over WebSocket.
 */
export interface RemoteServerConfig {
    url: string;
    token: string;
    remoteWorkspaceId: string;
}
/**
 * Client-facing workspace DTO — safe to send over RPC to remote clients.
 * Does not expose server-internal filesystem paths.
 */
export interface WorkspaceInfo {
    id: string;
    name: string;
    slug: string;
    kind?: WorkspaceKind;
    isProtected?: boolean;
    lastAccessedAt?: number;
    pinned?: boolean;
    iconUrl?: string;
    mcpUrl?: string;
    mcpAuthType?: McpAuthType;
    remoteServer?: RemoteServerConfig;
}
/**
 * Full workspace with server-internal details.
 * Used by server code and local Electron renderer (LOCAL_ONLY channels).
 */
export interface Workspace extends WorkspaceInfo {
    rootPath: string;
    createdAt: number;
}
/**
 * Authentication type for the built-in AI backend.
 * HopCode auth is handled by the local Qwen CLI, so the app stores no LLM
 * credential here.
 */
export type AuthType = 'none';
/**
 * OAuth credentials from a fresh authentication flow.
 * Used for temporary state in UI components before saving to credential store.
 */
export interface OAuthCredentials {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
    clientId: string;
    tokenType: string;
}
export interface StoredConfig {
    authType?: AuthType;
    workspaces: Workspace[];
    activeWorkspaceId: string | null;
    activeSessionId: string | null;
    model?: string;
}
