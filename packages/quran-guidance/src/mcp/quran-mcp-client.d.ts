/**
 * Quran MCP client with session management, caching, and graceful
 * degradation.
 *
 * Connects to https://mcp.quran.ai/ using the MCP Streamable HTTP
 * transport.  A single session is shared across all calls (module-
 * private singleton).
 *
 * Graceful degradation: if the MCP server is unreachable or returns
 * errors, all public methods return `null` instead of throwing.
 * Callers should treat MCP enrichment as optional.
 */
/** Structured result from a `fetch_quran` MCP tool call. */
export interface AyahResult {
    /** Surah:ayah reference, e.g. "49:6" */
    ref: string;
    /** Arabic text (from ar-simple-clean edition) */
    arabic: string;
    /** English translation text, if a translation edition was requested */
    translation?: string;
    /** Edition identifier for the translation */
    translationEdition?: string;
}
export type QuranMcpClient = {
    /**
     * Search the Quran for ayahs matching the query.
     * Returns null on any error (network, MCP protocol, etc.).
     */
    searchQuran: (input: {
        query: string;
        limit?: number;
        translation?: string;
    }) => Promise<unknown>;
    /**
     * Fetch the canonical text for a specific ayah.
     * Returns null on any error.
     */
    getAyah: (input: {
        surah: number;
        ayah: number;
        translation?: string;
    }) => Promise<AyahResult | null>;
    /**
     * Convenience: fetch only the English translation text for an ayah.
     * Returns null on any error or if no translation is available.
     */
    getAyahText: (input: {
        surah: number;
        ayah: number;
        translation?: string;
    }) => Promise<string | null>;
    /**
     * Returns true if the client has an active MCP session.
     * Note: the session may become stale later; this is a snapshot.
     */
    isAvailable: () => boolean;
};
export declare function createQuranMcpClient(): QuranMcpClient;
/**
 * Reset the MCP session and clear the cache (useful for testing).
 */
export declare function resetSession(): void;
