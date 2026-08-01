/**
 * Event Processor
 *
 * Central pure function that processes all agent events.
 * Guarantees consistent state transitions and always returns new references.
 *
 * Benefits:
 * - Single source of truth for event handling
 * - Pure functions - easy to test
 * - No race conditions - single update path
 * - Always new references - atom sync always works
 * - Message lookup by ID - never position-based
 */
import type { SessionState, AgentEvent, ProcessResult } from './types';
/**
 * Process an agent event, returning new state and any side effects
 *
 * This is a PURE FUNCTION - no side effects, always returns new state.
 * Guaranteed to return a new session reference (no referential equality issues).
 *
 * @param state - Current session state (session + streaming)
 * @param event - Agent event to process
 * @returns New state and any side effects to execute
 */
export declare function processEvent(state: SessionState, event: AgentEvent): ProcessResult;
