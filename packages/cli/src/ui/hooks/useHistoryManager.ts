/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import type { HistoryItem } from '../types.js';
import {
  HistoryVault,
  type HistoryWindowInfo,
  type HistorySearchResult,
} from '../history/HistoryVault.js';

// Type for the updater function passed to updateItem
type HistoryItemUpdater = (
  prevItem: HistoryItem,
) => Partial<Omit<HistoryItem, 'id'>>;

export interface UseHistoryManagerReturn {
  /** The currently visible window of history items (up to WINDOW_SIZE). */
  history: HistoryItem[];
  addItem: (itemData: Omit<HistoryItem, 'id'>, baseTimestamp: number) => number;
  updateItem: (
    id: number,
    updates: Partial<Omit<HistoryItem, 'id'>> | HistoryItemUpdater,
  ) => void;
  clearItems: () => void;
  loadHistory: (newHistory: HistoryItem[]) => void;
  truncateToItem: (itemId: number) => void;
  // ── Window navigation ──────────────────────────────────────────────────────
  canLoadOlderHistory: boolean;
  canLoadNewerHistory: boolean;
  loadOlderHistory: () => void;
  loadNewerHistory: () => void;
  windowInfo: HistoryWindowInfo;
  // ── Search ─────────────────────────────────────────────────────────────────
  searchHistory: (query: string) => HistorySearchResult[];
  jumpToSearchResult: (globalIndex: number) => void;
}

/**
 * Custom hook to manage the chat history state.
 *
 * Wraps a {@link HistoryVault} that holds the full unbounded history off React
 * state.  Only the active window (up to 2 000 items) is pushed to React state,
 * preventing unbounded memory growth while still giving the AI access to the
 * complete session context via the vault's context-note mechanism.
 */
export function useHistory(): UseHistoryManagerReturn {
  const vaultRef = useRef<HistoryVault>(new HistoryVault());
  const messageIdCounterRef = useRef(0);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [windowInfo, setWindowInfo] = useState<HistoryWindowInfo>({
    windowStart: 0,
    windowEnd: 0,
    total: 0,
    hasOlder: false,
    hasNewer: false,
  });

  /** Push the vault's current window and info into React state. */
  const syncState = useCallback(() => {
    const vault = vaultRef.current;
    setHistory(vault.getWindowItems());
    setWindowInfo(vault.getWindowInfo());
  }, []);

  const getNextMessageId = useCallback((baseTimestamp: number): number => {
    messageIdCounterRef.current += 1;
    return baseTimestamp + messageIdCounterRef.current;
  }, []);

  const addItem = useCallback(
    (itemData: Omit<HistoryItem, 'id'>, baseTimestamp: number): number => {
      const id = getNextMessageId(baseTimestamp);
      const newItem: HistoryItem = { ...itemData, id } as HistoryItem;

      const vault = vaultRef.current;
      const lastItem = vault.getLastItem();

      // Prevent adding duplicate consecutive user messages.
      // Check vault's last item (not React state) because a context-note
      // may be the last item in the window slice but not the last real item.
      if (
        lastItem?.type === 'user' &&
        newItem.type === 'user' &&
        'text' in lastItem &&
        'text' in newItem &&
        (lastItem as { text: string }).text ===
          (newItem as { text: string }).text
      ) {
        return id;
      }

      vault.push(newItem);
      syncState();
      return id;
    },
    [getNextMessageId, syncState],
  );

  /**
   * Updates an existing history item identified by its ID.
   * @deprecated Prefer not to update history item directly as we are currently
   * rendering all history items in <Static /> for performance reasons. Only use
   * if ABSOLUTELY NECESSARY
   */
  const updateItem = useCallback(
    (
      id: number,
      updates: Partial<Omit<HistoryItem, 'id'>> | HistoryItemUpdater,
    ) => {
      vaultRef.current.updateItem(id, (prev) => {
        const newUpdates =
          typeof updates === 'function' ? updates(prev) : updates;
        return { ...prev, ...newUpdates } as HistoryItem;
      });
      syncState();
    },
    [syncState],
  );

  const clearItems = useCallback(() => {
    vaultRef.current.clear();
    messageIdCounterRef.current = 0;
    syncState();
  }, [syncState]);

  const loadHistory = useCallback(
    (newHistory: HistoryItem[]) => {
      vaultRef.current.replaceAll(newHistory);
      syncState();
    },
    [syncState],
  );

  const truncateToItem = useCallback(
    (itemId: number) => {
      vaultRef.current.truncateFromId(itemId);
      syncState();
    },
    [syncState],
  );

  const loadOlderHistory = useCallback(() => {
    vaultRef.current.loadOlderWindow();
    syncState();
  }, [syncState]);

  const loadNewerHistory = useCallback(() => {
    vaultRef.current.loadNewerWindow();
    syncState();
  }, [syncState]);

  const searchHistory = useCallback(
    (query: string): HistorySearchResult[] => vaultRef.current.search(query),
    [],
  );

  const jumpToSearchResult = useCallback(
    (globalIndex: number) => {
      vaultRef.current.jumpToIndex(globalIndex);
      syncState();
    },
    [syncState],
  );

  return useMemo(
    () => ({
      history,
      addItem,
      updateItem,
      clearItems,
      loadHistory,
      truncateToItem,
      canLoadOlderHistory: windowInfo.hasOlder,
      canLoadNewerHistory: windowInfo.hasNewer,
      loadOlderHistory,
      loadNewerHistory,
      windowInfo,
      searchHistory,
      jumpToSearchResult,
    }),
    [
      history,
      addItem,
      updateItem,
      clearItems,
      loadHistory,
      truncateToItem,
      windowInfo,
      loadOlderHistory,
      loadNewerHistory,
      searchHistory,
      jumpToSearchResult,
    ],
  );
}
