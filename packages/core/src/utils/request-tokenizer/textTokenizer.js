/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
const NON_ASCII_RE = /[\u0080-\uffff]/;
/**
 * Text tokenizer for calculating text tokens using character-based estimation.
 *
 * Uses a lightweight character-based approach that is "good enough" for
 * guardrail features like sessionTokenLimit.
 *
 * Algorithm:
 * - ASCII characters: 0.25 tokens per char (4 chars = 1 token)
 * - Non-ASCII characters: 1.1 tokens per char (conservative for CJK, emoji, etc.)
 */
export function estimateTextTokens(text) {
    if (!text || text.length === 0) {
        return 0;
    }
    // Fast path: pure-ASCII text (code, English prose). A single regex scan
    // uses V8's optimized string search instead of a per-character JS loop.
    if (!NON_ASCII_RE.test(text)) {
        return Math.ceil(text.length / 4);
    }
    let nonAsciiChars = 0;
    for (let i = 0; i < text.length; i++) {
        if (text.charCodeAt(i) >= 128) {
            nonAsciiChars++;
        }
    }
    const asciiChars = text.length - nonAsciiChars;
    const tokens = asciiChars / 4 + nonAsciiChars * 1.1;
    return Math.ceil(tokens);
}
export class TextTokenizer {
    /**
     * Calculate tokens for text content
     *
     * @param text - The text to estimate tokens for
     * @returns The estimated token count
     */
    async calculateTokens(text) {
        return this.calculateTokensSync(text);
    }
    /**
     * Calculate tokens for multiple text strings
     *
     * @param texts - Array of text strings to estimate tokens for
     * @returns Array of token counts corresponding to each input text
     */
    async calculateTokensBatch(texts) {
        return texts.map((text) => this.calculateTokensSync(text));
    }
    calculateTokensSync(text) {
        return estimateTextTokens(text);
    }
}
//# sourceMappingURL=textTokenizer.js.map