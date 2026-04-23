/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * SessionList — Left sidebar showing all sessions with search
 */

import type { SessionMeta } from '../App.js';

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString();
}

interface Props {
  sessions: SessionMeta[];
  selectedId: string | null;
  search: string;
  onSearchChange: (q: string) => void;
  onSelect: (s: SessionMeta) => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export default function SessionList({
  sessions,
  selectedId,
  search,
  onSearchChange,
  onSelect,
  hasMore,
  isLoading,
  onLoadMore,
}: Props) {
  return (
    <div className="session-list">
      <div className="session-list-header">
        <input
          className="session-search"
          type="search"
          placeholder="Search sessions…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="session-list-items">
        {sessions.length === 0 && !isLoading && (
          <div className="session-list-empty">
            {search ? 'No sessions match your search.' : 'No sessions found.'}
          </div>
        )}

        {sessions.map((s) => (
          <button
            key={s.sessionId}
            className={`session-item ${s.sessionId === selectedId ? 'selected' : ''}`}
            onClick={() => onSelect(s)}
          >
            <div className="session-item-prompt">{s.prompt}</div>
            <div className="session-item-meta">
              <span className="session-item-time">{timeAgo(s.mtime)}</span>
              {s.model && (
                <span className="session-item-model">
                  {s.model.split('/').pop()}
                </span>
              )}
              {s.gitBranch && (
                <span className="session-item-branch">⎇ {s.gitBranch}</span>
              )}
            </div>
            <div className="session-item-cwd" title={s.cwd}>
              {s.cwd.replace(/\\/g, '/').split('/').slice(-2).join('/')}
            </div>
          </button>
        ))}

        {isLoading && <div className="session-list-loading">Loading…</div>}

        {hasMore && !isLoading && (
          <button className="session-load-more" onClick={onLoadMore}>
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
