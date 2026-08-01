/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
/**
 * Web search provider using the Jina AI Search API.
 * Works without an API key (limited rate) or with JINA_API_KEY for higher limits.
 * Documentation: https://jina.ai/search/
 */
export class JinaProvider extends BaseWebSearchProvider {
    config;
    name = 'Jina';
    static BASE_URL = 'https://s.jina.ai/';
    constructor(config) {
        super();
        this.config = config;
    }
    isAvailable() {
        // Jina works without an API key at a lower rate limit
        return true;
    }
    async performSearch(query, signal) {
        const apiKey = this.config.apiKey ?? process.env['JINA_API_KEY'];
        const encodedQuery = encodeURIComponent(query);
        const url = `${JinaProvider.BASE_URL}${encodedQuery}`;
        const headers = {
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
            throw new Error(`API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
        }
        const data = (await response.json());
        const results = (data.data ?? [])
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
//# sourceMappingURL=jina-provider.js.map