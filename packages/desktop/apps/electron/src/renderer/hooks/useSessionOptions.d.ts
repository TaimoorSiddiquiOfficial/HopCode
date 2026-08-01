/**
 * Session Options Types
 *
 * Type definitions and helpers for session-scoped settings.
 * The actual hook is in AppShellContext.tsx as useSessionOptionsFor().
 *
 * ADDING A NEW SESSION OPTION:
 * 1. Add field to SessionOptions interface below
 * 2. Update defaultSessionOptions
 * 3. Add UI control in FreeFormInput.tsx (or wherever needed)
 */
import type { PermissionMode } from '../../shared/types';
import type { ThinkingLevel } from '@craft-agent/shared/agent/thinking-levels';
/**
 * All session-scoped options in one place.
 */
export interface SessionOptions {
    /** Permission mode */
    permissionMode: PermissionMode;
    /** Monotonic version from backend permission mode state (used to ignore stale events) */
    permissionModeVersion?: number;
    /** Session-level thinking level — sticky, persisted. See {@link ThinkingLevel}. */
    thinkingLevel: ThinkingLevel;
}
/** Default values for new sessions */
export declare const defaultSessionOptions: SessionOptions;
/** Type for partial updates to session options */
export type SessionOptionUpdates = Partial<SessionOptions>;
/** Helper to merge session options with updates */
export declare function mergeSessionOptions(current: SessionOptions | undefined, updates: SessionOptionUpdates): SessionOptions;
