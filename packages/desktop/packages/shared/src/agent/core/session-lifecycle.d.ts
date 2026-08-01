/**
 * SessionLifecycle
 *
 * Shared session lifecycle types and utilities for agent implementations.
 * Provides common abort reasons, session state, and cleanup patterns.
 *
 * The actual abort implementation is provider-specific:
 * - Backend agents use their runtime-specific abort mechanism
 * - CodexAgent uses client.turnInterrupt() with the Codex API
 *
 * This module provides the shared types and utilities that both use.
 */
/**
 * Reason for aborting agent execution.
 * Used to distinguish user-initiated stops from internal aborts.
 */
export declare enum AbortReason {
    /** User clicked stop button */
    UserStop = "user_stop",
    /** Agent submitted a plan and is awaiting review */
    PlanSubmitted = "plan_submitted",
    /** Auth request triggered (OAuth, credential prompt) */
    AuthRequest = "auth_request",
    /** New message sent while processing (silent redirect) */
    Redirect = "redirect",
    /** Source activation requested - need to restart with new tools */
    SourceActivated = "source_activated",
    /** Session timeout */
    Timeout = "timeout",
    /** Internal error requiring abort */
    InternalError = "internal_error"
}
/**
 * Session state tracking for agent lifecycle.
 */
export interface SessionState {
    /** Unique session ID */
    sessionId: string;
    /** Whether the session is currently active */
    isActive: boolean;
    /** Number of messages/turns in this session */
    messageCount: number;
    /** Timestamp when session started */
    startedAt: number;
    /** Last activity timestamp */
    lastActivityAt: number;
    /** Whether there's been any assistant response content */
    hasReceivedContent: boolean;
}
/**
 * Configuration for session lifecycle management.
 */
export interface SessionLifecycleConfig {
    /** Session ID */
    sessionId: string;
    /** Optional callback when session state changes */
    onStateChange?: (state: SessionState) => void;
    /** Optional debug callback */
    onDebug?: (message: string) => void;
}
/**
 * Manages session lifecycle state.
 *
 * Tracks session activity and provides utilities for:
 * - Session state tracking (active, message count, timestamps)
 * - Abort reason management
 * - Session cleanup
 */
export declare class SessionLifecycleManager {
    private state;
    private currentAbortReason;
    private config;
    constructor(config: SessionLifecycleConfig);
    /**
     * Get current session state.
     */
    getState(): SessionState;
    /**
     * Get the session ID.
     */
    getSessionId(): string;
    /**
     * Check if this is the first message in the session.
     */
    isFirstMessage(): boolean;
    /**
     * Record that a message/turn has started.
     */
    recordMessageStart(): void;
    /**
     * Record that a message/turn has completed.
     */
    recordMessageComplete(): void;
    /**
     * Record that content has been received from the assistant.
     * Important for determining if abort should clear session state.
     */
    recordContentReceived(): void;
    /**
     * Set the abort reason for the current operation.
     * @returns Previous abort reason, if any.
     */
    setAbortReason(reason: AbortReason): AbortReason | null;
    /**
     * Get and clear the current abort reason.
     */
    consumeAbortReason(): AbortReason | null;
    /**
     * Get the current abort reason without clearing it.
     */
    getAbortReason(): AbortReason | null;
    /**
     * Check if the abort was user-initiated.
     */
    wasUserAbort(): boolean;
    /**
     * Check if abort should clear session state.
     *
     * Session state should be cleared if:
     * - Aborted before receiving any content
     * - AND it was the first message
     *
     * This prevents broken resume states.
     */
    shouldClearSessionOnAbort(): boolean;
    /**
     * Deactivate the session (e.g., on dispose).
     */
    deactivate(): void;
    /**
     * Reset session state for a new conversation.
     */
    reset(): void;
    private notifyStateChange;
    private debug;
}
/**
 * Create a new SessionLifecycleManager.
 */
export declare function createSessionLifecycleManager(config: SessionLifecycleConfig): SessionLifecycleManager;
