/**
 * Session selection hooks.
 *
 * Re-exports from the generic useEntitySelection factory.
 * The legacy useSession() hook is preserved for backward compatibility.
 */
/**
 * Legacy type alias for backward compatibility
 */
type Config = {
    selected: string | null;
};
/**
 * Legacy hook - maintains backward compatibility with existing code.
 * Returns [{ selected }, setSession] tuple.
 *
 * @deprecated Use useSessionSelection() for full multi-select support
 */
export declare function useSession(): [Config, (config: Config) => void];
export declare const useSessionSelection: any;
export declare const useSessionSelectionStore: any;
export declare const useIsMultiSelectActive: any;
export declare const useSelectedIds: any;
export declare const useSelectionCount: any;
export {};
