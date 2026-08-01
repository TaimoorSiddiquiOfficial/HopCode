/**
 * useEntitySelection — Generic atom-backed selection factory.
 *
 * Creates a Jotai atom + hooks for any entity type (sessions, sources, skills).
 * Each call to createEntitySelection() produces an independent atom and hook set.
 *
 * Hooks returned:
 * - useSelection()         — Full action hook (select, toggle, range, clear, etc.)
 * - useSelectionStore()    — Raw { state, setState } for useEntityListInteractions
 * - useIsMultiSelectActive() — Read-only boolean
 * - useSelectedIds()       — Read-only Set<string>
 * - useSelectionCount()    — Read-only number
 */
export declare function createEntitySelection(): {
    useSelection: () => {
        isMultiSelectActive: any;
        selectionCount: any;
        isSelected: (id: string) => any;
        select: (id: string, index: number) => void;
        toggle: (id: string, index: number) => void;
        selectRange: (toIndex: number, items: string[]) => void;
        selectAll: (items: string[]) => void;
        clearMultiSelect: () => void;
        removeFromSelection: (ids: string[]) => void;
        reset: () => void;
        state: any;
    };
    useSelectionStore: () => {
        state: any;
        setState: any;
    };
    useIsMultiSelectActive: () => boolean;
    useSelectedIds: () => Set<string>;
    useSelectionCount: () => number;
};
export declare const sessionSelection: {
    useSelection: () => {
        isMultiSelectActive: any;
        selectionCount: any;
        isSelected: (id: string) => any;
        select: (id: string, index: number) => void;
        toggle: (id: string, index: number) => void;
        selectRange: (toIndex: number, items: string[]) => void;
        selectAll: (items: string[]) => void;
        clearMultiSelect: () => void;
        removeFromSelection: (ids: string[]) => void;
        reset: () => void;
        state: any;
    };
    useSelectionStore: () => {
        state: any;
        setState: any;
    };
    useIsMultiSelectActive: () => boolean;
    useSelectedIds: () => Set<string>;
    useSelectionCount: () => number;
};
export declare const sourceSelection: {
    useSelection: () => {
        isMultiSelectActive: any;
        selectionCount: any;
        isSelected: (id: string) => any;
        select: (id: string, index: number) => void;
        toggle: (id: string, index: number) => void;
        selectRange: (toIndex: number, items: string[]) => void;
        selectAll: (items: string[]) => void;
        clearMultiSelect: () => void;
        removeFromSelection: (ids: string[]) => void;
        reset: () => void;
        state: any;
    };
    useSelectionStore: () => {
        state: any;
        setState: any;
    };
    useIsMultiSelectActive: () => boolean;
    useSelectedIds: () => Set<string>;
    useSelectionCount: () => number;
};
export declare const skillSelection: {
    useSelection: () => {
        isMultiSelectActive: any;
        selectionCount: any;
        isSelected: (id: string) => any;
        select: (id: string, index: number) => void;
        toggle: (id: string, index: number) => void;
        selectRange: (toIndex: number, items: string[]) => void;
        selectAll: (items: string[]) => void;
        clearMultiSelect: () => void;
        removeFromSelection: (ids: string[]) => void;
        reset: () => void;
        state: any;
    };
    useSelectionStore: () => {
        state: any;
        setState: any;
    };
    useIsMultiSelectActive: () => boolean;
    useSelectedIds: () => Set<string>;
    useSelectionCount: () => number;
};
export declare const automationSelection: {
    useSelection: () => {
        isMultiSelectActive: any;
        selectionCount: any;
        isSelected: (id: string) => any;
        select: (id: string, index: number) => void;
        toggle: (id: string, index: number) => void;
        selectRange: (toIndex: number, items: string[]) => void;
        selectAll: (items: string[]) => void;
        clearMultiSelect: () => void;
        removeFromSelection: (ids: string[]) => void;
        reset: () => void;
        state: any;
    };
    useSelectionStore: () => {
        state: any;
        setState: any;
    };
    useIsMultiSelectActive: () => boolean;
    useSelectedIds: () => Set<string>;
    useSelectionCount: () => number;
};
