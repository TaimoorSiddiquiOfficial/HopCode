export interface FocusInputEventDetail {
    sessionId?: string;
}
/**
 * Queue a targeted focus request so newly-mounted inputs can consume it
 * after a session switch race (e.g., SessionList Enter).
 */
export declare function queuePendingFocusForSession(sessionId?: string | null): void;
/**
 * Dispatch the global focus-input event with optional session scoping.
 * Also stores a pending target to survive session switch timing races.
 */
export declare function dispatchFocusInputEvent(detail?: FocusInputEventDetail): void;
/**
 * Consume queued focus request for a specific session. Returns true when consumed.
 */
export declare function consumePendingFocusForSession(sessionId?: string | null): boolean;
/** Clear queued focus for a session if present. */
export declare function clearPendingFocusForSession(sessionId?: string | null): void;
/** Test-only reset helper. */
export declare function __resetPendingFocusForTests(): void;
