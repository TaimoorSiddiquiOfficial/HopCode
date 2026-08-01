import type { AyahResult, QuranMcpClient } from './quran-mcp-client.js';
/**
 * Fetch a verified ayah from Quran MCP by surah and ayah number.
 * Returns null on any error — treat MCP data as optional enrichment.
 */
export declare function fetchVerifiedAyah(client: QuranMcpClient, input: {
    surah: number;
    ayah: number;
    translation?: string;
}): Promise<AyahResult | null>;
/**
 * Fetch only the translation text for an ayah.
 * Returns null on any error.
 */
export declare function fetchAyahText(client: QuranMcpClient, surah: number, ayah: number, translation?: string): Promise<string | null>;
/**
 * Search the Quran for ayahs matching a query.
 * Returns null on any error.
 */
export declare function searchVerifiedQuranReferences(client: QuranMcpClient, input: {
    query: string;
    limit?: number;
    translation?: string;
}): Promise<unknown>;
