/**
 * EntityPanel<T> — Config-driven entity list with built-in keyboard nav + multi-select.
 *
 * Wraps EntityList + EntityRow + useEntityListInteractions so consumers
 * only provide a data mapping via `mapItem`.
 */
import * as React from 'react';
import { type EntityListGroup } from './entity-list';
import type { createEntitySelection } from '@/hooks/useEntitySelection';
export interface EntityPanelItem {
    icon?: React.ReactNode;
    title: React.ReactNode;
    badges?: React.ReactNode;
    trailing?: React.ReactNode;
    controls?: React.ReactNode;
    menu?: React.ReactNode;
    hideMoreButton?: boolean;
    dataAttributes?: Record<string, string | undefined>;
}
export interface EntityPanelProps<T> {
    items: T[];
    groups?: EntityListGroup<T>[];
    getId: (item: T) => string;
    mapItem: (item: T) => EntityPanelItem;
    selection: ReturnType<typeof createEntitySelection>;
    onItemClick: (item: T) => void;
    selectedId?: string | null;
    emptyState?: React.ReactNode;
    className?: string;
}
export declare function EntityPanel<T>({ items, groups, getId, mapItem, selection, onItemClick, selectedId, emptyState, className, }: EntityPanelProps<T>): React.JSX.Element;
