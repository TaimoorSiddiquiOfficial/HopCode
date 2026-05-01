import type { QuranMcpClient } from './quran-mcp-client.js';

/**
 * Fetch a verified ayah from Quran MCP by surah and ayah number.
 *
 * @param client The Quran MCP client instance
 * @param input Surah number, ayah number, and optional translation preference
 */
export async function fetchVerifiedAyah(
  client: QuranMcpClient,
  input: {
    surah: number;
    ayah: number;
    translation?: string;
  },
) {
  return client.getAyah(input);
}

/**
 * Search the Quran for ayahs matching a query.
 *
 * @param client The Quran MCP client instance
 * @param input Search query, optional limit and translation preference
 */
export async function searchVerifiedQuranReferences(
  client: QuranMcpClient,
  input: {
    query: string;
    limit?: number;
    translation?: string;
  },
) {
  return client.searchQuran(input);
}
