/**
 * useDynamicStack — Realtime dynamic stacking with equal visible strips.
 *
 * Returns a callback ref that, when attached to a flex container, computes
 * per-badge marginLeft values via ResizeObserver. Two phases:
 *
 * 1. TRANSITION (gaps shrinking): uniform margins for even spacing.
 *    As container shrinks, all gaps decrease equally from `gap` toward 0.
 *    Used when V >= min(non-last badge widths) — prevents uneven positive
 *    margins that would appear with the per-badge formula.
 *
 * 2. STACKING (equal visible strips): per-badge margins so each badge
 *    exposes exactly V pixels regardless of natural width. Wider badges
 *    get more negative margins. All margins ≤ 0 in this phase.
 *    Used when V < min(non-last badge widths).
 *
 * A smooth blend over a short range at the crossover prevents discontinuity.
 *
 * Key design decisions:
 * - Callback ref: observer attaches immediately on mount, before first paint
 * - No rAF: ResizeObserver fires between layout and paint (same-frame updates)
 * - Direct child style manipulation (no CSS variables, no React re-renders)
 * - MutationObserver: recomputes when children are added/removed
 *
 * @param options.gap - Gap between badges when space allows (default: 8)
 * @param options.minVisible - Minimum visible strip per badge in px (default: 20)
 * @param options.reservedStart - Optional visual reserve applied only in stacking
 *   math (capped to one gap) to keep fade behavior stable (default: 0)
 */
export declare function useDynamicStack(options?: {
    gap?: number;
    minVisible?: number;
    reservedStart?: number;
}): (el: HTMLDivElement | null) => void;
