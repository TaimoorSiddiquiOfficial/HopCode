import type { ProviderDriver } from '../driver-types.ts';
import { fetchQwenModelsViaSharedAcp } from '../../../qwen-agent.ts';

export const hopcodeDriver: ProviderDriver = {
  provider: 'hopcode',
  buildRuntime: ({ resolvedPaths }) => ({
    paths: {
      hopcodeCli: resolvedPaths.hopcodeCliPath,
      node: resolvedPaths.nodeRuntimePath,
    },
  }),
  fetchModels: ({ hostRuntime, timeoutMs }) =>
    fetchQwenModelsViaSharedAcp({
      hostRuntime,
      timeoutMs,
    }),
  validateStoredConnection: async () => ({
    success: true,
    shouldRefreshModels: true,
  }),
  testConnection: async () => null,
};
