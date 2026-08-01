/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/** Ordered weakest → strongest. Drives the `/effort` picker and clamping. */
export const REASONING_EFFORT_TIERS = [
    'low',
    'medium',
    'high',
    'xhigh',
    'max',
];
/**
 * Numeric strength used when clamping a requested tier down to what a model
 * supports. Gaps are intentional so future intermediate tiers (e.g. a
 * `minimal: 10`) can slot in without renumbering.
 */
export const REASONING_EFFORT_RANKS = {
    low: 20,
    medium: 30,
    high: 40,
    xhigh: 60,
    max: 70,
};
/**
 * Normalize free-form user input to a canonical tier. Accepts separators and a
 * few common aliases (`x-high`, `extra-high`, `maximum`). Returns `undefined`
 * for anything unrecognized so callers can surface a helpful error.
 */
export function normalizeReasoningEffort(raw) {
    if (!raw || typeof raw !== 'string') {
        return undefined;
    }
    const key = raw
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, '');
    switch (key) {
        case 'low':
            return 'low';
        case 'medium':
        case 'med':
            return 'medium';
        case 'high':
            return 'high';
        case 'xhigh':
        case 'extrahigh':
            return 'xhigh';
        case 'max':
        case 'maximum':
            return 'max';
        default:
            return undefined;
    }
}
/**
 * Clamp a requested tier to the nearest tier a model/provider actually supports.
 *
 * Rank-based, mirroring openclaw's `clampThinkingLevel`: if the exact tier is
 * supported, keep it; otherwise prefer the next stronger supported tier, and
 * only walk down when nothing at or above the request is available. Because an
 * unsupported `xhigh`/`max` will have no supported tier at or above it (the
 * model's supported list omits them), this naturally caps over-strong requests
 * to the model ceiling without raising cost.
 *
 * `supported` defaults to the full ladder (no clamping).
 */
export function clampReasoningEffort(requested, supported) {
    const set = supported && supported.length > 0 ? supported : REASONING_EFFORT_TIERS;
    if (set.includes(requested)) {
        return requested;
    }
    const requestedRank = REASONING_EFFORT_RANKS[requested];
    const ranked = [...set].sort((a, b) => REASONING_EFFORT_RANKS[a] - REASONING_EFFORT_RANKS[b]);
    // Prefer the next stronger supported tier (smallest rank >= request).
    for (const tier of ranked) {
        if (REASONING_EFFORT_RANKS[tier] >= requestedRank) {
            return tier;
        }
    }
    // Nothing at or above the request: fall back to the strongest available.
    return ranked[ranked.length - 1];
}
//# sourceMappingURL=reasoning-effort.js.map