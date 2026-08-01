import * as React from 'react';
import { type IslandOutsideDismissBehavior } from './island-dismiss-policy';
export declare const ISLAND_BLOCKER_SELECTOR = "[data-ca-island-blocker=\"true\"]";
export declare function isIslandBlockerTarget(target: EventTarget | null): boolean;
export interface UseAnnotationIslandEventsOptions {
    enabled: boolean;
    openedAtRef: React.MutableRefObject<number>;
    isCompactView: boolean;
    isTargetInsideAnnotationIsland: (target: Node | null) => boolean;
    onClose: () => void;
    onBack?: () => boolean;
    outsideClickBehavior?: IslandOutsideDismissBehavior;
    scrollGraceMs?: number;
}
export declare function useAnnotationIslandEvents({ enabled, openedAtRef, isCompactView, isTargetInsideAnnotationIsland, onClose, onBack, outsideClickBehavior, scrollGraceMs, }: UseAnnotationIslandEventsOptions): void;
