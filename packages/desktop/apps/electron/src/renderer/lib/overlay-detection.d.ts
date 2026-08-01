/**
 * Check if any overlay is currently open in the DOM.
 * Returns true if an overlay is detected, false otherwise.
 *
 * This is used by the Escape key handler to determine whether
 * the escape should trigger chat interrupt or be handled by the overlay.
 */
export declare function hasOpenOverlay(): boolean;
