import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, memo, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useCallback, useMemo, useState, } from 'react';
import { createPortal } from 'react-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { isBackgroundSubAgentToolCall, isSubAgentToolCall, } from '../adapters/toolClassification';
import { CompactModeContext } from '../App';
import { useWebShellCustomization, } from '../customization';
import { useI18n } from '../i18n';
import { useWebShellPortalRoot } from '../portalRoot';
import { MessageItem } from './MessageItem';
import { MessageTimestamp } from './MessageTimestamp';
import { TurnOutputs, } from './artifacts/TurnOutputs';
import { ParallelAgentsGroup } from './messages/tools/ParallelAgentsGroup';
import { useSharedNow } from '../hooks/useSharedNow';
import { toolContainsCallId } from './messages/toolFormatting';
import turnCollapseStyles from './TurnCollapseRow.module.css';
import flashStyles from './MessageLocateFlash.module.css';
import styles from './MessageList.module.css';
const noopTurnOutputAction = () => undefined;
function getLastUserMessageId(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg?.role === 'user')
            return msg.id;
    }
    return null;
}
function getLastMessage(messages) {
    return messages[messages.length - 1];
}
function getLastTurnStartMessageId(messages) {
    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg && isTurnStartMessage(msg))
            return msg.id;
    }
    return null;
}
function isAgentOnlyToolGroup(msg) {
    return (msg.role === 'tool_group' &&
        msg.tools.length === 1 &&
        isSubAgentToolCall(msg.tools[0]));
}
function isBackgroundAgentOnlyToolGroup(msg) {
    return (msg.role === 'tool_group' &&
        msg.tools.length === 1 &&
        isBackgroundSubAgentToolCall(msg.tools[0]));
}
function isBackgroundLaunchNarration(msg) {
    // The daemon often streams short main-agent thought text between background
    // launches, e.g. "agent A is running, now starting agent B". The CLI treats
    // those as internal launch narration and shows a single Parallel agents box.
    // Only skip thought-only messages here; any user-facing assistant content
    // still breaks the group and remains visible.
    return msg.role === 'thinking';
}
function isForceExpandGroup(msg, pendingApproval) {
    if (msg.role !== 'tool_group')
        return false;
    if (pendingApproval?.toolCallId &&
        msg.tools.some((t) => toolContainsCallId(t, pendingApproval.toolCallId)))
        return true;
    return false;
}
function isHiddenInCompactMode(msg) {
    if (msg.role === 'thinking')
        return true;
    return false;
}
function mergeCompactToolGroups(messages, pendingApproval) {
    const result = [];
    let i = 0;
    while (i < messages.length) {
        const msg = messages[i];
        if (msg.role !== 'tool_group' || isForceExpandGroup(msg, pendingApproval)) {
            if (!isHiddenInCompactMode(msg)) {
                result.push(msg);
            }
            i++;
            continue;
        }
        const mergeableGroups = [msg];
        let lastMergedIdx = i;
        let j = i + 1;
        while (j < messages.length) {
            const next = messages[j];
            if (isHiddenInCompactMode(next)) {
                j++;
                continue;
            }
            if (next.role === 'tool_group' &&
                !isForceExpandGroup(next, pendingApproval)) {
                mergeableGroups.push(next);
                lastMergedIdx = j;
                j++;
                continue;
            }
            break;
        }
        if (mergeableGroups.length === 1) {
            result.push(msg);
            i++;
            continue;
        }
        const mergedTools = mergeableGroups.flatMap((g) => g.role === 'tool_group' ? g.tools : []);
        result.push({
            id: mergeableGroups[0].id,
            role: 'tool_group',
            tools: mergedTools,
        });
        i = lastMergedIdx + 1;
    }
    return result;
}
export function groupParallelAgents(messages) {
    const items = [];
    let i = 0;
    while (i < messages.length) {
        if (isBackgroundAgentOnlyToolGroup(messages[i])) {
            const grouped = [];
            let j = i;
            while (j < messages.length) {
                const current = messages[j];
                if (isBackgroundAgentOnlyToolGroup(current)) {
                    grouped.push(current);
                    j++;
                    continue;
                }
                if (isBackgroundLaunchNarration(current)) {
                    let nextAgentIdx = j + 1;
                    while (nextAgentIdx < messages.length &&
                        isBackgroundLaunchNarration(messages[nextAgentIdx])) {
                        nextAgentIdx++;
                    }
                    if (nextAgentIdx < messages.length &&
                        isBackgroundAgentOnlyToolGroup(messages[nextAgentIdx])) {
                        j = nextAgentIdx;
                        continue;
                    }
                }
                break;
            }
            if (grouped.length >= 2) {
                items.push({
                    type: 'parallel_agents',
                    key: `par-${grouped[0].id}`,
                    turnId: grouped[0].id,
                    agents: grouped.map((m) => m.tools[0]),
                    timestamp: grouped[0].timestamp,
                });
                i = j;
                continue;
            }
        }
        if (isAgentOnlyToolGroup(messages[i])) {
            const start = i;
            while (i < messages.length && isAgentOnlyToolGroup(messages[i]))
                i++;
            if (i - start >= 2) {
                const grouped = messages.slice(start, i);
                items.push({
                    type: 'parallel_agents',
                    key: `par-${grouped[0].id}`,
                    turnId: grouped[0].id,
                    agents: grouped.map((m) => m.tools[0]),
                    timestamp: grouped[0].timestamp,
                });
            }
            else {
                items.push({
                    type: 'message',
                    key: messages[start].id,
                    message: messages[start],
                });
            }
        }
        else {
            items.push({
                type: 'message',
                key: messages[i].id,
                message: messages[i],
            });
            i++;
        }
    }
    return items;
}
export function getDisplayItemVirtualKey(item) {
    if (item.type === 'parallel_agents')
        return `group:${item.key}`;
    if (item.type === 'turn_outputs')
        return `outputs:${item.key}`;
    if (item.type === 'turn_collapse') {
        const liveKey = item.turnCollapse.liveStartedAt;
        return liveKey === undefined
            ? `tc:${item.key}`
            : `tc:${item.key}:${liveKey}`;
    }
    if (item.type === 'turn_content')
        return `turn-content:${item.key}`;
    return `msg:${item.key}`;
}
export function attachTurnOutputs(items, isResponding, turnFileChanges, turnArtifacts, turnScheduledTasks) {
    if ((!turnFileChanges || turnFileChanges.size === 0) &&
        (!turnArtifacts || turnArtifacts.size === 0) &&
        (!turnScheduledTasks || turnScheduledTasks.size === 0)) {
        return items;
    }
    const result = [];
    let currentTurnId = null;
    const pushTurnOutputs = (turnId, isFinalTurn) => {
        if (isFinalTurn && isResponding)
            return;
        if (!turnId)
            return;
        const changes = turnFileChanges?.get(turnId) ?? [];
        const artifacts = turnArtifacts?.get(turnId) ?? [];
        const scheduledTasks = turnScheduledTasks?.get(turnId) ?? [];
        if (changes.length === 0 &&
            artifacts.length === 0 &&
            scheduledTasks.length === 0) {
            return;
        }
        result.push({
            type: 'turn_outputs',
            key: turnId,
            turnId,
            changes,
            artifacts,
            scheduledTasks,
        });
    };
    for (const item of items) {
        if (item.type === 'message' && isTurnStartMessage(item.message)) {
            pushTurnOutputs(currentTurnId, false);
            currentTurnId = item.message.id;
        }
        else if (!currentTurnId && item.type === 'message') {
            currentTurnId = item.message.id;
        }
        else if (!currentTurnId && item.type === 'parallel_agents') {
            currentTurnId = item.turnId;
        }
        result.push(item);
    }
    pushTurnOutputs(currentTurnId, true);
    return result;
}
function isAssistantAnswer(item) {
    return (item.type === 'message' &&
        item.message.role === 'assistant' &&
        // `content` is typed `string`, but daemon SSE text can be undefined at
        // runtime (transcriptToMessages copies `textBlock.text` through). Guard it:
        // `applyTurnCollapse` runs in render, so a bare `.trim()` would blank the
        // whole transcript.
        !!item.message.content &&
        item.message.content.trim().length > 0);
}
function findFinalAnswerIndex(items, start, end) {
    let lastWorkStepIndex = start;
    for (let i = end; i > start; i--) {
        if (isExecutionWorkStep(items[i])) {
            lastWorkStepIndex = i;
            break;
        }
    }
    for (let i = end; i > lastWorkStepIndex; i--) {
        if (isAssistantAnswer(items[i]))
            return i;
    }
    return -1;
}
function collectFinalAssistantTurnIds(items, isResponding) {
    const userIdxs = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'message' && isTurnStartMessage(item.message)) {
            userIdxs.push(i);
        }
    }
    const turnIdByAssistantId = new Map();
    for (let k = 0; k < userIdxs.length; k++) {
        if (k === userIdxs.length - 1 && isResponding)
            continue;
        const start = userIdxs[k];
        const end = (k + 1 < userIdxs.length ? userIdxs[k + 1] : items.length) - 1;
        const turnHead = items[start];
        const answerIdx = findFinalAnswerIndex(items, start, end);
        if (answerIdx < 0)
            continue;
        const item = items[answerIdx];
        if (turnHead?.type === 'message' &&
            item.type === 'message' &&
            item.message.role === 'assistant') {
            turnIdByAssistantId.set(item.message.id, turnHead.message.id);
        }
    }
    return turnIdByAssistantId;
}
/**
 * A turn's hideable "steps": tool activity, plans, and mid-turn assistant text.
 * The final answer and any system/shell/insight rows (errors, cancellations,
 * command output) are kept visible even when the turn is collapsed.
 */
