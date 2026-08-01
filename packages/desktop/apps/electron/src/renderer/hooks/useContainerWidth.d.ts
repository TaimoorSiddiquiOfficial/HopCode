import { type RefObject } from 'react';
/**
 * Tracks the inline-size (width) of a DOM element using ResizeObserver.
 *
 * Used by AppShell to derive `isAutoCompact` — when the shell container
 * is narrower than the mobile threshold, sidebar/navigator auto-collapse
 * and panels switch to single-panel mode.
 *
 * Returns 0 until the element is first measured.
 */
export declare function useContainerWidth(ref: RefObject<HTMLElement | null>): number;
