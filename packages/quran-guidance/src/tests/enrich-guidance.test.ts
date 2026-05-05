import { describe, it, expect, vi } from 'vitest';
import { enrichGuidanceWithMCP } from '../mcp/enrich-guidance.js';
import type { GuidanceDecision } from '../types/quran-guidance.js';
import type { QuranMcpClient } from '../mcp/quran-mcp-client.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeDecision(overrides?: Partial<GuidanceDecision>): GuidanceDecision {
  return {
    situation: 'general_advice',
    appliedAngles: ['truthfulness', 'good_speech'],
    ayahRefs: ['49:6', '17:36'],
    strategy: {
      do: ['Verify before acting'],
      avoid: ['Do not assume'],
      tone: ['careful', 'fair'],
    },
    responsePattern: 'truthful_helpful_response',
    ...overrides,
  };
}

function makeMockClient(responses: Map<string, string | null>): QuranMcpClient {
  return {
    getAyahText: vi.fn(
      async (input: { surah: number; ayah: number; translation?: string }) => {
        const key = `${input.surah}:${input.ayah}`;
        return responses.get(key) ?? null;
      },
    ),
    getAyah: vi.fn(),
    searchQuran: vi.fn(),
    isAvailable: vi.fn(() => true),
  } as unknown as QuranMcpClient;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('enrichGuidanceWithMCP', () => {
  describe('with null client', () => {
    it('returns empty ayahTexts map', async () => {
      const decision = makeDecision();
      const result = await enrichGuidanceWithMCP(decision, null);

      expect(result.decision).toBe(decision);
      expect(result.ayahTexts.size).toBe(0);
    });
  });

  describe('with valid MCP client', () => {
    it('fetches text for all ayah refs', async () => {
      const responses = new Map([
        ['49:6', 'O you who have believed, if a disobedient one comes...'],
        ['17:36', 'And do not pursue that of which you have no knowledge...'],
      ]);
      const client = makeMockClient(responses);
      const decision = makeDecision();

      const result = await enrichGuidanceWithMCP(decision, client);

      expect(result.ayahTexts.size).toBe(2);
      expect(result.ayahTexts.get('49:6')).toBe(responses.get('49:6'));
      expect(result.ayahTexts.get('17:36')).toBe(responses.get('17:36'));
    });

    it('omits ayahs where MCP returns null', async () => {
      const responses = new Map([
        ['49:6', 'Verified text for 49:6'],
        ['17:36', null], // MCP fails for this one
      ]);
      const client = makeMockClient(responses);
      const decision = makeDecision();

      const result = await enrichGuidanceWithMCP(decision, client);

      expect(result.ayahTexts.size).toBe(1);
      expect(result.ayahTexts.get('49:6')).toBe('Verified text for 49:6');
      expect(result.ayahTexts.has('17:36')).toBe(false);
    });

    it('handles client that throws (rejects)', async () => {
      const client = {
        getAyahText: vi.fn().mockRejectedValue(new Error('Boom')),
        getAyah: vi.fn(),
        searchQuran: vi.fn(),
        isAvailable: vi.fn(() => true),
      } as unknown as QuranMcpClient;
      const decision = makeDecision({ ayahRefs: ['1:1'] });

      const result = await enrichGuidanceWithMCP(decision, client);

      // Should not throw, just return empty texts
      expect(result.ayahTexts.size).toBe(0);
    });

    it('respects custom translation parameter', async () => {
      const client = makeMockClient(new Map([['1:1', 'Praise be to Allah']]));
      const decision = makeDecision({ ayahRefs: ['1:1'] });

      await enrichGuidanceWithMCP(decision, client, 'en-arberry');

      expect(client.getAyahText).toHaveBeenCalledWith({
        surah: 1,
        ayah: 1,
        translation: 'en-arberry',
      });
    });

    it('handles malformed ayah refs gracefully', async () => {
      const client = makeMockClient(new Map());
      const decision = makeDecision({ ayahRefs: ['invalid', 'also:bad:ref'] });

      // Should not throw, just skip
      const result = await enrichGuidanceWithMCP(decision, client);
      expect(result.ayahTexts.size).toBe(0);
    });
  });
});
