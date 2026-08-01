/**
 * Stale Session Recovery Watchdog
 *
 * Safety net for edge cases the reconnect replay protocol cannot catch:
 * - Events lost during React useEffect re-registration
 * - Single dropped event without a full WS disconnect
 * - Server crash mid-stream where disconnect is never signaled cleanly
 *
 * Periodically checks for sessions stuck in isProcessing=true with no
 * recent events, and refreshes them from server-persisted state.
 *
 * Uses a generous 120s threshold to avoid false positives on long tool
 * executions (some tools legitimately run for 60+ seconds).
 */
import { getDefaultStore } from 'jotai';
type JotaiStore = ReturnType<typeof getDefaultStore>;
interface UseStaleSessionRecoveryOptions {
    store: JotaiStore;
    refreshSessionFromServer: (sessionId: string) => Promise<'refreshed' | 'preserved_stale_messages' | 'failed'>;
}
/**
 * Tracks the last time any event was received for each session.
 * If a session has isProcessing=true but no events for STALE_THRESHOLD_MS,
 * it is considered stuck and will be refreshed from the server.
 */
export declare function useStaleSessionRecovery({ store, refreshSessionFromServer, }: UseStaleSessionRecoveryOptions): {
    /** Call this on every received session event to reset the watchdog timer. */
    trackSessionActivity: (sessionId: string) => void;
};
export {};
