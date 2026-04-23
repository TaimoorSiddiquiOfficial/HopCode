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

export interface SessionMeta {
  sessionId: string;
  projectDir: string;
  filePath: string;
  mtime: number;
  startTime: string;
  cwd: string;
  prompt: string;
  gitBranch?: string;
  messageCount: number;
  model?: string;
}

export interface GlobalStats {
  totalSessions: number;
  totalMessages: number;
  totalTokens: number;
  topModel: string | null;
  modelCounts: Record<string, number>;
  hopcodeDir: string;
}

export default function App() {
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedSession, setSelectedSession] = useState<SessionMeta | null>(
    null,
  );
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchSessions = useCallback(
    async (resetPage = false) => {
      setLoadingSessions(true);
      try {
        const nextPage = resetPage ? 1 : page;
        const params = new URLSearchParams({
          page: String(nextPage),
          limit: '20',
        });
        if (search) params.set('search', search);
        const res = await fetch(`/api/sessions?${params}`);
        const data = (await res.json()) as {
          items: SessionMeta[];
          total: number;
          hasMore: boolean;
        };
        setSessions((prev) =>
          resetPage ? data.items : [...prev, ...data.items],
        );
        setTotalSessions(data.total);
        setHasMore(data.hasMore);
        if (resetPage) setPage(1);
      } catch (e) {
        console.error('Failed to load sessions:', e);
      } finally {
        setLoadingSessions(false);
      }
    },
    [page, search],
  );

  // Load sessions on mount and when search changes
  useEffect(() => {
    void fetchSessions(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Load global stats on mount
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d: GlobalStats) => setStats(d))
      .catch(console.error);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
    void fetchSessions(false);
  }, [fetchSessions]);

  return (
    <div className="dashboard-root">
      {/* Top bar */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen((o) => !o)}
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            ☰
          </button>
          <span className="dashboard-logo">🐇 HopCode Dashboard</span>
        </div>
        <StatsBar stats={stats} totalSessions={totalSessions} />
      </header>

      <div className="dashboard-body">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="dashboard-sidebar">
            <SessionList
              sessions={sessions}
              selectedId={selectedSession?.sessionId ?? null}
              search={search}
              onSearchChange={(q) => {
                setSearch(q);
              }}
              onSelect={setSelectedSession}
              hasMore={hasMore}
              isLoading={loadingSessions}
              onLoadMore={handleLoadMore}
            />
          </aside>
        )}

        {/* Main content */}
        <main className="dashboard-main">
          {selectedSession ? (
            <ChatPanel session={selectedSession} />
          ) : (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">🐇</div>
              <h2>Select a session</h2>
              <p>Choose a session from the sidebar to view the conversation.</p>
              {stats && (
                <p className="dashboard-empty-hint">
                  Reading from <code>{stats.hopcodeDir}</code>
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
