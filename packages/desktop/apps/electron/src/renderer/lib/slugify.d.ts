/**
 * Slugify utility for workspace names
 *
 * Converts a human-readable name into a filesystem-safe slug.
 * Example: "My Project" → "my-project"
 */
/**
 * Convert a string to a URL/filesystem-safe slug
 * - Lowercase
 * - Replace spaces and underscores with hyphens
 * - Remove non-alphanumeric characters (except hyphens)
 * - Collapse multiple hyphens
 * - Trim leading/trailing hyphens
 */
export declare function slugify(str: string): string;
/**
 * Check if a string is a valid slug (already slugified)
 */
export declare function isValidSlug(str: string): boolean;
