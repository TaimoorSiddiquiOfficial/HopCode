import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * HopCode Web Dashboard — Root App Component
 */
import { useState, useEffect, useCallback } from 'react';
import SessionList from './components/SessionList.js';
import ChatPanel from './components/ChatPanel.js';
import StatsBar from './components/StatsBar.js';
export default function App() {
    const [sessions, setSessions] = useState([]);
    const [totalSessions, setTotalSessions] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [search, setSearch] = useState('');
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [selectedSession, setSelectedSession] = useState(null);
    const [stats, setStats] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const fetchSessions = useCallback(async (resetPage = false) => {
        setLoadingSessions(true);
        try {
            const nextPage = resetPage ? 1 : page;
            const params = new URLSearchParams({
                page: String(nextPage),
                limit: '20',
            });
            if (search)
                params.set('search', search);
            const res = await fetch(`/api/sessions?${params}`);
            const data = (await res.json());
            setSessions((prev) => resetPage ? data.items : [...prev, ...data.items]);
            setTotalSessions(data.total);
            setHasMore(data.hasMore);
            if (resetPage)
                setPage(1);
        }
        catch (e) {
            console.error('Failed to load sessions:', e);
        }
        finally {
            setLoadingSessions(false);
        }
    }, [page, search]);
    // Load sessions on mount and when search changes
    useEffect(() => {
        void fetchSessions(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);
    // Load global stats on mount
    useEffect(() => {
        fetch('/api/stats')
            .then((r) => r.json())
            .then((d) => setStats(d))
            .catch(console.error);
    }, []);
    const handleLoadMore = useCallback(() => {
        setPage((p) => p + 1);
        void fetchSessions(false);
    }, [fetchSessions]);
    return (_jsxs("div", { className: "dashboard-root", children: [_jsxs("header", { className: "dashboard-header", children: [_jsxs("div", { className: "dashboard-header-left", children: [_jsx("button", { className: "sidebar-toggle", onClick: () => setSidebarOpen((o) => !o), title: sidebarOpen ? 'Hide sidebar' : 'Show sidebar', children: "\u2630" }), _jsx("span", { className: "dashboard-logo", children: "\uD83D\uDC07 HopCode Dashboard" })] }), _jsx(StatsBar, { stats: stats, totalSessions: totalSessions })] }), _jsxs("div", { className: "dashboard-body", children: [sidebarOpen && (_jsx("aside", { className: "dashboard-sidebar", children: _jsx(SessionList, { sessions: sessions, selectedId: selectedSession?.sessionId ?? null, search: search, onSearchChange: (q) => {
                                setSearch(q);
                            }, onSelect: setSelectedSession, hasMore: hasMore, isLoading: loadingSessions, onLoadMore: handleLoadMore }) })), _jsx("main", { className: "dashboard-main", children: selectedSession ? (_jsx(ChatPanel, { session: selectedSession })) : (_jsxs("div", { className: "dashboard-empty", children: [_jsx("div", { className: "dashboard-empty-icon", children: "\uD83D\uDC07" }), _jsx("h2", { children: "Select a session" }), _jsx("p", { children: "Choose a session from the sidebar to view the conversation." }), stats && (_jsxs("p", { className: "dashboard-empty-hint", children: ["Reading from ", _jsx("code", { children: stats.hopcodeDir })] }))] })) })] })] }));
}
//# sourceMappingURL=App.js.map