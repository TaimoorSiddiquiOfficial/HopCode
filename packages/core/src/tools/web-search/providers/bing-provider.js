/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
/**
 * Web search provider using the Bing Web Search API (Azure Cognitive Services).
 * Requires a BING_API_KEY or config apiKey.
 * Get a free-tier key at https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
 */
export class BingProvider extends BaseWebSearchProvider {
    config;
    name = 'Bing';
    static BASE_URL = 'https://api.bing.microsoft.com/v7.0/search';
    constructor(config) {
        super();
        this.config = config;
    }
    isAvailable() {
        return !!(this.config.apiKey ?? process.env['BING_API_KEY']);
    }
    async performSearch(query, signal) {
        const apiKey = this.config.apiKey ?? process.env['BING_API_KEY'];
        const params = new URLSearchParams({
            q: query,
            count: String(this.config.maxResults ?? 10),
            responseFilter: 'Webpages',
        });
        if (this.config.market) {
            params.set('mkt', this.config.market);
        }
        const url = `${BingProvider.BASE_URL}?${params.toString()}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
            },
            signal,
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
        }
        const data = (await response.json());
        const results = (data.webPages?.value ?? []).map((page) => ({
            title: page.name,
            url: page.url,
            content: page.snippet,
            publishedDate: page.datePublished,
        }));
        return { query, results };
    }
}
//# sourceMappingURL=bing-provider.js.map