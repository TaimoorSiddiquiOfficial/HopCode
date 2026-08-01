/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { HistoryItem } from '../types.js';
/**
 * Number of items per window kept in React state.
 * Older and newer items live in the vault but are not rendered until the
 * user navigates to them with loadOlderWindow / loadNewerWindow.
 */
export declare const WINDOW_SIZE = 2000;
/** Information about the currently visible window. */
export interface HistoryWindowInfo {
    windowStart: number;
    windowEnd: number;
    total: number;
    hasOlder: boolean;
    hasNewer: boolean;
}
/** A single match returned by {@link HistoryVault.search}. */
export interface HistorySearchResult {
    item: HistoryItem;
    globalIndex: number;
    matchExcerpt: string;
}
/**
 * In-memory store for the complete session history with a sliding window.
 *
 * Only the active window (up to WINDOW_SIZE items) plus an optional synthetic
 * context-note item are pushed to React state.  The rest live here, off React,
 * so they do not cause re-renders.
 */
export declare class HistoryVault {
    private _items;
    private _windowStart;
    /** Cached context notes keyed by the _windowStart value they were built for. */
    private _contextNoteCache;
    /** Append a new item, advancing the live-edge window automatically. */
    push(item: HistoryItem): void;
    /** Update an existing item by id.  Clears the context note cache when the
     *  mutated item falls in the "older" section (before the window start).
     *  Returns true if the item was found and updated, false if not found. */
    updateItem(id: number, updater: (prev: HistoryItem) => HistoryItem): boolean;
    /** Replace the entire history (e.g. after /resume or loadHistory). */
    replaceAll(items: HistoryItem[]): void;
    /** Remove all items from the given id onward (inclusive). */
    truncateFromId(itemId: number): void;
    /** Clear everything. */
    clear(): void;
    loadOlderWindow(): void;
    loadNewerWindow(): void;
    /**
     * Shift the window so that globalIndex is visible, centred in the window
     * where possible.
     */
    jumpToIndex(globalIndex: number): void;
    getWindowInfo(): HistoryWindowInfo;
    /**
     * Returns the items for the current window.
     *
     * When older items exist (windowStart > 0), prepends a synthetic
     * `history_context_note` item summarising the hidden portion.
     */
    getWindowItems(): HistoryItem[];
    /** The last item in the vault (not just the window). Used for duplicate detection. */
    getLastItem(): HistoryItem | undefined;
    /**
     * Full-text search across ALL items in the vault (not just the visible window).
     * Returns up to `maxResults` matches with surrounding excerpts.
     */
    search(query: string, maxResults?: number): HistorySearchResult[];
    private _getOrBuildContextNote;
    private _buildContextNote;
}
/** Extract a searchable string from any HistoryItem variant. */
export declare function getSearchableText(item: HistoryItem): string;
