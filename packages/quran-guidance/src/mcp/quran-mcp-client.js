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
const MCP_URL = 'https://mcp.quran.ai/';
const JSON_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/event-stream',
};
let _session = null;
/** In-memory cache keyed by "surah:ayah:edition". */
const _cache = new Map();
function parseSseResult(body) {
    const dataLine = body.split('\n').find((line) => line.startsWith('data: '));
    if (!dataLine) {
        throw new Error('MCP response missing data line');
    }
    const payload = JSON.parse(dataLine.slice(6));
    if (payload.error) {
        throw new Error(`MCP error ${payload.error.code}: ${payload.error.message}`);
    }
    return payload.result;
}
// ---------------------------------------------------------------------------
// Session management
// ---------------------------------------------------------------------------
async function getSession() {
    if (_session?.initialized)
        return _session;
    const initRes = await fetch(MCP_URL, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'hopcode-guidance', version: '0.1.0' },
            },
        }),
    });
    if (!initRes.ok) {
        throw new Error(`MCP initialize failed: ${initRes.status}`);
    }
    const sessionId = initRes.headers.get('mcp-session-id');
    if (!sessionId) {
        throw new Error('MCP initialize: no session ID returned');
    }
    const body = await initRes.text();
    parseSseResult(body);
    _session = { sessionId, initialized: true };
    // Required initialized notification
    await fetch(MCP_URL, {
        method: 'POST',
        headers: { ...JSON_HEADERS, 'Mcp-Session-Id': sessionId },
        body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'notifications/initialized',
        }),
    });
    return _session;
}
// ---------------------------------------------------------------------------
// Low-level MCP call
// ---------------------------------------------------------------------------
async function callTool(toolName, args) {
    const session = await getSession();
    const res = await fetch(MCP_URL, {
        method: 'POST',
        headers: { ...JSON_HEADERS, 'Mcp-Session-Id': session.sessionId },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: { name: toolName, arguments: args },
        }),
    });
    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`MCP ${toolName} failed (${res.status}): ${errText}`);
    }
    return parseSseResult(await res.text());
}
// ---------------------------------------------------------------------------
// Result extraction
// ---------------------------------------------------------------------------
/**
 * Extract text content from an MCP tool result.
 * The result shape from fetch_quran is:
 *   { content: [{ type: 'text', text: '...' }] }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractTextContent(raw) {
    if (!raw)
        return null;
    // MCP standard: { content: [{ type: 'text', text: '...' }] }
    if (Array.isArray(raw.content)) {
        for (const part of raw.content) {
            if (part.type === 'text' && typeof part.text === 'string') {
                return part.text;
            }
        }
    }
    // Fallback: raw might be a string directly
    if (typeof raw === 'string')
        return raw;
    return null;
}
// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function createQuranMcpClient() {
    return {
        async searchQuran(input) {
            try {
                return await callTool('search_quran', {
                    query: input.query,
                    ...(input.translation ? { translations: input.translation } : {}),
                });
            }
            catch {
                return null;
            }
        },
        async getAyah(input) {
            const cacheKey = buildCacheKey(input.surah, input.ayah, input.translation);
            // Check cache first
            const cached = _cache.get(cacheKey);
            if (cached)
                return cached;
            try {
                const ref = `${input.surah}:${input.ayah}`;
                const editions = input.translation
                    ? ['ar-simple-clean', input.translation]
                    : ['ar-simple-clean'];
                const raw = await callTool('fetch_quran', { ayahs: ref, editions });
                const result = {
                    ref,
                    arabic: '',
                    translation: undefined,
                    translationEdition: input.translation,
                };
                // Parse the response: fetch_quran typically returns
                //   { content: [{ type: 'text', text: '...' }] }
                const text = extractTextContent(raw) ?? '';
                result.arabic = extractArabicFromText(text) ?? '';
                if (input.translation) {
                    result.translation = extractTranslationFromText(text) ?? undefined;
                }
                _cache.set(cacheKey, result);
                return result;
            }
            catch {
                return null;
            }
        },
        async getAyahText(input) {
            const result = await this.getAyah(input);
            return result?.translation ?? null;
        },
        isAvailable() {
            return _session?.initialized ?? false;
        },
    };
}
// ---------------------------------------------------------------------------
// Text parsing helpers
// ---------------------------------------------------------------------------
/**
 * Extract Arabic text from fetch_quran response.
 * The response is typically: "Arabic text\n\nEnglish translation"
 * Arabic Unicode range: \u0600-\u06FF
 *
 * Uses \u0020 (literal space) rather than \s to avoid matching
 * newlines, which would cause the entire response to match as
 * "Arabic" and prevent translation extraction.
 */
function extractArabicFromText(text) {
    const match = text.match(/[\u0600-\u06FF\uFD50-\uFDFF\u0020]+/);
    return match ? match[0].trim() : null;
}
/**
 * Extract English translation from fetch_quran response (after Arabic).
 */
function extractTranslationFromText(text) {
    // Arabic text is followed by separator(s) then translation
    const arabicEnd = text.search(/[^\u0600-\u06FF\uFD50-\uFDFF\s]/);
    if (arabicEnd === -1)
        return null;
    const after = text.slice(arabicEnd).trim();
    // Remove leading separators (dashes, newlines, etc.)
    const cleaned = after.replace(/^[\s\n\r\-—–]+/, '').trim();
    return cleaned || null;
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function buildCacheKey(surah, ayah, translation) {
    return `${surah}:${ayah}:${translation ?? 'arabic-only'}`;
}
/**
 * Reset the MCP session and clear the cache (useful for testing).
 */
export function resetSession() {
    _session = null;
    _cache.clear();
}
//# sourceMappingURL=quran-mcp-client.js.map