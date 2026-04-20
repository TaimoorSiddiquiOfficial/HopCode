/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseWebSearchProvider } from '../base-provider.js';
import type {
  WebSearchResult,
  WebSearchResultItem,
  FirecrawlProviderConfig,
} from '../types.js';

interface FirecrawlResultItem {
  title?: string;
  description?: string;
  url: string;
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    publishedDate?: string;
  };
}

interface FirecrawlSearchResponse {
  success?: boolean;
  data?: FirecrawlResultItem[];
  error?: string;
}

/**
 * Web search provider using the Firecrawl Search API.
 * Provides high-quality results with full page markdown extraction.
 * Requires a FIRECRAWL_API_KEY or config apiKey.
 * Sign up at https://firecrawl.dev
 */
export class FirecrawlProvider extends BaseWebSearchProvider {
  readonly name = 'Firecrawl';
  private static readonly BASE_URL = 'https://api.firecrawl.dev/v1/search';

  constructor(private readonly config: FirecrawlProviderConfig) {
    super();
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey ?? process.env['FIRECRAWL_API_KEY']);
  }

  protected async performSearch(
    query: string,
    signal: AbortSignal,
  ): Promise<WebSearchResult> {
    const apiKey = this.config.apiKey ?? process.env['FIRECRAWL_API_KEY'];

    const body: Record<string, unknown> = {
      query,
      limit: this.config.maxResults ?? 5,
    };

    if (this.config.scrapeOptions) {
      body['scrapeOptions'] = this.config.scrapeOptions;
    }

    const response = await fetch(FirecrawlProvider.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`,
      );
    }

    const data = (await response.json()) as FirecrawlSearchResponse;

    if (!data.success && data.error) {
      throw new Error(data.error);
    }

    const results: WebSearchResultItem[] = (data.data ?? []).map((item) => ({
      title: item.title ?? item.metadata?.title ?? item.url,
      url: item.url,
      content:
        item.description ??
        item.metadata?.description ??
        item.markdown?.slice(0, 500),
      publishedDate: item.metadata?.publishedDate,
    }));

    return { query, results };
  }
}
