/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ReadonlyFrame } from './ink-types.js';
import type { NormalizedSelection } from './selection-state.js';
/**
 * Word span (maximal run of non-whitespace cells) around a click, or null when
 * the click is on whitespace. Wide-character spacer cells (empty value) are
 * treated as part of the preceding glyph's run.
 */
export declare function wordSpanAt(frame: ReadonlyFrame | null, x: number, y: number): NormalizedSelection | null;
/** Whole visual line span (first column to last non-space), or null if blank. */
export declare function lineSpanAt(frame: ReadonlyFrame | null, y: number): NormalizedSelection | null;
