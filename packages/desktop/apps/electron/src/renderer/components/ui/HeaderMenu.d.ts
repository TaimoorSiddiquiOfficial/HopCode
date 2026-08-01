/**
 * HeaderMenu
 *
 * A "..." dropdown menu for panel headers with built-in Open in New Window action.
 * Pass page-specific menu items as children; they appear above the separator.
 * Optionally includes a "Learn More" link to documentation when helpFeature is provided.
 */
import * as React from 'react';
import { type DocFeature } from '@craft-agent/shared/docs/doc-links';
interface HeaderMenuProps {
    /** Route string for Open in New Window action */
    route: string;
    /** Page-specific menu items (rendered before Open in New Window) */
    children?: React.ReactNode;
    /** Documentation feature - when provided, adds a "Learn More" link to docs */
    helpFeature?: DocFeature;
}
export declare function HeaderMenu({ route, children, helpFeature }: HeaderMenuProps): React.JSX.Element;
export {};
