/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback, useEffect, useRef } from 'react';
import { MAX_SUGGESTIONS_TO_SHOW } from '../components/SuggestionsDisplay.js';
export function useCompletion(options = {}) {
    const [suggestions, setSuggestions] = useState([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
    const [visibleStartIndex, setVisibleStartIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isPerfectMatch, setIsPerfectMatch] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    // Skip the next clearDismissed call when the query changes due to an
    // accepted suggestion (dismissCompletion).  Accepting a suggestion also
    // mutates the buffer → changes the query, but we don't want to reset
    // dismissed in that case.
    const skipNextClearRef = useRef(false);
    const resetCompletionState = useCallback(() => {
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
        setVisibleStartIndex(0);
        setShowSuggestions(false);
        setIsLoadingSuggestions(false);
        setIsPerfectMatch(false);
        setDismissed(false);
    }, []);
    const dismissCompletion = useCallback(() => {
        resetCompletionState();
        setDismissed(true);
        skipNextClearRef.current = true;
    }, [resetCompletionState]);
    // Clear dismissed flag when the completion query changes (user typed more).
    // Skip the clear on the render immediately following a dismiss, since
    // accepting a suggestion also changes the query.
    const prevQueryRef = useRef(undefined);
    useEffect(() => {
        if (options.query !== prevQueryRef.current) {
            if (skipNextClearRef.current) {
                skipNextClearRef.current = false;
            }
            else {
                setDismissed(false);
            }
            prevQueryRef.current = options.query;
        }
    }, [options.query]);
    const navigateUp = useCallback(() => {
        if (suggestions.length === 0)
            return;
        setActiveSuggestionIndex((prevActiveIndex) => {
            // Calculate new active index, handling wrap-around
            const newActiveIndex = prevActiveIndex <= 0 ? suggestions.length - 1 : prevActiveIndex - 1;
            // Adjust scroll position based on the new active index
            setVisibleStartIndex((prevVisibleStart) => {
                // Case 1: Wrapped around to the last item
                if (newActiveIndex === suggestions.length - 1 &&
                    suggestions.length > MAX_SUGGESTIONS_TO_SHOW) {
                    return Math.max(0, suggestions.length - MAX_SUGGESTIONS_TO_SHOW);
                }
                // Case 2: Scrolled above the current visible window
                if (newActiveIndex < prevVisibleStart) {
                    return newActiveIndex;
                }
                // Otherwise, keep the current scroll position
                return prevVisibleStart;
            });
            return newActiveIndex;
        });
    }, [suggestions.length]);
    const navigateDown = useCallback(() => {
        if (suggestions.length === 0)
            return;
        setActiveSuggestionIndex((prevActiveIndex) => {
            // Calculate new active index, handling wrap-around
            const newActiveIndex = prevActiveIndex >= suggestions.length - 1 ? 0 : prevActiveIndex + 1;
            // Adjust scroll position based on the new active index
            setVisibleStartIndex((prevVisibleStart) => {
                // Case 1: Wrapped around to the first item
                if (newActiveIndex === 0 &&
                    suggestions.length > MAX_SUGGESTIONS_TO_SHOW) {
                    return 0;
                }
                // Case 2: Scrolled below the current visible window
                const visibleEndIndex = prevVisibleStart + MAX_SUGGESTIONS_TO_SHOW;
                if (newActiveIndex >= visibleEndIndex) {
                    return newActiveIndex - MAX_SUGGESTIONS_TO_SHOW + 1;
                }
                // Otherwise, keep the current scroll position
                return prevVisibleStart;
            });
            return newActiveIndex;
        });
    }, [suggestions.length]);
    return {
        suggestions,
        activeSuggestionIndex,
        visibleStartIndex,
        showSuggestions,
        isLoadingSuggestions,
        isPerfectMatch,
        dismissed,
        setSuggestions,
        setShowSuggestions,
        setActiveSuggestionIndex,
        setVisibleStartIndex,
        setIsLoadingSuggestions,
        setIsPerfectMatch,
        resetCompletionState,
        dismissCompletion,
        navigateUp,
        navigateDown,
    };
}
//# sourceMappingURL=useCompletion.js.map