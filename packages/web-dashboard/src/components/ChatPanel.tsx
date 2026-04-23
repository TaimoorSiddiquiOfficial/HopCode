/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * ChatPanel — Main area showing chat messages for a selected session
 */

import { useState, useEffect, useRef } from 'react';
import { ChatViewer } from '@hoptrendy/webui';
import type { ChatMessageData } from '@hoptrendy/webui';
import type { SessionMeta } from '../App.js';

interface ChatRecord {
  uuid: string;
  parentUuid: string | null;
  sessionId: string;
  timestamp: string;
  type: 'user' | 'assistant' | 'tool_result' | 'system';
  subtype?: string;
  cwd: string;
  version: string;
  gitBranch?: string;
  message?: {
    role?: string;
    parts?: Array<{ text?: string }>;
    content?: string | unknown[];
  };
  model?: string;
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  toolCallResult?: unknown;
}

/** Compute token totals from records */
function computeTokens(records: ChatRecord[]): {
  prompt: number;
  completion: number;
  total: number;
} {
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
function toChatMessageData(record: ChatRecord): ChatMessageData | null {
  if (record.type === 'system') return null;
  if (record.type === 'tool_result') return null;
  return {
    uuid: record.uuid,
    parentUuid: record.parentUuid,
    sessionId: record.sessionId,
    timestamp: record.timestamp,
    type: record.type === 'user' ? 'user' : 'assistant',
    message: record.message as ChatMessageData['message'],
    model: record.model,
    cwd: record.cwd,
    gitBranch: record.gitBranch,
  };
}

interface Props {
  session: SessionMeta;
}

export default function ChatPanel({ session }: Props) {
  const [records, setRecords] = useState<ChatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const prevSessionId = useRef<string | null>(null);

  useEffect(() => {
    if (prevSessionId.current === session.sessionId) return;
    prevSessionId.current = session.sessionId;

    setLoading(true);
    setError(null);
    setRecords([]);

    const params = new URLSearchParams({ project: session.projectDir });
    fetch(`/api/sessions/${session.sessionId}?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<{ records: ChatRecord[] }>;
      })
      .then((data) => {
        setRecords(data.records);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Failed to load session');
      })
      .finally(() => setLoading(false));
  }, [session.sessionId, session.projectDir]);

  const messages = records
    .map(toChatMessageData)
    .filter((m): m is ChatMessageData => m !== null);

  const tokens = computeTokens(records);
  const models = [...new Set(records.map((r) => r.model).filter(Boolean))];

  return (
    <div className="chat-panel">
      {/* Session header */}
      <div className="chat-panel-header">
        <div className="chat-panel-title">
          <span className="chat-panel-prompt" title={session.prompt}>
            {session.prompt.length > 80
              ? session.prompt.slice(0, 80) + '…'
              : session.prompt}
          </span>
          <span className="chat-panel-id">{session.sessionId.slice(0, 8)}</span>
        </div>
        <div className="chat-panel-meta">
          <span title={session.cwd}>📁 {session.cwd}</span>
          {session.gitBranch && <span>⎇ {session.gitBranch}</span>}
          {models.length > 0 && (
            <span>🤖 {models.map((m) => m!.split('/').pop()).join(', ')}</span>
          )}
          {tokens.total > 0 && (
            <span
              title={`${tokens.prompt} prompt + ${tokens.completion} completion`}
            >
              🔢 {tokens.total.toLocaleString()} tokens
            </span>
          )}
          <span>
            💬{' '}
            {
              records.filter((r) => r.type === 'user' || r.type === 'assistant')
                .length
            }{' '}
            messages
          </span>
        </div>
      </div>

      {/* Chat messages */}
      <div className="chat-panel-body">
        {loading && <div className="chat-panel-state">Loading messages…</div>}
        {error && (
          <div className="chat-panel-state chat-panel-error">⚠️ {error}</div>
        )}
        {!loading && !error && (
          <ChatViewer
            messages={messages}
            autoScroll={false}
            theme="dark"
            emptyMessage="No displayable messages in this session."
          />
        )}
      </div>
    </div>
  );
}
