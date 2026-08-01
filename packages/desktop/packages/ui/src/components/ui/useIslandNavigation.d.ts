export interface IslandNavigation<TView extends string> {
    current: TView;
    canPop: boolean;
    stack: TView[];
    push: (next: TView) => void;
    replace: (next: TView) => void;
    pop: () => void;
    reset: (root?: TView) => void;
    handleEscapeBackOrClose: (onClose: () => void) => boolean;
}
/**
 * Shared backstack helper for Island multi-view flows.
 */
export declare function useIslandNavigation<TView extends string>(initial: TView): IslandNavigation<TView>;
