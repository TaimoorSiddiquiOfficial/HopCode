/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
import type { WebSearchResult, JinaProviderConfig } from '../types.js';
/**
 * Web search provider using the Jina AI Search API.
 * Works without an API key (limited rate) or with JINA_API_KEY for higher limits.
 * Documentation: https://jina.ai/search/
 */
export declare class JinaProvider extends BaseWebSearchProvider {
    private readonly config;
    readonly name = "Jina";
    private static readonly BASE_URL;
    constructor(config: JinaProviderConfig);
    isAvailable(): boolean;
    protected performSearch(query: string, signal: AbortSignal): Promise<WebSearchResult>;
}
