/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Live model fetching for Ollama (local and cloud).
 *
 * Local deployments: uses the native `/api/tags` endpoint for rich metadata
 * (model size, quantization, parameter count).
 *
 * Cloud deployments (non-localhost): uses the OpenAI-compatible `/v1/models`
 * endpoint because cloud providers may not expose `/api/tags`.
 *
 * Falls back to the static catalog if the endpoint is unreachable or returns
 * an auth error.
 */
import type { ModelCategory } from './catalog.js';
import { fetchOpenAICompatibleModels } from './discovery.js';

interface OllamaTag {
  name: string;
  modified_at: string;
  size: number;
  digest?: string;
  details?: {
    parent_model?: string;
    format?: string;
    family?: string;
    families?: string[];
    parameter_size?: string;
    quantization_level?: string;
  };
}

interface OllamaTagsResponse {
  models: OllamaTag[];
}

/**
 * Check whether a URL points to a local Ollama deployment.
 */
function isLocalEndpoint(baseUrl: string): boolean {
  try {
    const hostname = new URL(baseUrl).hostname;
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '::1'
    );
  } catch {
    return false;
  }
}

/**
 * Format a model size into a human-readable string.
 */
function formatSize(bytes: number): string {
  if (bytes < 1e6) return `${(bytes / 1e3).toFixed(0)} KB`;
  if (bytes < 1e9) return `${(bytes / 1e6).toFixed(1)} MB`;
  return `${(bytes / 1e9).toFixed(1)} GB`;
}

/**
 * Build a rich description string for a model entry.
 */
function buildModelDescription(tag: OllamaTag, isCloud: boolean): string {
  const parts: string[] = [];
  if (!isCloud) {
    parts.push(formatSize(tag.size));
    parts.push('installed');
  } else {
    parts.push('available');
  }
  if (tag.details?.parameter_size) {
    parts.push(tag.details.parameter_size);
  }
  if (tag.details?.quantization_level) {
    parts.push(tag.details.quantization_level);
  }
  return parts.join(' · ');
}

/**
 * Build the /api/tags URL from a baseUrl that may end with /v1.
 * e.g. "http://localhost:11434/v1" → "http://localhost:11434/api/tags"
 */
function buildTagsUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/v1\/?$/, '')}/api/tags`;
}

/**
 * Produce a human-readable error for common Ollama HTTP status codes.
 */
function ollamaHttpError(status: number, isCloud: boolean): string {
  if (status === 401 || status === 403) {
    return isCloud
      ? `Authentication failed (${status}). Check your OLLAMA_CLOUD_API_KEY at https://ollama.com → Account → API Keys.`
      : `Authentication failed (${status}). Local Ollama should not require a key — check OLLAMA_API_KEY is unset or set to "ollama".`;
  }
  if (status === 404) {
    return isCloud
      ? `Ollama Cloud endpoint not found (404). Verify the API URL is correct.`
      : `Ollama local endpoint not found (404). Ensure Ollama is running: ollama serve`;
  }
  return `Ollama returned HTTP ${status}.`;
}

/**
 * Fetches models from an Ollama deployment.
 *
 * - Local: attempts native `/api/tags` (rich metadata: size, quant level)
 * - Cloud: goes directly to `/v1/models` (OpenAI-compatible, always available)
 *
 * Returns null on any error so callers can fall back to the static catalog.
 *
 * @param baseUrl   - e.g. "http://localhost:11434/v1" or "https://openai.ollama.com/v1"
 * @param apiKey    - Bearer token for Ollama Cloud (OLLAMA_CLOUD_API_KEY); omit for local
 * @param timeoutMs - max wait time before treating the server as unreachable
 */
export async function fetchOllamaModels(
  baseUrl: string,
  apiKey?: string,
  timeoutMs = 4000,
): Promise<ModelCategory[] | null> {
  const isCloud = !isLocalEndpoint(baseUrl);

  const headers: Record<string, string> = {};
  if (apiKey && apiKey !== 'ollama') {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // ── Local: try native /api/tags first for richer metadata ───────────────
  if (!isCloud) {
    const tagsUrl = buildTagsUrl(baseUrl);
    try {
      const resp = await fetch(tagsUrl, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!resp.ok) {
        // Surface auth/config errors, but still fall through to /v1/models
        if (resp.status === 401 || resp.status === 403) {
          throw new Error(ollamaHttpError(resp.status, false));
        }
      } else {
        const data = (await resp.json()) as OllamaTagsResponse;
        if (data.models?.length) {
          const models = data.models.map((m) => ({
            id: m.name,
            label: m.name,
            description: buildModelDescription(m, false),
          }));
          return [{ name: 'Installed Models', models }];
        }
        // Server responded but has no models — show friendly message
        return [
          {
            name: 'No models installed',
            models: [
              {
                id: 'llama3.2',
                label: 'llama3.2 (suggested)',
                description: 'Run: ollama pull llama3.2',
              },
            ],
          },
        ];
      }
    } catch (err) {
      // Re-throw auth errors so the UI can surface them
      if (
        err instanceof Error &&
        err.message.includes('Authentication failed')
      ) {
        throw err;
      }
      // Timeout or ECONNREFUSED — fall through to /v1/models attempt
    }
  }

  // ── Cloud or local fallback: use OpenAI-compatible /v1/models ────────────
  try {
    const categories = await fetchOpenAICompatibleModels(
      baseUrl,
      apiKey,
      timeoutMs,
    );
    if (categories) return categories;
  } catch (err) {
    // Surface specific auth/HTTP errors
    if (err instanceof Error) {
      const msg = err.message;
      if (
        msg.includes('401') ||
        msg.includes('403') ||
        msg.includes('Authentication')
      ) {
        throw new Error(ollamaHttpError(401, isCloud));
      }
    }
  }

  // Return null to signal "use static catalog"
  return null;
}
