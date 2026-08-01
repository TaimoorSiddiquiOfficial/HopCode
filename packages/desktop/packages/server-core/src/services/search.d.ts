/**
 * Session Content Search Service
 *
 * Uses ripgrep to search session content (JSONL files).
 * Returns matches with session IDs and context snippets.
 */
import { type PlatformServices } from '../runtime/platform';
/**
 * Thrown when the search service cannot run (e.g. ripgrep binary not found).
 * Clients should catch this and show an "unavailable" state instead of "0 results".
 */
export declare class SearchUnavailableError extends Error {
    constructor(reason: string);
}
export declare function setSearchPlatform(platform: PlatformServices): void;
/**
 * Search result for a single match
 */
export interface SearchMatch {
    /** Session ID (extracted from file path) */
    sessionId: string;
    /** Line number in the JSONL file */
    lineNumber: number;
    /** The matched text snippet with context */
    snippet: string;
    /** The raw matched text (without context) */
    matchText: string;
}
/**
 * Aggregated search results for a session
 */
export interface SessionSearchResult {
    sessionId: string;
    /** Number of matches found in this session */
    matchCount: number;
    /** First few matches with context */
    matches: SearchMatch[];
}
/**
 * Options for session search
 */
export interface SearchOptions {
    /** Maximum time to wait for search (ms). Default: 5000 */
    timeout?: number;
    /** Maximum matches per session. Default: 3 */
    maxMatchesPerSession?: number;
    /** Maximum total sessions to return. Default: 50 */
    maxSessions?: number;
    /** Case insensitive search. Default: true */
    ignoreCase?: boolean;
    /** Search ID for correlating logs across stages */
    searchId?: string;
}
/**
 * Search session content using ripgrep.
 *
 * @param query - Search query (plain text, will be escaped)
 * @param sessionsDir - Path to the sessions directory
 * @param options - Search options
 * @returns Promise resolving to array of session search results
 */
export declare function searchSessions(query: string, sessionsDir: string, options?: SearchOptions): Promise<SessionSearchResult[]>;
