/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { HistoryItem } from '../types.js';

/**
 * Number of items per window kept in React state.
 * Older and newer items live in the vault but are not rendered until the
 * user navigates to them with loadOlderWindow / loadNewerWindow.
 */
export const WINDOW_SIZE = 2_000;

/** Maximum number of excerpts included in a context note. */
const MAX_CONTEXT_EXCERPTS = 6;
const MIN_EXCERPT_LEN = 25;
const MAX_EXCERPT_LEN = 180;

/** Types worth summarising in a context note shown at the top of the window. */
const CONTEXT_WORTHY_TYPES = new Set([
  'user',
  'gemini',
  'info',
  'error',
  'warning',
  'away_recap',
]);

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

/** Monotonically decreasing counter used to assign negative IDs to synthetic context-note items. */
let _contextIdSeq = 0;
function nextContextNoteId(): number {
  return -(Date.now() + ++_contextIdSeq);
}

/**
 * In-memory store for the complete session history with a sliding window.
 *
 * Only the active window (up to WINDOW_SIZE items) plus an optional synthetic
 * context-note item are pushed to React state.  The rest live here, off React,
 * so they do not cause re-renders.
 */
export class HistoryVault {
  private _items: HistoryItem[] = [];
  private _windowStart = 0;

  /** Cached context notes keyed by the _windowStart value they were built for. */
  private _contextNoteCache = new Map<number, HistoryItem>();

  // ─── Mutations ────────────────────────────────────────────────────────────

  /** Append a new item, advancing the live-edge window automatically. */
  push(item: HistoryItem): void {
    this._items.push(item);
    // If we are already at (or past) the live edge, keep us locked to it.
    const liveEdge = Math.max(0, this._items.length - WINDOW_SIZE);
    if (this._windowStart >= liveEdge - 1) {
      this._windowStart = liveEdge;
    }
  }

  /** Update an existing item by id.  Clears the context note cache when the
   *  mutated item falls in the "older" section (before the window start). */
  updateItem(id: number, updater: (prev: HistoryItem) => HistoryItem): void {
    const idx = this._items.findIndex((i) => i.id === id);
    if (idx === -1) return;
    this._items[idx] = updater(this._items[idx]);
    if (idx < this._windowStart) {
      this._contextNoteCache.clear();
    }
  }

  /** Replace the entire history (e.g. after /resume or loadHistory). */
  replaceAll(items: HistoryItem[]): void {
    this._items = items.slice();
    this._windowStart = Math.max(0, this._items.length - WINDOW_SIZE);
    this._contextNoteCache.clear();
  }

  /** Remove all items from the given id onward (inclusive). */
  truncateFromId(itemId: number): void {
    const idx = this._items.findIndex((i) => i.id === itemId);
    if (idx === -1) return;
    this._items = this._items.slice(0, idx);
    this._windowStart = Math.min(
      this._windowStart,
      Math.max(0, this._items.length - WINDOW_SIZE),
    );
    this._contextNoteCache.clear();
  }

  /** Clear everything. */
  clear(): void {
    this._items = [];
    this._windowStart = 0;
    this._contextNoteCache.clear();
  }

  // ─── Window navigation ────────────────────────────────────────────────────

  loadOlderWindow(): void {
    this._windowStart = Math.max(0, this._windowStart - WINDOW_SIZE);
  }

  loadNewerWindow(): void {
    const liveEdge = Math.max(0, this._items.length - WINDOW_SIZE);
    this._windowStart = Math.min(liveEdge, this._windowStart + WINDOW_SIZE);
  }

