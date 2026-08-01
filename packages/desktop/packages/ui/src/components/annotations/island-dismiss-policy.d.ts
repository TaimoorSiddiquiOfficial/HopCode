export type IslandOutsideDismissBehavior = 'back-or-close' | 'close-only';
export type IslandOutsideDismissAction = 'back' | 'close';
export interface ResolveIslandOutsideDismissActionOptions {
    isCompactView: boolean;
    behavior: IslandOutsideDismissBehavior;
}
export declare function resolveIslandOutsideDismissAction({ isCompactView, behavior, }: ResolveIslandOutsideDismissActionOptions): IslandOutsideDismissAction;
