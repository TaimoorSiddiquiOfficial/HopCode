/**
 * AutomationSystem - Unified Facade for the Automations System
 *
 * Single entry point that:
 * - Creates EventBus instance (per workspace)
 * - Creates and registers all handlers
 * - Loads automations.json configuration
 * - Manages scheduler service
 * - Provides diffing for session metadata changes
 * - Provides dispose() for cleanup
 *
 * Benefits:
 * - No global state - each AutomationSystem instance is self-contained
 * - Easy to create for testing
 * - SessionManager uses ~30 lines instead of ~300
 */
import { WorkspaceEventBus, type EventPayloadMap } from './event-bus.ts';
import { type AutomationsConfigProvider } from './handlers/index.ts';
import { type AutomationsConfig, type AutomationEvent, type AutomationMatcher, type PendingPrompt, type WebhookActionResult, type AppEvent, type AgentEvent, type SdkAutomationCallbackMatcher, type SdkAutomationInput } from './types.ts';
export type { SessionMetadataSnapshot } from './types.ts';
import type { SessionMetadataSnapshot } from './types.ts';
export interface AutomationSystemOptions {
    /** Workspace root path (where automations.json lives) */
    workspaceRootPath: string;
    /** Workspace ID for logging and events */
    workspaceId: string;
    /** Working directory for command execution */
    workingDir?: string;
    /** Active source slugs for permission rules */
    activeSourceSlugs?: string[];
    /** Whether to start the scheduler service (default: false) */
    enableScheduler?: boolean;
    /** Called when prompts are ready to be executed */
    onPromptsReady?: (prompts: PendingPrompt[]) => void;
    /** Called when webhook results are available */
    onWebhookResults?: (results: WebhookActionResult[]) => void;
    /** Called when an error occurs during automation execution */
    onError?: (event: AutomationEvent, error: Error) => void;
    /** Called when events are lost after retries */
    onEventLost?: (events: string[], error: Error) => void;
}
export declare class AutomationSystem implements AutomationsConfigProvider {
    readonly eventBus: WorkspaceEventBus;
    private readonly options;
    private config;
    private promptHandler;
    private webhookHandler;
    private eventLogHandler;
    private scheduler;
    private disposed;
    private readonly lastKnownMetadata;
    constructor(options: AutomationSystemOptions);
    /**
     * Read, parse, and validate automations.json. Shared pipeline for loadConfig/reloadConfig.
     * Returns the raw parsed JSON alongside validation results (avoids re-reading for backfillIds).
     */
    private readAndValidateConfig;
    /**
     * Load automations configuration from automations.json.
     */
    private loadConfig;
    /**
     * Reload automations configuration.
     * Call this when automations.json changes.
     */
    reloadConfig(): {
        success: boolean;
        automationCount: number;
        errors: string[];
    };
    /**
     * Backfill missing IDs on matchers in the raw config.
     * Operates on the already-parsed raw JSON to avoid re-reading from disk.
     * Only writes if IDs were actually missing — no-op on subsequent loads.
     */
    private backfillIds;
    /**
     * Compact automations-history.jsonl on startup: two-tier retention.
     * 1) Keep only the last N entries per automation ID.
     * 2) If total still exceeds the global cap, drop oldest globally.
     * Runs synchronously during init — single-threaded, no race with concurrent appends.
     */
    private rotateHistory;
    /**
     * Get total number of actions.
     */
    private getActionCount;
    getConfig(): AutomationsConfig | null;
    getMatchersForEvent(event: AutomationEvent): AutomationMatcher[];
    /**
     * Create and register all handlers.
     */
    private createHandlers;
    /**
     * Start the scheduler service.
     */
    private startScheduler;
    /**
     * Stop the scheduler service.
     */
    stopScheduler(): void;
    /**
     * Update session metadata and emit events for changes.
     *
     * This replaces the diffing logic that was in SessionManager.
     * Call this whenever session metadata changes.
     *
     * @param sessionId - The session ID
     * @param next - The new metadata snapshot
     * @returns The events that were emitted
     */
    updateSessionMetadata(sessionId: string, next: SessionMetadataSnapshot): Promise<AppEvent[]>;
    /**
     * Remove session metadata tracking.
     * Call this when a session is deleted.
     */
    removeSessionMetadata(sessionId: string): void;
    /**
     * Get stored metadata for a session.
     */
    getSessionMetadata(sessionId: string): SessionMetadataSnapshot | undefined;
    /**
     * Set initial metadata for a session (without emitting events).
     * Call this when loading existing sessions.
     */
    setInitialSessionMetadata(sessionId: string, metadata: SessionMetadataSnapshot): void;
    /**
     * Emit a LabelConfigChange event.
     * Call this when labels/config.json changes.
     */
    emitLabelConfigChange(): Promise<void>;
    /**
     * Emit an event directly (for edge cases).
     */
    emit<T extends AutomationEvent>(event: T, payload: EventPayloadMap[T]): Promise<void>;
    /**
     * Execute agent event automations directly through the backend-agnostic entry point.
     * to fire agent events from automations.json.
     *
     * For each matching automation matcher, builds env vars and evaluates matching.
     * Command execution has been removed — all automation actions now go through prompt-based
     * execution (creating agent sessions via PromptHandler).
     * Catches all errors — automations must never break the agent flow.
     *
     * @param signal - Optional AbortSignal for cancelling automation execution on abort
     * @returns Number of matched matchers (for diagnostics/testing)
     */
    executeAgentEvent(event: AgentEvent, input: SdkAutomationInput, signal?: AbortSignal): Promise<number>;
    /**
     * Build SDK hook callbacks from automations.json definitions.
     *
     * Command execution has been removed — all automation actions now go through prompt-based
     * execution (creating agent sessions via PromptHandler). Agent event automations are not
     * currently supported via prompts, so this returns empty.
     */
    buildSdkHooks(): Partial<Record<AgentEvent, SdkAutomationCallbackMatcher[]>>;
    /**
     * Check if the system has been disposed.
     */
    isDisposed(): boolean;
    /**
     * Dispose the automation system, cleaning up all resources.
     */
    dispose(): Promise<void>;
}
