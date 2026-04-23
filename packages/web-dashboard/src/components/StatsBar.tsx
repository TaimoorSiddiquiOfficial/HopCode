/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * StatsBar — Top-right global stats display
 */

import type { GlobalStats } from '../App.js';

interface Props {
  stats: GlobalStats | null;
  totalSessions: number;
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function StatsBar({ stats, totalSessions }: Props) {
  return (
    <div className="stats-bar">
      <div className="stats-item">
        <span className="stats-value">{formatNum(totalSessions)}</span>
        <span className="stats-label">sessions</span>
      </div>
      {stats && (
        <>
          <div className="stats-divider" />
          <div className="stats-item">
            <span className="stats-value">
              {formatNum(stats.totalMessages)}
            </span>
            <span className="stats-label">messages</span>
          </div>
          <div className="stats-divider" />
          <div className="stats-item">
            <span className="stats-value">{formatNum(stats.totalTokens)}</span>
            <span className="stats-label">tokens</span>
          </div>
          {stats.topModel && (
            <>
              <div className="stats-divider" />
              <div className="stats-item">
                <span className="stats-value stats-model">
                  {stats.topModel.split('/').pop()}
                </span>
                <span className="stats-label">top model</span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
