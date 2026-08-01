import type { IslandTransitionConfig } from '../ui';
export type PointerSnapshot = {
    x: number;
    y: number;
    ts: number;
};
export declare function clampIslandAnchorX(anchorX: number, islandWidth: number): number;
export declare function getDefaultIslandWidthEstimate(): number;
export declare function buildSelectionEntryTransition(from: PointerSnapshot | null, to: PointerSnapshot | null): IslandTransitionConfig;
export declare function buildAnnotationChipEntryTransition(): IslandTransitionConfig;
