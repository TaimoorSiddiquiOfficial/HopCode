export declare function useInputHistory(storageKey?: string, legacyStorageKey?: string | undefined): {
    push: (text: string) => void;
    navigateUp: (currentText: string) => string | null;
    navigateDown: () => string | null;
    isNavigating: () => boolean;
    reset: () => void;
    searchReverse: (query: string) => string | null;
    getReverseMatches: (query: string) => string[];
    getLastEntry: (filter?: (entry: string) => boolean) => string | null;
    resetSearch: () => void;
    nav: {
        canUp: boolean;
        canDown: boolean;
    };
};
