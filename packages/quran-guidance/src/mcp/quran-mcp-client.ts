/**
 * Quran MCP client adapter with real HTTP transport.
 *
 * Connects to https://mcp.quran.ai/ using the MCP Streamable HTTP
 * transport (SSE-based JSON-RPC over HTTP with session management).
 *
 * Tools available:
 * - fetch_quran: Get canonical Quran text by ayah reference
 * - search_quran: Semantic search over Quran text
 * - fetch_translation / search_translation: Translation tools
 * - fetch_tafsir / search_tafsir: Tafsir commentary tools
 * - list_editions: Discover available editions
 */

/** Extract JSON result from an SSE response body. */
function parseSseResult(body: string): unknown {
  const dataLine = body.split('\n').find((line) => line.startsWith('data: '));
  if (!dataLine) {
    throw new Error('MCP response missing data line');
  }
  const payload = JSON.parse(dataLine.slice(6)) as {
    result?: unknown;
    error?: { code: number; message: string };
  };
  if (payload.error) {
    throw new Error(
      `MCP error ${payload.error.code}: ${payload.error.message}`,
    );
  }
  return payload.result;
}

// ---------------------------------------------------------------------------
// Session state (module-private singleton)
// ---------------------------------------------------------------------------

interface McpSession {
  sessionId: string;
  initialized: boolean;
}

const MCP_URL = 'https://mcp.quran.ai/';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json, text/event-stream',
};

let _session: McpSession | null = null;

/**
 * Initialise an MCP session (or return the cached one).
 *
 * The first call sends `initialize` to the server and captures the
 * `Mcp-Session-Id` response header.  Subsequent calls reuse the session.
 */
async function getSession(): Promise<McpSession> {
  if (_session?.initialized) return _session;

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
  parseSseResult(body); // validate init response

  _session = { sessionId, initialized: true };

  // Send the required initialized notification
  await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      'Mcp-Session-Id': sessionId,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    }),
  });

  return _session;
}

/**
 * Low-level MCP call.  Sends a JSON-RPC request and returns the parsed
 * result.  Session is established lazily.
 */
async function callTool(
  toolName: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const session = await getSession();

  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      ...JSON_HEADERS,
      'Mcp-Session-Id': session.sessionId,
    },
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
// Public types
// ---------------------------------------------------------------------------

export type QuranMcpClient = {
  /**
   * Search the Quran for ayahs matching the query.
   * Returns a ranked result set from the Quran MCP server.
   */
  searchQuran: (input: {
    query: string;
    limit?: number;
    translation?: string;
  }) => Promise<unknown>;

  /**
   * Fetch the canonical text for a specific ayah.
   *
   * @param surah  Surah number (1-114)
   * @param ayah   Ayah number within the surah
   * @param translation  Optional translation edition ID (e.g. 'en-abdel-haleem')
   */
  getAyah: (input: {
    surah: number;
    ayah: number;
    translation?: string;
  }) => Promise<unknown>;
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a live Quran MCP client connected to https://mcp.quran.ai/.
 *
 * The client manages its own MCP session (initialize, session ID, etc.)
 * and exposes the two core operations needed by the guidance engine.
 */
export function createQuranMcpClient(): QuranMcpClient {
  return {
    async searchQuran(input) {
      const result = await callTool('search_quran', {
        query: input.query,
        ...(input.translation ? { translations: input.translation } : {}),
      });
      return result;
    },

    async getAyah(input) {
      const ref = `${input.surah}:${input.ayah}`;
      const editions: string[] = input.translation
        ? ['ar-simple-clean', input.translation]
        : ['ar-simple-clean'];

      const result = await callTool('fetch_quran', {
        ayahs: ref,
        editions,
      });
      return result;
    },
  };
}

/**
 * Reset the MCP session (useful for testing or connection recovery).
 */
export function resetSession(): void {
  _session = null;
}
