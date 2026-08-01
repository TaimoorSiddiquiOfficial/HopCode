/**
 * Shared layout constants for chat UI
 *
 * These values ensure visual consistency between Electron and web viewer.
 * Import and use these in both ChatDisplay (Electron) and SessionViewer (UI package).
 */
/**
 * Overlay layout configuration
 * Controls when overlays show as modals vs fullscreen
 */
export declare const OVERLAY_LAYOUT: {
    /** Minimum viewport width for modal display (below this = fullscreen) */
    /** Set very high to always use fullscreen mode */
    readonly modalBreakpoint: 99999;
    /** Modal max width */
    readonly modalMaxWidth: 1100;
    /** Modal max height as percentage of viewport */
    readonly modalMaxHeightPercent: 85;
    /** Backdrop class for modal mode (semi-transparent) */
    readonly modalBackdropClass: "bg-black/50";
    /** Backdrop class for fullscreen mode (solid) */
    readonly fullscreenBackdropClass: "bg-background";
};
/**
 * Chat layout configuration
 */
export declare const CHAT_LAYOUT: {
    /** Max width for chat content area */
    readonly maxWidth: "max-w-[840px]";
    /** Horizontal padding for main container */
    readonly containerPaddingX: "px-5";
    /** Vertical padding for main container */
    readonly containerPaddingY: "py-8";
    /** Combined container padding */
    readonly containerPadding: "px-5 py-8";
    /** Vertical spacing between messages/turns */
    readonly messageSpacing: "space-y-2.5";
    /** Extra padding for user messages (visual separation from AI responses) */
    readonly userMessagePadding: "pt-4 pb-2";
    /** Bottom branding area padding */
    readonly brandingPadding: "pt-16 pb-24";
};
/**
 * Composed class strings for common patterns
 */
export declare const CHAT_CLASSES: {
    /** Main message container: max-width + centered + padding + spacing */
    readonly messageContainer: "max-w-[840px] mx-auto px-5 py-8 space-y-2.5";
    /** User message wrapper with padding */
    readonly userMessageWrapper: "pt-4 pb-2";
    /** Bottom branding container */
    readonly brandingContainer: "flex justify-center pt-16 pb-24";
};
export type OverlayMode = 'modal' | 'fullscreen';
/**
 * Hook to determine if overlay should show as modal or fullscreen
 * based on viewport size.
 *
 * @returns 'modal' if viewport is large enough, 'fullscreen' otherwise
 */
export declare function useOverlayMode(): OverlayMode;
