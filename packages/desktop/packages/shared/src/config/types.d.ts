/**
 * Config Types (Browser-safe)
 *
 * Pure type definitions for configuration.
 * Re-exports from @craft-agent/core for compatibility.
 */
export type { Workspace, McpAuthType, AuthType, OAuthCredentials, } from '@craft-agent/core/types';
/** App-level network proxy configuration. */
export interface NetworkProxySettings {
    enabled: boolean;
    httpProxy?: string;
    httpsProxy?: string;
    noProxy?: string;
}
