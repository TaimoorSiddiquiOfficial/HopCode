/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Live model fetching for Ollama (local and cloud).
 *
 * Uses the native Ollama `/api/tags` endpoint for local deployments
 * (with richer metadata) and the OpenAI-compatible `/v1/models` endpoint
 * for Ollama Cloud (which doesn't always expose `/api/tags`).
 *
 * Falls back to the static catalog if the endpoint is unreachable.
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
 * Fetches models from an Ollama deployment.
 *
 * For local Ollama, uses the native `/api/tags` endpoint which provides
 * model size, parameter count, quantization level, and other metadata.
 *
 * For Ollama Cloud, tries `/api/tags` first, then falls back to the
 * OpenAI-compatible `/v1/models` endpoint (which is always available on
 * Ollama Cloud but provides less metadata).
 *
 * @param baseUrl   - e.g. http://localhost:11434/v1 or https://ollama.com/v1
 * @param apiKey    - Bearer token for Ollama Cloud (OLLAMA_API_KEY); omit for local
 * @param timeoutMs - max wait time per attempt before falling back
 */
export async function fetchOllamaModels(
  baseUrl: string,
  apiKey?: string,
  timeoutMs = 3000,
): Promise<ModelCategory[] | null> {
  const isCloud = !isLocalEndpoint(baseUrl);
  const tagsUrl = `${baseUrl.replace(/\/v1\/?$/, '')}/api/tags`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {};
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  // Try native `/api/tags` first (more metadata)
  try {
    const resp = await fetch(tagsUrl, { signal: controller.signal, headers });
    clearTimeout(timer);

    if (resp.ok) {
      const data = (await resp.json()) as OllamaTagsResponse;

      if (data.models?.length) {
        const categoryName = isCloud
          ? 'Ollama Cloud Models'
          : 'Installed Models';
        const models = data.models.map((m) => ({
          id: m.name,
          label: m.name,
          description: buildModelDescription(m, isCloud),
        }));

        return [{ name: categoryName, models }];
      }
    }
  } catch {
    // `/api/tags` failed — fall through to fallback
  }
  clearTimeout(timer);

  // For any deployment (local or cloud), fall back to the
  // OpenAI-compatible `/v1/models` endpoint
  return fetchOpenAICompatibleModels(baseUrl, apiKey, timeoutMs);
}
