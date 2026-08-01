/**
 * Session Self-Management Bindings
 *
 * Attaches 6 session management properties to a SessionToolContext using
 * Object.defineProperty with non-memoized lazy getters. Each access resolves
 * the callback from the session-scoped tool callback registry at call time,
 * so late merges and callback replacements are immediately visible without
 * recreating the context.
 *
 * Used by backend paths to ensure a single binding implementation.
 *
 * Design rules:
 * - Each getter calls getSessionScopedToolCallbacks() fresh — NO memoization
 * - Returns undefined when the callback is missing — NO no-ops, NO fake data
 * - getSessionInfo is the only field that wraps (for sid ?? sessionId defaulting)
 * - All other fields return the raw registry callback directly (signatures match)
 */
import type { SessionToolContext } from '@craft-agent/session-tools-core';
/**
 * Attach session self-management bindings to a SessionToolContext.
 *
 * Defines lazy getters for: setSessionLabels, setSessionStatus,
 * getSessionInfo, listSessions, resolveLabels, resolveStatus.
 *
 * @param context - The SessionToolContext to augment (mutated in place)
 * @param sessionId - The session ID for registry lookup and getSessionInfo defaulting
 */
export declare function attachSessionSelfManagementBindings(context: SessionToolContext, sessionId: string): void;
