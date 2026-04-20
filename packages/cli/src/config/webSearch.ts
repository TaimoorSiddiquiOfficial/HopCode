/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { WebSearchProviderConfig } from '@hoptrendy/hopcode-core';
import type { Settings } from './settings.js';

/**
 * CLI arguments related to web search configuration
 */
export interface WebSearchCliArgs {
  tavilyApiKey?: string;
  googleApiKey?: string;
  googleSearchEngineId?: string;
  webSearchDefault?: string;
}

/**
 * Web search configuration structure
 */
export interface WebSearchConfig {
  provider: WebSearchProviderConfig[];
  default: string;
  mode?: 'auto' | 'manual';
}

/**
 * Priority order used for auto-chain failover and default selection.
 * DuckDuckGo is last — always available as a free fallback.
 */
const PROVIDER_PRIORITY = [
  'firecrawl',
  'tavily',
  'exa',
  'bing',
  'jina',
  'google',
  'dashscope',
  'custom',
  'duckduckgo',
] as const;

/**
 * Build webSearch configuration from multiple sources with priority:
 * 1. settings.json (new format) - highest priority
 * 2. Command line args + environment variables
 * 3. DuckDuckGo free fallback (always injected when no other providers are configured)
 *
 * @param argv - Command line arguments
 * @param settings - User settings from settings.json
 * @param authType - Authentication type (e.g., 'qwen-oauth')
 * @returns WebSearch configuration (always defined — DuckDuckGo is the fallback)
 */
export function buildWebSearchConfig(
  argv: WebSearchCliArgs,
  settings: Settings,
  _authType?: string,
): WebSearchConfig | undefined {
  // Step 1: Collect providers from settings or command line/env
  let providers: WebSearchProviderConfig[] = [];
  let userDefault: string | undefined;
  let userMode: 'auto' | 'manual' | undefined;

  if (settings.webSearch) {
    // Use providers from settings.json
    providers = [...settings.webSearch.provider] as WebSearchProviderConfig[];
    userDefault = settings.webSearch.default;
    userMode = (settings.webSearch as WebSearchConfig).mode;
  } else {
    // Build providers from command line args and environment variables

    // Firecrawl
    const firecrawlKey = process.env['FIRECRAWL_API_KEY'];
    if (firecrawlKey) {
      providers.push({ type: 'firecrawl', apiKey: firecrawlKey });
    }

    // Tavily
    const tavilyKey =
      argv.tavilyApiKey ||
      settings.advanced?.tavilyApiKey ||
      process.env['TAVILY_API_KEY'];
    if (tavilyKey) {
      providers.push({ type: 'tavily', apiKey: tavilyKey });
    }

    // Exa
    const exaKey = process.env['EXA_API_KEY'];
    if (exaKey) {
      providers.push({ type: 'exa', apiKey: exaKey });
    }

    // Bing / Azure Cognitive Search
    const bingKey = process.env['BING_API_KEY'];
    if (bingKey) {
      providers.push({ type: 'bing', apiKey: bingKey });
    }

    // Jina (works without a key too, but key gives higher rate limits)
    const jinaKey = process.env['JINA_API_KEY'];
    if (jinaKey) {
      providers.push({ type: 'jina', apiKey: jinaKey });
    }

    // Google Custom Search
    const googleKey = argv.googleApiKey || process.env['GOOGLE_API_KEY'];
    const googleEngineId =
      argv.googleSearchEngineId || process.env['GOOGLE_SEARCH_ENGINE_ID'];
    if (googleKey && googleEngineId) {
      providers.push({
        type: 'google',
        apiKey: googleKey,
        searchEngineId: googleEngineId,
      });
    }

    // Custom HTTP search API
    const customUrl = process.env['WEB_SEARCH_API'];
    if (customUrl) {
      providers.push({ type: 'custom', url: customUrl });
    }
  }

  // Step 2: DashScope auto-injection was removed when the free tier was
  // discontinued on 2026-04-15.  Explicit settings.json config still works.

  // Step 3: Always inject DuckDuckGo as the last-resort free fallback.
  // This ensures web_search is always available even with zero API keys.
  const hasDdg = providers.some((p) => p.type === 'duckduckgo');
  if (!hasDdg) {
    providers.push({ type: 'duckduckgo' });
  }

  // Also inject Jina free tier when no Jina key is present but no other free provider exists
  // (Jina supports ~10 free req/min without a key)
  const hasFreeProvider = providers.some(
    (p) => p.type === 'duckduckgo' || p.type === 'jina',
  );
  if (!hasFreeProvider) {
    providers.push({ type: 'jina' });
  }

  // Step 4: Determine default provider using priority order
  let defaultProvider = userDefault || argv.webSearchDefault;
  if (!defaultProvider) {
    for (const providerType of PROVIDER_PRIORITY) {
      if (providers.some((p) => p.type === providerType)) {
        defaultProvider = providerType;
        break;
      }
    }
    if (!defaultProvider) {
      defaultProvider = providers[0]?.type ?? 'duckduckgo';
    }
  }

  // Step 5: Default to "auto" mode so failover works out of the box
  const mode: 'auto' | 'manual' = userMode ?? 'auto';

  return {
    provider: providers,
    default: defaultProvider,
    mode,
  };
}
