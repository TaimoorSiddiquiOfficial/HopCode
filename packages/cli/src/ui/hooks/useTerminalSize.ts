/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Returns the actual terminal size without any padding adjustments.
 */
export function useTerminalSize(): { columns: number; rows: number } {
  const [size, setSize] = useState({
    columns: process.stdout.columns || 80,
    rows: process.stdout.rows || 24,
  });

  // Debounce timer to avoid UV_HANDLE_CLOSING assertions on Windows
  // during rapid-fire resize events.
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function updateSize() {
      const newCols = process.stdout.columns || 80;
      const newRows = process.stdout.rows || 24;

      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }

      // Small debounce (16ms = ~1 frame) to batch resize events
      // while remaining responsive.
      resizeTimerRef.current = setTimeout(() => {
        setSize({ columns: newCols, rows: newRows });
        resizeTimerRef.current = null;
      }, 16);
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
