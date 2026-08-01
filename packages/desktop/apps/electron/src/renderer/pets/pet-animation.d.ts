/**
 * Pet sprite-atlas animation (clean-room).
 *
 * Atlas: 1536x1872, 8 cols x 9 rows, 192x208 px cells, transparent.
 * Each row is one animation state. Frames are stepped by mutating a single
 * element's `background-position`; `background-size` is set so the sheet maps
 * cell-to-cell at percentage positions.
 */
export type PetState = 'idle' | 'running-right' | 'running-left' | 'waving' | 'jumping' | 'failed' | 'waiting' | 'running' | 'review';
export declare const PET_STATES: readonly PetState[];
export declare const PET_COLUMNS = 8;
export declare const PET_ROWS = 9;
export declare const PET_CELL_WIDTH = 192;
export declare const PET_CELL_HEIGHT = 208;
export interface PetFrame {
    rowIndex: number;
    columnIndex: number;
    durationMs: number;
}
export declare const PET_STATE_FRAMES: Record<PetState, PetFrame[]>;
export interface PetSequence {
    frames: PetFrame[];
    /** When the last frame is reached, jump back here; null = stop. */
    loopStartIndex: number | null;
}
/**
 * Resolve the frame sequence to play for a state.
 * - reduced motion: a single static frame, no loop.
 * - idle: the slow idle loop, forever.
 * - any action: play it `ACTION_REPEATS` times, then loop the idle settle.
 */
export declare function buildSequence(state: PetState, reducedMotion: boolean): PetSequence;
/** CSS `background-position` for a frame (percentage-based sprite stepping). */
export declare function backgroundPositionFor(frame: PetFrame): string;
/** `background-size` that makes the atlas map one cell per element. */
export declare const PET_BACKGROUND_SIZE = "800% 900%";
