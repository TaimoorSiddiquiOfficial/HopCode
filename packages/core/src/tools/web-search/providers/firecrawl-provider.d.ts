/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
import type { WebSearchResult, FirecrawlProviderConfig } from '../types.js';
/**
 * Web search provider using the Firecrawl Search API.
 * Provides high-quality results with full page markdown extraction.
 * Requires a FIRECRAWL_API_KEY or config apiKey.
 * Sign up at https://firecrawl.dev
 */
export declare class FirecrawlProvider extends BaseWebSearchProvider {
    private readonly config;
    readonly name = "Firecrawl";
    private static readonly BASE_URL;
    constructor(config: FirecrawlProviderConfig);
    isAvailable(): boolean;
    protected performSearch(query: string, signal: AbortSignal): Promise<WebSearchResult>;
}
