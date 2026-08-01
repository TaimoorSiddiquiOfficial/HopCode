/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Browser-safe subset of @hoptrendy/hopcode-core tokenLimits.
 *
 * The webview bundle (IIFE, platform: browser) cannot `require` Node.js
 * packages. This module replicates the constants and logic the webview
 * actually uses so that the core package never needs to be pulled into the
 * browser bundle.
 *
 * Keep this file in sync with:
 *   packages/core/src/core/tokenLimits.ts
 */
type TokenCount = number;
/** Default input context window size: 200 K tokens. */
export declare const DEFAULT_TOKEN_LIMIT: TokenCount;
export type TokenLimitType = 'input' | 'output';
/**
 * Return the token limit for a given model name.
 *
 * This is a browser-safe mirror of `tokenLimit()` in
 * `@hoptrendy/hopcode-core`. The webview only calls this as a fallback
 * when `modelInfo._meta.contextLimit` is unavailable.
 *
 * @param model - The model identifier string
 * @param type  - 'input' for context window, 'output' for generation limit
 * @returns Maximum token count for the model and type
 */
export declare function tokenLimit(model: string, type?: TokenLimitType): TokenCount;
export {};
