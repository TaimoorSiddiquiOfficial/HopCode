/**
 * UsageTracker
 *
 * Tracks token usage and context window consumption for agent sessions.
 * Provides accurate per-message tracking (not cumulative billing totals)
 * for real-time context window display.
 *
 * Used by backend agents to:
 * - Track input/output tokens per message
 * - Calculate cache hit/miss rates
 * - Emit usage_update events for UI display
 * - Track cumulative session usage (for billing display)
 */
/**
 * Token usage for a single message.
 */
export interface MessageUsage {
    /** Total input tokens (includes cache tokens) */
    inputTokens: number;
    /** Output tokens generated */
    outputTokens: number;
    /** Tokens read from cache */
    cacheReadTokens: number;
    /** Tokens written to cache */
    cacheCreationTokens: number;
    /** Timestamp of this usage record */
    timestamp: number;
}
/**
 * Cumulative session usage (for billing/totals).
 */
export interface SessionUsage {
    /** Total input tokens across all messages */
    totalInputTokens: number;
    /** Total output tokens across all messages */
    totalOutputTokens: number;
    /** Total cache read tokens */
    totalCacheReadTokens: number;
    /** Total cache creation tokens */
    totalCacheCreationTokens: number;
    /** Number of messages/turns */
    messageCount: number;
    /** Session start timestamp */
    startedAt: number;
}
/**
 * Usage update event data (for UI display).
 */
export interface UsageUpdate {
    /** Current context size (input tokens for last message) */
    inputTokens: number;
    /** Context window size (model's maximum) */
    contextWindow?: number;
    /** Cache hit rate (0-1) */
    cacheHitRate?: number;
}
/**
 * Configuration for UsageTracker.
 */
export interface UsageTrackerConfig {
    /** Context window size for the model being used */
    contextWindow?: number;
    /** Callback when usage is updated */
    onUsageUpdate?: (update: UsageUpdate) => void;
    /** Debug callback */
    onDebug?: (message: string) => void;
}
/**
 * Tracks token usage for an agent session.
 *
 * Provides:
 * - Per-message usage tracking (for accurate context window display)
 * - Cumulative session usage (for billing totals)
 * - Cache efficiency metrics
 * - Real-time usage update events
 */
export declare class UsageTracker {
    private config;
    private sessionUsage;
    private lastMessageUsage;
    private cachedContextWindow?;
    constructor(config?: UsageTrackerConfig);
    /**
     * Record usage from an assistant message.
     * This is called during message processing to track real-time usage.
     */
    recordMessageUsage(usage: {
        inputTokens: number;
        outputTokens?: number;
        cacheReadTokens?: number;
        cacheCreationTokens?: number;
    }): void;
    /**
     * Record final usage when a turn completes.
     * Updates cumulative session totals.
     */
    recordTurnComplete(usage?: {
        inputTokens: number;
        outputTokens: number;
        cacheReadTokens?: number;
        cacheCreationTokens?: number;
    }): void;
    /**
     * Set/update the context window size.
     * This can be updated dynamically as model info becomes available.
     */
    setContextWindow(contextWindow: number): void;
    /**
     * Get the current context window size.
     */
    getContextWindow(): number | undefined;
    /**
     * Get the last message's usage (for per-message display).
     */
    getLastMessageUsage(): MessageUsage | null;
    /**
     * Get cumulative session usage (for billing/totals).
     */
    getSessionUsage(): SessionUsage;
    /**
     * Get the current input tokens (from last message).
     * This represents the actual context size sent to the API.
     */
    getCurrentInputTokens(): number;
    /**
     * Calculate cache hit rate (0-1).
     * Higher is better - more tokens served from cache.
     */
    getCacheHitRate(): number;
    /**
     * Get context usage as a percentage (0-100).
     * Returns undefined if context window is not set.
     */
    getContextUsagePercent(): number | undefined;
    /**
     * Check if context is getting full (> 80% used).
     */
    isContextFilling(): boolean;
    /**
     * Check if context is critically full (> 95% used).
     */
    isContextCritical(): boolean;
    /**
     * Reset all tracking (for new session).
     */
    reset(): void;
    /**
     * Build a UsageUpdate object for emitting events.
     */
    buildUsageUpdate(): UsageUpdate;
    private emitUsageUpdate;
    private debug;
}
/**
 * Create a new UsageTracker.
 */
export declare function createUsageTracker(config?: UsageTrackerConfig): UsageTracker;
