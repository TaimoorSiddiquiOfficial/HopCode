/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseWebSearchProvider } from '../base-provider.js';
import type {
  WebSearchResult,
  WebSearchResultItem,
  ExaProviderConfig,
} from '../types.js';

interface ExaResultItem {
  id: string;
  url: string;
  title?: string;
  score?: number;
  publishedDate?: string;
  author?: string;
  summary?: string;
  text?: string;
}

interface ExaSearchResponse {
  results: ExaResultItem[];
  resolvedSearchType?: string;
}

/**
 * Web search provider using the Exa AI neural search API.
 * Requires an EXA_API_KEY or config apiKey.
 * Sign up at https://exa.ai
 */
export class ExaProvider extends BaseWebSearchProvider {
  readonly name = 'Exa';
  private static readonly BASE_URL = 'https://api.exa.ai/search';

  constructor(private readonly config: ExaProviderConfig) {
    super();
  }

  isAvailable(): boolean {
    return !!(this.config.apiKey ?? process.env['EXA_API_KEY']);
  }

  protected async performSearch(
    query: string,
    signal: AbortSignal,
  ): Promise<WebSearchResult> {
    const apiKey = this.config.apiKey ?? process.env['EXA_API_KEY'];

    const body: Record<string, unknown> = {
      query,
      numResults: this.config.maxResults ?? 5,
      type: this.config.searchType ?? 'auto',
    };

    if (this.config.includeSummary !== false) {
      body['contents'] = { summary: { query } };
    }

    const response = await fetch(ExaProvider.BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
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

    const data = (await response.json()) as ExaSearchResponse;
    const results: WebSearchResultItem[] = (data.results ?? []).map((r) => ({
      title: r.title ?? r.url,
      url: r.url,
      content: r.summary ?? r.text,
      score: r.score,
      publishedDate: r.publishedDate,
    }));

    return { query, results };
  }
}
