/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Local type stubs replacing ink@7 exports that were removed in v7.
 * See https://github.com/vadimdemedes/ink
 */
/** Ink's internal cell representation in a composited frame. */
export interface FrameCell {
    type: 'char';
    value: string;
    fullWidth: boolean;
    styles: unknown[];
}
/** A composited (rendered) frame: the 2-D cell grid Ink produces after a render cycle. */
export interface ReadonlyFrame {
    width: number;
    height: number;
    cells: FrameCell[][];
}
/** Selection range in frame coordinates, inclusive on both ends. */
export interface ScreenSelection {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
}
/** Controller for reading and highlighting a composited frame. */
export interface FrameController {
    getFrame(): ReadonlyFrame | null;
    setSelection(selection: ScreenSelection | null): void;
    subscribe(listener: (frame: ReadonlyFrame) => void): () => void;
}
