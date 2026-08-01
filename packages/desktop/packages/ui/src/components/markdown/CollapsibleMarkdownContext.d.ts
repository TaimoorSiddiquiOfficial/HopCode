import * as React from 'react';
interface CollapsibleMarkdownContextValue {
    /** Set of section IDs that are currently collapsed */
    collapsedSections: Set<string>;
    /** Toggle a section's collapsed state */
    toggleSection: (sectionId: string) => void;
    /** Expand all sections */
    expandAll: () => void;
}
/**
 * Hook to access collapsible markdown context.
 * Returns null if not within a provider (for non-collapsible mode).
 */
export declare function useCollapsibleMarkdown(): CollapsibleMarkdownContextValue | null;
interface CollapsibleMarkdownProviderProps {
    children: React.ReactNode;
}
/**
 * CollapsibleMarkdownProvider
 *
 * Provides state management for collapsible markdown sections.
 * All sections start expanded (empty collapsed set).
 */
export declare function CollapsibleMarkdownProvider({ children }: CollapsibleMarkdownProviderProps): React.JSX.Element;
export {};
