import * as React from 'react';
/**
 * SessionSearchHeader - Presentational component for session list search UI.
 *
 * Renders:
 * - Search input with static search icon
 * - Status row showing "Loading…" or "{count} results" when query is active
 *
 * This component is shared between the main app (SessionList) and the playground.
 */
export interface SessionSearchHeaderProps {
    /** Current search query value */
    searchQuery: string;
    /** Called when search query changes */
    onSearchChange?: (query: string) => void;
    /** Called when search is closed (X button) */
    onSearchClose?: () => void;
    /** Called on keydown in the search input */
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    /** Called when input gains focus */
    onFocus?: () => void;
    /** Called when input loses focus */
    onBlur?: () => void;
    /** Whether content search is in progress */
    isSearching?: boolean;
    /** Whether the search service is unavailable (e.g. ripgrep not found) */
    isUnavailable?: boolean;
    /** Number of results to display (when not searching) */
    resultCount?: number;
    /** Whether the result count exceeded the display limit (shows "100+" instead of exact count) */
    exceededLimit?: boolean;
    /** Ref for the input element (for focus management) */
    inputRef?: React.RefObject<HTMLInputElement>;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the input is read-only (for playground demos) */
    readOnly?: boolean;
}
export declare function SessionSearchHeader({ searchQuery, onSearchChange, onSearchClose, onKeyDown, onFocus, onBlur, isSearching, isUnavailable, resultCount, exceededLimit, inputRef, placeholder, readOnly, }: SessionSearchHeaderProps): React.JSX.Element;
