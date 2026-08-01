/**
 * Text Event Handlers
 *
 * Handles text_delta and text_complete events.
 * Pure functions that return new state - no side effects.
 */
import type { SessionState, TextDeltaEvent, TextCompleteEvent } from '../types';
/**
 * Handle text_delta - accumulate streaming content
 *
 * Creates a new streaming message if none exists, otherwise updates existing.
 * Uses turnId for lookup, never position.
 */
export declare function handleTextDelta(state: SessionState, event: TextDeltaEvent): SessionState;
/**
 * Handle text_complete - finalize the streaming message
 *
 * Sets isStreaming: false, isPending: false.
 * If message not found, CREATES it (fixes race condition bug).
 * Uses complete text from SDK (event.text), not accumulated content.
 */
export declare function handleTextComplete(state: SessionState, event: TextCompleteEvent): SessionState;
