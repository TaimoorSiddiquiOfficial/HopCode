import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
function formatNum(n) {
    if (n >= 1_000_000)
        return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000)
        return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}
export default function StatsBar({ stats, totalSessions }) {
    return (_jsxs("div", { className: "stats-bar", children: [_jsxs("div", { className: "stats-item", children: [_jsx("span", { className: "stats-value", children: formatNum(totalSessions) }), _jsx("span", { className: "stats-label", children: "sessions" })] }), stats && (_jsxs(_Fragment, { children: [_jsx("div", { className: "stats-divider" }), _jsxs("div", { className: "stats-item", children: [_jsx("span", { className: "stats-value", children: formatNum(stats.totalMessages) }), _jsx("span", { className: "stats-label", children: "messages" })] }), _jsx("div", { className: "stats-divider" }), _jsxs("div", { className: "stats-item", children: [_jsx("span", { className: "stats-value", children: formatNum(stats.totalTokens) }), _jsx("span", { className: "stats-label", children: "tokens" })] }), stats.topModel && (_jsxs(_Fragment, { children: [_jsx("div", { className: "stats-divider" }), _jsxs("div", { className: "stats-item", children: [_jsx("span", { className: "stats-value stats-model", children: stats.topModel.split('/').pop() }), _jsx("span", { className: "stats-label", children: "top model" })] })] }))] }))] }));
}
//# sourceMappingURL=StatsBar.js.map