/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
import type { WebSearchResult, CustomProviderConfig } from '../types.js';
/**
 * Flexible custom web search provider that works with any HTTP JSON API.
 * Configured via environment variables or settings.json.
 *
 * Environment variables:
 *  WEB_SEARCH_API    - base URL of the search endpoint
 *  WEB_QUERY_PARAM   - query parameter name (default: "q")
 *  WEB_METHOD        - GET or POST (default: GET)
 *  WEB_KEY           - API key (sent via WEB_AUTH_HEADER)
 *  WEB_AUTH_HEADER   - header name for the API key (default: "Authorization")
 *  WEB_AUTH_SCHEME   - scheme prefix (default: "Bearer")
 *  WEB_HEADERS       - extra headers as "Name: value; Name2: value2"
 *  WEB_JSON_PATH     - dot-path to results array in JSON response
 *  WEB_PARAMS        - static extra query params as JSON string
 *  WEB_PROVIDER      - preset name: searxng | brave | serpapi | google
 */
export declare class CustomProvider extends BaseWebSearchProvider {
    readonly name: string;
    private readonly resolved;
    constructor(config?: Partial<CustomProviderConfig>);
    private resolveConfig;
    private parseHeadersString;
    isAvailable(): boolean;
    protected performSearch(query: string, signal: AbortSignal): Promise<WebSearchResult>;
}
