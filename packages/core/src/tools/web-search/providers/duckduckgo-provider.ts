/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseWebSearchProvider } from '../base-provider.js';
import type {
  WebSearchResult,
  WebSearchResultItem,
  DuckDuckGoProviderConfig,
} from '../types.js';

interface DdgRelatedTopic {
  Result?: string;
  FirstURL?: string;
  Text?: string;
  Topics?: DdgRelatedTopic[];
}

interface DdgInstantAnswer {
  Abstract?: string;
  AbstractURL?: string;
  Heading?: string;
  Results?: Array<{ FirstURL: string; Text: string }>;
  RelatedTopics?: DdgRelatedTopic[];
}

/**
 * Web search provider using DuckDuckGo Instant Answers API.
 * Requires no API key — acts as a zero-config free fallback.
 * Note: Returns instant-answer style results; for full web results
 * consider a paid provider like Tavily or Exa.
 */
export class DuckDuckGoProvider extends BaseWebSearchProvider {
  readonly name = 'DuckDuckGo';
  private static readonly BASE_URL = 'https://api.duckduckgo.com/';

  constructor(
    private readonly config: DuckDuckGoProviderConfig = { type: 'duckduckgo' },
  ) {
    super();
  }

  isAvailable(): boolean {
    return true;
  }

  protected async performSearch(
    query: string,
    signal: AbortSignal,
  ): Promise<WebSearchResult> {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      no_html: '1',
      skip_disambig: '1',
      t: 'hopcode',
    });

    const url = `${DuckDuckGoProvider.BASE_URL}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': 'HopCode/1.0' },
      signal,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as DdgInstantAnswer;
    const results: WebSearchResultItem[] = [];

    // Collect direct results
    for (const r of data.Results ?? []) {
      if (r.FirstURL && r.Text) {
        results.push({
          title: this.extractTitle(r.Text),
          url: r.FirstURL,
          content: r.Text,
        });
      }
    }

    // Collect related topics (flattened, handles nested Topics arrays)
    const flatTopics = this.flattenTopics(data.RelatedTopics ?? []);
    const maxExtras = (this.config.maxResults ?? 10) - results.length;
    for (const t of flatTopics.slice(0, maxExtras)) {
      if (t.FirstURL && t.Text) {
        results.push({
          title: this.extractTitle(t.Text),
          url: t.FirstURL,
          content: t.Text,
        });
      }
    }

    const answer =
      data.Abstract?.trim() ||
      (results.length === 0
        ? `No instant-answer results for "${query}". Try a paid provider for full web search.`
        : undefined);

    return { query, answer, results };
  }

  private flattenTopics(topics: DdgRelatedTopic[]): DdgRelatedTopic[] {
    const flat: DdgRelatedTopic[] = [];
    for (const t of topics) {
      if (t.Topics) {
        flat.push(...this.flattenTopics(t.Topics));
      } else {
        flat.push(t);
      }
    }
    return flat;
  }

  private extractTitle(text: string): string {
    const firstSentence = text.split(/[.!?]/)[0];
    return (firstSentence ?? text).trim().slice(0, 120);
  }
}
