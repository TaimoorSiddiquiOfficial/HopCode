/**
 * Qwen Model Fetcher
 *
 * HopCode exposes its selectable models through ACP session/new.
 */
import { fetchBackendModels } from '@craft-agent/shared/agent/backend';
import { getHostRuntime } from './runtime';
export class HopCodeModelFetcher {
    /** Qwen models are read on demand/startup from the local HopCode CLI. */
    refreshIntervalMs = 0;
    async fetchModels(connection, credentials) {
        return fetchBackendModels({
            connection,
            credentials,
            timeoutMs: 45_000,
            hostRuntime: getHostRuntime(),
        });
    }
}
//# sourceMappingURL=hopcode-model-fetcher.js.map