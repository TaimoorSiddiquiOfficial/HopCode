/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Live model fetching for Ollama (local and cloud).
 * Falls back to the static catalog if the endpoint is unreachable.
 */
import type { ModelCategory } from './catalog.js';
import { fetchOpenAICompatibleModels } from './discovery.js';

interface OllamaTag {
  name: string;
  modified_at: string;
  size: number;
}

interface OllamaTagsResponse {
  models: OllamaTag[];
}

/**
 * Fetches installed models from a running Ollama daemon via `/api/tags`.
 * For Ollama Cloud, also falls back to the OpenAI-compatible `/v1/models`
 * endpoint if `/api/tags` is unreachable or returns nothing.
 *
 * @param baseUrl  - e.g. http://localhost:11434/v1 or https://ollama.com/v1
 * @param apiKey   - Bearer token for Ollama Cloud (OLLAMA_API_KEY); omit for local
 * @param timeoutMs - max wait time per attempt before falling back
 */
export async function fetchOllamaModels(
  baseUrl: string,
  apiKey?: string,
  timeoutMs = 3000,
): Promise<ModelCategory[] | null> {
  const isCloud = /^https?:\/\/(?!localhost|127\.\d|0\.0\.0\.0)/.test(baseUrl);
  const tagsUrl = `${baseUrl.replace(/\/v1\/?$/, '')}/api/tags`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {};
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  try {
    const resp = await fetch(tagsUrl, { signal: controller.signal, headers });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = (await resp.json()) as OllamaTagsResponse;
    clearTimeout(timer);

    if (!data.models?.length) return null;

    const label = isCloud ? 'available' : 'installed';
    const models = data.models.map((m) => {
      const sizeGB = (m.size / 1e9).toFixed(1);
      return {
        id: m.name,
        label: m.name,
        description: isCloud ? label : `${sizeGB} GB · ${label}`,
      };
    });

    return [{ name: isCloud ? 'Cloud Models' : 'Installed Models', models }];
  } catch {
    clearTimeout(timer);
    // For cloud endpoints, fall back to the standard OpenAI-compatible /v1/models
    if (isCloud) {
      return fetchOpenAICompatibleModels(baseUrl, apiKey, timeoutMs);
    }
    return null;
  }
}
