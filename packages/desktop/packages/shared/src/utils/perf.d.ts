/**
 * Performance Instrumentation
 *
 * Lightweight performance tracking for identifying bottlenecks.
 * Logs to stderr with aggregated statistics.
 *
 * IMPORTANT: Disabled by default. Only active when:
 * - CLI: --debug flag is passed (calls enableDebug())
 * - Electron: Running from source (!app.isPackaged)
 *
 * Usage:
 *   const end = perf.start('session.load')
 *   // ... do work ...
 *   end() // logs duration
 *
 *   // Or with async operations:
 *   const result = await perf.measure('mcp.connect', async () => {
 *     return connectToServer()
 *   })
 *
 *   // Nested spans for detailed breakdown:
 *   const span = perf.span('agent.init')
 *   span.mark('config.loaded')
 *   span.mark('mcp.connected')
 *   span.end() // logs total + breakdown
 */
interface PerfMetric {
    name: string;
    startTime: number;
    endTime?: number;
    duration?: number;
    marks: Array<{
        name: string;
        time: number;
        elapsed: number;
    }>;
    metadata?: Record<string, unknown>;
}
interface PerfConfig {
    enabled: boolean;
    logToFile: boolean;
    logFilePath: string;
    minDurationMs: number;
    onMetric?: (metric: PerfMetric) => void;
}
/**
 * Configure performance tracking
 */
export declare function configurePerfTracking(options: Partial<PerfConfig>): void;
/**
 * Enable/disable perf tracking at runtime
 */
export declare function setPerfEnabled(enabled: boolean): void;
/**
 * Check if perf tracking is enabled.
 * Returns true if explicitly enabled OR if debug mode is active.
 */
export declare function isPerfEnabled(): boolean;
/**
 * Start a simple timing operation
 * Returns a function to call when the operation completes
 */
export declare function start(name: string, metadata?: Record<string, unknown>): () => number;
/**
 * Measure an async operation
 */
export declare function measure<T>(name: string, fn: () => Promise<T>, metadata?: Record<string, unknown>): Promise<T>;
/**
 * Measure a sync operation
 */
export declare function measureSync<T>(name: string, fn: () => T, metadata?: Record<string, unknown>): T;
/**
 * Create a span for measuring operations with intermediate marks
 */
export interface PerfSpan {
    /** Add a checkpoint mark */
    mark(name: string): void;
    /** Add metadata to the span */
    setMetadata(key: string, value: unknown): void;
    /** End the span and log results */
    end(): number;
    /** Get elapsed time without ending */
    elapsed(): number;
}
export declare function span(name: string, metadata?: Record<string, unknown>): PerfSpan;
/**
 * Get aggregated statistics for all operations
 */
export declare function getStats(): Map<string, {
    count: number;
    totalMs: number;
    minMs: number;
    maxMs: number;
    avgMs: number;
    p50Ms: number;
    p95Ms: number;
}>;
/**
 * Get recent metrics (for debugging/analysis)
 */
export declare function getRecentMetrics(): PerfMetric[];
/**
 * Clear all collected metrics and stats
 */
export declare function clearMetrics(): void;
/**
 * Format stats as a summary table (for console output)
 */
export declare function formatStatsSummary(): string;
export declare const perf: {
    start: typeof start;
    measure: typeof measure;
    measureSync: typeof measureSync;
    span: typeof span;
    getStats: typeof getStats;
    getRecentMetrics: typeof getRecentMetrics;
    clearMetrics: typeof clearMetrics;
    formatStatsSummary: typeof formatStatsSummary;
    configure: typeof configurePerfTracking;
    setEnabled: typeof setPerfEnabled;
    isEnabled: typeof isPerfEnabled;
};
export default perf;
