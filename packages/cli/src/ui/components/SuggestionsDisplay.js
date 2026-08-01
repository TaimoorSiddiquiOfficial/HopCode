import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useRef } from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { RowMouseController } from './shared/RowMouseController.js';
import { PrepareLabel, MAX_WIDTH } from './PrepareLabel.js';
import { Colors } from '../colors.js';
import { t } from '../../i18n/index.js';
import { MAX_SUGGESTIONS_TO_SHOW, } from '../utils/suggestions.js';
export { MAX_SUGGESTIONS_TO_SHOW } from '../utils/suggestions.js';
export { MAX_WIDTH };
/**
 * In @-mention mode a wide resource-reference column must still leave the row's
 * description at least this many columns, so an unusually long reference can't
 * shrink the description away entirely.
 */
const MIN_DESCRIPTION_WIDTH = 12;
const ACTIVE_MARKER_WIDTH = 2;
/**
 * Collapse all runs of whitespace (including newlines from multi-line
 * SKILL.md/command descriptions) into single spaces so a description renders
 * as a single logical line. Without this, frontmatter line breaks are
 * preserved verbatim and a single long description can fill the whole terminal.
 */
export function normalizeDescription(description) {
    return description.replace(/\s+/g, ' ').trim();
}
export function SuggestionsDisplay({ suggestions, activeIndex, isLoading, width, scrollOffset, userInput, mode, expandedIndex, onHoverIndex, onSelectIndex, mouseEnabled, }) {
    const containerRef = useRef(null);
    const itemRefs = useRef([]);
    if (isLoading) {
        return (_jsx(Box, { width: width, children: _jsx(Text, { color: "gray", children: t('Loading suggestions...') }) }));
    }
    if (suggestions.length === 0) {
        return null; // Don't render anything if there are no suggestions
    }
    // Calculate the visible slice based on scrollOffset
    const startIndex = scrollOffset;
    const endIndex = Math.min(scrollOffset + MAX_SUGGESTIONS_TO_SHOW, suggestions.length);
    const visibleSuggestions = suggestions.slice(startIndex, endIndex);
    const getFullLabel = (s) => [s.label, s.argumentHint, s.sourceBadge].filter(Boolean).join(' ');
    const maxLabelLength = Math.max(...suggestions.map((s) => getFullLabel(s).length));
    // Width of the left label column. In slash mode every row shares one
    // half-width command column. In @-mention (reverse) mode only rows WITH a
    // description (MCP resources/servers) share a column — sized to the longest
    // such reference so the references stay intact and their descriptions line
    // up, capped so the description keeps a minimum readable width — while plain
    // file rows (no description) keep the full row width. The reference takes
    // priority over its description, which truncates.
    const describedLabelLengths = suggestions
        .filter((s) => s.description)
        .map((s) => getFullLabel(s).length);
    const contentWidth = Math.max(width - ACTIVE_MARKER_WIDTH, 1);
    const labelColumnWidth = mode === 'slash'
        ? Math.min(maxLabelLength, Math.floor(contentWidth * 0.5))
        : describedLabelLengths.length > 0
            ? Math.min(Math.max(...describedLabelLengths), Math.max(contentWidth - MIN_DESCRIPTION_WIDTH - 2, 1))
            : 0;
    return (_jsxs(Box, { flexDirection: "column", width: width, ref: containerRef, children: [mouseEnabled && onHoverIndex && onSelectIndex && (_jsx(RowMouseController, { containerRef: containerRef, itemRefs: itemRefs, scrollOffset: startIndex, onHoverIndex: onHoverIndex, onSelectIndex: onSelectIndex })), scrollOffset > 0 && _jsx(Text, { color: theme.text.primary, children: "\u25B2" }), visibleSuggestions.map((suggestion, index) => {
                const originalIndex = startIndex + index;
                const isActive = originalIndex === activeIndex;
                const isExpanded = originalIndex === expandedIndex;
                const textColor = isActive ? theme.text.accent : theme.text.secondary;
                const displayLabel = suggestion.label ?? suggestion.value;
                const isLong = displayLabel.length >= MAX_WIDTH;
                const expansionIndicatorWidth = isActive && isLong ? 3 : 0;
                const descriptionColumnWidth = Math.max(contentWidth - labelColumnWidth - 2 - expansionIndicatorWidth, 1);
                const labelElement = (_jsx(PrepareLabel, { label: displayLabel, matchedIndex: suggestion.matchedIndex, userInput: userInput, textColor: textColor, isExpanded: isExpanded }));
                return (_jsxs(Box, { flexDirection: "row", ref: (node) => {
                        itemRefs.current[index] = node;
                    }, children: [_jsx(Box, { width: ACTIVE_MARKER_WIDTH, flexShrink: 0, children: _jsx(Text, { color: textColor, children: isActive ? '> ' : '  ' }) }), _jsx(Box, { ...(mode === 'slash' || suggestion.description
                                ? { width: labelColumnWidth, flexShrink: 0 }
                                : { flexShrink: 1 }), children: _jsxs(Box, { children: [labelElement, suggestion.argumentHint && (_jsxs(Text, { color: theme.text.secondary, children: [' ', suggestion.argumentHint] })), suggestion.sourceBadge && (_jsxs(Text, { color: textColor, children: [" ", suggestion.sourceBadge] }))] }) }), suggestion.description && (_jsx(Box, { width: descriptionColumnWidth, flexGrow: 1, flexShrink: 1, paddingLeft: 2, children: _jsx(Text, { color: textColor, wrap: "truncate-end", children: normalizeDescription(suggestion.description) }) })), isActive && isLong && (_jsx(Box, { children: _jsx(Text, { color: Colors.Gray, children: isExpanded ? ' ← ' : ' → ' }) }))] }, `${suggestion.value}-${originalIndex}`));
            }), endIndex < suggestions.length && _jsx(Text, { color: "gray", children: "\u25BC" }), suggestions.length > MAX_SUGGESTIONS_TO_SHOW && (_jsxs(Text, { color: "gray", children: ["(", activeIndex + 1, "/", suggestions.length, ")"] }))] }));
}
//# sourceMappingURL=SuggestionsDisplay.js.map