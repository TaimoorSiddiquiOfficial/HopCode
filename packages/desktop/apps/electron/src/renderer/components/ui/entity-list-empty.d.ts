/**
 * EntityListEmptyScreen — Unified empty state for entity lists.
 *
 * Wraps the Empty primitives into a single configurable component
 * used by SessionList, SourcesListPanel, and SkillsListPanel.
 */
import * as React from 'react';
import { type DocFeature } from '@craft-agent/shared/docs/doc-links';
export interface EntityListEmptyScreenProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    /** Auto-renders a "Learn more" button linking to this doc key */
    docKey?: DocFeature;
    /** Extra action buttons rendered after "Learn more" */
    children?: React.ReactNode;
    className?: string;
}
export declare function EntityListEmptyScreen({ icon, title, description, docKey, children, className, }: EntityListEmptyScreenProps): React.JSX.Element;
