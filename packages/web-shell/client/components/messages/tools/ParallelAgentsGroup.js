import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../../../i18n';
import { formatElapsed, formatLiveElapsed, StatusIcon, truncateText, } from './toolDisplay';
import { getTaskExecutionRecord, getAgentType, getAgentDescription, getAgentCurrentToolHint, formatTokenCount, getAgentCancellationReason, getAgentDisplayStatus, toolContainsCallId, } from '../toolFormatting';
import { SubAgentPanel } from './SubAgentPanel';
import styles from './ParallelAgentsGroup.module.css';
function formatDuration(ms) {
    const totalSec = Math.round(ms / 1000);
    if (totalSec < 60)
        return `${totalSec}s`;
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}
/**
 * Geometry for the shared-axis mini timeline: one bar per agent against
 * the group's combined wall-clock span, so overlap and relative duration
 * read at a glance. Returns null when the bars would not be comparable
 * (an agent without a start time) or carry no information (single agent,
 * sub-second span) — the list then renders without a timeline.
 */
export function computeAgentsTimeline(agents, now) {
    if (agents.length < 2)
        return null;
    const starts = [];
    for (const agent of agents) {
        if (typeof agent.startTime !== 'number')
            return null;
        starts.push(agent.startTime);
    }
    const ends = agents.map((agent, i) => agent.status === 'in_progress'
        ? Math.max(now, starts[i])
        : Math.max(agent.endTime ?? starts[i], starts[i]));
    const t0 = Math.min(...starts);
    const span = Math.max(...ends) - t0;
    if (span < 1000)
        return null;
    const rows = new Map();
    agents.forEach((agent, i) => {
        // Keep a visible sliver for near-instant agents, clamped so it never
        // overflows the right edge.
        const width = Math.max((ends[i] - starts[i]) / span, 0.02);
        const left = Math.min((starts[i] - t0) / span, 1 - width);
        rows.set(agent.callId, {
            leftPct: left * 100,
            widthPct: width * 100,
            running: agent.status === 'in_progress',
        });
    });
    // Ruler at 0 / step / 2·step… with a "nice" step (1-2-5 × 10ᵏ seconds),
    // stopping short of the right edge so labels don't collide with it.
    const targetSec = Math.max(span / 1000 / 2.2, 1);
    const pow = Math.pow(10, Math.floor(Math.log10(targetSec)));
    const stepSec = [5, 2, 1].map((m) => m * pow).find((s) => s <= targetSec) ?? pow;
    const ticks = [];
    for (let m = 0; ticks.length < 4; m++) {
        const atMs = m * stepSec * 1000;
        if (atMs > span * 0.92)
            break;
        ticks.push({ leftPct: (atMs / span) * 100, label: formatDuration(atMs) });
    }
    return { rows, ticks };
}
function getAgentStats(agent, now) {
    const parts = [];
    const taskExec = getTaskExecutionRecord(agent.rawOutput);
    const stats = taskExec?.['executionSummary'];
    const elapsed = stats && typeof stats['totalDurationMs'] === 'number'
        ? formatDuration(stats['totalDurationMs'])
        : formatElapsed(agent.startTime, agent.endTime ?? (agent.status === 'in_progress' ? now : undefined));
    if (elapsed)
        parts.push(elapsed);
    const tokens = taskExec &&
        typeof taskExec['tokenCount'] === 'number' &&
        taskExec['tokenCount'] > 0
        ? taskExec['tokenCount']
        : stats &&
            typeof stats['outputTokens'] === 'number' &&
            stats['outputTokens'] > 0
            ? stats['outputTokens']
            : 0;
    if (tokens > 0) {
        parts.push(formatTokenCount(tokens));
    }
    const reason = getAgentCancellationReason(agent);
    if (reason)
        parts.push(truncateText(reason, 80));
    return parts.join(' · ');
}
function ToolGroupIcon() {
    return (_jsx("svg", { className: styles.summaryToolIcon, width: "14", height: "14", viewBox: "0 0 1024 1024", fill: "currentColor", "aria-hidden": "true", children: _jsx("path", { d: "M770.08 96.32c1.728.64 3.072 1.984 3.712 3.712l38.848 107.584c.64 1.728 1.984 3.104 3.712 3.712l107.584 38.848a6.144 6.144 0 0 1 0 11.584l-107.584 38.848a6.144 6.144 0 0 0-3.712 3.712l-38.848 107.584a6.144 6.144 0 0 1-11.584 0L723.36 304.32a6.144 6.144 0 0 0-3.712-3.712L612.064 261.76a6.144 6.144 0 0 1 0-11.584l107.584-38.848a6.144 6.144 0 0 0 3.712-3.712l38.848-107.584c1.184-3.2 4.704-4.8 7.872-3.68zM576 160H384q-119.296 0-203.648 84.352Q96 328.704 96 448v192q0 119.296 84.352 203.648Q264.704 928 384 928h256q119.296 0 203.648-84.352Q928 759.296 928 640V512h-64v128q0 92.8-65.6 158.4Q732.8 864 640 864H384q-92.8 0-158.4-65.6Q160 732.8 160 640V448q0-92.8 65.6-158.4Q291.2 224 384 224h192v-64zm96 248.224L568.224 512 672 615.776l45.248-45.28L658.752 512l58.496-58.496L672 408.224zM320 608V448h64v160h-64z", stroke: "currentColor", strokeWidth: "28", strokeLinejoin: "round" }) }));
}
export function ParallelAgentsGroup({ agents, pendingApproval, }) {
    const { t } = useI18n();
    const [groupExpanded, setGroupExpanded] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [now, setNow] = useState(() => Date.now());
    const liveStartedAtRef = useRef(Date.now());
    const hasRunning = agents.some((a) => a.status === 'in_progress');
    useEffect(() => {
        if (!hasRunning)
            return;
        liveStartedAtRef.current = Date.now();
        setNow(Date.now());
    }, [hasRunning]);
    useEffect(() => {
        if (!hasRunning)
            return;
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [hasRunning]);
    const runningDuration = hasRunning
        ? formatLiveElapsed(now - liveStartedAtRef.current)
        : '';
    const doneCount = agents.filter((a) => a.status === 'completed' || a.status === 'failed').length;
    const total = agents.length;
    const approvalAgent = pendingApproval?.toolCallId
        ? agents.find((a) => toolContainsCallId(a, pendingApproval.toolCallId))
        : undefined;
    const showGroup = groupExpanded || !!approvalAgent;
    const timeline = showGroup ? computeAgentsTimeline(agents, now) : null;
    const summaryStatus = agents.some((a) => getAgentDisplayStatus(a) === 'failed')
        ? 'failed'
        : hasRunning
            ? 'in_progress'
            : 'completed';
    return (_jsxs("div", { className: styles.wrap, children: [_jsxs("button", { type: "button", className: styles.summary, onClick: () => setGroupExpanded((value) => !value), "aria-expanded": showGroup, title: showGroup ? t('tool.collapseHint') : t('tool.expand'), children: [summaryStatus === 'failed' ? (_jsx("span", { className: styles.summaryStatus, children: _jsx(StatusIcon, { status: summaryStatus }) })) : (_jsx("span", { className: styles.summaryIcon, "aria-hidden": "true", children: _jsx(ToolGroupIcon, {}) })), _jsxs("span", { className: hasRunning
                            ? `${styles.summaryText} ${styles.summaryTextActive}`
                            : styles.summaryText, children: [t('parallelAgents.title'), runningDuration && _jsxs(_Fragment, { children: [" ", runningDuration] }), _jsx("span", { className: styles.summaryDot, children: "\u00B7" }), t('parallelAgents.done', { done: doneCount, total })] }), _jsx("span", { className: showGroup ? styles.chevronDown : styles.chevronRight, "aria-hidden": "true" })] }), showGroup && (_jsxs("div", { className: styles.group, children: [_jsx("div", { className: styles.list, children: agents.map((agent) => {
                            const agentType = getAgentType(agent);
                            const desc = getAgentDescription(agent);
                            const toolHint = getAgentCurrentToolHint(agent, t);
                            const stats = getAgentStats(agent, now);
                            const status = getAgentDisplayStatus(agent);
                            const isExpanded = expandedId === agent.callId;
                            const track = timeline?.rows.get(agent.callId);
                            return (_jsxs("div", { children: [_jsxs("div", { className: styles.row, onClick: () => setExpandedId(isExpanded ? null : agent.callId), children: [_jsx(StatusIcon, { status: status }), _jsxs("span", { className: styles.rowDesc, children: [truncateText(desc || agentType, 50), toolHint && (_jsx("span", { className: styles.rowTool, children: ` (${toolHint})` }))] }), stats && _jsx("span", { className: styles.rowStats, children: stats })] }), track && (_jsx("div", { className: styles.track, "aria-hidden": "true", children: _jsx("span", { className: track.running
                                                ? `${styles.bar} ${styles.barRunning}`
                                                : styles.bar, style: {
                                                left: `${track.leftPct}%`,
                                                width: `${track.widthPct}%`,
                                            } }) })), isExpanded && (_jsx("div", { className: styles.detail, children: _jsx(SubAgentPanel, { tool: agent, hideHeader: true }) }))] }, agent.callId));
                        }) }), timeline && timeline.ticks.length >= 2 && (_jsx("div", { className: styles.ruler, "aria-hidden": "true", children: timeline.ticks.map((tick) => (_jsx("span", { className: styles.tick, style: { left: `${tick.leftPct}%` }, children: tick.label }, tick.label))) }))] }))] }));
}
//# sourceMappingURL=ParallelAgentsGroup.js.map