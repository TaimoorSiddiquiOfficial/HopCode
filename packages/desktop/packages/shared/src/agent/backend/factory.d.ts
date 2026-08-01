import type { AgentBackend, AgentProvider, BackendConfig, BackendHostRuntimeContext, CoreBackendConfig, LlmAuthType, LlmProviderType } from './types.ts';
import { type LlmConnection } from '../../config/storage.ts';
import type { ModelFetchResult } from '../../config/model-fetcher.ts';
import type { BackendModelFetchCredentials, BackendProviderOptions, BackendResolutionContext, StoredConnectionValidationResult } from './internal/driver-types.ts';
export declare function detectProvider(_authType: string): AgentProvider;
export declare function createBackend(config: BackendConfig): AgentBackend;
export declare const createAgent: typeof createBackend;
export declare function getAvailableProviders(): AgentProvider[];
export declare function isProviderAvailable(provider: AgentProvider): boolean;
export declare function connectionTypeToProvider(_type: unknown): LlmProviderType;
export declare function connectionAuthTypeToBackendAuthType(_authType?: LlmAuthType): LlmAuthType;
export declare function resolveSessionConnection(sessionConnectionSlug?: string, workspaceDefaultConnectionSlug?: string): LlmConnection | null;
export interface ResolvedBackendContext extends BackendResolutionContext {
}
export declare function resolveBackendContext(args: {
    sessionConnectionSlug?: string;
    workspaceDefaultConnectionSlug?: string;
    managedModel?: string;
}): ResolvedBackendContext;
export declare function resolveSetupTestConnectionHint(): Pick<LlmConnection, 'providerType'>;
export declare function fetchBackendModels(args: {
    connection: LlmConnection;
    credentials: BackendModelFetchCredentials;
    hostRuntime: BackendHostRuntimeContext;
    timeoutMs?: number;
}): Promise<ModelFetchResult>;
export declare function validateStoredBackendConnection(args: {
    slug: string;
    connection: LlmConnection;
    hostRuntime: BackendHostRuntimeContext;
}): Promise<StoredConnectionValidationResult>;
export declare function providerTypeToAgentProvider(_providerType?: LlmProviderType): AgentProvider;
export declare function createConfigFromConnection(connection: LlmConnection, baseConfig: Omit<BackendConfig, 'provider' | 'authType' | 'providerType'>): BackendConfig;
export declare function createBackendFromConnection(connectionSlug: string, baseConfig: Omit<BackendConfig, 'provider' | 'authType'>, hostRuntime?: BackendHostRuntimeContext, providerOptions?: BackendProviderOptions): AgentBackend;
export declare function createBackendFromResolvedContext(args: {
    context: ResolvedBackendContext;
    coreConfig: CoreBackendConfig;
    hostRuntime: BackendHostRuntimeContext;
    providerOptions?: BackendProviderOptions;
}): AgentBackend;
export declare const BACKEND_CAPABILITIES: Record<AgentProvider, {
    needsHttpPoolServer: boolean;
    listsSessions: boolean;
}>;
export declare function resolveModelForProvider(_provider: AgentProvider, managedModel?: string, connection?: LlmConnection | null): string;
export declare function getDefaultAuthType(_provider: AgentProvider): LlmAuthType;
export declare function initializeBackendHostRuntime(args: {
    provider?: AgentProvider;
    hostRuntime: BackendHostRuntimeContext;
}): void;
export declare function resolveBackendHostTooling(hostRuntime: BackendHostRuntimeContext): import("./internal/runtime-resolver.ts").ResolvedBackendHostTooling;
export declare function cleanupSourceRuntimeArtifacts(): Promise<void>;
export declare function testBackendConnection(args: {
    provider: AgentProvider;
    apiKey: string;
    model: string;
    baseUrl?: string;
    connection?: Pick<LlmConnection, 'providerType'>;
    hostRuntime: BackendHostRuntimeContext;
    timeoutMs?: number;
}): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function validateConnection(args: {
    provider: AgentProvider;
    apiKey?: string;
    model?: string;
    baseUrl?: string;
    hostRuntime?: BackendHostRuntimeContext;
}): Promise<{
    success: boolean;
    error?: string;
}>;
