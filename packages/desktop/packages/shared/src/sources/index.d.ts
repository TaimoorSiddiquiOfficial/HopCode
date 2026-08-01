/**
 * Sources Module
 *
 * Public exports for source management.
 */
export type { SourceType, SourceMcpAuthType, HttpAuthType, KnownProvider, ApiOAuthProvider, ApiOAuthConfig, McpSourceConfig, ApiSourceConfig, LocalSourceConfig, SourceConnectionStatus, FolderSourceConfig, SourceGuide, LoadedSource, CreateSourceInput, ApiRenewEndpoint, } from './types.ts';
export { API_OAUTH_PROVIDERS, isApiOAuthProvider, isGenericOAuthSource, hasRenewEndpoint, isRefreshableSource, } from './types.ts';
export { ensureSourcesDir, getSourcePath, loadSourceConfig, saveSourceConfig, markSourceAuthenticated, loadSourceGuide, saveSourceGuide, findSourceIcon, downloadSourceIcon, sourceNeedsIconDownload, isIconUrl, loadSource, loadWorkspaceSources, loadAllSources, getEnabledSources, isSourceUsable, getSourcesBySlugs, generateSourceSlug, createSource, deleteSource, sourceExists, parseGuideMarkdown, } from './storage.ts';
export { SourceCredentialManager, getSourceCredentialManager, getSourcesNeedingAuth, } from './credential-manager.ts';
export type { AuthResult, ApiCredential, BasicAuthCredential, } from './credential-manager.ts';
export { SourceServerBuilder, getSourceServerBuilder, normalizeMcpUrl, SERVER_BUILD_ERRORS, } from './server-builder.ts';
export type { McpServerConfig, SourceWithCredential, BuiltServers, } from './server-builder.ts';
export { getDocsSource, getBuiltinSources, isBuiltinSource, } from './builtin-sources.ts';
export type { SummarizeCallback } from './api-tools.ts';
export { TokenRefreshManager, createTokenGetter, } from './token-refresh-manager.ts';
export type { TokenRefreshResult, RefreshManagerOptions, } from './token-refresh-manager.ts';