  /**
   * Shift the window so that globalIndex is visible, centred in the window
   * where possible.
   */
  jumpToIndex(globalIndex: number): void {
    const clamped = Math.max(0, Math.min(this._items.length - 1, globalIndex));
    const liveEdge = Math.max(0, this._items.length - WINDOW_SIZE);
    this._windowStart = Math.max(
      0,
      Math.min(liveEdge, clamped - Math.floor(WINDOW_SIZE / 2)),
    );
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  getWindowInfo(): HistoryWindowInfo {
    const total = this._items.length;
    const windowEnd = Math.min(this._windowStart + WINDOW_SIZE, total);
    return {
      windowStart: this._windowStart,
      windowEnd,
      total,
      hasOlder: this._windowStart > 0,
      hasNewer: windowEnd < total,
    };
  }

  /**
   * Returns the items for the current window.
   *
   * When older items exist (windowStart > 0), prepends a synthetic
   * `history_context_note` item summarising the hidden portion.
   */
  getWindowItems(): HistoryItem[] {
    const slice = this._items.slice(
      this._windowStart,
      this._windowStart + WINDOW_SIZE,
    );
    if (this._windowStart === 0) return slice;
    return [this._getOrBuildContextNote(), ...slice];
  }

  /** The last item in the vault (not just the window). Used for duplicate detection. */
  getLastItem(): HistoryItem | undefined {
    return this._items[this._items.length - 1];
  }

  /**
   * Full-text search across ALL items in the vault (not just the visible window).
   * Returns up to `maxResults` matches with surrounding excerpts.
   */
  search(query: string, maxResults = 200): HistorySearchResult[] {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const lower = trimmed.toLowerCase();
    const results: HistorySearchResult[] = [];

    for (
      let i = 0;
      i < this._items.length && results.length < maxResults;
      i++
    ) {
      const item = this._items[i];
      const text = getSearchableText(item);
      if (!text) continue;
      const lowerText = text.toLowerCase();
      const matchIdx = lowerText.indexOf(lower);
      if (matchIdx === -1) continue;

      const start = Math.max(0, matchIdx - 40);
      const end = Math.min(text.length, matchIdx + lower.length + 60);
      const raw = text.slice(start, end).replace(/\n+/g, ' ');
      const matchExcerpt =
        (start > 0 ? '…' : '') + raw + (end < text.length ? '…' : '');

      results.push({ item, globalIndex: i, matchExcerpt });
    }

    return results;
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private _getOrBuildContextNote(): HistoryItem {
    const cached = this._contextNoteCache.get(this._windowStart);
    if (cached) return cached;
    const note = this._buildContextNote();
    this._contextNoteCache.set(this._windowStart, note);
    return note;
  }

  private _buildContextNote(): HistoryItem {
    const olderItems = this._items.slice(0, this._windowStart);
    const excerpts: string[] = [];

    for (
      let i = olderItems.length - 1;
      i >= 0 && excerpts.length < MAX_CONTEXT_EXCERPTS;
      i--
    ) {
      const item = olderItems[i];
      if (!CONTEXT_WORTHY_TYPES.has(item.type)) continue;
      const text = getSearchableText(item);
      if (!text || text.length < MIN_EXCERPT_LEN) continue;
      const truncated = text.slice(0, MAX_EXCERPT_LEN);
      excerpts.unshift(`[${item.type}] ${truncated}`);
    }

    const summaryText =
      excerpts.length > 0
        ? `Context from earlier in this session (items 0–${this._windowStart - 1}):\n` +
          excerpts.map((e) => `  • ${e}`).join('\n')
        : `${this._windowStart} earlier items are not shown in this window.`;

    return {
      type: 'history_context_note',
      windowFrom: 0,
      windowTo: this._windowStart,
      text: summaryText,
      id: nextContextNoteId(),
    } as HistoryItem;
  }
}

/** Extract a searchable string from any HistoryItem variant. */
export function getSearchableText(item: HistoryItem): string {
  const asAny = item as unknown as Record<string, unknown>;
  if (typeof asAny['text'] === 'string' && asAny['text']) {
    return asAny['text'] as string;
  }
  if (typeof asAny['summary'] === 'string' && asAny['summary']) {
    return asAny['summary'] as string;
  }
  return '';
}
