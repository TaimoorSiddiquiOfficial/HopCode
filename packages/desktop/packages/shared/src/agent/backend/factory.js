import { HopCodeAgent } from '../hopcode-agent.ts';
import { getDefaultLlmConnection, getLlmConnection, } from '../../config/storage.ts';
import { DEFAULT_MODEL } from '../../config/models.ts';
import { resolveBackendHostTooling as resolveHostToolingPaths, resolveBackendRuntimePaths, } from './internal/runtime-resolver.ts';
import { hopcodeDriver } from './internal/drivers/hopcode-driver.ts';
export function detectProvider(_authType) {
    return 'hopcode';
}
export function createBackend(config) {
    return new HopCodeAgent({
        ...config,
        provider: 'hopcode',
        providerType: 'hopcode',
        authType: 'none',
    });
}
export const createAgent = createBackend;
export function getAvailableProviders() {
    return ['hopcode'];
}
export function isProviderAvailable(provider) {
    return provider === 'hopcode';
}
export function connectionTypeToProvider(_type) {
    return 'hopcode';
}
export function connectionAuthTypeToBackendAuthType(_authType) {
    return 'none';
}
function hopcodeConnectionFallback() {
    return {
        slug: 'hopcode',
        name: 'HopCode',
        providerType: 'hopcode',
        authType: 'none',
        createdAt: 0,
    };
}
export function resolveSessionConnection(sessionConnectionSlug, workspaceDefaultConnectionSlug) {
    const slug = sessionConnectionSlug || workspaceDefaultConnectionSlug || getDefaultLlmConnection();
    if (!slug)
        return hopcodeConnectionFallback();
    return getLlmConnection(slug) ?? hopcodeConnectionFallback();
}
export function resolveBackendContext(args) {
    const connection = resolveSessionConnection(args.sessionConnectionSlug, args.workspaceDefaultConnectionSlug);
    return {
        connection,
        provider: 'hopcode',
        authType: 'none',
        resolvedModel: resolveModelForProvider('hopcode', args.managedModel, connection),
        capabilities: BACKEND_CAPABILITIES.hopcode,
    };
}
export function resolveSetupTestConnectionHint() {
    return { providerType: 'hopcode' };
}
export async function fetchBackendModels(args) {
    const resolvedPaths = resolveBackendRuntimePaths(args.hostRuntime);
    return hopcodeDriver.fetchModels({
        connection: { ...args.connection, providerType: 'hopcode', authType: 'none' },
        credentials: args.credentials,
        hostRuntime: args.hostRuntime,
        resolvedPaths,
        timeoutMs: args.timeoutMs ?? 30_000,
    });
}
export async function validateStoredBackendConnection(args) {
    const resolvedPaths = resolveBackendRuntimePaths(args.hostRuntime);
    return hopcodeDriver.validateStoredConnection
        ? hopcodeDriver.validateStoredConnection({
            slug: args.slug,
            connection: { ...args.connection, providerType: 'hopcode', authType: 'none' },
            credentialManager: undefined,
            hostRuntime: args.hostRuntime,
            resolvedPaths,
        })
        : { success: true };
}
export function providerTypeToAgentProvider(_providerType) {
    return 'hopcode';
}
export function createConfigFromConnection(connection, baseConfig) {
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
export function createBackendFromConnection(connectionSlug, baseConfig, hostRuntime, providerOptions) {
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
export function createBackendFromResolvedContext(args) {
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
export const BACKEND_CAPABILITIES = {
    hopcode: { needsHttpPoolServer: true, listsSessions: true },
};
export function resolveModelForProvider(_provider, managedModel, connection) {
    return managedModel || connection?.defaultModel || '';
}
export function getDefaultAuthType(_provider) {
    return 'none';
}
export function initializeBackendHostRuntime(args) {
    hopcodeDriver.initializeHostRuntime?.({
        hostRuntime: args.hostRuntime,
        resolvedPaths: resolveBackendRuntimePaths(args.hostRuntime),
    });
}
export function resolveBackendHostTooling(hostRuntime) {
    return resolveHostToolingPaths(hostRuntime);
}
export async function cleanupSourceRuntimeArtifacts() {
    // Qwen-only runtime does not create provider-specific source artifacts.
}
export async function testBackendConnection(args) {
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
export async function validateConnection(args) {
    if (!args.hostRuntime)
        return { success: true };
    return testBackendConnection({
        provider: 'hopcode',
        apiKey: '',
        model: args.model || DEFAULT_MODEL,
        hostRuntime: args.hostRuntime,
    });
}
//# sourceMappingURL=factory.js.map