/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseWebSearchProvider } from '../base-provider.js';
import type { WebSearchResult, ExaProviderConfig } from '../types.js';
/**
 * Web search provider using the Exa AI neural search API.
 * Requires an EXA_API_KEY or config apiKey.
 * Sign up at https://exa.ai
 */
export declare class ExaProvider extends BaseWebSearchProvider {
    private readonly config;
    readonly name = "Exa";
    private static readonly BASE_URL;
    constructor(config: ExaProviderConfig);
    isAvailable(): boolean;
    protected performSearch(query: string, signal: AbortSignal): Promise<WebSearchResult>;
}
