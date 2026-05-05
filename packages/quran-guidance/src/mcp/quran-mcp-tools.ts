import type { AyahResult, QuranMcpClient } from './quran-mcp-client.js';

/**
 * Fetch a verified ayah from Quran MCP by surah and ayah number.
 * Returns null on any error — treat MCP data as optional enrichment.
 */
export async function fetchVerifiedAyah(
  client: QuranMcpClient,
  input: {
    surah: number;
    ayah: number;
    translation?: string;
  },
): Promise<AyahResult | null> {
  return client.getAyah(input);
}

/**
 * Fetch only the translation text for an ayah.
 * Returns null on any error.
 */
export async function fetchAyahText(
  client: QuranMcpClient,
  surah: number,
  ayah: number,
  translation: string = 'en-abdel-haleem',
): Promise<string | null> {
  return client.getAyahText({ surah, ayah, translation });
}

/**
 * Search the Quran for ayahs matching a query.
 * Returns null on any error.
 */
export async function searchVerifiedQuranReferences(
  client: QuranMcpClient,
  input: {
    query: string;
    limit?: number;
    translation?: string;
  },
): Promise<unknown> {
  return client.searchQuran(input);
}
