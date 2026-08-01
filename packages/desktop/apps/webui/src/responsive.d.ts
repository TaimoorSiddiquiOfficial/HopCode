/**
 * responsive.ts — Thin mobile detection for webui
 *
 * Layout responsiveness is now handled by container queries and isAutoCompact
 * in the shared electron renderer components. This module only provides
 * viewport-level mobile detection for the few places that need it
 * (touch events, virtual keyboard handling, safe-area insets).
 */
/**
 * Hook that returns true when viewport is at mobile width.
 *
 * Use sparingly — prefer container queries (@container) for layout decisions.
 * This is for viewport-level concerns like touch handling and virtual keyboard.
 */
export declare function useIsMobile(): boolean;
