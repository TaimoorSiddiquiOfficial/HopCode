/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

/**
 * ANSI escape sequence to move the cursor to the home position
 * (top-left of the visible area). Unlike clear-screen this does
 * not erase the scrollback buffer, avoiding the blank flash
 * that made resize feel jarring.  The terminal redraw optimizer
 * and synchronized-output patch already prevent the classic Ink
 * corruption issues (truncated lines, scrollback bounce).
 */
const CURSOR_HOME = '\x1b[H';

/**
 * Returns the actual terminal size without any padding adjustments.
 *
 * On resize, homes the cursor so Ink can re-render at the new
 * dimensions without residual cursor-offset artifacts.
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
        // Home the cursor so Ink's next layout pass starts from the
        // expected position. We intentionally avoid clearing the screen
        // here: the redraw optimizer handles erase-line bounce, and a
        // full clear caused a jarring blank flash during every resize.
        if (process.stdout.isTTY) {
          process.stdout.write(CURSOR_HOME);
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
