import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function timeAgo(ms) {
    const diff = Date.now() - ms;
    const mins = Math.floor(diff / 60_000);
    const hours = Math.floor(diff / 3_600_000);
    const days = Math.floor(diff / 86_400_000);
    if (mins < 1)
        return 'just now';
    if (mins < 60)
        return `${mins}m ago`;
    if (hours < 24)
        return `${hours}h ago`;
    if (days < 7)
        return `${days}d ago`;
    return new Date(ms).toLocaleDateString();
}
export default function SessionList({ sessions, selectedId, search, onSearchChange, onSelect, hasMore, isLoading, onLoadMore, }) {
    return (_jsxs("div", { className: "session-list", children: [_jsx("div", { className: "session-list-header", children: _jsx("input", { className: "session-search", type: "search", placeholder: "Search sessions\u2026", value: search, onChange: (e) => onSearchChange(e.target.value) }) }), _jsxs("div", { className: "session-list-items", children: [sessions.length === 0 && !isLoading && (_jsx("div", { className: "session-list-empty", children: search ? 'No sessions match your search.' : 'No sessions found.' })), sessions.map((s) => (_jsxs("button", { className: `session-item ${s.sessionId === selectedId ? 'selected' : ''}`, onClick: () => onSelect(s), children: [_jsx("div", { className: "session-item-prompt", children: s.prompt }), _jsxs("div", { className: "session-item-meta", children: [_jsx("span", { className: "session-item-time", children: timeAgo(s.mtime) }), s.model && (_jsx("span", { className: "session-item-model", children: s.model.split('/').pop() })), s.gitBranch && (_jsxs("span", { className: "session-item-branch", children: ["\u2387 ", s.gitBranch] }))] }), _jsx("div", { className: "session-item-cwd", title: s.cwd, children: s.cwd.replace(/\\/g, '/').split('/').slice(-2).join('/') })] }, s.sessionId))), isLoading && _jsx("div", { className: "session-list-loading", children: "Loading\u2026" }), hasMore && !isLoading && (_jsx("button", { className: "session-load-more", onClick: onLoadMore, children: "Load more" }))] })] }));
}
//# sourceMappingURL=SessionList.js.map