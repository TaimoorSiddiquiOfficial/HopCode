import { fetchHopCodeModelsViaSharedAcp } from '../../../hopcode-agent.ts';
export const hopcodeDriver = {
    provider: 'hopcode',
    buildRuntime: ({ resolvedPaths }) => ({
        paths: {
            hopcodeCli: resolvedPaths.hopcodeCliPath,
            node: resolvedPaths.nodeRuntimePath,
        },
    }),
    fetchModels: ({ hostRuntime, timeoutMs }) => fetchHopCodeModelsViaSharedAcp({
        hostRuntime,
        timeoutMs,
    }),
    validateStoredConnection: async () => ({
        success: true,
        shouldRefreshModels: true,
    }),
    testConnection: async () => null,
};
//# sourceMappingURL=hopcode-driver.js.map