function isHideableStep(item, isFinalAnswer) {
    if (item.type === 'parallel_agents')
        return true;
    if (item.type === 'turn_outputs')
        return false;
    if (item.type === 'turn_collapse')
        return false;
    if (item.type === 'turn_content') {
        return item.items.some((child) => isHideableStep(child, isFinalAnswer));
    }
    switch (item.message.role) {
        case 'tool_group':
        case 'plan':
            return true;
        case 'assistant':
            return !isFinalAnswer;
        case 'thinking':
            return true;
        case 'system':
            return isMidTurnInjectedDebugMessage(item.message);
        case 'user':
        case 'user_shell':
        case 'btw':
        case 'insight_progress':
        case 'insight_ready':
        case 'insight_error':
            return false;
        default: {
            // Compile-time exhaustiveness: a newly added DaemonMessage role fails to
            // assign to `never` here. At runtime (e.g. a newer daemon sending an
            // unknown role) it falls through as not-hideable — kept visible rather
            // than crashing the transcript or vanishing from a collapsed turn.
            const _exhaustive = item.message;
            return false;
        }
    }
}
function isMidTurnInjectedDebugMessage(message) {
    return (message.source === 'mid_turn_message_injected' ||
        message.content?.startsWith('mid_turn_message_injected (unrecognized daemon event):') === true);
}
export function getTurnTimelineNode(item, t) {
    if (item.type === 'parallel_agents') {
        return {
            kind: 'agents',
            timestamp: item.timestamp,
            label: t ? t('timeline.parallelAgents') : 'Parallel agents',
        };
    }
    if (item.type === 'turn_outputs')
        return { kind: 'none' };
    if (item.type !== 'message')
        return { kind: 'none' };
    const { message } = item;
    switch (message.role) {
        case 'thinking':
            return {
                kind: 'thought',
                timestamp: message.timestamp,
                label: t ? t('timeline.thinking') : 'Thinking',
            };
        case 'assistant':
            if (item.turnCollapse)
                return { kind: 'none', timestamp: message.timestamp };
            if (!compactTimelineText(message.content, 1))
                return { kind: 'none', timestamp: message.timestamp };
            return {
                kind: 'commentary',
                timestamp: message.timestamp,
                label: t ? t('timeline.assistantUpdate') : 'Assistant update',
            };
        case 'tool_group': {
            const count = message.tools.length;
            return {
                kind: 'tool',
                timestamp: message.timestamp,
                label: t
                    ? t('timeline.toolCalls', { count })
                    : `${count} tool call${count === 1 ? '' : 's'}`,
            };
        }
        case 'plan':
            return {
                kind: 'plan',
                timestamp: message.timestamp,
                label: t ? t('timeline.planUpdate') : 'Plan update',
            };
        case 'system':
            return isMidTurnInjectedDebugMessage(message)
                ? {
                    kind: 'status',
                    timestamp: message.timestamp,
                    label: t ? t('timeline.statusUpdate') : 'Status update',
                }
                : { kind: 'none', timestamp: message.timestamp };
        case 'user':
        case 'user_shell':
        case 'btw':
        case 'insight_progress':
        case 'insight_ready':
        case 'insight_error':
            return { kind: 'none', timestamp: message.timestamp };
        default: {
            const _exhaustive = message;
            return { kind: 'none' };
        }
    }
}
function compactTimelineText(raw, maxLength, options = {}) {
    const source = options.stripMarkdown === true ? cleanTimelineMarkdown(raw) : (raw ?? '');
    const compact = source.replace(/\s+/g, ' ').trim();
    if (maxLength <= 0)
        return '';
    if (!compact)
        return '';
    const chars = Array.from(compact);
    return chars.length > maxLength
        ? `${chars.slice(0, maxLength - 1).join('')}…`
        : compact;
}
function cleanTimelineMarkdown(raw) {
    if (!raw)
        return '';
    const inlinePlaceholders = [];
    const stashInline = (value) => {
        const key = `\u0000${inlinePlaceholders.length}\u0000`;
        inlinePlaceholders.push(value);
        return key;
    };
    let cleaned = raw
        .replace(/```[^\n`]*\n?([\s\S]*?)```/g, (_match, code) => stashInline(code))
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`([^`\n]+)`/g, (_match, code) => stashInline(code))
        .replace(/^\s{0,3}#{1,6}\s+/gm, '')
        .replace(/^\s{0,3}>\s?/gm, '')
        .replace(/^\s*[-*+]\s+/gm, '');
    cleaned = stripBalancedTimelineMarker(cleaned, '~~');
    cleaned = stripBalancedTimelineMarker(cleaned, '**');
    cleaned = stripBalancedTimelineMarker(cleaned, '__');
    cleaned = cleaned
        .replace(/\*([^*\s][^*]*?\S)\*/g, '$1')
        .replace(/(^|[^\p{L}\p{N}_])_([^_\s][^_]*?\S)_(?=$|[^\p{L}\p{N}_])/gu, '$1$2');
    for (const [index, value] of inlinePlaceholders.entries()) {
        cleaned = cleaned.split(`\u0000${index}\u0000`).join(value);
    }
    return cleaned;
}
function stripBalancedTimelineMarker(raw, marker) {
    let result = '';
    let index = 0;
    while (index < raw.length) {
        const start = raw.indexOf(marker, index);
        if (start === -1)
            return result + raw.slice(index);
        const contentStart = start + marker.length;
        const end = raw.indexOf(marker, contentStart);
        if (end === -1)
            return result + raw.slice(index);
        const content = raw.slice(contentStart, end);
        result +=
            content.trim().length === 0
                ? raw.slice(index, end + marker.length)
                : raw.slice(index, start) + content;
        index = end + marker.length;
    }
    return result;
}
function timelineLabelForTurn(message, t) {
    const raw = message.role === 'user'
        ? message.content
        : message.role === 'user_shell'
            ? message.command
            : '';
    const compact = compactTimelineText(raw, 32);
    if (!compact)
        return t ? t('timeline.userTurn') : 'User turn';
    return compact;
}
function isScheduledTaskMessage(message) {
    return (message.role === 'user' &&
        (message.source === 'cron' || message.source === 'loop'));
}
// Collapse and timeline turns start at chat prompts and shell prompts; new-chat
// auto-follow still uses getLastUserMessageId so shell prompts do not jump.
function isTurnStartMessage(message) {
    return message.role === 'user' || message.role === 'user_shell';
}
function timelineDetailSnippetForMessage(message, t) {
    switch (message.role) {
        case 'thinking':
            // Thinking content may include private model reasoning; keep details label-only.
            return t ? t('timeline.kind.thought') : 'thinking';
        case 'assistant':
            return compactTimelineText(message.content, 120, { stripMarkdown: true });
        case 'tool_group': {
            const count = message.tools.length;
            return t
                ? t('timeline.toolCalls', { count })
                : `${count} tool call${count === 1 ? '' : 's'}`;
        }
        case 'plan':
            return t ? t('timeline.planDetail') : 'plan update';
        case 'system':
            return isMidTurnInjectedDebugMessage(message)
                ? compactTimelineText(message.content, 120, { stripMarkdown: true })
                : '';
        case 'user':
        case 'user_shell':
        case 'btw':
        case 'insight_progress':
        case 'insight_ready':
        case 'insight_error':
            return '';
        default: {
            const _exhaustive = message;
            return '';
        }
    }
}
function timelineDetailSnippetForItem(item, t) {
    if (item.type === 'parallel_agents') {
        const count = item.agents.length;
        return t
            ? t('timeline.parallelAgentsDetail', { count })
            : `${count} parallel agent${count === 1 ? '' : 's'}`;
    }
    if (item.type === 'turn_outputs')
        return '';
    if (item.type !== 'message')
        return '';
    return timelineDetailSnippetForMessage(item.message, t);
}
function getKindLabel(kind, t) {
    if (!t)
        return SESSION_TIMELINE_KIND_LABEL[kind];
    return t(`timeline.kind.${kind}`);
}
function timelineDetailForTurn(turnItems, finalAssistantId, nodeKinds, t) {
    if (finalAssistantId !== null) {
        for (const item of turnItems) {
            if (item.type !== 'message')
                continue;
            const { message } = item;
            if (message.id !== finalAssistantId || message.role !== 'assistant') {
                continue;
            }
            const finalAnswerDetail = compactTimelineText(message.content, 180, {
                stripMarkdown: true,
            });
            if (finalAnswerDetail)
                return finalAnswerDetail;
        }
    }
    const snippets = [];
    for (let i = 0; i < turnItems.length; i += 1) {
        const item = turnItems[i];
        if (item.type === 'message' &&
            finalAssistantId !== null &&
            item.message.id === finalAssistantId) {
            continue;
        }
        const snippet = timelineDetailSnippetForItem(item, t);
        if (snippet)
            snippets.push(snippet);
    }
    const detail = compactTimelineText(snippets.join(' · '), 180);
    if (detail)
        return detail;
    if (nodeKinds.length > 0) {
        return nodeKinds.map((kind) => getKindLabel(kind, t)).join(' · ');
    }
    return t ? t('timeline.noActivity') : 'No activity';
}
export function getSessionTimelineEntries(messages, t) {
    const entries = [];
    let turnStart = null;
    let turnItems = [];
    const pushTurn = () => {
        if (!turnStart)
            return;
        const timelineItems = groupParallelAgents(turnItems);
        const finalAssistantIndex = findFinalAnswerIndex(timelineItems, -1, timelineItems.length - 1);
        const finalAssistantItem = finalAssistantIndex >= 0 ? timelineItems[finalAssistantIndex] : null;
        const finalAssistantId = finalAssistantItem?.type === 'message' &&
            finalAssistantItem.message.role === 'assistant' &&
            !finalAssistantItem.message.isStreaming &&
            compactTimelineText(finalAssistantItem.message.content, 1, {
                stripMarkdown: true,
            }).length > 0
            ? finalAssistantItem.message.id
            : null;
        const nodeKinds = [];
        for (const item of timelineItems) {
            if (item.type === 'message' &&
                finalAssistantId !== null &&
                item.message.id === finalAssistantId) {
                continue;
            }
            const node = getTurnTimelineNode(item, t);
            if (node.kind !== 'none' && !nodeKinds.includes(node.kind)) {
                nodeKinds.push(node.kind);
            }
        }
        entries.push({
            id: turnStart.id,
            label: timelineLabelForTurn(turnStart, t),
            detail: timelineDetailForTurn(timelineItems, finalAssistantId, nodeKinds, t),
            timestamp: turnStart.timestamp,
            nodeKinds,
            ...(isScheduledTaskMessage(turnStart) ? { isScheduledTask: true } : {}),
        });
    };
    for (const message of messages) {
        if (isTurnStartMessage(message)) {
            pushTurn();
            turnStart = message;
            turnItems = [];
            continue;
        }
        if (turnStart) {
            turnItems.push(message);
        }
    }
    pushTurn();
    return entries;
}
function TimelineClockIcon() {
    return (_jsxs("svg", { className: styles.sessionTimelineDetailsIcon, viewBox: "0 0 16 16", "aria-hidden": "true", focusable: "false", children: [_jsx("circle", { cx: "8", cy: "8", r: "6.25" }), _jsx("path", { d: "M8 4.5v4l-2.5 2" })] }));
}
function toolTimelineSignature(tool) {
    const rawOutput = tool.rawOutput && typeof tool.rawOutput === 'object'
        ? tool.rawOutput
        : undefined;
    return [
        tool.callId,
        tool.toolName,
        tool.kind ?? '',
        tool.status,
        tool.parentToolCallId ?? '',
        tool.subContent ? 'sub-content' : '',
        tool.subTools?.length ?? 0,
        String(tool.args?.subagent_type ?? ''),
        tool.args?.run_in_background === true ? 'background' : '',
        String(rawOutput?.['type'] ?? ''),
        String(rawOutput?.['status'] ?? ''),
    ].join(':');
}
export function getSessionTimelineSignature(messages) {
    return messages
        .map((message) => {
        const base = `${message.id}:${message.role}:${message.timestamp ?? ''}`;
        switch (message.role) {
            case 'assistant':
            case 'thinking':
                return `${base}:${message.isStreaming ? 'streaming' : message.content}`;
            case 'tool_group':
                return `${base}:${message.tools.map(toolTimelineSignature).join(',')}`;
            case 'system':
                return `${base}:${message.variant}:${message.source ?? ''}:${message.content}`;
            case 'user':
                return `${base}:${message.content}`;
            case 'user_shell':
                return `${base}:${message.command}`;
            case 'plan':
            case 'btw':
            case 'insight_progress':
            case 'insight_ready':
            case 'insight_error':
                return base;
            default: {
                const _exhaustive = message;
                return base;
            }
        }
    })
        .join('|');
}
function isExecutionWorkStep(item) {
    if (item.type === 'parallel_agents')
        return true;
    if (item.type === 'turn_outputs')
        return false;
    if (item.type === 'turn_collapse')
        return false;
    if (item.type === 'turn_content')
        return item.items.some(isExecutionWorkStep);
    return item.message.role === 'tool_group' || item.message.role === 'plan';
}
function isActiveToolStatus(status) {
    return (status === 'pending' || status === 'running' || status === 'in_progress');
}
function activeExecutionKey(item) {
    if (item.type === 'turn_content') {
        for (let i = item.items.length - 1; i >= 0; i--) {
            const key = activeExecutionKey(item.items[i]);
            if (key)
                return key;
        }
        return null;
    }
    if (item.type === 'turn_outputs')
        return null;
    if (item.type === 'turn_collapse') {
        if (item.turnCollapse.liveStartedAt === undefined)
            return null;
        if (item.turnCollapse.toolCallCount === undefined ||
            item.turnCollapse.toolCallCount <= 0) {
            return null;
        }
        return `turn:${item.turnCollapse.turnId}:${item.turnCollapse.toolCallCount}`;
    }
    if (item.type === 'parallel_agents') {
        const activeAgents = item.agents.filter((agent) => isActiveToolStatus(agent.status));
        if (activeAgents.length === 0)
            return null;
        return `agents:${item.key}:${activeAgents.map((agent) => agent.callId).join(',')}`;
    }
    if (item.message.role !== 'tool_group')
        return null;
    const activeTools = item.message.tools.filter((tool) => isActiveToolStatus(tool.status));
    if (activeTools.length === 0)
        return null;
    return `tools:${item.message.id}:${activeTools.map((tool) => tool.callId).join(',')}`;
}
function latestActiveExecutionKey(items) {
    for (let i = items.length - 1; i >= 0; i--) {
        const key = activeExecutionKey(items[i]);
        if (key)
            return key;
    }
    return null;
}
function terminalTurnTimestamp(item) {
    if (item.type !== 'message' || item.message.role !== 'system') {
        return undefined;
    }
    return item.message.source === 'prompt_cancelled' ||
        item.message.source === 'turn_error'
        ? item.message.timestamp
        : undefined;
}
function isTurnErrorItem(item) {
    return (item.type === 'message' &&
        item.message.role === 'system' &&
        item.message.source === 'turn_error');
}
function assistantContentTimestamp(item) {
    if (item.type !== 'message' || item.message.role !== 'assistant') {
        return undefined;
    }
    return item.message.content?.trim() ? item.message.timestamp : undefined;
}
/**
 * Per-turn token usage contribution of a row. The SDK reducer folds each round's
 * usage — including the sub-agent rounds a turn spawns — onto the turn's
 * top-level assistant blocks, so summing the turn's assistant messages yields
 * its true total cost.
 */
function itemAssistantUsage(item) {
    return item.type === 'message' && item.message.role === 'assistant'
        ? item.message.usage
        : undefined;
}
function itemToolCallCount(item) {
    if (item.type === 'parallel_agents')
        return item.agents.length;
    if (item.type === 'turn_outputs')
        return 0;
    if (item.type === 'turn_collapse')
        return 0;
    if (item.type === 'turn_content') {
        return item.items.reduce((sum, child) => sum + itemToolCallCount(child), 0);
    }
    return item.message.role === 'tool_group' ? item.message.tools.length : 0;
}
/**
 * Walk backwards from `index` to the user-message row that heads its turn and
 * return that turn's id, or null when `index` precedes the first turn.
 */
export function findTurnIdForIndex(items, index) {
    for (let i = Math.min(index, items.length - 1); i >= 0; i--) {
        const item = items[i];
        if (item.type === 'message' && isTurnStartMessage(item.message)) {
            return item.message.id;
        }
    }
    return null;
}
export function getTurnIdByDisplayIndex(items) {
    const turnIds = [];
    let currentTurnId = null;
    for (const item of items) {
        if (item.type === 'message' && isTurnStartMessage(item.message)) {
            currentTurnId = item.message.id;
        }
        turnIds.push(currentTurnId);
    }
    return turnIds;
}
function timelineIndexForDisplayIndex(visibleItems, index, entryIndexById, turnIdByDisplayIndex) {
    const turnId = turnIdByDisplayIndex === undefined
        ? findTurnIdForIndex(visibleItems, index)
        : (turnIdByDisplayIndex[index] ?? null);
    if (!turnId)
        return null;
    return entryIndexById.get(turnId) ?? null;
}
export function getSessionTimelineRangeForIndexes(visibleItems, visibleItemIndexes, entryIndexById, currentItemIndex, turnIdByDisplayIndex = getTurnIdByDisplayIndex(visibleItems)) {
    let startIndex = Number.POSITIVE_INFINITY;
    let endIndex = -1;
    for (const visibleItemIndex of visibleItemIndexes) {
        if (visibleItemIndex < 0 || visibleItemIndex >= visibleItems.length) {
            continue;
        }
        const timelineIndex = timelineIndexForDisplayIndex(visibleItems, visibleItemIndex, entryIndexById, turnIdByDisplayIndex);
        if (timelineIndex === null)
            continue;
        startIndex = Math.min(startIndex, timelineIndex);
        endIndex = Math.max(endIndex, timelineIndex);
    }
    if (endIndex < 0)
        return null;
    const currentIndex = currentItemIndex === undefined || currentItemIndex === null
        ? null
        : timelineIndexForDisplayIndex(visibleItems, currentItemIndex, entryIndexById, turnIdByDisplayIndex);
    return {
        startIndex,
        endIndex,
        currentIndex: currentIndex !== null &&
            currentIndex >= startIndex &&
            currentIndex <= endIndex
            ? currentIndex
            : endIndex,
    };
}
/**
 * Fold each completed turn down to its prompt and final answer, hiding the
 * intermediate steps (thinking, tool calls, mid-turn assistant text) behind a
 * toggle attached to the prompt row. A turn spans one user message up to the
 * next; its "final answer" is the last assistant row carrying visible content.
 * The leading user row of every collapsible turn is tagged with a
 * `TurnCollapseHead`; when collapsed, the hidden middle rows are dropped and the
 * final answer's own thinking is stripped so only its purple-prefixed content
 * remains. Returns the original array untouched when disabled or when there is
 * nothing to collapse.
 */
/** Does any tool group / parallel-agents row in [start, end] own `callId`? */
function turnOwnsCallId(items, start, end, callId) {
    if (!callId)
        return false;
    for (let i = start; i <= end; i++) {
        const item = items[i];
        if (item.type === 'parallel_agents') {
            if (item.agents.some((agent) => toolContainsCallId(agent, callId))) {
                return true;
            }
        }
        else if (item.type === 'message' && item.message.role === 'tool_group') {
            if (item.message.tools.some((tool) => toolContainsCallId(tool, callId))) {
                return true;
            }
        }
    }
    return false;
}
export function applyTurnCollapse(items, { overrides, isResponding, activeTurnStartedAt, pendingApprovalCallId, enabled, }) {
    if (!enabled || items.length === 0)
        return items;
    const userIdxs = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'message' && isTurnStartMessage(item.message)) {
            userIdxs.push(i);
        }
    }
    if (userIdxs.length === 0)
        return items;
    const result = [];
    // Anything before the first prompt (e.g. a session-restore banner) is not
    // part of any turn and passes through verbatim.
    for (let i = 0; i < userIdxs[0]; i++)
        result.push(items[i]);
    for (let k = 0; k < userIdxs.length; k++) {
        const start = userIdxs[k];
        const end = (k + 1 < userIdxs.length ? userIdxs[k + 1] : items.length) - 1;
        const head = items[start];
        const turnId = head.message.id;
        const promptTs = head.message.timestamp;
        const isActiveTurn = k === userIdxs.length - 1 && isResponding;
        const hasPendingApproval = turnOwnsCallId(items, start, end, pendingApprovalCallId);
        const answerIdx = findFinalAnswerIndex(items, start, end);
        let hiddenCount = 0;
        let terminalTs;
        let assistantTs;
        let inputTokens = 0;
        let outputTokens = 0;
        let cachedTokens = 0;
        let toolCallCount = 0;
        let thinkingCount = 0;
        let hasUsage = false;
        let hasTurnError = false;
        for (let i = start + 1; i <= end; i++) {
            const item = items[i];
            const isStep = isHideableStep(item, i === answerIdx);
            if (isStep) {
                hiddenCount++;
            }
            if (isTurnErrorItem(item)) {
                hasTurnError = true;
            }
            toolCallCount += itemToolCallCount(item);
            if (item.type === 'message' && item.message.role === 'thinking') {
                thinkingCount++;
            }
            const terminalTimestamp = terminalTurnTimestamp(item);
            if (terminalTimestamp !== undefined) {
                terminalTs =
                    terminalTs === undefined
                        ? terminalTimestamp
                        : Math.max(terminalTs, terminalTimestamp);
            }
            const assistantTimestamp = assistantContentTimestamp(item);
            if (assistantTimestamp !== undefined) {
                assistantTs =
                    assistantTs === undefined
                        ? assistantTimestamp
                        : Math.max(assistantTs, assistantTimestamp);
            }
            const usage = itemAssistantUsage(item);
            if (usage) {
                inputTokens += usage.inputTokens;
                outputTokens += usage.outputTokens;
                cachedTokens += usage.cachedTokens ?? 0;
                hasUsage = true;
            }
        }
        const liveStartedAt = isActiveTurn
            ? (activeTurnStartedAt ?? promptTs ?? Date.now())
            : undefined;
        const lastStepTs = terminalTs ?? assistantTs;
        const elapsedMs = promptTs !== undefined &&
            lastStepTs !== undefined &&
            lastStepTs >= promptTs
            ? lastStepTs - promptTs
            : undefined;
        const hasMetrics = hasUsage || elapsedMs !== undefined || liveStartedAt !== undefined;
        if (hasPendingApproval || (hiddenCount === 0 && !hasMetrics)) {
            // Nothing to add: the inline approve/reject UI must stay reachable, or the
            // turn has neither foldable steps nor a measured metric. Emit it untouched.
            for (let i = start; i <= end; i++)
                result.push(items[i]);
            continue;
        }
        // A turn with foldable steps gets a chevron and defaults to expanded while
        // streaming, when the turn errored, or when there is no final answer;
        // otherwise it collapses once complete. A step-less turn (e.g. a plain "hi"
        // reply) has nothing to fold, so it stays expanded and shows a chevron-less
        // metrics line. An explicit user toggle always wins.
        const shouldStayOpen = isActiveTurn || hasTurnError || answerIdx < 0;
        const expanded = hiddenCount === 0
            ? true
            : overrides.has(turnId)
                ? overrides.get(turnId)
                : shouldStayOpen;
        const collapsed = !expanded;
        let turnContentGroupIndex = 0;
        const pushTurnContentGroup = (groupItems) => {
            if (groupItems.length === 0)
                return;
            result.push({
                type: 'turn_content',
                key: `${turnId}-content-${turnContentGroupIndex++}`,
                turnId,
                collapsed,
                items: groupItems,
            });
        };
        // Push the user message
        result.push({
            type: 'message',
            key: head.key,
            message: head.message,
        });
        // Insert standalone turn_collapse item right after user message
        // This keeps the toggle at the top of the turn regardless of expand state
        const turnCollapseInfo = {
            turnId,
            collapsed,
            hiddenCount,
            ...(elapsedMs !== undefined ? { elapsedMs } : {}),
            ...(hasUsage ? { inputTokens, outputTokens } : {}),
            ...(cachedTokens > 0 ? { cachedTokens } : {}),
            ...(toolCallCount > 0 ? { toolCallCount } : {}),
            ...(thinkingCount > 0 ? { thinkingCount } : {}),
            ...(liveStartedAt !== undefined ? { liveStartedAt } : {}),
        };
        result.push({
            type: 'turn_collapse',
            key: `tc-${turnId}`,
            turnCollapse: turnCollapseInfo,
        });
        if (!collapsed) {
            let turnContentItems = [];
            for (let i = start + 1; i <= end; i++) {
                const item = items[i];
                // Attach turnCollapse to final answer for metrics display
                if (i === answerIdx &&
                    item.type === 'message' &&
                    item.message.role === 'assistant') {
                    pushTurnContentGroup(turnContentItems);
                    turnContentItems = [];
                    result.push({
                        ...item,
                        turnCollapse: turnCollapseInfo,
                    });
                }
                else {
                    turnContentItems.push(item);
                }
            }
            pushTurnContentGroup(turnContentItems);
            continue;
        }
        // Collapsed: keep hideable steps mounted in a zero-height content group so
        // the fold animation can run. Keep the final answer and non-step rows
        // (errors, cancellations, command output) in their original places. On an
        // active turn the "answer" is still streaming, so fold it away too rather
        // than strand a provisional line.
        const collapsedContentItems = [];
        const visibleCollapsedItems = [];
        for (let i = start + 1; i <= end; i++) {
            const item = items[i];
            if (i === answerIdx && isActiveTurn)
                continue;
            if (i === answerIdx &&
                item.type === 'message' &&
                item.message.role === 'assistant') {
                visibleCollapsedItems.push({
                    ...item,
                    turnCollapse: turnCollapseInfo,
                });
                continue;
            }
            if (isHideableStep(item, i === answerIdx)) {
                collapsedContentItems.push(item);
                continue;
            }
            visibleCollapsedItems.push(item);
        }
        pushTurnContentGroup(collapsedContentItems);
        result.push(...visibleCollapsedItems);
    }
    return result;
}
/**
 * Locate a display item by message id, falling back to the tool call id for
 * tool groups that were merged (compact mode) or grouped (parallel agents)
 * under another message's id.
 */
