/**
 * Default Entity Colors
 *
 * Default color assignments for built-in entities (statuses, etc).
 * These are used when an entity config doesn't specify an explicit color.
 *
 * Moved from renderer's todo-states.tsx to shared module so both
 * backend validation and frontend rendering use the same defaults.
 */
import type { EntityColor } from './types.ts';
/**
 * Default colors for built-in statuses.
 * Uses system colors with opacity modifiers for muted states.
 */
export declare const DEFAULT_STATUS_COLORS: Record<string, EntityColor>;
/** Fallback color for statuses without explicit color or known default */
export declare const DEFAULT_STATUS_FALLBACK: EntityColor;
/**
 * Get the default color for a status ID.
 * Returns the known default if the status is built-in, otherwise the fallback.
 */
export declare function getDefaultStatusColor(statusId: string): EntityColor;
