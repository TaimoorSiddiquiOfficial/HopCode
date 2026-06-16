import type {
  AgentBackend,
  AgentProvider,
  BackendConfig,
  BackendHostRuntimeContext,
  CoreBackendConfig,
  LlmAuthType,
  LlmProviderType,
} from './types.ts';
import { HopCodeAgent } from '../hopcode-agent.ts';
import {
  getDefaultLlmConnection,
  getLlmConnection,
  type LlmConnection,
} from '../../config/storage.ts';
import { DEFAULT_MODEL } from '../../config/models.ts';
import type { ModelFetchResult } from '../../config/model-fetcher.ts';
import type {
  BackendModelFetchCredentials,
  BackendProviderOptions,
  BackendResolutionContext,
  ResolvedBackendConfig,
  StoredConnectionValidationResult,
} from './internal/driver-types.ts';
import {
  resolveBackendHostTooling as resolveHostToolingPaths,
  resolveBackendRuntimePaths,
} from './internal/runtime-resolver.ts';
import { hopcodeDriver } from './internal/drivers/qwen.ts';

export function detectProvider(_authType: string): AgentProvider {
  return 'hopcode';
}

export function createBackend(config: BackendConfig): AgentBackend {
  return new HopCodeAgent({
    ...config,
    provider: 'hopcode',
    providerType: 'hopcode',
    authType: 'none',
  } as ResolvedBackendConfig);
}

export const createAgent = createBackend;

export function getAvailableProviders(): AgentProvider[] {
  return ['hopcode'];
}

export function isProviderAvailable(provider: AgentProvider): boolean {
  return provider === 'hopcode';
}

export function connectionTypeToProvider(_type: unknown): LlmProviderType {
  return 'hopcode';
}

export function connectionAuthTypeToBackendAuthType(_authType?: LlmAuthType): LlmAuthType {
  return 'none';
}

function hopcodeConnectionFallback(): LlmConnection {
  return {
    slug: 'hopcode',
    name: 'HopCode',
    providerType: 'hopcode',
    authType: 'none',
    createdAt: 0,
  };
}

export function resolveSessionConnection(
  sessionConnectionSlug?: string,
  workspaceDefaultConnectionSlug?: string,
): LlmConnection | null {
  const slug = sessionConnectionSlug || workspaceDefaultConnectionSlug || getDefaultLlmConnection();
  if (!slug) return hopcodeConnectionFallback();
  return getLlmConnection(slug) ?? hopcodeConnectionFallback();
}

export interface ResolvedBackendContext extends BackendResolutionContext {}

export function resolveBackendContext(args: {
  sessionConnectionSlug?: string;
  workspaceDefaultConnectionSlug?: string;
  managedModel?: string;
}): ResolvedBackendContext {
  const connection = resolveSessionConnection(
    args.sessionConnectionSlug,
    args.workspaceDefaultConnectionSlug,
  );

  return {
    connection,
    provider: 'hopcode',
    authType: 'none',
    resolvedModel: resolveModelForProvider('hopcode', args.managedModel, connection),
    capabilities: BACKEND_CAPABILITIES.hopcode,
  };
}

export function resolveSetupTestConnectionHint(): Pick<LlmConnection, 'providerType'> {
  return { providerType: 'hopcode' };
}

export async function fetchBackendModels(args: {
  connection: LlmConnection;
  credentials: BackendModelFetchCredentials;
  hostRuntime: BackendHostRuntimeContext;
  timeoutMs?: number;
}): Promise<ModelFetchResult> {
  const resolvedPaths = resolveBackendRuntimePaths(args.hostRuntime);
  return hopcodeDriver.fetchModels!({
    connection: { ...args.connection, providerType: 'hopcode', authType: 'none' },
    credentials: args.credentials,
    hostRuntime: args.hostRuntime,
    resolvedPaths,
    timeoutMs: args.timeoutMs ?? 30_000,
  });
}

export async function validateStoredBackendConnection(args: {
  slug: string;
  connection: LlmConnection;
  hostRuntime: BackendHostRuntimeContext;
}): Promise<StoredConnectionValidationResult> {
  const resolvedPaths = resolveBackendRuntimePaths(args.hostRuntime);
  return hopcodeDriver.validateStoredConnection
    ? hopcodeDriver.validateStoredConnection({
      slug: args.slug,
      connection: { ...args.connection, providerType: 'hopcode', authType: 'none' },
      credentialManager: undefined as never,
      hostRuntime: args.hostRuntime,
      resolvedPaths,
    })
    : { success: true };
}