export function findDisplayItemIndex(items, messageId, callId) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type === 'message') {
            if (item.message.id === messageId)
                return i;
            if (callId &&
                item.message.role === 'tool_group' &&
                item.message.tools.some((tool) => toolContainsCallId(tool, callId))) {
                return i;
            }
        }
        else if (item.type === 'parallel_agents' &&
            callId &&
            item.agents.some((agent) => toolContainsCallId(agent, callId))) {
            return i;
        }
        else if (item.type === 'turn_content' &&
            findDisplayItemIndex(item.items, messageId, callId) >= 0) {
            return i;
        }
        else if (item.type === 'turn_outputs') {
            continue;
        }
    }
    return -1;
}
function displayItemMatchesLocateTarget(item, target) {
    if (!target)
        return false;
    const callId = target.callId;
    if (item.type === 'message') {
        if (item.message.id === target.messageId)
            return true;
        return (!!callId &&
            item.message.role === 'tool_group' &&
            item.message.tools.some((tool) => toolContainsCallId(tool, callId)));
    }
    if (item.type === 'parallel_agents') {
        return (!!callId && item.agents.some((agent) => toolContainsCallId(agent, callId)));
    }
    if (item.type === 'turn_content') {
        return item.items.some((child) => displayItemMatchesLocateTarget(child, target));
    }
    if (item.type === 'turn_outputs')
        return false;
    return false;
}
const HEADER_INDEX = 0;
const ESTIMATE_HEADER = 120;
const ESTIMATE_MESSAGE = 80;
const ESTIMATE_TURN_COLLAPSE = 32;
const ESTIMATE_TAIL = 240;
const FOLLOW_BOTTOM_THRESHOLD_PX = 30;
const LOAD_OLDER_HISTORY_THRESHOLD_PX = 48;
export const VIRTUAL_SCROLL_THRESHOLD = 200;
const SESSION_TIMELINE_MIN_VISIBLE_ENTRIES = 4;
export function shouldUseVirtualScroll(totalCount, threshold = VIRTUAL_SCROLL_THRESHOLD) {
    return totalCount > threshold;
}
function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    if (totalSeconds < 60)
        return `${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;
    return `${minutes}m ${seconds}s`;
}
function formatTokenCount(tokens) {
    return tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : `${tokens}`;
}
function durationMetricText(elapsedMs) {
    return elapsedMs !== undefined ? formatDuration(elapsedMs) : '';
}
function tokenMetricText(collapse, t) {
    if (collapse.inputTokens === undefined ||
        collapse.outputTokens === undefined) {
        return '';
    }
    const cachedTokens = collapse.cachedTokens ?? 0;
    const cached = cachedTokens > 0 && collapse.inputTokens > 0
        ? ` (${formatTokenCount(cachedTokens)} ${t('turn.cached')}, ${Math.round((cachedTokens / collapse.inputTokens) * 100)}%)`
        : '';
    return `↑${formatTokenCount(collapse.inputTokens)}${cached} ↓${formatTokenCount(collapse.outputTokens)}`;
}
function turnMetricsText(collapse, t) {
    const parts = [];
    const tokenMetric = tokenMetricText(collapse, t);
    if (tokenMetric)
        parts.push(tokenMetric);
    if (collapse.toolCallCount !== undefined && collapse.toolCallCount > 0) {
        parts.push(t('turn.toolCalls', { count: collapse.toolCallCount }));
    }
    if (collapse.thinkingCount !== undefined && collapse.thinkingCount > 0) {
        parts.push(t('turn.thinkingCount', { count: collapse.thinkingCount }));
    }
    return parts.join(' · ');
}
function hasNonDurationMetrics(collapse) {
    return ((collapse.inputTokens !== undefined &&
        collapse.outputTokens !== undefined) ||
        (collapse.toolCallCount !== undefined && collapse.toolCallCount > 0));
}
const TurnCollapseRow = memo(function TurnCollapseRow({ turnCollapse, onToggleCollapse, }) {
    const { t } = useI18n();
    const hasToggle = turnCollapse.hiddenCount > 0;
    const liveStartedAt = turnCollapse.liveStartedAt;
    const showMetadataRow = hasToggle ||
        liveStartedAt !== undefined ||
        hasNonDurationMetrics(turnCollapse);
    const now = useSharedNow(liveStartedAt !== undefined && showMetadataRow);
    const elapsedSeenRef = useRef(0);
    const previousLiveStartedAtRef = useRef(liveStartedAt);
    if (previousLiveStartedAtRef.current !== liveStartedAt) {
        previousLiveStartedAtRef.current = liveStartedAt;
        elapsedSeenRef.current = 0;
    }
    let displayElapsedMs;
    if (liveStartedAt !== undefined && showMetadataRow) {
        elapsedSeenRef.current = Math.max(elapsedSeenRef.current, Math.max(0, now - liveStartedAt));
        displayElapsedMs = elapsedSeenRef.current;
    }
    else if (showMetadataRow && turnCollapse.elapsedMs !== undefined) {
        elapsedSeenRef.current = 0;
        displayElapsedMs = turnCollapse.elapsedMs;
    }
    else {
        elapsedSeenRef.current = 0;
        displayElapsedMs = undefined;
    }
    const visibleMetrics = durationMetricText(displayElapsedMs);
    const hiddenMetrics = turnMetricsText(turnCollapse, t);
    const summaryMetrics = turnMetricsText(turnCollapse, t);
    const statusLabel = liveStartedAt !== undefined ? t('turn.processing') : t('turn.processed');
    const showVisibleMetrics = !!visibleMetrics && showMetadataRow;
    const showHiddenMetrics = !!hiddenMetrics && showMetadataRow;
    const showSummaryMetrics = !!summaryMetrics && showMetadataRow;
    if (!showMetadataRow)
        return null;
    const toggleExpanded = () => {
        if (!hasToggle)
            return;
        const nextExpanded = turnCollapse.collapsed;
        onToggleCollapse(turnCollapse.turnId, nextExpanded);
    };
    return (_jsxs("div", { className: hasToggle
            ? `${turnCollapseStyles.collapseRow} ${turnCollapseStyles.collapseRowClickable}`
            : turnCollapseStyles.collapseRow, role: hasToggle ? 'button' : undefined, tabIndex: hasToggle ? 0 : undefined, "aria-expanded": hasToggle ? !turnCollapse.collapsed : undefined, "aria-label": hasToggle
            ? turnCollapse.collapsed
                ? t('turn.expand')
                : t('turn.collapse')
            : undefined, title: hasToggle
            ? turnCollapse.collapsed
                ? t('turn.expand')
                : t('turn.collapse')
            : undefined, onClick: hasToggle ? toggleExpanded : undefined, onKeyDown: hasToggle
            ? (event) => {
                if (event.key !== 'Enter' && event.key !== ' ')
                    return;
                event.preventDefault();
                toggleExpanded();
            }
            : undefined, children: [_jsxs("span", { className: turnCollapseStyles.collapseLabel, children: [_jsxs("span", { className: turnCollapseStyles.processedLabel, children: [statusLabel, showVisibleMetrics && (_jsxs("span", { className: turnCollapseStyles.processedMeta, children: [' ', visibleMetrics] }))] }), showSummaryMetrics && (_jsx("span", { className: turnCollapseStyles.summaryMetrics, children: summaryMetrics })), showHiddenMetrics && (_jsx("span", { className: turnCollapseStyles.hiddenMetrics, children: hiddenMetrics }))] }), hasToggle && (_jsx("span", { "data-testid": `toggle-${turnCollapse.turnId}`, className: turnCollapseStyles.collapseIcon, onClick: (event) => {
                    event.stopPropagation();
                    toggleExpanded();
                }, children: _jsx("span", { className: turnCollapse.collapsed
                        ? turnCollapseStyles.chevronRight
                        : turnCollapseStyles.chevronDown, "aria-hidden": "true" }) }))] }));
});
function getChatRowClassName(item) {
    if (item.type === 'turn_collapse')
        return styles.turnStatusRow;
    if (item.type === 'turn_outputs')
        return styles.turnContentRow;
    if (item.type === 'turn_content') {
        return styles.turnContentRow;
    }
    if (item.type !== 'message')
        return undefined;
    if (item.turnCollapse)
        return styles.turnAnswerRow;
    return undefined;
}
const TurnContent = memo(function TurnContent({ collapsed, children, }) {
    const className = joinClassNames(styles.turnContentClip, collapsed ? styles.turnContentCollapsed : undefined);
    return (_jsx("div", { className: className, "data-collapsed": collapsed ? 'true' : 'false', children: _jsx("div", { className: styles.turnContentInner, children: children }) }));
});
const SESSION_TIMELINE_KIND_LABEL = {
    thought: 'thinking',
    commentary: 'assistant update',
    tool: 'tool calls',
    agents: 'parallel agents',
    plan: 'plan update',
    status: 'status update',
    none: 'turn',
};
const SESSION_TIMELINE_TOOLTIP_THEME_VARS = [
    '--background',
    '--foreground',
    '--muted-foreground',
    '--border',
    '--font-sans',
];
const SESSION_TIMELINE_TOOLTIP_ID = 'session-timeline-detail-tooltip';
const SessionTimeline = memo(function SessionTimeline({ entries, currentTurnId, currentRange, hidden, onSelect, }) {
    const portalRoot = useWebShellPortalRoot();
    const { t } = useI18n();
    const panelRef = useRef(null);
    const viewportRef = useRef(null);
    const tooltipRef = useRef(null);
    const programmaticScrollRef = useRef(false);
    const focusScrollGuardRef = useRef(false);
    const focusScrollGuardFrameRef = useRef(null);
    const focusScrollGuardFallbackRef = useRef(null);
    const [tooltip, setTooltip] = useState(null);
    const currentIndex = currentRange !== null
        ? currentRange.currentIndex
        : entries.findIndex((entry) => entry.id === currentTurnId);
    const hideTooltip = useCallback(() => setTooltip(null), []);
    const handleViewportScroll = useCallback(() => {
        if (programmaticScrollRef.current || focusScrollGuardRef.current)
            return;
        hideTooltip();
    }, [hideTooltip]);
    const buildTooltip = useCallback((entry, el) => {
        const panel = panelRef.current;
        if (!panel)
            return null;
        const computedStyle = getComputedStyle(panel);
        const rect = el.getBoundingClientRect();
        return {
            entry,
            top: rect.top + rect.height / 2,
            left: rect.right + 8,
            clamped: false,
            themeVars: Object.fromEntries(SESSION_TIMELINE_TOOLTIP_THEME_VARS.map((name) => [
                name,
                computedStyle.getPropertyValue(name),
            ])),
        };
    }, []);
    const findTooltipAnchor = useCallback((entry) => {
        const viewport = viewportRef.current;
        if (!viewport)
            return null;
        const item = Array.from(viewport.querySelectorAll('[data-testid="session-timeline-entry"]')).find((node) => node.getAttribute('data-turn-id') === entry.id);
        return item?.querySelector('button') ?? null;
    }, []);
    const isTooltipAnchorVisible = useCallback((anchor) => {
        const viewport = viewportRef.current;
        if (!viewport)
            return false;
        const viewportRect = viewport.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        return (anchorRect.bottom >= viewportRect.top &&
            anchorRect.top <= viewportRect.bottom);
    }, []);
    const syncTooltip = useCallback(() => {
        setTooltip((current) => {
            if (!current)
                return null;
            const anchor = findTooltipAnchor(current.entry);
            if (!anchor || !isTooltipAnchorVisible(anchor))
                return null;
            return buildTooltip(current.entry, anchor);
        });
    }, [buildTooltip, findTooltipAnchor, isTooltipAnchorVisible]);
    const showTooltip = useCallback((entry, el) => {
        setTooltip(buildTooltip(entry, el));
    }, [buildTooltip]);
    const guardFocusScroll = useCallback(() => {
        if (typeof window === 'undefined')
            return;
        if (focusScrollGuardFrameRef.current !== null) {
            window.cancelAnimationFrame(focusScrollGuardFrameRef.current);
        }
        if (focusScrollGuardFallbackRef.current !== null) {
            window.clearTimeout(focusScrollGuardFallbackRef.current);
        }
        focusScrollGuardRef.current = true;
        focusScrollGuardFrameRef.current = window.requestAnimationFrame(() => {
            focusScrollGuardFrameRef.current = null;
            focusScrollGuardRef.current = false;
            syncTooltip();
        });
        focusScrollGuardFallbackRef.current = window.setTimeout(() => {
            focusScrollGuardFallbackRef.current = null;
            focusScrollGuardRef.current = false;
        }, 100);
    }, [syncTooltip]);
    useLayoutEffect(() => {
        if (hidden)
            return;
        const viewport = viewportRef.current;
        if (!viewport || currentIndex < 0)
            return;
        const item = viewport.querySelector(`[data-timeline-index="${currentIndex}"]`);
        if (!item)
            return;
        const itemCenter = item.offsetTop + item.offsetHeight / 2;
        const maxScrollTop = viewport.scrollHeight - viewport.clientHeight;
        const nextScrollTop = Math.max(0, Math.min(itemCenter - viewport.clientHeight / 2, maxScrollTop));
        if (viewport.scrollTop === nextScrollTop)
            return;
        programmaticScrollRef.current = true;
        viewport.scrollTop = nextScrollTop;
        const frame = window.requestAnimationFrame(() => {
            programmaticScrollRef.current = false;
            syncTooltip();
        });
        const fallback = window.setTimeout(() => {
            programmaticScrollRef.current = false;
        }, 100);
        return () => {
            window.cancelAnimationFrame(frame);
            window.clearTimeout(fallback);
            programmaticScrollRef.current = false;
        };
    }, [currentIndex, hidden, syncTooltip]);
    useLayoutEffect(() => {
        if (!tooltip || typeof window === 'undefined')
            return;
        window.addEventListener('resize', syncTooltip);
        return () => {
            window.removeEventListener('resize', syncTooltip);
        };
    }, [syncTooltip, tooltip]);
    useLayoutEffect(() => () => {
        if (focusScrollGuardFrameRef.current !== null) {
            window.cancelAnimationFrame(focusScrollGuardFrameRef.current);
        }
        if (focusScrollGuardFallbackRef.current !== null) {
            window.clearTimeout(focusScrollGuardFallbackRef.current);
        }
        focusScrollGuardRef.current = false;
    }, []);
    useLayoutEffect(() => {
        if (!tooltip || tooltip.clamped)
            return;
        const panel = panelRef.current;
        const tooltipEl = tooltipRef.current;
        if (!panel || !tooltipEl || typeof window === 'undefined')
            return;
        const rect = tooltipEl.getBoundingClientRect();
        const margin = 12;
        let nextTop = tooltip.top;
        if (rect.top < margin) {
            nextTop += margin - rect.top;
        }
        else if (rect.bottom > window.innerHeight - margin) {
            nextTop -= rect.bottom - (window.innerHeight - margin);
        }
        if (nextTop === tooltip.top)
            return;
        setTooltip((current) => current?.entry.id === tooltip.entry.id
            ? { ...current, top: nextTop, clamped: true }
            : current);
    }, [tooltip]);
    if (hidden || entries.length === 0)
        return null;
    return (_jsx("div", { className: styles.sessionTimelineLayer, "aria-hidden": "false", children: _jsxs("nav", { ref: panelRef, className: styles.sessionTimelinePanel, "aria-label": t('timeline.sessionTimeline'), "data-testid": "session-timeline", onMouseLeave: hideTooltip, children: [_jsx("div", { ref: viewportRef, className: styles.sessionTimelineViewport, "data-testid": "session-timeline-viewport", onScroll: handleViewportScroll, children: _jsx("ol", { className: styles.sessionTimelineList, children: entries.map((entry, index) => {
                            const isInCurrentRange = currentRange !== null &&
                                index >= currentRange.startIndex &&
                                index <= currentRange.endIndex;
                            const isCurrent = currentRange !== null
                                ? index === currentRange.currentIndex
                                : entry.id === currentTurnId;
                            const nodeKinds = entry.nodeKinds.join(',');
                            const ariaLabel = [
                                `${t('timeline.turnPrefix', { index: index + 1 })}: ${entry.label}`,
                                isCurrent ? t('timeline.currentTurn') : null,
                            ]
                                .filter(Boolean)
                                .join('. ');
                            const revealTooltip = (event) => showTooltip(entry, event.currentTarget);
                            const revealFocusedTooltip = (event) => {
                                guardFocusScroll();
                                showTooltip(entry, event.currentTarget);
                            };
                            const describedByTooltip = tooltip?.entry.id === entry.id;
                            return (_jsx("li", { className: styles.sessionTimelineItem, "data-testid": "session-timeline-entry", "data-turn-id": entry.id, "data-timeline-index": index, "data-node-kinds": nodeKinds, "data-in-current-range": isInCurrentRange ? 'true' : undefined, children: _jsx("button", { type: "button", className: joinClassNames(styles.sessionTimelineButton, isInCurrentRange
                                        ? styles.sessionTimelineButtonInRange
                                        : undefined, isCurrent
                                        ? styles.sessionTimelineButtonCurrent
                                        : undefined), "aria-current": isCurrent ? 'step' : undefined, "aria-describedby": describedByTooltip
                                        ? SESSION_TIMELINE_TOOLTIP_ID
                                        : undefined, "aria-label": ariaLabel, onClick: () => onSelect(entry.id), onFocus: revealFocusedTooltip, onBlur: hideTooltip, onMouseEnter: revealTooltip, onMouseLeave: hideTooltip, children: _jsx("span", { className: styles.sessionTimelineTick }) }) }, entry.id));
                        }) }) }), tooltip &&
                    typeof document !== 'undefined' &&
                    createPortal(_jsxs("div", { ref: tooltipRef, className: styles.sessionTimelineDetails, id: SESSION_TIMELINE_TOOLTIP_ID, "data-testid": "session-timeline-detail", "data-title": tooltip.entry.label, "data-detail": tooltip.entry.detail, "data-scheduled-task": tooltip.entry.isScheduledTask ? 'true' : undefined, role: "tooltip", style: {
                            ...tooltip.themeVars,
                            top: tooltip.top,
                            left: tooltip.left,
                        }, children: [_jsxs("span", { className: styles.sessionTimelineDetailsTitle, children: [tooltip.entry.isScheduledTask && _jsx(TimelineClockIcon, {}), _jsx("span", { className: styles.sessionTimelineDetailsTitleText, children: tooltip.entry.label })] }), _jsx("span", { className: styles.sessionTimelineDetailsDetail, children: tooltip.entry.detail })] }), portalRoot ?? document.body)] }) }));
});
function joinClassNames(...classNames) {
    const result = classNames.filter(Boolean).join(' ');
    return result || undefined;
}
const EMPTY_SESSION_TIMELINE_ENTRIES = [];
function LoadingTranscriptSkeleton({ label }) {
    return (_jsxs(_Fragment, { children: [_jsx("div", { role: "status", "aria-live": "polite", className: styles.srOnly, children: label }), _jsxs("div", { className: styles.loadingSkeleton, "data-testid": "message-list-loading-skeleton", "aria-hidden": "true", children: [_jsx("div", { className: styles.loadingSkeletonUserRow, children: _jsxs("div", { className: styles.loadingSkeletonUserBubble, children: [_jsx("span", { className: styles.loadingSkeletonLineWide }), _jsx("span", { className: styles.loadingSkeletonLineShort })] }) }), _jsx("div", { className: styles.loadingSkeletonAssistantRow, children: _jsxs("div", { className: styles.loadingSkeletonAssistantBlock, children: [_jsx("span", { className: styles.loadingSkeletonLineMedium }), _jsx("span", { className: styles.loadingSkeletonLineWide }), _jsx("span", { className: styles.loadingSkeletonLineNarrow })] }) }), _jsx("div", { className: styles.loadingSkeletonUserRow, children: _jsx("div", { className: styles.loadingSkeletonUserBubbleCompact, children: _jsx("span", { className: styles.loadingSkeletonLineMedium }) }) }), _jsx("div", { className: styles.loadingSkeletonAssistantRow, children: _jsxs("div", { className: styles.loadingSkeletonAssistantBlock, children: [_jsx("span", { className: styles.loadingSkeletonLineWide }), _jsx("span", { className: styles.loadingSkeletonLineMedium })] }) })] })] }));
}
export const MessageList = memo(forwardRef(function MessageList({ messages, pendingApproval, onShowContextDetail, loadingTranscript, catchingUp, hasOlderHistory = false, loadingOlderHistory = false, historyCapacityReached = false, onLoadOlderHistory, isResponding = false, activeTurnStartedAt, welcomeHeader, centerWelcomeHeader = false, workspaceCwd, tailContent, tailKey = 'tail', virtualScrollThreshold = VIRTUAL_SCROLL_THRESHOLD, autoScrollTailIntoView = false, bottomOverlayInset = 0, hideSessionTimeline = false, showRetryHint = false, onRetryClick, onBranchSession, onCanScrollToBottomChange, turnFileChanges, turnArtifacts, turnScheduledTasks, onReviewChanges, onOpenArtifact, onOpenScheduledTask, onTurnOutputOpen, generateContent, }, ref) {
    const { t } = useI18n();
    const compactMode = useContext(CompactModeContext);
    const mergedMessages = useMemo(() => compactMode
        ? mergeCompactToolGroups(messages, pendingApproval)
        : messages, [compactMode, messages, pendingApproval]);
    const displayItems = useMemo(() => attachTurnOutputs(groupParallelAgents(mergedMessages), isResponding, turnFileChanges, turnArtifacts, turnScheduledTasks), [
        mergedMessages,
        isResponding,
        turnFileChanges,
        turnArtifacts,
        turnScheduledTasks,
    ]);
    const [isSessionTimelineVisible, setIsSessionTimelineVisible] = useState(false);
    const sessionTimelineCache = useRef(null);
    // Signature + entries are O(transcript text); only pay for them while the
    // rail can actually show (container >= 1160px — never on mobile).
    const sessionTimelineEntries = useMemo(() => {
        if (!isSessionTimelineVisible)
            return EMPTY_SESSION_TIMELINE_ENTRIES;
        const signature = getSessionTimelineSignature(mergedMessages);
        if (sessionTimelineCache.current?.signature !== signature ||
            sessionTimelineCache.current?.t !== t) {
            sessionTimelineCache.current = {
                signature,
                t,
                entries: getSessionTimelineEntries(mergedMessages, t),
            };
        }
        return sessionTimelineCache.current.entries;
    }, [isSessionTimelineVisible, mergedMessages, t]);
    const sessionTimelineEntryIndexById = useMemo(() => new Map(sessionTimelineEntries.map((entry, index) => [entry.id, index])), [sessionTimelineEntries]);
    const fallbackCurrentTimelineTurnId = useMemo(() => getLastTurnStartMessageId(mergedMessages), [mergedMessages]);
    const [sessionTimelineRange, setSessionTimelineRange] = useState(null);
    const currentTimelineTurnId = sessionTimelineRange !== null
        ? (sessionTimelineEntries[sessionTimelineRange.currentIndex]?.id ??
            fallbackCurrentTimelineTurnId)
        : fallbackCurrentTimelineTurnId;
    const lastCompletedAssistantId = useMemo(() => {
        if (isResponding)
            return null;
        for (let i = mergedMessages.length - 1; i >= 0; i -= 1) {
            const message = mergedMessages[i];
            if (message &&
                (message.role === 'tool_group' || message.role === 'plan')) {
                return null;
            }
            if (message?.role === 'assistant' &&
                !message.isStreaming &&
                message.content?.trim()) {
                return message.id;
            }
        }
        return null;
    }, [isResponding, mergedMessages]);
    const finalAssistantTurnIdByAssistantId = useMemo(() => collectFinalAssistantTurnIds(displayItems, isResponding), [displayItems, isResponding]);
    // ── Per-turn collapse ────────────────────────────────────────────────
    // Completed turns fold down to their prompt + final answer (toggle on the
    // prompt row). `collapseOverrides` records explicit user toggles keyed by
    // the turn's user-message id; turns absent from it follow the default
    // (collapsed once complete). `displayItems` stays the full, pre-collapse
    // list — used only to locate rows hidden inside a collapsed turn — while
    // `visibleItems` is what actually renders.
    const { collapseCompletedTurns } = useWebShellCustomization();
    const collapseEnabled = collapseCompletedTurns ?? true;
    const [collapseOverrides, setCollapseOverrides] = useState(() => new Map());
    const shouldFollow = useRef(true);
    const followPausedByUserRef = useRef(false);
    const userScrollIntentUntil = useRef(0);
    const lastScrollTop = useRef(0);
    const olderHistoryLoadInFlight = useRef(false);
    const scrollCooldown = useRef(false);
    const scrollCooldownCount = useRef(0);
    const sessionTimelineFrame = useRef(null);
    const lastReportedCanScrollToBottom = useRef(null);
    const didTrackLastUserMsgRef = useRef(false);
    const prevLastUserMsgId = useRef(null);
    const pendingNewUserSmoothScroll = useRef(false);
    const prevLoadingTranscript = useRef(loadingTranscript);
    const pendingTranscriptBottomScroll = useRef(Boolean(loadingTranscript));
    const transcriptBottomScrollFrame = useRef(undefined);
    const transcriptBottomScrollSettleFrame = useRef(undefined);
    const prevBottomOverlayInset = useRef(bottomOverlayInset);
    const prevActiveExecutionKey = useRef(null);
    const prevCatchingUp = useRef(catchingUp);
    const catchingUpRef = useRef(catchingUp);
    const prevHasTailContent = useRef(false);
    const pendingFollowRecheck = useRef(false);
    const pendingFollowRecheckFrame = useRef(undefined);
    const pendingFollowRecheckTimer = useRef(undefined);
    const pendingOverflowFrame = useRef(undefined);
    catchingUpRef.current = catchingUp;
    const containerRef = useRef(null);
    const olderHistoryRetryBlocked = useRef(false);
    const lastUnderfillAutoLoad = useRef(null);
    const [olderHistoryAnchor, setOlderHistoryAnchor] = useState(null);
    useLayoutEffect(() => {
        if (!olderHistoryAnchor)
            return;
        const current = containerRef.current;
        if (current) {
            current.scrollTop =
                olderHistoryAnchor.scrollTop +
                    Math.max(0, current.scrollHeight - olderHistoryAnchor.scrollHeight);
        }
        olderHistoryLoadInFlight.current = false;
        setOlderHistoryAnchor(null);
    }, [olderHistoryAnchor]);
    useEffect(() => {
        if (!hasOlderHistory) {
            olderHistoryRetryBlocked.current = false;
            lastUnderfillAutoLoad.current = null;
        }
    }, [hasOlderHistory]);
    const reportCanScrollToBottom = useCallback(() => {
        const el = containerRef.current;
        const distanceFromBottom = el
            ? el.scrollHeight - el.scrollTop - el.clientHeight
            : 0;
        const canScrollToBottom = !shouldFollow.current && distanceFromBottom > 1;
        if (lastReportedCanScrollToBottom.current === canScrollToBottom)
            return;
        lastReportedCanScrollToBottom.current = canScrollToBottom;
        onCanScrollToBottomChange?.(canScrollToBottom);
    }, [onCanScrollToBottomChange]);
    const scheduleScrollOverflowReport = useCallback(() => {
        if (pendingOverflowFrame.current !== undefined) {
            window.cancelAnimationFrame(pendingOverflowFrame.current);
        }
        pendingOverflowFrame.current = window.requestAnimationFrame(reportCanScrollToBottom);
    }, [reportCanScrollToBottom]);
    const setShouldFollow = useCallback((value) => {
        if (shouldFollow.current === value)
            return;
        shouldFollow.current = value;
        scheduleScrollOverflowReport();
    }, [scheduleScrollOverflowReport]);
    const visibleItems = useMemo(() => applyTurnCollapse(displayItems, {
        overrides: collapseOverrides,
        isResponding,
        activeTurnStartedAt,
        pendingApprovalCallId: pendingApproval?.toolCallId ?? null,
        enabled: collapseEnabled,
    }), [
        displayItems,
        collapseOverrides,
        isResponding,
        activeTurnStartedAt,
        pendingApproval?.toolCallId,
        collapseEnabled,
    ]);
    const visibleTurnIdByDisplayIndex = useMemo(() => getTurnIdByDisplayIndex(visibleItems), [visibleItems]);
    const hasEnoughSessionTimelineEntries = sessionTimelineEntries.length >= SESSION_TIMELINE_MIN_VISIBLE_ENTRIES;
    useLayoutEffect(() => {
        if (hideSessionTimeline) {
            setIsSessionTimelineVisible((prev) => (prev ? false : prev));
            return;
        }
        const el = containerRef.current;
        if (!el)
            return;
        const updateVisibility = () => {
            const width = el.getBoundingClientRect().width;
            const nextVisible = width >= 1160;
            setIsSessionTimelineVisible((prev) => prev === nextVisible ? prev : nextVisible);
        };
        updateVisibility();
        if (typeof ResizeObserver === 'undefined')
            return;
        const observer = new ResizeObserver(updateVisibility);
        observer.observe(el);
        return () => observer.disconnect();
    }, [hideSessionTimeline]);
    // ── Scroll-follow state ──────────────────────────────────────────────
    //
    // The scroll behavior follows 6 rules:
    //
    //   1. Default follow-bottom — while the user is looking at the bottom,
    //      new content (streaming tokens, tool cards expanding, approval
    //      cards appearing, any height change) keeps the viewport pinned
    //      to the latest output.
    //
    //   2. Scroll-up pauses follow — if the user scrolls up, the page
    //      assumes they want to read history and stops auto-scrolling.
    //      Even if the model is still streaming, the viewport stays put.
    //
    //   3. Scroll-back-to-bottom resumes — when the user scrolls back
    //      near the bottom (within FOLLOW_BOTTOM_THRESHOLD_PX), follow mode
    //      re-engages
    //      and new content resumes sticking.
    //
    //   4. New message resets follow — after the user sends a message,
    //      follow mode is forced on so the model's reply scrolls in
    //      naturally.
    //
    //   5. Session restore / reconnect — during history replay
    //      (`catchingUp === true`), all auto-scrolling is suppressed to
    //      avoid fighting the rapidly replaying transcript. Once replay
    //      finishes (`catchingUp` flips to falsy), a single scroll-to-
    //      bottom fires so the user lands at the latest content.
    //
    //   6. Short content — if the content doesn't overflow the container
    //      (no scrollbar), scrollToBottom is a no-op. This avoids a
    //      visual flash when the model just started replying with a
    //      short first chunk.
    //
    // Implementation: three refs, three effects, one scroll handler.
    //
    //   - `shouldFollow`      — whether auto-scroll is active
    //   - `lastScrollTop`     — previous scrollTop for direction detection
    //   - `prevLastUserMsgId` — tracks when a new user message appears
    //   - `prevCatchingUp`    — tracks the catchingUp → ready transition
    //
    // The single auto-scroll driver is a `useLayoutEffect` on
    // `totalVirtualSize` (the virtualizer's computed content height).
    // Every height change — streaming text, card expand, approval
    // appearance — flows through this one effect.
    // ─────────────────────────────────────────────────────────────────────
    const hasTailContent = tailContent !== undefined && tailContent !== null;
    const showLoadingSkeleton = Boolean(loadingTranscript);
    const hasHeader = !!welcomeHeader;
    const headerOffset = hasHeader ? 1 : 0;
    const tailContentIndex = headerOffset + visibleItems.length;
    const totalCount = tailContentIndex + (hasTailContent ? 1 : 0);
    const useVirtualScroll = shouldUseVirtualScroll(totalCount, virtualScrollThreshold);
    const getScrollElement = useCallback(() => {
        return containerRef.current;
    }, []);
    const recheckFollowFromScrollGeometry = useCallback(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        const isNearBottom = distanceFromBottom < FOLLOW_BOTTOM_THRESHOLD_PX;
        followPausedByUserRef.current = !isNearBottom;
        setShouldFollow(isNearBottom);
        scheduleScrollOverflowReport();
    }, [scheduleScrollOverflowReport, setShouldFollow]);
    const markUserScrollIntent = useCallback(() => {
        userScrollIntentUntil.current = Date.now() + 1000;
    }, []);
    const scheduleFollowRecheck = useCallback(() => {
        pendingFollowRecheck.current = true;
        if (pendingFollowRecheckFrame.current !== undefined) {
            window.cancelAnimationFrame(pendingFollowRecheckFrame.current);
        }
        if (pendingFollowRecheckTimer.current !== undefined) {
            window.clearTimeout(pendingFollowRecheckTimer.current);
        }
        pendingFollowRecheckFrame.current = window.requestAnimationFrame(recheckFollowFromScrollGeometry);
        // Turn content uses a 180ms grid transition. The real scrollHeight can
        // cross the overflow threshold only after the animation advances, so do a
        // final geometry read once the expansion has settled.
        pendingFollowRecheckTimer.current = window.setTimeout(() => {
            pendingFollowRecheck.current = false;
            pendingFollowRecheckFrame.current = undefined;
            pendingFollowRecheckTimer.current = undefined;
            recheckFollowFromScrollGeometry();
        }, 220);
    }, [recheckFollowFromScrollGeometry]);
    useEffect(() => () => {
        if (pendingFollowRecheckFrame.current !== undefined) {
            window.cancelAnimationFrame(pendingFollowRecheckFrame.current);
        }
        if (pendingFollowRecheckTimer.current !== undefined) {
            window.clearTimeout(pendingFollowRecheckTimer.current);
        }
        if (pendingOverflowFrame.current !== undefined) {
            window.cancelAnimationFrame(pendingOverflowFrame.current);
        }
        if (transcriptBottomScrollFrame.current !== undefined) {
            window.cancelAnimationFrame(transcriptBottomScrollFrame.current);
        }
        if (transcriptBottomScrollSettleFrame.current !== undefined) {
            window.cancelAnimationFrame(transcriptBottomScrollSettleFrame.current);
        }
    }, []);
    const handleToggleCollapse = useCallback((turnId, nextExpanded) => {
        // Expanding/collapsing a turn is an explicit reading action. Pause
        // follow so streaming output does not yank the viewport back to the
        // tail while the user is inspecting history.
        const el = containerRef.current;
        // If there is no scrollbar yet, there is no meaningful "not at
        // bottom" state to report. The toggle may create overflow though, so
        // re-check after the expanded/collapsed rows have been laid out.
        if (!el || el.scrollHeight > el.clientHeight + 1) {
            followPausedByUserRef.current = true;
            setShouldFollow(false);
        }
        scheduleFollowRecheck();
        setCollapseOverrides((prev) => {
            const next = new Map(prev);
            next.set(turnId, nextExpanded);
            return next;
        });
    }, [scheduleFollowRecheck, setShouldFollow]);
    const handleDisclosureClickCapture = useCallback((event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement))
            return;
        if (!target.closest('[aria-expanded]'))
            return;
        followPausedByUserRef.current = true;
        setShouldFollow(false);
        scheduleFollowRecheck();
    }, [scheduleFollowRecheck, setShouldFollow]);
    const getItemKey = useCallback((index) => {
        if (hasHeader && index === HEADER_INDEX)
            return 'slot:header';
        if (hasTailContent && index === tailContentIndex) {
            return `slot:tail:${tailKey}`;
        }
        const item = visibleItems[index - headerOffset];
        return item ? getDisplayItemVirtualKey(item) : `slot:row:${index}`;
    }, [
        hasHeader,
        hasTailContent,
        tailContentIndex,
        tailKey,
        visibleItems,
        headerOffset,
    ]);
    // Rule 6: skip if content doesn't overflow (no scrollbar).
    const scrollToBottom = useCallback((behavior = 'auto') => {
        const el = getScrollElement();
        if (!el)
            return;
        if (el.scrollHeight <= el.clientHeight)
            return;
        scrollCooldownCount.current += 1;
        const gen = scrollCooldownCount.current;
        scrollCooldown.current = true;
        if (behavior === 'smooth') {
            el.scrollTo({ top: el.scrollHeight, behavior });
        }
        else {
            el.scrollTop = el.scrollHeight;
        }
        scheduleScrollOverflowReport();
        lastScrollTop.current = Math.max(0, el.scrollHeight - el.clientHeight);
        reportCanScrollToBottom();
        const releaseCooldown = () => {
            if (scrollCooldownCount.current === gen) {
                scrollCooldown.current = false;
            }
        };
        if (behavior === 'smooth') {
            setTimeout(releaseCooldown, 350);
        }
        else {
            requestAnimationFrame(releaseCooldown);
        }
    }, [getScrollElement, reportCanScrollToBottom, scheduleScrollOverflowReport]);
    const resumeBottomFollow = useCallback((behavior = 'smooth') => {
        followPausedByUserRef.current = false;
        setShouldFollow(true);
        scrollToBottom(behavior);
    }, [scrollToBottom, setShouldFollow]);
    const virtualizer = useVirtualizer({
        count: totalCount,
        enabled: useVirtualScroll,
        getScrollElement,
        getItemKey,
        estimateSize: (index) => {
            if (hasHeader && index === HEADER_INDEX)
                return ESTIMATE_HEADER;
            if (hasTailContent && index === tailContentIndex)
                return ESTIMATE_TAIL;
            const item = visibleItems[index - headerOffset];
            if (item?.type === 'turn_collapse')
                return ESTIMATE_TURN_COLLAPSE;
            if (item?.type === 'turn_content') {
                return Math.max(ESTIMATE_MESSAGE, item.items.length * ESTIMATE_MESSAGE);
            }
            return ESTIMATE_MESSAGE;
        },
        overscan: 20,
        useFlushSync: false,
        useAnimationFrameWithResizeObserver: true,
    });
    const virtualItems = virtualizer.getVirtualItems();
    const totalVirtualSize = virtualizer.getTotalSize();
    const sessionTimelineRangeState = useRef({
        entryIndexById: new Map(),
        headerOffset: 0,
        isVisible: false,
        turnIdByDisplayIndex: [],
        visibleItems: [],
    });
    sessionTimelineRangeState.current = {
        entryIndexById: sessionTimelineEntryIndexById,
        headerOffset,
        isVisible: isSessionTimelineVisible,
        turnIdByDisplayIndex: visibleTurnIdByDisplayIndex,
        visibleItems,
    };
    const updateSessionTimelineRange = useCallback(() => {
        const el = getScrollElement();
        const state = sessionTimelineRangeState.current;
        if (!el || !state.isVisible || state.entryIndexById.size === 0) {
            setSessionTimelineRange((prev) => (prev === null ? prev : null));
            return;
        }
        const viewportRect = el.getBoundingClientRect();
        const viewportTop = viewportRect.top;
        const viewportBottom = viewportRect.bottom;
        const viewportCenter = viewportTop + (viewportBottom - viewportTop) / 2;
        const visibleItemIndexes = [];
        let currentItemIndex = null;
        let closestDistance = Number.POSITIVE_INFINITY;
        el.querySelectorAll('[data-index]').forEach((row) => {
            const rawIndex = row.dataset.index;
            if (rawIndex === undefined)
                return;
            const rowIndex = Number(rawIndex);
            if (!Number.isFinite(rowIndex))
                return;
            const visibleItemIndex = rowIndex - state.headerOffset;
            if (visibleItemIndex < 0 ||
                visibleItemIndex >= state.visibleItems.length) {
                return;
            }
            const rowRect = row.getBoundingClientRect();
            if (rowRect.bottom < viewportTop || rowRect.top > viewportBottom) {
                return;
            }
            visibleItemIndexes.push(visibleItemIndex);
            const rowCenter = rowRect.top + (rowRect.bottom - rowRect.top) / 2;
            const distance = Math.abs(rowCenter - viewportCenter);
            if (distance < closestDistance) {
                closestDistance = distance;
                currentItemIndex = visibleItemIndex;
            }
        });
        const next = getSessionTimelineRangeForIndexes(state.visibleItems, visibleItemIndexes, state.entryIndexById, currentItemIndex, state.turnIdByDisplayIndex);
        setSessionTimelineRange((prev) => {
            if (prev?.startIndex === next?.startIndex &&
                prev?.endIndex === next?.endIndex &&
                prev?.currentIndex === next?.currentIndex) {
                return prev;
            }
            return next;
        });
    }, [getScrollElement]);
    const scheduleSessionTimelineRangeUpdate = useCallback(() => {
        if (sessionTimelineFrame.current !== null) {
            cancelAnimationFrame(sessionTimelineFrame.current);
        }
        sessionTimelineFrame.current = requestAnimationFrame(() => {
            sessionTimelineFrame.current = null;
            updateSessionTimelineRange();
        });
    }, [updateSessionTimelineRange]);
    useEffect(() => () => {
        if (sessionTimelineFrame.current !== null) {
            cancelAnimationFrame(sessionTimelineFrame.current);
            sessionTimelineFrame.current = null;
        }
    }, []);
    useEffect(() => {
        scheduleSessionTimelineRangeUpdate();
    }, [
        scheduleSessionTimelineRangeUpdate,
        totalCount,
        totalVirtualSize,
        useVirtualScroll,
        virtualItems.length,
        isSessionTimelineVisible,
    ]);
    // Imperative scroll-to-message (e.g. the floating TodoPanel's "show in
    // transcript" button) with a brief highlight on the target message.
    const [flashTarget, setFlashTarget] = useState(null);
    useEffect(() => {
        if (!flashTarget)
            return;
        const timer = setTimeout(() => setFlashTarget(null), 1600);
        return () => clearTimeout(timer);
    }, [flashTarget]);
    // Scroll a visible row to center and flash the target message inside it.
    const performScrollToRow = useCallback((rowIndex, target) => {
        // Explicit navigation away from the tail — pause follow so the
        // auto-scroll driver doesn't yank the viewport straight back down,
        // and engage the same cooldown scrollToBottom uses so the scroll
        // events this triggers short-circuit handleScroll. Without it, Rule 3
        // (near-bottom → resume follow) would re-enable follow whenever the
        // target sits near the bottom, and the next streaming height change
        // would pull the viewport back to the tail. An instant (non-smooth)
        // scroll keeps that cooldown window short and deterministic.
        followPausedByUserRef.current = true;
        setShouldFollow(false);
        scrollCooldownCount.current += 1;
        const gen = scrollCooldownCount.current;
        scrollCooldown.current = true;
        if (useVirtualScroll) {
            virtualizer.scrollToIndex(rowIndex, { align: 'center' });
        }
        else {
            containerRef.current
                ?.querySelector(`[data-index="${rowIndex}"]`)
                ?.scrollIntoView({ block: 'center' });
        }
        // Release once the scroll has settled (the virtualizer may re-scroll
        // a frame or two later after measuring the target row).
        setTimeout(() => {
            if (scrollCooldownCount.current === gen) {
                scrollCooldown.current = false;
                scheduleSessionTimelineRangeUpdate();
                scheduleScrollOverflowReport();
            }
        }, 150);
        setFlashTarget(null);
        requestAnimationFrame(() => setFlashTarget(target));
    }, [
        useVirtualScroll,
        virtualizer,
        setShouldFollow,
        scheduleSessionTimelineRangeUpdate,
        scheduleScrollOverflowReport,
    ]);
    const scrollToMessageState = useRef({
        visibleItems: [],
        displayItems: [],
        headerOffset: 0,
        performScrollToRow: () => { },
    });
    scrollToMessageState.current = {
        visibleItems,
        displayItems,
        headerOffset,
        performScrollToRow,
    };
    // A scroll target that currently sits inside a collapsed turn: expand the
    // turn, then finish the scroll once its rows materialize in `visibleItems`.
    const pendingScrollRef = useRef(null);
    const scrollToMessage = useCallback((messageId, callId) => {
        const { visibleItems, displayItems, headerOffset, performScrollToRow } = scrollToMessageState.current;
        const visibleIndex = findDisplayItemIndex(visibleItems, messageId, callId);
        if (visibleIndex >= 0) {
            const visibleItem = visibleItems[visibleIndex];
            if (visibleItem?.type === 'turn_content' && visibleItem.collapsed) {
                pendingScrollRef.current = { messageId, callId };
                setCollapseOverrides((prev) => {
                    if (prev.get(visibleItem.turnId) === true)
                        return prev;
                    const next = new Map(prev);
                    next.set(visibleItem.turnId, true);
                    return next;
                });
                return true;
            }
            pendingScrollRef.current = null;
            performScrollToRow(visibleIndex + headerOffset, {
                messageId,
                callId,
            });
            return true;
        }
        // Not on screen — it may be folded inside a collapsed turn. Locate it
        // in the full list, expand that turn, and defer the scroll.
        const fullIndex = findDisplayItemIndex(displayItems, messageId, callId);
        if (fullIndex < 0)
            return false;
        const turnId = findTurnIdForIndex(displayItems, fullIndex);
        if (!turnId)
            return false;
        pendingScrollRef.current = { messageId, callId };
        setCollapseOverrides((prev) => {
            if (prev.get(turnId) === true)
                return prev;
            const next = new Map(prev);
            next.set(turnId, true);
            return next;
        });
        return true;
    }, []);
    useImperativeHandle(ref, () => ({ scrollToMessage, scrollToBottom: resumeBottomFollow }), [scrollToMessage, resumeBottomFollow]);
    // Flush a deferred scroll once the expanded turn's rows are visible.
    useEffect(() => {
        const pending = pendingScrollRef.current;
        if (!pending)
            return;
        const idx = findDisplayItemIndex(visibleItems, pending.messageId, pending.callId);
        if (idx < 0)
            return;
        pendingScrollRef.current = null;
        performScrollToRow(idx + headerOffset, pending);
    }, [visibleItems, headerOffset, performScrollToRow]);
    const loadOlderHistory = useCallback(async (allowRetry = false) => {
        const el = containerRef.current;
        if (!el ||
            !onLoadOlderHistory ||
            loadingOlderHistory ||
            olderHistoryLoadInFlight.current ||
            (olderHistoryRetryBlocked.current && !allowRetry)) {
            return;
        }
        olderHistoryRetryBlocked.current = false;
        olderHistoryLoadInFlight.current = true;
        const previousHeight = el.scrollHeight;
        const previousTop = el.scrollTop;
        followPausedByUserRef.current = true;
        try {
            await onLoadOlderHistory();
            setOlderHistoryAnchor({
                scrollHeight: previousHeight,
                scrollTop: previousTop,
            });
        }
        catch {
            olderHistoryRetryBlocked.current = true;
            olderHistoryLoadInFlight.current = false;
        }
    }, [loadingOlderHistory, onLoadOlderHistory]);
    // Rules 2 & 3: detect scroll direction to toggle follow mode.
    // Runs synchronously in the scroll handler — no rAF needed since
    // the browser already coalesces scroll events.
    const handleScroll = useCallback(() => {
        const el = getScrollElement();
        if (!el)
            return;
        const curr = el.scrollTop;
        if (hasOlderHistory && curr <= LOAD_OLDER_HISTORY_THRESHOLD_PX) {
            void loadOlderHistory(true);
        }
        if (scrollCooldown.current) {
            lastScrollTop.current = curr;
            return;
        }
        scheduleSessionTimelineRangeUpdate();
        const prev = lastScrollTop.current;
        lastScrollTop.current = curr;
        const distanceFromBottom = el.scrollHeight - curr - el.clientHeight;
        scheduleScrollOverflowReport();
        // Rule 2: scrolling up → pause follow
        if (curr < prev - 1) {
            // Container resizes can clamp scrollTop downward while the viewport is
            // still at the tail. Treat that as follow mode, not a manual scroll-up.
            const isNearBottom = distanceFromBottom < FOLLOW_BOTTOM_THRESHOLD_PX;
            const hasUserScrollIntent = Date.now() <= userScrollIntentUntil.current;
            if (isNearBottom) {
                followPausedByUserRef.current = false;
                setShouldFollow(true);
            }
            else if (hasUserScrollIntent) {
                followPausedByUserRef.current = true;
                setShouldFollow(false);
            }
            else if (!followPausedByUserRef.current) {
                setShouldFollow(false);
            }
            return;
        }
        // Rule 3: near bottom → resume follow
        // Run only after non-upward scrolls. Otherwise a tiny wheel-up near the
        // tail would pause follow and immediately re-enable it in the same event.
        if (distanceFromBottom < FOLLOW_BOTTOM_THRESHOLD_PX) {
            followPausedByUserRef.current = false;
            setShouldFollow(true);
        }
    }, [
        getScrollElement,
        hasOlderHistory,
        loadOlderHistory,
        scheduleScrollOverflowReport,
        scheduleSessionTimelineRangeUpdate,
        setShouldFollow,
    ]);
    useEffect(() => {
        const el = getScrollElement();
        if (!el)
            return;
        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => el.removeEventListener('scroll', handleScroll);
    }, [getScrollElement, handleScroll]);
    const loadOlderHistoryIfUnderfilled = useCallback(() => {
        if (!hasOlderHistory ||
            loadingOlderHistory ||
            catchingUp ||
            showLoadingSkeleton) {
            return;
        }
        const el = getScrollElement();
        if (!el || el.scrollHeight > el.clientHeight + 1)
            return;
        const previousLoad = lastUnderfillAutoLoad.current;
        if (previousLoad !== null &&
            previousLoad.loader === onLoadOlderHistory &&
            previousLoad.totalVirtualSize === totalVirtualSize) {
            olderHistoryRetryBlocked.current = true;
            return;
        }
        lastUnderfillAutoLoad.current = {
            loader: onLoadOlderHistory,
            totalVirtualSize,
        };
        void loadOlderHistory();
    }, [
        catchingUp,
        getScrollElement,
        hasOlderHistory,
        loadOlderHistory,
        loadingOlderHistory,
        onLoadOlderHistory,
        showLoadingSkeleton,
        totalVirtualSize,
    ]);
    useEffect(() => {
        loadOlderHistoryIfUnderfilled();
    }, [loadOlderHistoryIfUnderfilled, totalVirtualSize]);
    useEffect(() => {
        const el = getScrollElement();
        if (!el)
            return;
        const retryOlderHistoryAtTop = () => {
            if (olderHistoryRetryBlocked.current &&
                el.scrollTop <= LOAD_OLDER_HISTORY_THRESHOLD_PX) {
                void loadOlderHistory(true);
            }
        };
        const markFromWheel = (event) => {
            markUserScrollIntent();
            if (event.deltaY < 0)
                retryOlderHistoryAtTop();
        };
        const markFromTouch = () => {
            markUserScrollIntent();
            retryOlderHistoryAtTop();
        };
        const markFromPointer = (event) => {
            const rect = el.getBoundingClientRect();
            const scrollbarEdge = 20;
            if (event.clientX >= rect.right - scrollbarEdge ||
                event.clientY >= rect.bottom - scrollbarEdge) {
                markUserScrollIntent();
            }
        };
        const markFromKey = (event) => {
            if (event.key === 'ArrowUp' ||
                event.key === 'ArrowDown' ||
                event.key === 'PageUp' ||
                event.key === 'PageDown' ||
                event.key === 'Home' ||
                event.key === 'End' ||
                event.key === ' ') {
                markUserScrollIntent();
                if (event.key === 'ArrowUp' ||
                    event.key === 'PageUp' ||
                    event.key === 'Home') {
                    retryOlderHistoryAtTop();
                }
            }
        };
        el.addEventListener('wheel', markFromWheel, { passive: true });
        el.addEventListener('touchstart', markFromTouch, {
            passive: true,
        });
        el.addEventListener('pointerdown', markFromPointer, { passive: true });
        el.addEventListener('keydown', markFromKey, { passive: true });
        return () => {
            el.removeEventListener('wheel', markFromWheel);
            el.removeEventListener('touchstart', markFromTouch);
            el.removeEventListener('pointerdown', markFromPointer);
            el.removeEventListener('keydown', markFromKey);
        };
    }, [getScrollElement, loadOlderHistory, markUserScrollIntent]);
    useEffect(() => {
        const el = getScrollElement();
        if (!el || typeof ResizeObserver === 'undefined')
            return;
        const observer = new ResizeObserver(() => {
            scheduleScrollOverflowReport();
            loadOlderHistoryIfUnderfilled();
        });
        observer.observe(el);
        for (const child of Array.from(el.children)) {
            observer.observe(child);
        }
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node instanceof HTMLElement)
                        observer.observe(node);
                }
                for (const node of Array.from(mutation.removedNodes)) {
                    if (node instanceof HTMLElement)
                        observer.unobserve(node);
                }
            }
            scheduleScrollOverflowReport();
        });
        mutationObserver.observe(el, { childList: true });
        scheduleScrollOverflowReport();
        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [
        getScrollElement,
        loadOlderHistoryIfUnderfilled,
        scheduleScrollOverflowReport,
    ]);
    // Clear screen (e.g. /clear) → reset to follow mode, drop stale per-turn
    // collapse overrides, and disarm any deferred scroll so it can't fire
    // against the next session.
    useEffect(() => {
        if (messages.length === 0) {
            followPausedByUserRef.current = false;
            setShouldFollow(true);
            pendingScrollRef.current = null;
            setCollapseOverrides((prev) => (prev.size ? new Map() : prev));
        }
    }, [messages.length, setShouldFollow]);
    // Container-resize guard: when floating panels (e.g. TodoPanel)
    // appear or disappear the scroll container's clientHeight changes.
    // Snap back to bottom so the user doesn't lose their place while
    // follow mode is active.
    useEffect(() => {
        const el = containerRef.current;
        if (!el)
            return;
        const observer = new ResizeObserver(() => {
            scheduleSessionTimelineRangeUpdate();
            if (catchingUpRef.current)
                return;
            if (followPausedByUserRef.current)
                return;
            setShouldFollow(true);
            requestAnimationFrame(() => {
                if (!catchingUpRef.current && !followPausedByUserRef.current) {
                    scrollToBottom();
                }
            });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [scrollToBottom, scheduleSessionTimelineRangeUpdate, setShouldFollow]);
    // Rule 4: new user message → force follow on so the model's reply
    // scrolls into view as it streams in.
    useLayoutEffect(() => {
        const lastId = getLastUserMessageId(messages);
        if (catchingUp || loadingTranscript || prevLoadingTranscript.current) {
            prevLastUserMsgId.current = lastId;
            didTrackLastUserMsgRef.current = true;
            pendingNewUserSmoothScroll.current = false;
            prevLoadingTranscript.current = loadingTranscript;
            return;
        }
        prevLoadingTranscript.current = loadingTranscript;
        if (!didTrackLastUserMsgRef.current) {
            prevLastUserMsgId.current = lastId;
            didTrackLastUserMsgRef.current = true;
            pendingNewUserSmoothScroll.current = false;
            return;
        }
        const lastMessage = getLastMessage(messages);
        if (lastId &&
            lastMessage?.role === 'user' &&
            lastId !== prevLastUserMsgId.current) {
            followPausedByUserRef.current = false;
            setShouldFollow(true);
            // A new prompt supersedes any pending "Show in transcript" scroll.
            pendingScrollRef.current = null;
            pendingNewUserSmoothScroll.current = true;
        }
        else {
            pendingNewUserSmoothScroll.current = false;
        }
        prevLastUserMsgId.current = lastId;
    }, [messages, catchingUp, loadingTranscript, setShouldFollow]);
    // Rule 5: session restore — when catchingUp flips from true → falsy,
    // replay just finished. Scroll to bottom once so the user sees the
    // latest content without the viewport fighting the replay.
    useLayoutEffect(() => {
        if (prevCatchingUp.current && !catchingUp) {
            followPausedByUserRef.current = false;
            setShouldFollow(true);
            scrollToBottom('auto');
        }
        prevCatchingUp.current = catchingUp;
    }, [catchingUp, scrollToBottom, setShouldFollow]);
    useLayoutEffect(() => {
        if (loadingTranscript) {
            pendingTranscriptBottomScroll.current = true;
            return;
        }
        if (!pendingTranscriptBottomScroll.current)
            return;
        if (catchingUp || messages.length === 0)
            return;
        pendingTranscriptBottomScroll.current = false;
        followPausedByUserRef.current = false;
        setShouldFollow(true);
        pendingScrollRef.current = null;
        if (transcriptBottomScrollFrame.current !== undefined) {
            window.cancelAnimationFrame(transcriptBottomScrollFrame.current);
        }
        if (transcriptBottomScrollSettleFrame.current !== undefined) {
            window.cancelAnimationFrame(transcriptBottomScrollSettleFrame.current);
        }
        const scrollIfStillFollowing = () => {
            if (catchingUpRef.current || followPausedByUserRef.current)
                return;
            setShouldFollow(true);
            scrollToBottom('auto');
        };
        transcriptBottomScrollFrame.current = window.requestAnimationFrame(() => {
            transcriptBottomScrollFrame.current = undefined;
            scrollIfStillFollowing();
            transcriptBottomScrollSettleFrame.current =
                window.requestAnimationFrame(() => {
                    transcriptBottomScrollSettleFrame.current = undefined;
                    scrollIfStillFollowing();
                });
        });
    }, [
        catchingUp,
        loadingTranscript,
        messages.length,
        scrollToBottom,
        setShouldFollow,
    ]);
    useLayoutEffect(() => {
        const insetChanged = prevBottomOverlayInset.current !== bottomOverlayInset;
        prevBottomOverlayInset.current = bottomOverlayInset;
        if (!insetChanged)
            return;
        if (catchingUp)
            return;
        if (followPausedByUserRef.current)
            return;
        setShouldFollow(true);
        requestAnimationFrame(() => {
            if (!catchingUpRef.current && !followPausedByUserRef.current) {
                scrollToBottom('auto');
            }
        });
    }, [bottomOverlayInset, catchingUp, scrollToBottom, setShouldFollow]);
    const runningExecutionKey = useMemo(() => latestActiveExecutionKey(visibleItems), [visibleItems]);
    // Tool summaries and parallel-agent boxes can grow after their first
    // render, which used to leave the row clipped behind the fixed composer.
    // Instead of observing every row resize (too noisy while streaming), scroll
    // once when a new execution row starts, and only while the user is already
    // following the bottom.
    useLayoutEffect(() => {
        if (catchingUp)
            return;
        if (!runningExecutionKey) {
            prevActiveExecutionKey.current = null;
            return;
        }
        if (runningExecutionKey === prevActiveExecutionKey.current)
            return;
        prevActiveExecutionKey.current = runningExecutionKey;
        if (shouldFollow.current || !followPausedByUserRef.current) {
            requestAnimationFrame(() => {
                if (!followPausedByUserRef.current) {
                    setShouldFollow(true);
                    scrollToBottom();
                }
            });
        }
    }, [catchingUp, runningExecutionKey, scrollToBottom, setShouldFollow]);
    // Rule 6: an inline picker/dialog (tailContent) just appeared. It renders
    // at the very bottom of the virtualized list, so if the user had scrolled
    // up it would open below the fold and the action would look like a no-op.
    // Only opt-in callers (autoScrollTailIntoView) force-follow it into view, so
    // unrelated tail panels keep the reader's scroll position.
    useEffect(() => {
        if (autoScrollTailIntoView &&
            hasTailContent &&
            !prevHasTailContent.current) {
            followPausedByUserRef.current = false;
            setShouldFollow(true);
            // Re-check follow inside the frame: if the user scrolls up in the gap
            // before it fires (Rule 2 clears the flag), don't fight them.
            requestAnimationFrame(() => {
                if (!followPausedByUserRef.current)
                    scrollToBottom();
            });
        }
        prevHasTailContent.current = hasTailContent;
    }, [
        autoScrollTailIntoView,
        hasTailContent,
        scrollToBottom,
        setShouldFollow,
    ]);
    const renderVirtualItem = useCallback((index) => {
        const renderDisplayItem = (displayItem, isLatest) => {
            if (displayItem.type === 'parallel_agents') {
                return (_jsx(MessageTimestamp, { timestamp: displayItem.timestamp, children: _jsx("div", { className: displayItemMatchesLocateTarget(displayItem, flashTarget)
                            ? flashStyles.flash
                            : undefined, children: _jsx(ParallelAgentsGroup, { agents: displayItem.agents, pendingApproval: pendingApproval }) }) }));
            }
            if (displayItem.type === 'turn_outputs') {
                return (_jsx(TurnOutputs, { changes: displayItem.changes, turnId: displayItem.turnId, artifacts: displayItem.artifacts, scheduledTasks: displayItem.scheduledTasks, workspaceCwd: workspaceCwd, onOpenRequest: onTurnOutputOpen, onReviewChanges: onReviewChanges ?? noopTurnOutputAction, onOpenArtifact: onOpenArtifact ?? noopTurnOutputAction, onOpenScheduledTask: onOpenScheduledTask ?? noopTurnOutputAction }));
            }
            if (displayItem.type === 'turn_collapse') {
                return (_jsx(TurnCollapseRow, { turnCollapse: displayItem.turnCollapse, onToggleCollapse: handleToggleCollapse }));
            }
            if (displayItem.type === 'turn_content') {
                return (_jsx(TurnContent, { collapsed: displayItem.collapsed, children: displayItem.items.map((child) => (_jsx("div", { className: getChatRowClassName(child), children: renderDisplayItem(child, false) }, getDisplayItemVirtualKey(child)))) }));
            }
            const finalAssistantTurnId = displayItem.message.role === 'assistant'
                ? finalAssistantTurnIdByAssistantId.get(displayItem.message.id)
                : undefined;
            let assistantTurnFooterInfo;
            if (displayItem.message.role === 'assistant' &&
                finalAssistantTurnId) {
                assistantTurnFooterInfo = {
                    turnId: finalAssistantTurnId,
                    message: {
                        id: displayItem.message.id,
                        content: displayItem.message.content,
                        isStreaming: displayItem.message.isStreaming,
                        timestamp: displayItem.message.timestamp,
                    },
                };
            }
            return (_jsx(MessageItem, { message: displayItem.message, pendingApproval: pendingApproval, onShowContextDetail: onShowContextDetail, workspaceCwd: workspaceCwd, isLatest: isLatest, showRetryHint: showRetryHint, onRetryClick: onRetryClick, onBranchSession: onBranchSession, showAssistantActions: displayItem.message.role === 'assistant' &&
                    finalAssistantTurnIdByAssistantId.has(displayItem.message.id), showAssistantBranch: displayItem.message.role === 'assistant' &&
                    displayItem.message.id === lastCompletedAssistantId, isLocateFlashing: displayItemMatchesLocateTarget(displayItem, flashTarget), assistantTurnFooterInfo: assistantTurnFooterInfo, generateContent: generateContent }));
        };
        if (hasHeader && index === HEADER_INDEX) {
            return welcomeHeader;
        }
        if (hasTailContent && index === tailContentIndex) {
            return tailContent;
        }
        const itemIndex = index - headerOffset;
        const item = visibleItems[itemIndex];
        if (!item)
            return null;
        return renderDisplayItem(item, itemIndex === visibleItems.length - 1);
    }, [
        hasHeader,
        welcomeHeader,
        hasTailContent,
        tailContent,
        tailContentIndex,
        pendingApproval,
        onShowContextDetail,
        generateContent,
        headerOffset,
        visibleItems,
        flashTarget,
        finalAssistantTurnIdByAssistantId,
        lastCompletedAssistantId,
        workspaceCwd,
        showRetryHint,
        onRetryClick,
        onBranchSession,
        handleToggleCollapse,
        onOpenArtifact,
        onOpenScheduledTask,
        onReviewChanges,
        onTurnOutputOpen,
    ]);
    const getRowClassName = useCallback((item) => item ? getChatRowClassName(item) : undefined, []);
    // ── Single auto-scroll driver (rules 1, 5, 6) ──────────────────────
    // Fires whenever the virtualizer's total content height changes —
    // this captures every scenario: streaming tokens appending, tool
    // cards expanding/collapsing, approval cards appearing, etc.
    //
    // Rule 5: during replay (catchingUp) → skip, avoid fighting rapid
    //         transcript replay. The catchingUp→ready transition effect
    //         above handles the final scroll.
    // Rule 1: when shouldFollow is true → scroll to bottom.
    // Rule 6: scrollToBottom itself checks scrollHeight <= clientHeight
    //         and is a no-op when there's no overflow.
    useLayoutEffect(() => {
        if (catchingUp)
            return;
        const isNewUserMessage = pendingNewUserSmoothScroll.current;
        if (scrollCooldown.current && !isNewUserMessage)
            return;
        // Preserve the new-prompt scroll even if a previous disclosure resize is
        // still settling; it targets the latest virtualizer size from this render.
        if (pendingFollowRecheck.current && !isNewUserMessage)
            return;
        if (shouldFollow.current ||
            isNewUserMessage ||
            !followPausedByUserRef.current) {
            if (!followPausedByUserRef.current) {
                setShouldFollow(true);
            }
            scrollToBottom(isNewUserMessage ? 'smooth' : 'auto');
            pendingNewUserSmoothScroll.current = false;
        }
    }, [
        totalVirtualSize,
        messages,
        totalCount,
        catchingUp,
        scrollToBottom,
        setShouldFollow,
    ]);
    useLayoutEffect(() => {
        scheduleScrollOverflowReport();
    }, [messages, scheduleScrollOverflowReport, totalCount, totalVirtualSize]);
    return (_jsxs("div", { ref: containerRef, className: joinClassNames(styles.list, hasHeader && centerWelcomeHeader
            ? styles.listWithWelcomeHeader
            : undefined), "data-web-shell-message-list": true, onClickCapture: handleDisclosureClickCapture, children: [showLoadingSkeleton && (_jsx(LoadingTranscriptSkeleton, { label: t('editor.sessionLoading') })), loadingOlderHistory && !showLoadingSkeleton && (_jsx("div", { className: styles.historyStatus, role: "status", children: t('history.loadingEarlier') })), historyCapacityReached && !showLoadingSkeleton && (_jsx("div", { className: styles.historyStatus, role: "status", children: t('history.capacityReached') })), _jsx(SessionTimeline, { entries: sessionTimelineEntries, currentTurnId: currentTimelineTurnId, currentRange: sessionTimelineRange, hidden: !isSessionTimelineVisible || !hasEnoughSessionTimelineEntries, onSelect: scrollToMessage }), useVirtualScroll ? (_jsx("div", { className: styles.virtualSizer, style: {
                    height: totalVirtualSize,
                }, children: virtualItems.map((virtualRow) => (_jsx("div", { "data-index": virtualRow.index, ref: virtualizer.measureElement, className: joinClassNames(styles.virtualRow, getRowClassName(visibleItems[virtualRow.index - headerOffset])), "data-web-shell-message-row": true, style: {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        transform: `translateY(${virtualRow.start}px)`,
                    }, children: renderVirtualItem(virtualRow.index) }, virtualRow.key))) })) : (Array.from({ length: totalCount }, (_, index) => {
                const key = getItemKey(index);
                const item = visibleItems[index - headerOffset];
                return (_jsx("div", { "data-index": index, className: getRowClassName(item), "data-web-shell-message-row": true, children: renderVirtualItem(index) }, key));
            }))] }));
}));
//# sourceMappingURL=MessageList.js.map