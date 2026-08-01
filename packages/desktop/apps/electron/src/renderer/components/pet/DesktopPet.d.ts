/**
 * Fills the transparent, always-on-top pet window. Everything is clustered at
 * the bottom-right: notification cards stack just above a small toggle, which
 * sits just above the draggable pet. The toggle is pinned right above the pet,
 * so collapse/expand only grows/shrinks the cards above it — the toggle and pet
 * never move.
 *
 * Click-through is per-element via elementFromPoint: only the pet, the cards
 * and the toggle are interactive; everything else passes through to the desktop.
 */
export declare function DesktopPet(): import("react").JSX.Element | null;