export function providerTypeToAgentProvider(_providerType?: LlmProviderType): AgentProvider {
  return 'hopcode';
}

export function createConfigFromConnection(
  connection: LlmConnection,
  baseConfig: Omit<BackendConfig, 'provider' | 'authType' | 'providerType'>,
): BackendConfig {
  const { model: baseModel, ...restConfig } = baseConfig;
  const model = baseModel || connection.defaultModel;

  return {
    ...restConfig,
    provider: 'hopcode',
    providerType: 'hopcode',
    authType: 'none',
    connectionSlug: connection.slug,
    ...(model ? { model } : {}),
  };
}

export function createBackendFromConnection(
  connectionSlug: string,
  baseConfig: Omit<BackendConfig, 'provider' | 'authType'>,
  hostRuntime?: BackendHostRuntimeContext,
  providerOptions?: BackendProviderOptions,
): AgentBackend {
  const connection = getLlmConnection(connectionSlug) ?? hopcodeConnectionFallback();
  const context = resolveBackendContext({
    sessionConnectionSlug: connection.slug,
    managedModel: baseConfig.model,
  });

  if (hostRuntime) {
    return createBackendFromResolvedContext({
      context,
      coreConfig: baseConfig,
      hostRuntime,
      providerOptions,
    });
  }

  return createBackend(createConfigFromConnection(connection, {
    ...baseConfig,
    ...(context.resolvedModel ? { model: context.resolvedModel } : {}),
  }));
}

export function createBackendFromResolvedContext(args: {
  context: ResolvedBackendContext;
  coreConfig: CoreBackendConfig;
  hostRuntime: BackendHostRuntimeContext;
  providerOptions?: BackendProviderOptions;
}): AgentBackend {
  const resolvedPaths = resolveBackendRuntimePaths(args.hostRuntime);
  const runtime = hopcodeDriver.buildRuntime({
    context: args.context,
    coreConfig: args.coreConfig,
    hostRuntime: args.hostRuntime,
    resolvedPaths,
    providerOptions: args.providerOptions,
  });

  return createBackend({
    ...args.coreConfig,
    provider: 'hopcode',
    providerType: 'hopcode',
    authType: 'none',
    ...(args.context.resolvedModel ? { model: args.context.resolvedModel } : {}),
    runtime,
  });
}

export const BACKEND_CAPABILITIES: Record<AgentProvider, {
  needsHttpPoolServer: boolean;
  listsSessions: boolean;
}> = {
  qwen: { needsHttpPoolServer: true, listsSessions: true },
};

export function resolveModelForProvider(
  _provider: AgentProvider,
  managedModel?: string,
  connection?: LlmConnection | null,
): string {
  return managedModel || connection?.defaultModel || '';
}

export function getDefaultAuthType(_provider: AgentProvider): LlmAuthType {
  return 'none';
}

export function initializeBackendHostRuntime(args: {
  provider?: AgentProvider;
  hostRuntime: BackendHostRuntimeContext;
}): void {
  hopcodeDriver.initializeHostRuntime?.({
    hostRuntime: args.hostRuntime,
    resolvedPaths: resolveBackendRuntimePaths(args.hostRuntime),
  });
}

export function resolveBackendHostTooling(hostRuntime: BackendHostRuntimeContext) {
  return resolveHostToolingPaths(hostRuntime);
}

export async function cleanupSourceRuntimeArtifacts(): Promise<void> {
  // Qwen-only runtime does not create provider-specific source artifacts.
}

export async function testBackendConnection(args: {
  provider: AgentProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
  connection?: Pick<LlmConnection, 'providerType'>;
  hostRuntime: BackendHostRuntimeContext;
  timeoutMs?: number;
}): Promise<{ success: boolean; error?: string }> {
  const resolvedPaths = resolveBackendRuntimePaths(args.hostRuntime);
  const result = await hopcodeDriver.testConnection?.({
    provider: 'hopcode',
    apiKey: '',
    model: args.model || DEFAULT_MODEL,
    hostRuntime: args.hostRuntime,
    resolvedPaths,
    timeoutMs: args.timeoutMs ?? 30_000,
    connection: { providerType: 'hopcode' },
  });
  return result ?? { success: true };
}

export async function validateConnection(args: {
  provider: AgentProvider;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  hostRuntime?: BackendHostRuntimeContext;
}): Promise<{ success: boolean; error?: string }> {
  if (!args.hostRuntime) return { success: true };
  return testBackendConnection({
    provider: 'hopcode',
    apiKey: '',
    model: args.model || DEFAULT_MODEL,
    hostRuntime: args.hostRuntime,
  });
}
