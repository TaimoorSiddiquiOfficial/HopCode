export type RestorableTextSelection = {
    start: number;
    end: number;
};
export declare function restoreDomSelectionFromOffsets(root: HTMLElement, start: number, end: number): boolean;
export declare function restoreDomSelection(root: HTMLElement, selection: RestorableTextSelection | null | undefined): boolean;
export declare function clearDomSelection(): void;
export declare function scheduleDomSelectionRestore(rootRef: {
    current: HTMLElement | null;
}, selection: RestorableTextSelection | null | undefined): void;
