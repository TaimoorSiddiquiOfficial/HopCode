import * as React from 'react';
interface CollapsibleSectionProps {
    sectionId: string;
    headingLevel: number;
    isCollapsed: boolean;
    onToggle: (sectionId: string) => void;
    children: React.ReactNode;
}
/**
 * CollapsibleSection
 *
 * Renders a markdown section with a collapsible heading.
 * - First child is the heading (rendered as trigger)
 * - Remaining children are the content (collapsible)
 * - Chevron appears on hover, rotates when expanded
 * - Only H1-H4 are collapsible; H5-H6 render normally
 */
export declare function CollapsibleSection({ sectionId, headingLevel, isCollapsed, onToggle, children, }: CollapsibleSectionProps): React.JSX.Element;
export {};
