import type { ProviderDriver } from '../driver-types.ts';
import { fetchHopCodeModelsViaSharedAcp } from '../../../hopcode-agent.ts';

export const hopcodeDriver: ProviderDriver = {
  provider: 'hopcode',
  buildRuntime: ({ resolvedPaths }) => ({
    paths: {
      hopcodeCli: resolvedPaths.hopcodeCliPath,
      node: resolvedPaths.nodeRuntimePath,
    },
  }),
  fetchModels: ({ hostRuntime, timeoutMs }) =>
    fetchHopCodeModelsViaSharedAcp({
      hostRuntime,
      timeoutMs,
    }),
  validateStoredConnection: async () => ({
    success: true,
    shouldRefreshModels: true,
  }),
  testConnection: async () => null,
};
