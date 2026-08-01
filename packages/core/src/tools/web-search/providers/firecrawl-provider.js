/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
/**
 * Web search provider using the Firecrawl Search API.
 * Provides high-quality results with full page markdown extraction.
 * Requires a FIRECRAWL_API_KEY or config apiKey.
 * Sign up at https://firecrawl.dev
 */
export class FirecrawlProvider extends BaseWebSearchProvider {
    config;
    name = 'Firecrawl';
    static BASE_URL = 'https://api.firecrawl.dev/v1/search';
    constructor(config) {
        super();
        this.config = config;
    }
    isAvailable() {
        return !!(this.config.apiKey ?? process.env['FIRECRAWL_API_KEY']);
    }
    async performSearch(query, signal) {
        const apiKey = this.config.apiKey ?? process.env['FIRECRAWL_API_KEY'];
        const body = {
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
            throw new Error(`API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
        }
        const data = (await response.json());
        if (!data.success && data.error) {
            throw new Error(data.error);
        }
        const results = (data.data ?? []).map((item) => ({
            title: item.title ?? item.metadata?.title ?? item.url,
            url: item.url,
            content: item.description ??
                item.metadata?.description ??
                item.markdown?.slice(0, 500),
            publishedDate: item.metadata?.publishedDate,
        }));
        return { query, results };
    }
}
//# sourceMappingURL=firecrawl-provider.js.map