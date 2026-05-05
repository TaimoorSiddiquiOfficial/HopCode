import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createQuranMcpClient, resetSession } from '../mcp/quran-mcp-client.js';
import type { QuranMcpClient } from '../mcp/quran-mcp-client.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockInitResponse() {
  return new Response(
    'data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"quran-mcp","version":"1.0"}}}\n\n',
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Mcp-Session-Id': 'test-session-1',
      },
    },
  );
}

function mockToolResponse(text: string) {
  // JSON-escape the text to avoid breaking the SSE payload structure
  const escaped = JSON.stringify(text);
  return new Response(
    `data: {"jsonrpc":"2.0","id":2,"result":{"content":[{"type":"text","text":${escaped}}]}}\n\n`,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Mcp-Session-Id': 'test-session-1',
      },
    },
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createQuranMcpClient', () => {
  let client: QuranMcpClient;

  beforeEach(() => {
    resetSession();
    vi.restoreAllMocks();
    client = createQuranMcpClient();
  });

  describe('session initialization', () => {
    it('establishes an MCP session on first tool call', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      // First call: initialize
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      // Second call: notifications/initialized
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      // Third call: tool call
      fetchSpy.mockResolvedValueOnce(
        mockToolResponse('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'),
      );

      const result = await client.getAyah({ surah: 1, ayah: 1 });

      expect(result).not.toBeNull();
      expect(result?.ref).toBe('1:1');

      // Verify initialize was called with correct params
      const initBody = JSON.parse(
        (fetchSpy.mock.calls[0]?.[1] as RequestInit)?.body as string,
      );
      expect(initBody.method).toBe('initialize');
      expect(initBody.params.protocolVersion).toBe('2024-11-05');
    });

    it('returns true from isAvailable after initialization', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      fetchSpy.mockResolvedValueOnce(mockToolResponse('test text'));

      expect(client.isAvailable()).toBe(false);

      await client.getAyah({ surah: 1, ayah: 1 });

      expect(client.isAvailable()).toBe(true);
    });
  });

  describe('caching', () => {
    it('returns cached result on second call without re-fetching', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      // Init + notification + first tool call
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      fetchSpy.mockResolvedValueOnce(
        mockToolResponse('قُلْ هُوَ اللَّهُ أَحَدٌ'),
      );

      const first = await client.getAyah({ surah: 112, ayah: 1 });
      const callCountAfterFirst = fetchSpy.mock.calls.length;

      // Second call — should use cache
      const second = await client.getAyah({ surah: 112, ayah: 1 });
      const callCountAfterSecond = fetchSpy.mock.calls.length;

      expect(second).toEqual(first);
      // No additional fetch calls beyond the first
      expect(callCountAfterSecond).toBe(callCountAfterFirst);

      // Different translation should miss cache
      fetchSpy.mockResolvedValueOnce(
        mockToolResponse('Say, "He is Allah, [Who is] One"'),
      );
      await client.getAyah({
        surah: 112,
        ayah: 1,
        translation: 'en-sahih',
      });
      expect(fetchSpy.mock.calls.length).toBe(callCountAfterSecond + 1);
    });
  });

  describe('graceful degradation', () => {
    it('returns null on initialize failure', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('Network error'),
      );

      const result = await client.getAyah({ surah: 1, ayah: 1 });
      expect(result).toBeNull();
    });

    it('returns null on tool call failure after init', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      fetchSpy.mockRejectedValueOnce(new Error('Tool call failed'));

      const result = await client.getAyah({ surah: 1, ayah: 1 });
      expect(result).toBeNull();
    });

    it('returns null on HTTP error response', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      fetchSpy.mockResolvedValueOnce(
        new Response('Not Found', { status: 404 }) as unknown as Response,
      );

      const result = await client.getAyah({ surah: 1, ayah: 1 });
      expect(result).toBeNull();
    });

    it('returns null from getAyahText when translation is missing', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      // Response with only Arabic text, no translation section
      fetchSpy.mockResolvedValueOnce(
        mockToolResponse('قُلْ هُوَ اللَّهُ أَحَدٌ'),
      );

      // Request translation but response has only Arabic
      const text = await client.getAyahText({
        surah: 112,
        ayah: 1,
        translation: 'en-sahih',
      });
      expect(text).toBeNull();
    });

    it('searchQuran returns null on error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('Network error'),
      );

      const result = await client.searchQuran({ query: 'mercy' });
      expect(result).toBeNull();
    });
  });

  describe('resetSession', () => {
    it('clears session and cache', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      fetchSpy.mockResolvedValueOnce(mockToolResponse('test'));

      await client.getAyah({ surah: 1, ayah: 1 });
      expect(client.isAvailable()).toBe(true);

      resetSession();
      expect(client.isAvailable()).toBe(false);
    });
  });

  describe('getAyahText convenience', () => {
    it('returns translation text for a valid ayah', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      // Arabic followed by English translation
      fetchSpy.mockResolvedValueOnce(
        mockToolResponse(
          'قُلْ هُوَ اللَّهُ أَحَدٌ\n\nSay, "He is Allah, [Who is] One"',
        ),
      );

      const text = await client.getAyahText({
        surah: 112,
        ayah: 1,
        translation: 'en-sahih',
      });

      expect(text).toBe('Say, "He is Allah, [Who is] One"');
    });
  });

  describe('searchQuran', () => {
    it('passes query and translation to MCP tool', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      fetchSpy.mockResolvedValueOnce(mockInitResponse() as unknown as Response);
      fetchSpy.mockResolvedValueOnce(
        new Response(null, { status: 200 }) as unknown as Response,
      );
      fetchSpy.mockResolvedValueOnce(
        new Response(
          'data: {"jsonrpc":"2.0","id":3,"result":{"content":[{"type":"text","text":"results here"}]}}\n\n',
          {
            status: 200,
            headers: {
              'Content-Type': 'text/event-stream',
              'Mcp-Session-Id': 'test-session-1',
            },
          },
        ) as unknown as Response,
      );

      const result = await client.searchQuran({
        query: 'mercy',
        translation: 'en-arberry',
      });

      expect(result).not.toBeNull();
    });
  });
});
