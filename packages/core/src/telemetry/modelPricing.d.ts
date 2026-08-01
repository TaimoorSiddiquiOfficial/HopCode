/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Pricing in USD per 1,000,000 tokens for common models.
 * Prices are approximate and sourced from provider public pricing pages.
 * Update as providers change rates.
 */
export interface ModelPricing {
    /** USD per 1M input (prompt) tokens */
    inputPer1M: number;
    /** USD per 1M output (completion) tokens */
    outputPer1M: number;
}
/**
 * Look up pricing for a model name.
 * Returns `undefined` for unknown/local models (e.g. Ollama, llama3.2).
 */
export declare function getModelPricing(modelName: string): ModelPricing | undefined;
/**
 * Estimate cost in USD for a given model + token counts.
 * Returns 0 if the model is unknown (local/self-hosted).
 */
export declare function estimateModelCost(modelName: string, inputTokens: number, outputTokens: number): number;
/**
 * Format a cost value as a human-readable USD string.
 * Uses scientific notation only as a last resort.
 */
export declare function formatCostUsd(usd: number): string;
