/**
 * Event Processor Hook
 *
 * Provides the event processor for use in App.tsx.
 * Manages streaming state per session and returns processed events.
 */
import type { Session } from '../../shared/types';
import type { AgentEvent, Effect, StreamingState } from './types';
interface UseEventProcessorResult {
    /**
     * Process an agent event and return the updated session + any side effects
     *
     * @param event - The agent event to process
     * @param currentSession - Current session state (or null if not found)
     * @param workspaceId - Workspace ID for creating new sessions
     * @returns Updated session and any side effects to execute
     */
    processAgentEvent: (event: AgentEvent, currentSession: Session | null, workspaceId: string) => {
        session: Session;
        effects: Effect[];
    };
    /**
     * Clear streaming state for a session (e.g., on error or complete)
     */
    clearStreamingState: (sessionId: string) => void;
    /**
     * Get current streaming state for a session (for debugging/testing)
     */
    getStreamingState: (sessionId: string) => StreamingState | null;
}
/**
 * Hook that provides the event processor
 *
 * Manages streaming state per session (replaces streamingTextRef).
 * All event processing goes through pure functions.
 */
export declare function useEventProcessor(): UseEventProcessorResult;
export {};
