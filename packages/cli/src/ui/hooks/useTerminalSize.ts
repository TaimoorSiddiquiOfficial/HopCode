/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

/**
 * ANSI escape sequence to clear the screen and move cursor home.
 * \x1b[2J  — clear entire screen
 * \x1b[H   — move cursor to home position (top-left)
 */
const CLEAR_SCREEN_AND_HOME = '\x1b[2J\x1b[H';

/**
 * Returns the actual terminal size without any padding adjustments.
 *
 * On resize, clears the terminal screen and homes the cursor so Ink can
 * re-render all components at the new dimensions without visual corruption
 * (truncated lines, overlapping content from Static frames that were flushed
 * at the previous width).
 */
export function useTerminalSize(): { columns: number; rows: number } {
  const [size, setSize] = useState({
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  });

  // Debounce timer to avoid rapid flicker from intermediate resize events
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function updateSize() {
      const newCols = process.stdout.columns || 80;
      const newRows = process.stdout.rows || 24;

      // Clear screen + home cursor BEFORE updating size state.
      // This must happen synchronously so the escape sequence fires before
      // Ink re-renders the component tree.
      if (process.stdout.isTTY) {
        process.stdout.write(CLEAR_SCREEN_AND_HOME);
      }

      // Debounce: only commit the React state update after 100ms of no
      // further resize events. This prevents excessive re-renders during
      // manual window dragging.
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = setTimeout(() => {
        setSize({ columns: newCols, rows: newRows });
        resizeTimerRef.current = null;
      }, 100);
    }

    process.stdout.on('resize', updateSize);
    return () => {
      process.stdout.off('resize', updateSize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, []);

  return size;
}
