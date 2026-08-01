/**
 * Human-Readable Session ID Generator
 *
 * Generates session IDs in the format: YYMMDD-readable-slug
 * Example: 260111-fix-session-names
 *
 * - Time-sortable by date prefix
 * - Human-readable and memorable
 * - Prompt/title-derived when a useful hint is available
 * - Random adjective-noun fallback for callers that cannot provide a hint
 * - Collision handling with numeric suffix
 */
/**
 * Generate date prefix in YYMMDD format
 */
export declare function generateDatePrefix(date?: Date): string;
/**
 * Generate a random adjective-noun slug
 */
export declare function generateHumanSlug(): string;
/**
 * Convert a user-facing title or prompt into a filesystem-safe slug.
 */
export declare function generateSlugFromHint(hint?: string): string | null;
/**
 * Generate a unique session ID, handling collisions
 *
 * @param existingIds - Set or array of existing session IDs in the workspace
 * @param date - Optional date for the prefix (defaults to now)
 * @param slugHint - Optional prompt/title text to derive the slug from
 * @returns A unique session ID like "260111-fix-session-names" or "260111-fix-session-names-2"
 */
export declare function generateUniqueSessionId(existingIds: Set<string> | string[], date?: Date, slugHint?: string): string;
/**
 * Parse a session ID to extract its components
 *
 * @param sessionId - A session ID like "260111-swift-river" or legacy UUID
 * @returns Parsed components or null if not in human-readable format
 */
export declare function parseSessionId(sessionId: string): {
    datePrefix: string;
    date: Date;
    slug: string;
    suffix?: number;
} | null;
/**
 * Check if a session ID is in the new human-readable format
 */
export declare function isHumanReadableId(sessionId: string): boolean;
