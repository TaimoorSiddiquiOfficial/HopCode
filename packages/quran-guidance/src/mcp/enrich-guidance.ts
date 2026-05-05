import type { GuidanceDecision } from '../types/quran-guidance.js';
import type { QuranMcpClient } from './quran-mcp-client.js';

/**
 * Enriched guidance decision that includes verified ayah text from
 * the Quran MCP when available.
 */
export interface EnrichedGuidance {
  /** The original guidance decision */
  decision: GuidanceDecision;
  /**
   * Verified ayah texts keyed by reference (e.g. "49:6").
   * Only populated when the MCP client is available and the lookup
   * succeeds.  Empty map when MCP is unavailable.
   */
  ayahTexts: Map<string, string>;
}

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
export async function enrichGuidanceWithMCP(
  decision: GuidanceDecision,
  client: QuranMcpClient | null,
  translation: string = 'en-abdel-haleem',
): Promise<EnrichedGuidance> {
  const ayahTexts = new Map<string, string>();

  if (!client) {
    return { decision, ayahTexts };
  }

  // Fetch all ayah texts in parallel
  const results = await Promise.allSettled(
    decision.ayahRefs.map(async (ref) => {
      const [surah, ayah] = parseRef(ref);
      if (!surah || !ayah) return null;
      const text = await client.getAyahText({ surah, ayah, translation });
      return text ? { ref, text } : null;
    }),
  );

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
function parseRef(ref: string): [number | null, number | null] {
  const parts = ref.split(':');
  if (parts.length !== 2) return [null, null];
  const surah = parseInt(parts[0], 10);
  const ayah = parseInt(parts[1], 10);
  if (isNaN(surah) || isNaN(ayah)) return [null, null];
  return [surah, ayah];
}
