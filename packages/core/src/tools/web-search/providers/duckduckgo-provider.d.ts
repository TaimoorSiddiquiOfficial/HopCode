/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
import type { WebSearchResult, DuckDuckGoProviderConfig } from '../types.js';
/**
 * Web search provider using DuckDuckGo Instant Answers API.
 * Requires no API key — acts as a zero-config free fallback.
 * Note: Returns instant-answer style results; for full web results
 * consider a paid provider like Tavily or Exa.
 */
export declare class DuckDuckGoProvider extends BaseWebSearchProvider {
    private readonly config;
    readonly name = "DuckDuckGo";
    private static readonly BASE_URL;
    constructor(config?: DuckDuckGoProviderConfig);
    isAvailable(): boolean;
    protected performSearch(query: string, signal: AbortSignal): Promise<WebSearchResult>;
    private flattenTopics;
    private extractTitle;
}
