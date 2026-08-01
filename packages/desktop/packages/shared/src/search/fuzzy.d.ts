/**
 * Centralized fuzzy search utility using uFuzzy
 *
 * Features:
 * - Word boundary aware matching ("proj" matches "My Project")
 * - Full CJK (Chinese/Japanese/Korean) support via Unicode mode
 * - Transparent scoring for sorting by relevance
 * - Match ranges for highlighting
 */
export interface FuzzyResult<T> {
    item: T;
    /** Match score - higher is better */
    score: number;
    /** Character indices for highlighting (flat array from uFuzzy) */
    ranges?: number[];
}
/**
 * Fuzzy search/filter a list of items
 * Returns items sorted by match quality (best first)
 *
 * @param items - Array of items to search
 * @param query - Search query string
 * @param getText - Function to extract searchable text from each item
 * @returns Filtered and sorted results with scores
 *
 * @example
 * const results = fuzzyFilter(commands, 'cmt', cmd => cmd.label)
 * // Returns commands matching "cmt" like "commit", sorted by relevance
 */
export declare function fuzzyFilter<T>(items: T[], query: string, getText: (item: T) => string): FuzzyResult<T>[];
/**
 * Get fuzzy match score for a single text string
 * Useful for sorting/prioritization without full filtering
 *
 * @param text - Text to match against
 * @param query - Search query
 * @returns Score (higher = better match), 0 if no match
 *
 * @example
 * const score = fuzzyScore("My Project", "proj")
 * // Returns positive score for word boundary match
 */
export declare function fuzzyScore(text: string, query: string): number;
/**
 * Check if text fuzzy-matches the query
 * Simple boolean check, faster than getting full score
 *
 * @param text - Text to match against
 * @param query - Search query
 * @returns true if matches
 */
export declare function fuzzyMatch(text: string, query: string): boolean;
