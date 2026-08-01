/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { HistoryItem } from '../types.js';
interface TranscriptViewProps {
    /** Frozen snapshot of history + pending items, already stitched by the caller. */
    items: HistoryItem[];
    /**
     * When false, Ink already owns the alternate screen (VP mode) — the
     * AlternateScreen wrapper skips its escape writes to avoid double-enter.
     */
    useAlternateScreen?: boolean;
}
/**
 * Memoized so the frozen transcript doesn't re-reconcile on every AppContainer
 * re-render while streaming continues underneath. AppContainer hands a stable
 * `items` reference (memoized from the freeze snapshot), so the default shallow
 * prop compare is enough.
 */
export declare const TranscriptView: import("react").MemoExoticComponent<({ items, useAlternateScreen, }: TranscriptViewProps) => import("react").JSX.Element>;
export {};
