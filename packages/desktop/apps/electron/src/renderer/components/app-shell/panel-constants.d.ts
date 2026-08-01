/** Gap between any adjacent panels (sidebar ↔ navigator ↔ content ↔ right sidebar) */
export declare const PANEL_GAP = 6;
/** Padding from window edges to outermost panels (right, bottom, left when sidebar hidden) */
export declare const PANEL_EDGE_INSET = 6;
/** Corner radius for panel edges touching the window boundary (macOS native corners → larger) */
export declare const RADIUS_EDGE: number;
/** Corner radius for interior corners between panels */
export declare const RADIUS_INNER = 10;
/** Minimum width for any content panel */
export declare const PANEL_MIN_WIDTH = 440;
/** Extra vertical space reserved in panel stack for box-shadows. */
export declare const PANEL_STACK_VERTICAL_OVERFLOW = 8;
/**
 * Shared resize sash geometry.
 *
 * Keep all seams (sidebar, navigator/content, panel/panel) aligned by deriving
 * offsets from these constants instead of hardcoded pixel literals.
 */
export declare const PANEL_SASH_HIT_WIDTH = 8;
export declare const PANEL_SASH_LINE_WIDTH = 2;
/**
 * When the sash is inserted between two flex items, flex gap would apply twice
 * (item↔sash and sash↔item). Pull it back by half the gap on both sides so
 * the visible distance remains exactly PANEL_GAP.
 */
export declare const PANEL_SASH_FLEX_MARGIN: number;
/** Half-width helper for centering sash containers on seam coordinates. */
export declare const PANEL_SASH_HALF_HIT_WIDTH: number;
