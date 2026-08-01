interface UseAutoGrowOptions {
    /** Minimum height in pixels */
    minHeight?: number;
    /** Maximum height in pixels (optional - unlimited if not set) */
    maxHeight?: number;
}
/**
 * Hook to auto-grow a textarea based on content
 *
 * Usage:
 * ```tsx
 * const { ref, adjustHeight } = useAutoGrow({ minHeight: 72 })
 * <textarea ref={ref} onChange={(e) => { setValue(e.target.value); adjustHeight() }} />
 * ```
 */
export declare function useAutoGrow<T extends HTMLTextAreaElement>({ minHeight, maxHeight, }?: UseAutoGrowOptions): {
    ref: import("react").RefObject<T | null>;
    adjustHeight: () => void;
};
export {};
