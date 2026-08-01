import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChatPanel — Main area showing chat messages for a selected session
 */
import { useState, useEffect, useRef } from 'react';
import { ChatViewer } from '@hoptrendy/webui';
/** Compute token totals from records */
function computeTokens(records) {
    let prompt = 0;
    let completion = 0;
    for (const r of records) {
        if (r.usageMetadata) {
            prompt += r.usageMetadata.promptTokenCount ?? 0;
            completion += r.usageMetadata.candidatesTokenCount ?? 0;
        }
    }
    return { prompt, completion, total: prompt + completion };
}
/** Convert ChatRecord → ChatMessageData (webui format) */
function toChatMessageData(record) {
    if (record.type === 'system')
        return null;
    if (record.type === 'tool_result')
        return null;
    return {
        uuid: record.uuid,
        parentUuid: record.parentUuid,
        sessionId: record.sessionId,
        timestamp: record.timestamp,
        type: record.type === 'user' ? 'user' : 'assistant',
        message: record.message,
        model: record.model,
        cwd: record.cwd,
        gitBranch: record.gitBranch,
    };
}
export default function ChatPanel({ session }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const prevSessionId = useRef(null);
    useEffect(() => {
        if (prevSessionId.current === session.sessionId)
            return;
        prevSessionId.current = session.sessionId;
        setLoading(true);
        setError(null);
        setRecords([]);
        const params = new URLSearchParams({ project: session.projectDir });
        fetch(`/api/sessions/${session.sessionId}?${params}`)
            .then((r) => {
            if (!r.ok)
                throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
            .then((data) => {
            setRecords(data.records);
        })
            .catch((e) => {
            setError(e instanceof Error ? e.message : 'Failed to load session');
        })
            .finally(() => setLoading(false));
    }, [session.sessionId, session.projectDir]);
    const messages = records
        .map(toChatMessageData)
        .filter((m) => m !== null);
    const tokens = computeTokens(records);
    const models = [...new Set(records.map((r) => r.model).filter(Boolean))];
    return (_jsxs("div", { className: "chat-panel", children: [_jsxs("div", { className: "chat-panel-header", children: [_jsxs("div", { className: "chat-panel-title", children: [_jsx("span", { className: "chat-panel-prompt", title: session.prompt, children: session.prompt.length > 80
                                    ? session.prompt.slice(0, 80) + '…'
                                    : session.prompt }), _jsx("span", { className: "chat-panel-id", children: session.sessionId.slice(0, 8) })] }), _jsxs("div", { className: "chat-panel-meta", children: [_jsxs("span", { title: session.cwd, children: ["\uD83D\uDCC1 ", session.cwd] }), session.gitBranch && _jsxs("span", { children: ["\u2387 ", session.gitBranch] }), models.length > 0 && (_jsxs("span", { children: ["\uD83E\uDD16 ", models.map((m) => m.split('/').pop()).join(', ')] })), tokens.total > 0 && (_jsxs("span", { title: `${tokens.prompt} prompt + ${tokens.completion} completion`, children: ["\uD83D\uDD22 ", tokens.total.toLocaleString(), " tokens"] })), _jsxs("span", { children: ["\uD83D\uDCAC", ' ', records.filter((r) => r.type === 'user' || r.type === 'assistant')
                                        .length, ' ', "messages"] })] })] }), _jsxs("div", { className: "chat-panel-body", children: [loading && _jsx("div", { className: "chat-panel-state", children: "Loading messages\u2026" }), error && (_jsxs("div", { className: "chat-panel-state chat-panel-error", children: ["\u26A0\uFE0F ", error] })), !loading && !error && (_jsx(ChatViewer, { messages: messages, autoScroll: false, theme: "dark", emptyMessage: "No displayable messages in this session." }))] })] }));
}
//# sourceMappingURL=ChatPanel.js.map