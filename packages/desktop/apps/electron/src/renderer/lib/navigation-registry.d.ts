/**
 * Navigation Registry
 *
 * Type-safe registry that defines the relationships between navigators and details pages.
 * This ensures compile-time safety: you cannot add a page without registering it here,
 * and the app won't compile if relationships are incomplete.
 *
 * Structure:
 *   Navigator → Details Pages → Components
 *
 * Each navigator has:
 * - A list of valid details page types
 * - A default details page (or null for empty state)
 * - Logic to get the first item for auto-selection
 */
import type { ComponentType } from 'react';
import type { SessionFilter } from '../../shared/types';
/**
 * Props passed to navigator components
 */
export interface NavigatorProps {
    /** Called when a details item is selected */
    onSelectDetails: (detailsType: string, detailsId: string) => void;
    /** Currently selected details */
    selectedDetails?: {
        type: string;
        id: string;
    };
}
/**
 * Props passed to details page components
 */
export interface DetailsProps {
    /** The ID of the selected item */
    id: string;
    /** Additional props specific to the page */
    [key: string]: unknown;
}
/**
 * Context data available for navigation inference
 */
export interface NavigationData {
    /** All sessions in the current filter */
    sessions: Array<{
        id: string;
        isFlagged?: boolean;
        stateId?: string;
    }>;
    /** All sources */
    sources: Array<{
        slug: string;
    }>;
    /** Current session filter (if in sessions mode) */
    sessionFilter?: SessionFilter;
}
/**
 * Configuration for a single navigator
 */
export interface NavigatorConfig<TDetailsPages extends Record<string, ComponentType<DetailsProps>>> {
    /** Display name for the navigator */
    displayName: string;
    /** Valid details page types and their components */
    detailsPages: TDetailsPages;
    /** Default details page when navigating to this navigator (null = allow empty state) */
    defaultDetails: (keyof TDetailsPages & string) | null;
    /** Get the first item ID for auto-selection (returns null if empty) */
    getFirstItem: (context: NavigationData) => string | null;
}
/**
 * All navigator types in the app
 */
export type NavigatorType = 'sessions' | 'sources' | 'settings';
/**
 * Session filter kinds that map to sidebar routes
 */
export type SessionFilterKind = 'allSessions' | 'flagged' | 'state';
/**
 * Metadata that each details page should export
 * This helps with reverse lookups and validation
 */
export interface DetailsPageMeta {
    /** The navigator this page belongs to */
    navigator: NavigatorType;
    /** The slug used in routes */
    slug: string;
}
/**
 * The central navigation registry
 *
 * IMPORTANT: This object defines ALL valid navigation paths in the app.
 * Adding a new page requires:
 * 1. Creating the component
 * 2. Adding it to the appropriate navigator's detailsPages
 * 3. Exporting meta from the component
 */
export declare const NavigationRegistry: {
    readonly sessions: {
        readonly displayName: "Sessions";
        readonly detailsPages: {
            readonly session: import("react").FunctionComponent<DetailsProps>;
        };
        readonly defaultDetails: null;
        readonly getFirstItem: (ctx: NavigationData) => string | null;
    };
    readonly sources: {
        readonly displayName: "Sources";
        readonly detailsPages: {
            readonly source: import("react").FunctionComponent<DetailsProps>;
        };
        readonly defaultDetails: null;
        readonly getFirstItem: (ctx: NavigationData) => string;
    };
    readonly settings: {
        readonly displayName: "Settings";
        readonly detailsPages: {
            readonly app: import("react").FunctionComponent<DetailsProps>;
            readonly ai: import("react").FunctionComponent<DetailsProps>;
            readonly appearance: import("react").FunctionComponent<DetailsProps>;
            readonly input: import("react").FunctionComponent<DetailsProps>;
            readonly workspace: import("react").FunctionComponent<DetailsProps>;
            readonly permissions: import("react").FunctionComponent<DetailsProps>;
            readonly labels: import("react").FunctionComponent<DetailsProps>;
            readonly shortcuts: import("react").FunctionComponent<DetailsProps>;
            readonly preferences: import("react").FunctionComponent<DetailsProps>;
        };
        readonly defaultDetails: "app";
        readonly getFirstItem: () => string;
    };
};
/**
 * Extract details page types for a given navigator
 */
export type DetailsType<N extends NavigatorType> = keyof (typeof NavigationRegistry)[N]['detailsPages'] & string;
/**
 * All possible details types across all navigators
 */
export type AnyDetailsType = DetailsType<'sessions'> | DetailsType<'sources'> | DetailsType<'settings'>;
/**
 * Represents the full navigation state
 */
export type NavigationState = {
    navigator: 'sessions';
    sessionFilter: SessionFilter;
    details: {
        type: 'session';
        id: string;
    } | null;
} | {
    navigator: 'sources';
    details: {
        type: 'source';
        id: string;
    } | null;
} | {
    navigator: 'settings';
    details: {
        type: DetailsType<'settings'>;
        id: string;
    };
};
