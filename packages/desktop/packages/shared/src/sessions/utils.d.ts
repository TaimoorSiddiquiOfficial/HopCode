/**
 * Session utility functions
 */
import { type SessionPersistentField } from './types.js';
/**
 * Pick persistent fields from a session-like object.
 * Used by createSessionHeader, readSessionJsonl, getSessions, getSession
 * to ensure all persistent fields are included consistently.
 *
 * @param source - Object containing session fields
 * @returns Object with only the persistent fields that exist in source
 */
export declare function pickSessionFields<T extends object>(source: T): Partial<Record<SessionPersistentField, unknown>>;
