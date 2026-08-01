/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { WebSearchProviderConfig } from '@hoptrendy/hopcode-core';
import type { Settings } from './settings.js';
/**
 * CLI arguments related to web search configuration
 */
export interface WebSearchCliArgs {
    tavilyApiKey?: string;
    googleApiKey?: string;
    googleSearchEngineId?: string;
    webSearchDefault?: string;
}
/**
 * Web search configuration structure
 */
export interface WebSearchConfig {
    provider: WebSearchProviderConfig[];
    default: string;
    mode?: 'auto' | 'manual';
}
/**
 * Build webSearch configuration from multiple sources with priority:
 * 1. settings.json (new format) - highest priority
 * 2. Command line args + environment variables
 * 3. DuckDuckGo free fallback (always injected when no other providers are configured)
 *
 * @param argv - Command line arguments
 * @param settings - User settings from settings.json
 * @param authType - Authentication type (e.g., 'hopcode-oauth')
 * @returns WebSearch configuration (always defined — DuckDuckGo is the fallback)
 */
export declare function buildWebSearchConfig(argv: WebSearchCliArgs, settings: Settings, _authType?: string): WebSearchConfig | undefined;
