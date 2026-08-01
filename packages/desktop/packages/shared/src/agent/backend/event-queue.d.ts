/**
 * Event Queue for Async Generator Pattern
 *
 * Bridges async event handlers (.on() listeners) with AsyncGenerator<AgentEvent>.
 * Used by backends where events arrive asynchronously from separate notification handlers.
 *
 * Pattern:
 *   handler calls enqueue(event) → pushes to queue, wakes waiters
 *   chat() loop calls drain()   → yields queued events, waits when empty
 *   handler calls complete()    → signals no more events
 */
import type { AgentEvent } from '@craft-agent/core/types';
export declare class EventQueue {
    private queue;
    private resolvers;
    private done;
    /**
     * Enqueue an event and wake any waiting consumers.
     */
    enqueue(event: AgentEvent): void;
    /**
     * Signal that the turn is complete — no more events expected.
     * Wakes all waiting consumers with done=true.
     */
    complete(): void;
    /**
     * Reset queue state for a new turn.
     * Must be called before each chat() invocation.
     */
    reset(): void;
    /**
     * Async generator that yields events as they arrive.
     * Completes when complete() is called and the queue is drained.
     */
    drain(): AsyncGenerator<AgentEvent>;
    /**
     * Check if the queue has pending events.
     */
    get hasPending(): boolean;
    /**
     * Check if the queue has been marked complete.
     */
    get isComplete(): boolean;
    /**
     * Wake all waiting consumers.
     */
    private signal;
    /**
     * Wait for events to be available or completion signal.
     * Returns true when turn is complete and queue is empty.
     */
    private waitForEvent;
}
