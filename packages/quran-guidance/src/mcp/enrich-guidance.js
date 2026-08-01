/**
 * Fetch verified ayah text for each ayah reference in a guidance
 * decision.
 *
 * Graceful degradation: if the MCP client is unavailable or any
 * individual lookup fails, those ayahs are simply omitted from
 * `ayahTexts`.  The caller always gets a valid `EnrichedGuidance`
 * back, never an error.
 *
 * @param decision   The resolved guidance decision
 * @param client     Optional Quran MCP client (skip enrichment if null)
 * @param translation  Translation edition to use (default: en-abdel-haleem)
 */
export async function enrichGuidanceWithMCP(decision, client, translation = 'en-abdel-haleem') {
    const ayahTexts = new Map();
    if (!client) {
        return { decision, ayahTexts };
    }
    // Fetch all ayah texts in parallel
    const results = await Promise.allSettled(decision.ayahRefs.map(async (ref) => {
        const [surah, ayah] = parseRef(ref);
        if (!surah || !ayah)
            return null;
        const text = await client.getAyahText({ surah, ayah, translation });
        return text ? { ref, text } : null;
    }));
    for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
            ayahTexts.set(result.value.ref, result.value.text);
        }
    }
    return { decision, ayahTexts };
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/**
 * Parse a "surah:ayah" reference string into numbers.
 * Returns [null, null] for malformed strings.
 */
function parseRef(ref) {
    const parts = ref.split(':');
    if (parts.length !== 2)
        return [null, null];
    const surah = parseInt(parts[0], 10);
    const ayah = parseInt(parts[1], 10);
    if (isNaN(surah) || isNaN(ayah))
        return [null, null];
    return [surah, ayah];
}
//# sourceMappingURL=enrich-guidance.js.map