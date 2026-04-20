/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseWebSearchProvider } from '../base-provider.js';
import type {
  WebSearchResult,
  WebSearchResultItem,
  CustomProviderConfig,
} from '../types.js';

type HttpMethod = 'GET' | 'POST';

/** Built-in presets for common self-hosted / third-party search APIs. */
const PRESETS: Record<string, Partial<CustomProviderConfig>> = {
  searxng: {
    url: 'http://localhost:8080/search',
    queryParam: 'q',
    method: 'GET',
    params: { format: 'json', engines: 'google,bing,duckduckgo' },
    jsonPath: 'results',
  },
  brave: {
    url: 'https://api.search.brave.com/res/v1/web/search',
    queryParam: 'q',
    method: 'GET',
    authHeader: 'X-Subscription-Token',
    authScheme: '',
    jsonPath: 'web.results',
  },
  serpapi: {
    url: 'https://serpapi.com/search',
    queryParam: 'q',
    method: 'GET',
    params: { engine: 'google' },
    jsonPath: 'organic_results',
  },
  google: {
    url: 'https://www.googleapis.com/customsearch/v1',
    queryParam: 'q',
    method: 'GET',
    jsonPath: 'items',
  },
};

function getNestedValue(obj: unknown, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Flexible custom web search provider that works with any HTTP JSON API.
 * Configured via environment variables or settings.json.
 *
 * Environment variables:
 *  WEB_SEARCH_API    - base URL of the search endpoint
 *  WEB_QUERY_PARAM   - query parameter name (default: "q")
 *  WEB_METHOD        - GET or POST (default: GET)
 *  WEB_KEY           - API key (sent via WEB_AUTH_HEADER)
 *  WEB_AUTH_HEADER   - header name for the API key (default: "Authorization")
 *  WEB_AUTH_SCHEME   - scheme prefix (default: "Bearer")
 *  WEB_HEADERS       - extra headers as "Name: value; Name2: value2"
 *  WEB_JSON_PATH     - dot-path to results array in JSON response
 *  WEB_PARAMS        - static extra query params as JSON string
 *  WEB_PROVIDER      - preset name: searxng | brave | serpapi | google
 */
export class CustomProvider extends BaseWebSearchProvider {
  readonly name: string;
  private readonly resolved: CustomProviderConfig;

  constructor(config: Partial<CustomProviderConfig> = {}) {
    super();
    this.resolved = this.resolveConfig(config);
    this.name = `Custom(${this.resolved.preset ?? this.resolved.url})`;
  }

  private resolveConfig(
    overrides: Partial<CustomProviderConfig>,
  ): CustomProviderConfig {
    // Merge preset base → env vars → explicit config
    const preset = overrides.preset ?? process.env['WEB_PROVIDER'];
    const presetBase: Partial<CustomProviderConfig> = preset
      ? (PRESETS[preset] ?? {})
      : {};

    const extraParamsEnv = process.env['WEB_PARAMS'];
    let envParams: Record<string, string> = {};
    if (extraParamsEnv) {
      try {
        envParams = JSON.parse(extraParamsEnv) as Record<string, string>;
      } catch {
        // ignore malformed JSON
      }
    }

    const envHeaders = this.parseHeadersString(
      process.env['WEB_HEADERS'] ?? '',
    );

    return {
      type: 'custom' as const,
      url:
        overrides.url ?? process.env['WEB_SEARCH_API'] ?? presetBase.url ?? '',
      queryParam:
        overrides.queryParam ??
        process.env['WEB_QUERY_PARAM'] ??
        presetBase.queryParam ??
        'q',
      method: (overrides.method ??
        process.env['WEB_METHOD'] ??
        presetBase.method ??
        'GET') as HttpMethod,
      apiKey: overrides.apiKey ?? process.env['WEB_KEY'] ?? presetBase.apiKey,
      authHeader:
        overrides.authHeader ??
        process.env['WEB_AUTH_HEADER'] ??
        presetBase.authHeader ??
        'Authorization',
      authScheme:
        overrides.authScheme ??
        process.env['WEB_AUTH_SCHEME'] ??
        presetBase.authScheme ??
        'Bearer',
      headers: { ...presetBase.headers, ...envHeaders, ...overrides.headers },
      jsonPath:
        overrides.jsonPath ??
        process.env['WEB_JSON_PATH'] ??
        presetBase.jsonPath,
      params: { ...presetBase.params, ...envParams, ...overrides.params },
      maxResults: overrides.maxResults ?? 10,
      preset,
    };
  }

  private parseHeadersString(raw: string): Record<string, string> {
    const result: Record<string, string> = {};
    for (const part of raw.split(';')) {
      const colon = part.indexOf(':');
      if (colon === -1) continue;
      const key = part.slice(0, colon).trim();
      const value = part.slice(colon + 1).trim();
      if (key) result[key] = value;
    }
    return result;
  }

  isAvailable(): boolean {
    if (!this.resolved.url) return false;
    // Require an API key for non-local/non-preset URLs
    if (this.resolved.preset === 'searxng') return true;
    return true;
  }

  protected async performSearch(
    query: string,
    signal: AbortSignal,
  ): Promise<WebSearchResult> {
    const {
      url,
      queryParam,
      method,
      apiKey,
      authHeader,
      authScheme,
      headers,
      jsonPath,
      params,
    } = this.resolved;

    if (!url) {
      throw new Error('Custom provider: WEB_SEARCH_API is not configured.');
    }

    // Build request headers
    const reqHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    if (apiKey) {
      const scheme = authScheme ? `${authScheme} ` : '';
      reqHeaders[authHeader ?? 'Authorization'] = `${scheme}${apiKey}`;
    }

    let response: Response;

    if (method === 'POST') {
      const body: Record<string, unknown> = {
        [queryParam ?? 'q']: query,
        ...params,
      };
      reqHeaders['Content-Type'] = 'application/json';
      response = await fetch(url, {
        method: 'POST',
        headers: reqHeaders,
        body: JSON.stringify(body),
        signal,
      });
    } else {
      const urlParams = new URLSearchParams({
        [queryParam ?? 'q']: query,
        ...Object.fromEntries(
          Object.entries(params ?? {}).map(([k, v]) => [k, String(v)]),
        ),
      });
      response = await fetch(`${url}?${urlParams.toString()}`, {
        method: 'GET',
        headers: reqHeaders,
        signal,
      });
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`,
      );
    }

    const data = await response.json();

    // Extract results from the configured JSON path
    const rawResults = jsonPath
      ? (getNestedValue(data, jsonPath) as unknown[])
      : (data as unknown[]);

    if (!Array.isArray(rawResults)) {
      return { query, results: [] };
    }

    const results: WebSearchResultItem[] = rawResults
      .slice(0, this.resolved.maxResults ?? 10)
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          title: String(r['title'] ?? r['name'] ?? r['heading'] ?? ''),
          url: String(r['url'] ?? r['link'] ?? r['href'] ?? ''),
          content: String(
            r['snippet'] ?? r['description'] ?? r['content'] ?? r['text'] ?? '',
          ),
          publishedDate: r['datePublished'] as string | undefined,
        };
      })
      .filter((r) => r.url);

    return { query, results };
  }
}
