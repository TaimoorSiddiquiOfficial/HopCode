/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Suggestion } from '../components/SuggestionsDisplay.js';
export interface UseCompletionOptions {
    /** When the completion query changes, the dismissed flag is cleared
     *  (unless dismissCompletion was just called). */
    query?: string | null;
}
export interface UseCompletionReturn {
    suggestions: Suggestion[];
    activeSuggestionIndex: number;
    visibleStartIndex: number;
    showSuggestions: boolean;
    isLoadingSuggestions: boolean;
    isPerfectMatch: boolean;
    dismissed: boolean;
    setSuggestions: React.Dispatch<React.SetStateAction<Suggestion[]>>;
    setActiveSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
    setVisibleStartIndex: React.Dispatch<React.SetStateAction<number>>;
    setIsLoadingSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    setIsPerfectMatch: React.Dispatch<React.SetStateAction<boolean>>;
    setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
    /** Dismisses the completion dropdown and prevents re-open until query changes. */
    dismissCompletion: () => void;
    resetCompletionState: () => void;
    navigateUp: () => void;
    navigateDown: () => void;
}
export declare function useCompletion(options?: UseCompletionOptions): UseCompletionReturn;
