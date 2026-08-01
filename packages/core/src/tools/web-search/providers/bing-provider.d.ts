/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
import type { WebSearchResult, BingProviderConfig } from '../types.js';
/**
 * Web search provider using the Bing Web Search API (Azure Cognitive Services).
 * Requires a BING_API_KEY or config apiKey.
 * Get a free-tier key at https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/
 */
export declare class BingProvider extends BaseWebSearchProvider {
    private readonly config;
    readonly name = "Bing";
    private static readonly BASE_URL;
    constructor(config: BingProviderConfig);
    isAvailable(): boolean;
    protected performSearch(query: string, signal: AbortSignal): Promise<WebSearchResult>;
}
