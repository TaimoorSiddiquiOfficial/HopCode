import * as React from 'react';
/**
 * Hook for horizontal scroll containers with CSS mask fade indicators.
 * Tracks scroll position and produces a maskImage gradient that fades
 * edges when content overflows — same pattern used in Mermaid diagrams.
 */
export declare function useScrollFade(fadeSize?: number): {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    maskImage: string | undefined;
    canScrollLeft: boolean;
    canScrollRight: boolean;
};
