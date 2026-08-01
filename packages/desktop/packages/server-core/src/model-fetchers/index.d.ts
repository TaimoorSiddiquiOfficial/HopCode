/**
 * Model Refresh Service
 *
 * Centralized service for fetching and refreshing model lists across all providers.
 * Replaces the scattered fetchAndStore*Models() functions and startCodexModelRefresh().
 *
 * Fallback chain:
 * 1. Provider runtime discovery via backend driver dispatch
 * 2. Persisted connection.models — previously fetched, survives offline/restart
 * 3. MODEL_REGISTRY — hardcoded offline seed data, last resort
 *
 * Qwen is the exception: HopCode's ACP response is the source of truth, so
 * discovered models are kept in memory and never persisted to config.json.
 */
import type { ModelFetcherMap, ModelFetcherCredentials } from '@craft-agent/shared/config';
import type { ModelDefinition } from '@craft-agent/shared/config';
type CredentialResolver = (slug: string) => Promise<ModelFetcherCredentials>;
export interface RuntimeModelState {
    models: ModelDefinition[];
    serverDefault?: string;
}
declare class ModelRefreshService {
    private fetchers;
    private getCredentials;
    private timers;
    private inFlight;
    private runtimeModels;
    constructor(fetchers: ModelFetcherMap, getCredentials: CredentialResolver);
    /**
     * Fetch models for a connection through the fallback chain.
     * Deduplicates concurrent calls for the same slug — if a refresh is already
     * in progress, callers share the same promise instead of racing.
     */
    refreshConnection(slug: string): Promise<void>;
    getRuntimeModelState(slug: string): RuntimeModelState | undefined;
    setRuntimeModelState(slug: string, state: RuntimeModelState): boolean;
    /**
     * Internal: actual refresh logic with fallback chain.
     * Qwen ACP model metadata remains runtime-only and is never persisted.
     */
    private _doRefresh;
    /**
     * Start periodic refresh timers for all existing connections.
     * Also runs an immediate non-blocking fetch for each.
     * Call on app startup after IPC handlers are registered.
     */
    startAll(): void;
    /**
     * Stop all refresh timers. Call on app quit.
     */
    stopAll(): void;
    /**
     * Trigger an immediate refresh for a specific connection.
     * Also starts a periodic timer if the fetcher supports it.
     * Called when: connection created, auth completed, user clicks refresh.
     */
    refreshNow(slug: string): Promise<void>;
    /**
     * Stop timer for a specific connection (e.g., when deleted).
     */
    stopConnection(slug: string): void;
    private startTimer;
}
/**
 * Get the ModelRefreshService singleton.
 * Must be initialized with initModelRefreshService() before use.
 */
export declare function getModelRefreshService(): ModelRefreshService;
/**
 * Initialize the ModelRefreshService with a credential resolver.
 * Called once during app startup.
 */
export declare function initModelRefreshService(getCredentials: CredentialResolver): ModelRefreshService;
export { setFetcherPlatform } from './runtime';
