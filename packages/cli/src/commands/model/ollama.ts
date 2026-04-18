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

interface OllamaTag {
  name: string;
  modified_at: string;
  size: number;
}

interface OllamaTagsResponse {
  models: OllamaTag[];
}

/**
 * Fetches installed models from a running Ollama daemon.
 * @param baseUrl - e.g. http://localhost:11434
 * @param timeoutMs - max wait time before falling back to static list
 */
export async function fetchOllamaModels(
  baseUrl: string,
  timeoutMs = 3000,
): Promise<ModelCategory[] | null> {
  const url = `${baseUrl.replace(/\/v1\/?$/, '')}/api/tags`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(url, { signal: controller.signal });
    if (!resp.ok) return null;
    const data = (await resp.json()) as OllamaTagsResponse;
    clearTimeout(timer);

    if (!data.models?.length) return null;

    const models = data.models.map((m) => {
      const sizeGB = (m.size / 1e9).toFixed(1);
      return {
        id: m.name,
        label: m.name,
        description: `${sizeGB} GB · installed`,
      };
    });

    return [{ name: 'Installed Models', models }];
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
