/**
 * Hook for persisting TurnCard expanded/collapsed state across session switches.
 *
 * Stores expansion state in a single localStorage key as a bounded LRU map
 * (max 100 sessions). Only expanded IDs are stored since collapsed is the default.
 *
 * Shape: { [sessionId]: { turns: string[], groups: string[], lastAccessed: number } }
 */
/**
 * Persist TurnCard expansion state for the given session.
 * Returns controlled state + callbacks to pass to TurnCard components.
 */
export declare function useTurnCardExpansion(sessionId: string | undefined): {
    expandedTurns: Set<string>;
    toggleTurn: (turnId: string, expanded: boolean) => void;
    expandedActivityGroups: Set<string>;
    setExpandedActivityGroups: import("react").Dispatch<import("react").SetStateAction<Set<string>>>;
};
