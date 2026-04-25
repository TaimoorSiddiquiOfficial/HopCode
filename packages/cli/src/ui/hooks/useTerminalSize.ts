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

      // Debounce: only commit the React state update after 100ms of no
      // further resize events. This prevents excessive re-renders during
      // manual window dragging.
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
      resizeTimerRef.current = setTimeout(() => {
        // Clear screen + home cursor AFTER the debounce period so it fires
        // just before the React re-render (Ink reads the new columns/rows on
        // the next layout pass). Clearing too early leaves a blank gap;
        // clearing synchronously with the state update lets Ink repaint at
        // the new dimensions immediately.
        if (process.stdout.isTTY) {
          process.stdout.write(CLEAR_SCREEN_AND_HOME);
        }
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
