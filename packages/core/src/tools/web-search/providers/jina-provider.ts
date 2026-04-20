/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseWebSearchProvider } from '../base-provider.js';
import type {
  WebSearchResult,
  WebSearchResultItem,
  JinaProviderConfig,
} from '../types.js';

interface JinaResultItem {
  title?: string;
  description?: string;
  url: string;
  content?: string;
  publishedTime?: string;
}

interface JinaSearchResponse {
  data?: JinaResultItem[];
  code?: number;
  message?: string;
}

/**
 * Web search provider using the Jina AI Search API.
 * Works without an API key (limited rate) or with JINA_API_KEY for higher limits.
 * Documentation: https://jina.ai/search/
 */
export class JinaProvider extends BaseWebSearchProvider {
  readonly name = 'Jina';
  private static readonly BASE_URL = 'https://s.jina.ai/';

  constructor(private readonly config: JinaProviderConfig) {
    super();
  }

  isAvailable(): boolean {
    // Jina works without an API key at a lower rate limit
    return true;
  }

  protected async performSearch(
    query: string,
    signal: AbortSignal,
  ): Promise<WebSearchResult> {
    const apiKey = this.config.apiKey ?? process.env['JINA_API_KEY'];

    const encodedQuery = encodeURIComponent(query);
    const url = `${JinaProvider.BASE_URL}${encodedQuery}`;

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    if (this.config.maxResults) {
      headers['X-With-Generated-Alt'] = String(this.config.maxResults);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(
        `API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`,
      );
    }

    const data = (await response.json()) as JinaSearchResponse;
    const results: WebSearchResultItem[] = (data.data ?? [])
      .slice(0, this.config.maxResults ?? 5)
      .map((item) => ({
        title: item.title ?? item.url,
        url: item.url,
        content: item.description ?? item.content,
        publishedDate: item.publishedTime,
      }));

    return { query, results };
  }
}
