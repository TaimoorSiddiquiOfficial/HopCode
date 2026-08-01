import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { memo, useCallback, useMemo } from 'react';
import { Box, Text } from 'ink';
import { createDebugLogger } from '@hoptrendy/hopcode-core';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { theme } from '../semantic-colors.js';
import { t } from '../../i18n/index.js';
import { AlternateScreen } from './AlternateScreen.js';
import { HistoryItemDisplay } from './HistoryItemDisplay.js';
import { ErrorBoundary } from './shared/ErrorBoundary.js';
import { ScrollableList, SCROLL_TO_ITEM_END } from './shared/ScrollableList.js';
import { sanitizeTerminalText } from '../utils/textUtils.js';
import { OverflowProvider } from '../contexts/OverflowContext.js';
const debugLogger = createDebugLogger('TRANSCRIPT_VIEW');
// Per-item virtual-scroll height estimate. The transcript renders every item
// with `fullDetail` (thinking full text, full tool output), so each item is
// far taller than MainContent's flat `() => 3`. A type-aware estimate keeps the
// scrollbar / PageUp-PageDown jump distances sane; VirtualizedList back-fills the
// real measured height once an item is rendered.
function estimateTranscriptItemHeight(item) {
    switch (item.type) {
        case 'gemini_thought':
        case 'gemini_thought_content':
            return 12;
        case 'tool_group':
            return 16;
        case 'gemini':
        case 'gemini_content':
            return 8;
        case 'user':
        case 'user_shell':
            return 2;
        default:
            return 4;
    }
}
const keyExtractor = (item) => item.id >= 0 ? `t-${item.id}` : `tp-${-item.id - 1}`;
const TranscriptViewImpl = ({ items, useAlternateScreen = true, }) => {
    const { rows, columns } = useTerminalSize();
    const headerHeight = 1;
    const footerHeight = 1;
    const contentHeight = Math.max(rows - headerHeight - footerHeight, 1);
    const estimatedItemHeight = useCallback((index) => estimateTranscriptItemHeight(items[index]), [items]);
    const renderItem = useCallback(({ item }) => (_jsx(HistoryItemDisplay, { item: item, isPending: false, terminalWidth: columns, fullDetail: true })), [columns]);
    const title = t('Transcript');
    // Close keys (Esc / q / Ctrl+C / Ctrl+O) are owned exclusively by
    // AppContainer's global keypress guard so a single broadcast keypress isn't
    // handled twice — TranscriptView renders no close handler of its own.
    const content = useMemo(() => (_jsx(OverflowProvider, { children: _jsx(ScrollableList, { hasFocus: true, data: items, renderItem: renderItem, estimatedItemHeight: estimatedItemHeight, keyExtractor: keyExtractor, initialScrollIndex: SCROLL_TO_ITEM_END, containerHeight: contentHeight }) })), [items, renderItem, estimatedItemHeight, contentHeight]);
    // fullDetail rendering exercises paths the normal view never hits (forced
    // thinking expansion, every tool group expanded, full result blocks). An
    // unexpected item shape would otherwise throw uncaught and crash the CLI, so
    // contain it: show a fallback and let the user press Esc/q to close.
    const errorFallback = useCallback((error) => (_jsxs(Box, { flexDirection: "column", paddingX: 1, children: [_jsx(Text, { color: theme.status.error, bold: true, children: t('Failed to render transcript.') }), _jsx(Text, { color: theme.text.secondary, children: sanitizeTerminalText(error.message) }), _jsxs(Text, { dimColor: true, italic: true, children: ["Esc/q ", t('to close')] })] })), []);
    // Log caught render errors to the debug channel — the on-screen fallback is
    // user-facing, but the fullDetail paths exercise rendering the normal view
    // never hits, so a swallowed error must still leave a diagnostic trail.
    const onRenderError = useCallback((error, info) => {
        debugLogger.error(`render error: ${error.message}`, info.componentStack ?? '');
    }, []);
    return (_jsx(AlternateScreen, { disabled: !useAlternateScreen, children: _jsxs(Box, { flexDirection: "column", height: rows, width: columns, children: [_jsx(Box, { children: _jsx(Text, { color: theme.text.accent, bold: true, children: title }) }), _jsx(Box, { flexDirection: "column", flexGrow: 1, children: _jsx(ErrorBoundary, { fallback: errorFallback, onError: onRenderError, children: content }) }), _jsx(Box, { justifyContent: "center", children: _jsxs(Text, { dimColor: true, italic: true, children: ["Esc/q ", t('to close'), " ", '  ', "Shift+\u2191\u2193 ", t('to scroll'), " ", '  ', "PgUp/PgDn", '  ', "Ctrl+Home/End"] }) })] }) }));
};
/**
 * Memoized so the frozen transcript doesn't re-reconcile on every AppContainer
 * re-render while streaming continues underneath. AppContainer hands a stable
 * `items` reference (memoized from the freeze snapshot), so the default shallow
 * prop compare is enough.
 */
export const TranscriptView = memo(TranscriptViewImpl);
TranscriptView.displayName = 'TranscriptView';
//# sourceMappingURL=TranscriptView.js.map