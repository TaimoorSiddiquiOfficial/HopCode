/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
/**
 * Web search provider using the Exa AI neural search API.
 * Requires an EXA_API_KEY or config apiKey.
 * Sign up at https://exa.ai
 */
export class ExaProvider extends BaseWebSearchProvider {
    config;
    name = 'Exa';
    static BASE_URL = 'https://api.exa.ai/search';
    constructor(config) {
        super();
        this.config = config;
    }
    isAvailable() {
        return !!(this.config.apiKey ?? process.env['EXA_API_KEY']);
    }
    async performSearch(query, signal) {
        const apiKey = this.config.apiKey ?? process.env['EXA_API_KEY'];
        const body = {
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
                'x-api-key': apiKey,
            },
            body: JSON.stringify(body),
            signal,
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`API error: ${response.status} ${response.statusText}${text ? ` - ${text}` : ''}`);
        }
        const data = (await response.json());
        const results = (data.results ?? []).map((r) => ({
            title: r.title ?? r.url,
            url: r.url,
            content: r.summary ?? r.text,
            score: r.score,
            publishedDate: r.publishedDate,
        }));
        return { query, results };
    }
}
//# sourceMappingURL=exa-provider.js.map