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

/** Exact-match model pricing table (model name → pricing). */
const EXACT_PRICING: Record<string, ModelPricing> = {
  // ── OpenAI ────────────────────────────────────────────────────────────────
  'gpt-4o': { inputPer1M: 2.5, outputPer1M: 10.0 },
  'gpt-4o-mini': { inputPer1M: 0.15, outputPer1M: 0.6 },
  'gpt-4-turbo': { inputPer1M: 10.0, outputPer1M: 30.0 },
  'gpt-4': { inputPer1M: 30.0, outputPer1M: 60.0 },
  'gpt-3.5-turbo': { inputPer1M: 0.5, outputPer1M: 1.5 },
  o1: { inputPer1M: 15.0, outputPer1M: 60.0 },
  'o1-mini': { inputPer1M: 3.0, outputPer1M: 12.0 },
  'o3-mini': { inputPer1M: 1.1, outputPer1M: 4.4 },

  // ── Anthropic ─────────────────────────────────────────────────────────────
  'claude-opus-4': { inputPer1M: 15.0, outputPer1M: 75.0 },
  'claude-sonnet-4-5': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'claude-sonnet-4': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'claude-3-5-sonnet-20241022': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'claude-3-5-haiku-20241022': { inputPer1M: 0.8, outputPer1M: 4.0 },
  'claude-3-opus-20240229': { inputPer1M: 15.0, outputPer1M: 75.0 },
  'claude-3-sonnet-20240229': { inputPer1M: 3.0, outputPer1M: 15.0 },
  'claude-3-haiku-20240307': { inputPer1M: 0.25, outputPer1M: 1.25 },

  // ── Google Gemini ─────────────────────────────────────────────────────────
  'gemini-2.0-flash': { inputPer1M: 0.1, outputPer1M: 0.4 },
  'gemini-2.0-flash-lite': { inputPer1M: 0.075, outputPer1M: 0.3 },
  'gemini-1.5-pro': { inputPer1M: 1.25, outputPer1M: 5.0 },
  'gemini-1.5-flash': { inputPer1M: 0.075, outputPer1M: 0.3 },
  'gemini-1.5-flash-8b': { inputPer1M: 0.0375, outputPer1M: 0.15 },

  // ── DeepSeek ─────────────────────────────────────────────────────────────
  'deepseek-chat': { inputPer1M: 0.14, outputPer1M: 0.28 },
  'deepseek-reasoner': { inputPer1M: 0.55, outputPer1M: 2.19 },
  'deepseek-r1': { inputPer1M: 0.55, outputPer1M: 2.19 },

  // ── Mistral ────────────────────────────────────────────────────────────────
  'mistral-large-latest': { inputPer1M: 2.0, outputPer1M: 6.0 },
  'mistral-small-latest': { inputPer1M: 0.2, outputPer1M: 0.6 },
  'codestral-latest': { inputPer1M: 0.3, outputPer1M: 0.9 },

  // ── xAI ───────────────────────────────────────────────────────────────────
  'grok-2': { inputPer1M: 2.0, outputPer1M: 10.0 },
  'grok-2-mini': { inputPer1M: 0.2, outputPer1M: 1.0 },

  // ── Cohere ────────────────────────────────────────────────────────────────
  'command-r-plus': { inputPer1M: 2.5, outputPer1M: 10.0 },
  'command-r': { inputPer1M: 0.15, outputPer1M: 0.6 },
};

/**
 * Prefix-match fallback pricing table.
 * Matched in order; first match wins.
 */
const PREFIX_PRICING: Array<[string, ModelPricing]> = [
  ['gpt-4o', { inputPer1M: 2.5, outputPer1M: 10.0 }],
  ['gpt-4', { inputPer1M: 10.0, outputPer1M: 30.0 }],
  ['gpt-3.5', { inputPer1M: 0.5, outputPer1M: 1.5 }],
  ['claude-3-5-haiku', { inputPer1M: 0.8, outputPer1M: 4.0 }],
  ['claude-3-5', { inputPer1M: 3.0, outputPer1M: 15.0 }],
  ['claude-3-opus', { inputPer1M: 15.0, outputPer1M: 75.0 }],
  ['claude-3', { inputPer1M: 3.0, outputPer1M: 15.0 }],
  ['claude-sonnet', { inputPer1M: 3.0, outputPer1M: 15.0 }],
  ['claude-opus', { inputPer1M: 15.0, outputPer1M: 75.0 }],
  ['claude-haiku', { inputPer1M: 0.8, outputPer1M: 4.0 }],
  ['gemini-2.0-flash', { inputPer1M: 0.1, outputPer1M: 0.4 }],
  ['gemini-1.5-pro', { inputPer1M: 1.25, outputPer1M: 5.0 }],
  ['gemini-1.5', { inputPer1M: 0.075, outputPer1M: 0.3 }],
  ['deepseek-r1', { inputPer1M: 0.55, outputPer1M: 2.19 }],
  ['deepseek', { inputPer1M: 0.14, outputPer1M: 0.28 }],
  ['mistral-large', { inputPer1M: 2.0, outputPer1M: 6.0 }],
  ['mistral', { inputPer1M: 0.2, outputPer1M: 0.6 }],
  ['grok-2', { inputPer1M: 2.0, outputPer1M: 10.0 }],
];

/**
 * Look up pricing for a model name.
 * Returns `undefined` for unknown/local models (e.g. Ollama, llama3.2).
 */
export function getModelPricing(modelName: string): ModelPricing | undefined {
  if (!modelName) return undefined;
  const lower = modelName.toLowerCase();

  // Exact match first (fastest path)
  if (EXACT_PRICING[lower]) return EXACT_PRICING[lower];

  // Prefix fallback
  for (const [prefix, pricing] of PREFIX_PRICING) {
    if (lower.startsWith(prefix)) return pricing;
  }

  return undefined;
}

/**
 * Estimate cost in USD for a given model + token counts.
 * Returns 0 if the model is unknown (local/self-hosted).
 */
export function estimateModelCost(
  modelName: string,
  inputTokens: number,
  outputTokens: number,
): number {
  const pricing = getModelPricing(modelName);
  if (!pricing) return 0;
  return (
    (inputTokens * pricing.inputPer1M + outputTokens * pricing.outputPer1M) /
    1_000_000
  );
}

/**
 * Format a cost value as a human-readable USD string.
 * Uses scientific notation only as a last resort.
 */
export function formatCostUsd(usd: number): string {
  if (usd === 0) return '$0.00';
  if (usd < 0.0001) return `< $0.0001`;
  if (usd < 0.01) return `$${usd.toFixed(4)}`;
  if (usd < 1) return `$${usd.toFixed(3)}`;
  return `$${usd.toFixed(2)}`;
}
