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
export declare function fetchOllamaModels(baseUrl: string, apiKey?: string, timeoutMs?: number): Promise<ModelCategory[] | null>;
