/**
 * Fetch a verified ayah from Quran MCP by surah and ayah number.
 * Returns null on any error — treat MCP data as optional enrichment.
 */
export async function fetchVerifiedAyah(client, input) {
    return client.getAyah(input);
}
/**
 * Fetch only the translation text for an ayah.
 * Returns null on any error.
 */
export async function fetchAyahText(client, surah, ayah, translation = 'en-abdel-haleem') {
    return client.getAyahText({ surah, ayah, translation });
}
/**
 * Search the Quran for ayahs matching a query.
 * Returns null on any error.
 */
export async function searchVerifiedQuranReferences(client, input) {
    return client.searchQuran(input);
}
//# sourceMappingURL=quran-mcp-tools.js.map