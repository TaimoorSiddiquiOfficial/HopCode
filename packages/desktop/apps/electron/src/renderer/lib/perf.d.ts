/**
 * Renderer-side Performance Instrumentation
 *
 * Tracks session switch timing from click to render complete.
 * Logs via electron-log to the main log file.
 *
 * Usage:
 *   // In SessionList click handler:
 *   rendererPerf.startSessionSwitch(sessionId)
 *
 *   // In ChatTabPanel when session loads:
 *   rendererPerf.markSessionSwitch(sessionId, 'session.loaded')
 *
 *   // When render is complete:
 *   rendererPerf.endSessionSwitch(sessionId)
 */
interface SessionSwitchMetric {
    sessionId: string;
    startTime: number;
    marks: Array<{
        name: string;
        elapsed: number;
    }>;
    endTime?: number;
    duration?: number;
}
/**
 * Initialize perf tracking. Call this once on app startup.
 * In Electron renderer, we check if we're in dev mode.
 */
export declare function initRendererPerf(isDebug: boolean): void;
/**
 * Check if perf tracking is enabled
 */
export declare function isRendererPerfEnabled(): boolean;
/**
 * Start tracking a session switch.
 * Call this when user clicks on a session in the list.
 * Clears any other pending switches (user navigated away before completion).
 */
export declare function startSessionSwitch(sessionId: string): void;
/**
 * Add a checkpoint mark during session switch.
 * Use for intermediate steps like 'session.loaded', 'agent.status', etc.
 */
export declare function markSessionSwitch(sessionId: string, markName: string): void;
/**
 * End session switch tracking and log final duration.
 * Call this when the chat display has fully rendered.
 */
export declare function endSessionSwitch(sessionId: string): number | null;
/**
 * Get recent session switch metrics for analysis
 */
export declare function getRecentMetrics(): SessionSwitchMetric[];
/**
 * Get statistics for session switch times
 */
export declare function getSessionSwitchStats(): {
    count: number;
    avgMs: number;
    p50Ms: number;
    p95Ms: number;
    minMs: number;
    maxMs: number;
} | null;
/**
 * Clear all metrics
 */
export declare function clearMetrics(): void;
export declare const rendererPerf: {
    init: typeof initRendererPerf;
    isEnabled: typeof isRendererPerfEnabled;
    startSessionSwitch: typeof startSessionSwitch;
    markSessionSwitch: typeof markSessionSwitch;
    endSessionSwitch: typeof endSessionSwitch;
    getRecentMetrics: typeof getRecentMetrics;
    getStats: typeof getSessionSwitchStats;
    clear: typeof clearMetrics;
};
export default rendererPerf;
