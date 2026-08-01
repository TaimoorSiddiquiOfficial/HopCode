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
export declare function enrichGuidanceWithMCP(decision: GuidanceDecision, client: QuranMcpClient | null, translation?: string): Promise<EnrichedGuidance>;
