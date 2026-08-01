import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import stringWidth from 'string-width';
import { MarkdownDisplay, } from '../../utils/MarkdownDisplay.js';
import { theme } from '../../semantic-colors.js';
import { SCREEN_READER_MODEL_PREFIX, SCREEN_READER_USER_PREFIX, } from '../../textConstants.js';
import { t } from '../../../i18n/index.js';
import { wrapToVisualLines } from '../../utils/textUtils.js';
import { formatDuration } from '../../utils/displayUtils.js';
export const THINKING_ICON = '∴ ';
export const THINKING_ICON_PENDING = '∵ ';
export const toggleKeyHint = process.platform === 'darwin' ? 'option+t' : 'alt+t';
function getPrefixWidth(prefix) {
    // Reserve one extra column so text never touches the prefix glyph.
    return stringWidth(prefix) + 1;
}
const PrefixedTextMessage = ({ text, prefix, prefixColor, textColor, ariaLabel, marginTop = 0, alignSelf, }) => {
    const prefixWidth = getPrefixWidth(prefix);
    return (_jsxs(Box, { flexDirection: "row", paddingY: 0, marginTop: marginTop, alignSelf: alignSelf, children: [_jsx(Box, { width: prefixWidth, children: _jsx(Text, { color: prefixColor, "aria-label": ariaLabel, children: prefix }) }), _jsx(Box, { flexGrow: 1, children: _jsx(Text, { wrap: "wrap", color: textColor, children: text }) })] }));
};
const PrefixedMarkdownMessage = ({ text, prefix, prefixColor, isPending, availableTerminalHeight, contentWidth, ariaLabel, textColor, sourceCopyIndexOffsets, }) => {
    const prefixWidth = getPrefixWidth(prefix);
    return (_jsxs(Box, { flexDirection: "row", children: [_jsx(Box, { width: prefixWidth, children: _jsx(Text, { color: prefixColor, "aria-label": ariaLabel, children: prefix }) }), _jsx(Box, { flexGrow: 1, flexDirection: "column", children: _jsx(MarkdownDisplay, { text: text, isPending: isPending, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth - prefixWidth, textColor: textColor, sourceCopyIndexOffsets: sourceCopyIndexOffsets }) })] }));
};
const ContinuationMarkdownMessage = ({ text, isPending, availableTerminalHeight, contentWidth, basePrefix, textColor, sourceCopyIndexOffsets, }) => {
    const prefixWidth = getPrefixWidth(basePrefix);
    return (_jsx(Box, { flexDirection: "column", paddingLeft: prefixWidth, children: _jsx(MarkdownDisplay, { text: text, isPending: isPending, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth - prefixWidth, textColor: textColor, sourceCopyIndexOffsets: sourceCopyIndexOffsets }) }));
};
export const UserMessage = ({ text }) => (_jsx(PrefixedTextMessage, { text: text, prefix: ">", prefixColor: theme.text.accent, textColor: theme.text.accent, ariaLabel: SCREEN_READER_USER_PREFIX, alignSelf: "flex-start", marginTop: 1 }));
export const UserShellMessage = ({ text }) => {
    const commandToDisplay = text.startsWith('!') ? text.substring(1) : text;
    return (_jsx(PrefixedTextMessage, { text: commandToDisplay, prefix: "$", prefixColor: theme.text.link, textColor: theme.text.primary }));
};
export const AssistantMessage = ({ text, isPending, availableTerminalHeight, contentWidth, sourceCopyIndexOffsets, }) => (_jsx(PrefixedMarkdownMessage, { text: text, prefix: "?", prefixColor: theme.text.accent, ariaLabel: SCREEN_READER_MODEL_PREFIX, isPending: isPending, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth, sourceCopyIndexOffsets: sourceCopyIndexOffsets }));
export const AssistantMessageContent = ({ text, isPending, availableTerminalHeight, contentWidth, sourceCopyIndexOffsets, }) => (_jsx(ContinuationMarkdownMessage, { text: text, isPending: isPending, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth, basePrefix: "?", sourceCopyIndexOffsets: sourceCopyIndexOffsets }));
const MAX_STREAMING_THINKING_VISUAL_LINES = 4;
const BRIEF_THOUGHT_THRESHOLD_MS = 1_000;
function tailVisualLines(text, width, maxLines) {
    const charBudget = maxLines * width * 2;
    let sliceStart = Math.max(0, text.length - charBudget);
    if (sliceStart > 0) {
        const nl = text.indexOf('\n', sliceStart);
        if (nl !== -1 && nl < text.length - 1) {
            sliceStart = nl + 1;
        }
    }
    const lines = wrapToVisualLines(text.slice(sliceStart), width);
    return lines.slice(-maxLines).join('\n');
}
const ThinkBody = ({ text, isPending, expanded, availableTerminalHeight, contentWidth }) => {
    if (!isPending && !expanded)
        return null;
    if (isPending && !expanded) {
        const innerWidth = Math.max(contentWidth - 2, 20);
        const maxLines = availableTerminalHeight != null
            ? Math.max(1, Math.min(MAX_STREAMING_THINKING_VISUAL_LINES, Math.floor(availableTerminalHeight / 3)))
            : MAX_STREAMING_THINKING_VISUAL_LINES;
        const display = tailVisualLines(text, innerWidth, maxLines);
        return (_jsx(Box, { paddingLeft: 2, children: _jsx(Text, { dimColor: true, wrap: "truncate", children: display }) }));
    }
    return (_jsx(Box, { paddingLeft: 2, flexDirection: "column", children: _jsx(MarkdownDisplay, { text: text, isPending: isPending, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth - 2, textColor: theme.text.secondary }) }));
};
export const ThinkMessage = ({ text, isPending, expanded = false, availableTerminalHeight, contentWidth, durationMs, clickable = false, }) => {
    const durationSuffix = durationMs != null ? ` ${formatDuration(durationMs)}` : '';
    const completedLabel = durationMs == null
        ? null
        : durationMs < BRIEF_THOUGHT_THRESHOLD_MS
            ? t('Thought briefly')
            : `${t('Thought for')} ${formatDuration(durationMs)}`;
    if (!isPending && !expanded) {
        const label = completedLabel ?? t('Thinking');
        const hint = clickable
            ? t('(click or {{keyHint}} to expand)', { keyHint: toggleKeyHint })
            : t('({{keyHint}} to expand)', { keyHint: toggleKeyHint });
        return (_jsxs(Text, { dimColor: true, italic: true, children: [THINKING_ICON, label, " ", hint] }));
    }
    const label = isPending
        ? `${t('Thinking')}…${durationSuffix}`
        : (completedLabel ?? `${t('Thinking')}…`);
    const collapseHint = !isPending && expanded
        ? ` ${t('({{keyHint}} to collapse)', { keyHint: toggleKeyHint })}`
        : '';
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { dimColor: true, italic: true, children: [isPending ? THINKING_ICON_PENDING : THINKING_ICON, label, collapseHint] }), _jsx(ThinkBody, { text: text, isPending: isPending, expanded: expanded, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth })] }));
};
export const ThinkMessageContent = ({ text, isPending, expanded = false, availableTerminalHeight, contentWidth, }) => (_jsx(ThinkBody, { text: text, isPending: isPending, expanded: expanded, availableTerminalHeight: availableTerminalHeight, contentWidth: contentWidth }));
//# sourceMappingURL=ConversationMessages.js.map