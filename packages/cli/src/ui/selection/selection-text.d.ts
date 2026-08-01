/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
import type { ReadonlyFrame } from './ink-types.js';
import type { NormalizedSelection } from './selection-state.js';
/**
 * Extracts the visual text of a selection from a composited frame.
 *
 * B1 fidelity: the text is exactly what is displayed. Wide-character spacer
 * cells carry an empty value and contribute nothing, so a wide glyph appears
 * once. Per-line trailing whitespace is trimmed. Soft-wrapped logical lines are
 * NOT rejoined and decoration cells are NOT excluded — that is PR 2 (semantic
 * fidelity), which needs renderer metadata not present in the raw frame.
 */
export declare function getSelectedText(frame: ReadonlyFrame | null, selection: NormalizedSelection): string;
