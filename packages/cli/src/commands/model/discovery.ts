/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generic live model discovery for any OpenAI-compatible provider.
 *
 * Inspired by OpenClaude's listOpenAICompatibleModels (providerDiscovery.ts).
 * Fetches GET /v1/models (or /models if /v1 is already in the baseUrl),
 * filters out non-chat entries, and returns categorised results.
 *
 * Usage:
 *   const cats = await fetchOpenAICompatibleModels('https://api.groq.com/openai/v1', apiKey);
 *   const cats = await fetchOpenRouterModels(apiKey);  // free-tier aware
 */

import type { ModelCategory } from './catalog.js';

// ── Types ─────────────────────────────────────────────────────────────────────

interface OpenAIModelObject {
  id: string;
  object?: string;
  owned_by?: string;
  created?: number;
}

interface OpenAIListResponse {
  object?: string;
  data?: OpenAIModelObject[];
  // Some providers return the array directly at root level
  models?: OpenAIModelObject[];
}

// ── Filters ───────────────────────────────────────────────────────────────────

const NON_CHAT_HINTS = [
  'embed',
  'embedding',
  'rerank',
  'bge',
  'whisper',
  'tts',
  'clip',
  'moderation',
  'vision-preview',
] as const;

function isNonChatModel(id: string): boolean {
  const lower = id.toLowerCase();
  return NON_CHAT_HINTS.some((h) => lower.includes(h));
}

// ── URL normalisation ─────────────────────────────────────────────────────────

/**
 * Build the models endpoint URL from a provider baseUrl.
 *
 * Handles these patterns:
 *   - "https://api.groq.com/openai/v1"  → ".../v1/models"
 *   - "https://api.openai.com"           → ".../v1/models"  (appends /v1/models)
 *   - "https://openrouter.ai/api/v1"    → ".../v1/models"
 */
function buildModelsUrl(baseUrl: string): string {
  const base = baseUrl.replace(/\/+$/, '');
  // If baseUrl already ends with /v1 (or /v1/something), use /models relative to it
  if (/\/v1(\/.*)?$/.test(base)) {
    const v1Part = base.replace(/\/v1\/.*$/, '/v1');
    return `${v1Part}/models`;
  }
  return `${base}/v1/models`;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch the live model list from any OpenAI-compatible provider.
 *
 * Returns a ModelCategory array ready for the interactive selector,
 * or null if the request failed / returned no usable models.
 *
 * @param baseUrl   - Provider base URL (e.g. https://api.groq.com/openai/v1)
 * @param apiKey    - Bearer token for authentication
 * @param timeoutMs - How long to wait before giving up
 */
export async function fetchOpenAICompatibleModels(
  baseUrl: string,
  apiKey?: string,
  timeoutMs = 5000,
): Promise<ModelCategory[] | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  try {
    const url = buildModelsUrl(baseUrl);
    const resp = await fetch(url, { signal: controller.signal, headers });
    if (!resp.ok) return null;

    const json = (await resp.json()) as OpenAIListResponse;

    // Normalise: some providers wrap in {data: [...]}, others return {models: [...]}
    // or even a plain array.
    let rawModels: OpenAIModelObject[] = [];
    if (Array.isArray(json)) {
      rawModels = json as unknown as OpenAIModelObject[];
    } else if (Array.isArray(json.data)) {
      rawModels = json.data;
    } else if (Array.isArray(json.models)) {
      rawModels = json.models;
    }

    if (!rawModels.length) return null;

    const models = rawModels
      .filter((m) => m.id && !isNonChatModel(m.id))
      .sort((a, b) => a.id.localeCompare(b.id));

    if (!models.length) return null;

    return [
      {
        name: 'Available Models',
        models: models.map((m) => ({
          id: m.id,
          label: m.id,
          description: m.owned_by ? `by ${m.owned_by}` : undefined,
        })),
      },
    ];
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── OpenRouter-specific discovery ─────────────────────────────────────────────

/**
 * Fetch live model list from OpenRouter, splitting free-tier (`:free` suffix)
 * models into a dedicated category shown first.
 *
 * OpenRouter exposes 300+ models; many have a `:free` variant that requires
 * no credits. Surfacing them separately makes it easy for users to get started.
 *
 * @param apiKey    - OPENROUTER_API_KEY (optional — free models work without one)
 * @param timeoutMs - How long to wait before giving up
 */
export async function fetchOpenRouterModels(
  apiKey?: string,
  timeoutMs = 8000,
): Promise<ModelCategory[] | null> {
  const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/TaimoorSiddiquiOfficial/HopCode',
    'X-Title': 'HopCode',
  };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  try {
    const resp = await fetch(`${OPENROUTER_BASE}/models`, {
      signal: controller.signal,
      headers,
    });
    if (!resp.ok) return null;

    const json = (await resp.json()) as {
      data?: Array<{
        id: string;
        owned_by?: string;
        pricing?: { prompt?: string };
      }>;
    };

    const rawModels = Array.isArray(json.data) ? json.data : [];
    if (!rawModels.length) return null;

    const chatModels = rawModels
      .filter((m) => m.id && !isNonChatModel(m.id))
      .sort((a, b) => a.id.localeCompare(b.id));

    if (!chatModels.length) return null;

    const free: typeof chatModels = [];
    const paid: typeof chatModels = [];

    for (const m of chatModels) {
      // Free models have :free suffix or zero prompt cost
      const isFree =
        m.id.endsWith(':free') ||
        m.pricing?.prompt === '0' ||
        m.pricing?.prompt === '0.0';
      (isFree ? free : paid).push(m);
    }

    const categories: ModelCategory[] = [];

    if (free.length) {
      categories.push({
        name: 'Free Tier (no credits needed)',
        models: free.map((m) => ({
          id: m.id,
          label: m.id,
          description: m.owned_by ? `by ${m.owned_by} · free` : 'free',
        })),
      });
    }

    if (paid.length) {
      categories.push({
        name: 'Paid Models',
        models: paid.map((m) => ({
          id: m.id,
          label: m.id,
          description: m.owned_by ? `by ${m.owned_by}` : undefined,
        })),
      });
    }

    return categories.length ? categories : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
