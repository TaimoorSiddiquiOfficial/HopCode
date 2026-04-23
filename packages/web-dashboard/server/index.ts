/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * HopCode Web Dashboard — Express API server
 *
 * Scans ~/.hopcode/projects for session JSONL files and exposes them
 * via a REST API consumed by the React frontend.
 *
 * Usage:
 *   hopcode-dashboard                        # serves on port 7899
 *   HOPCODE_DASHBOARD_PORT=8080 hopcode-dashboard
 *   HOPCODE_RUNTIME_DIR=/custom/path hopcode-dashboard
 */

import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env['HOPCODE_DASHBOARD_PORT'] ?? '7899', 10);

/** Root HopCode dir — ~/.hopcode unless overridden */
function getHopcodeDir(): string {
  const env =
    process.env['HOPCODE_RUNTIME_DIR'] ?? process.env['QWEN_RUNTIME_DIR'];
  if (env) return env;
  return path.join(os.homedir(), '.hopcode');
}

/** Projects base: ~/.hopcode/projects */
function getProjectsDir(): string {
  return path.join(getHopcodeDir(), 'projects');
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionMeta {
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
  systemPayload?: unknown;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Read first N records from a JSONL file */
async function readJSONLHead(
  filePath: string,
  maxLines = 5,
): Promise<ChatRecord[]> {
  const records: ChatRecord[] = [];
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let count = 0;
  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed) as ChatRecord);
    } catch {
      // skip malformed lines
    }
    if (++count >= maxLines) {
      rl.close();
      stream.destroy();
      break;
    }
  }
  return records;
}

/** Read ALL records from a JSONL file */
async function readJSONLAll(filePath: string): Promise<ChatRecord[]> {
  const records: ChatRecord[] = [];
  const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed) as ChatRecord);
    } catch {
      // skip malformed lines
    }
  }
  return records;
}

/** Extract first user prompt text from records */
function extractPrompt(records: ChatRecord[]): string {
  for (const r of records) {
    if (r.type === 'user' && r.message) {
      const msg = r.message;
      if (msg.parts && Array.isArray(msg.parts)) {
        const text = msg.parts
          .map((p) => p.text ?? '')
          .join('')
          .trim();
        if (text) return text.slice(0, 120);
      }
      if (typeof msg.content === 'string' && msg.content.trim()) {
        return msg.content.trim().slice(0, 120);
      }
    }
  }
  return '(empty session)';
}

/** Discover all session files across all projects */
function discoverSessionFiles(): Array<{
  filePath: string;
  projectDir: string;
  mtime: number;
}> {
  const projectsDir = getProjectsDir();
  const results: Array<{
    filePath: string;
    projectDir: string;
    mtime: number;
  }> = [];

  if (!fs.existsSync(projectsDir)) return results;

  const projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });
  for (const entry of projectEntries) {
    if (!entry.isDirectory()) continue;
    const chatsDir = path.join(projectsDir, entry.name, 'chats');
    if (!fs.existsSync(chatsDir)) continue;

    const files = fs.readdirSync(chatsDir);
    for (const file of files) {
      if (!file.endsWith('.jsonl')) continue;
      const filePath = path.join(chatsDir, file);
      try {
        const stat = fs.statSync(filePath);
        results.push({
          filePath,
          projectDir: entry.name,
          mtime: stat.mtimeMs,
        });
      } catch {
        // skip inaccessible files
      }
    }
  }

  // sort newest first
  results.sort((a, b) => b.mtime - a.mtime);
  return results;
}

/** Build a SessionMeta from file + head records */
async function buildSessionMeta(
  filePath: string,
  projectDir: string,
  mtime: number,
): Promise<SessionMeta | null> {
  try {
    const records = await readJSONLHead(filePath, 10);
    if (records.length === 0) return null;

    const first = records[0];
    const sessionId = path.basename(filePath, '.jsonl');
    const model = records.find((r) => r.model)?.model;

    return {
      sessionId,
      projectDir,
      filePath,
      mtime,
      startTime: first.timestamp,
      cwd: first.cwd ?? projectDir,
      prompt: extractPrompt(records),
      gitBranch: first.gitBranch,
      messageCount: records.length,
      model,
    };
  } catch {
    return null;
  }
}

// ─── Express app ──────────────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

/** Serve built React frontend */
const clientDistDir = path.join(__dirname, '../client');
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
}

// ─── API Routes ───────────────────────────────────────────────────────────────

/**
 * GET /api/sessions
 * List all sessions sorted by recency.
 * Query params: page (default 1), limit (default 20), search (optional)
 */
app.get('/api/sessions', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(String(req.query['limit'] ?? '20'), 10)),
    );
    const search = String(req.query['search'] ?? '')
      .toLowerCase()
      .trim();

    const files = discoverSessionFiles();

    // Build meta for each file (parallel, bounded concurrency)
    const CONCURRENCY = 10;
    const allMeta: SessionMeta[] = [];

    for (let i = 0; i < files.length; i += CONCURRENCY) {
      const batch = files.slice(i, i + CONCURRENCY);
      const results = await Promise.all(
        batch.map((f) => buildSessionMeta(f.filePath, f.projectDir, f.mtime)),
      );
      for (const m of results) {
        if (m) allMeta.push(m);
      }
    }

    // Filter by search
    const filtered = search
      ? allMeta.filter(
          (s) =>
            s.prompt.toLowerCase().includes(search) ||
            s.cwd.toLowerCase().includes(search) ||
            s.sessionId.toLowerCase().includes(search),
        )
      : allMeta;

    const total = filtered.length;
    const offset = (page - 1) * limit;
    const items = filtered.slice(offset, offset + limit);

    res.json({
      items,
      total,
      page,
      limit,
      hasMore: offset + limit < total,
    });
  } catch (err) {
    console.error('[dashboard] /api/sessions error:', err);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

/**
 * GET /api/sessions/:sessionId
 * Return all records for a session.
 * Query param: project (projectDir name, optional — used to disambiguate)
 */
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const projectHint = String(req.query['project'] ?? '');
    const projectsDir = getProjectsDir();

    // Find the file
    let filePath: string | null = null;

    if (projectHint && fs.existsSync(projectsDir)) {
      const candidate = path.join(
        projectsDir,
        projectHint,
        'chats',
        `${sessionId}.jsonl`,
      );
      if (fs.existsSync(candidate)) filePath = candidate;
    }

    if (!filePath && fs.existsSync(projectsDir)) {
      // scan all projects
      for (const entry of fs.readdirSync(projectsDir, {
        withFileTypes: true,
      })) {
        if (!entry.isDirectory()) continue;
        const candidate = path.join(
          projectsDir,
          entry.name,
          'chats',
          `${sessionId}.jsonl`,
        );
        if (fs.existsSync(candidate)) {
          filePath = candidate;
          break;
        }
      }
    }

    if (!filePath) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    const records = await readJSONLAll(filePath);
    res.json({ sessionId, records });
  } catch (err) {
    console.error('[dashboard] /api/sessions/:id error:', err);
    res.status(500).json({ error: 'Failed to load session' });
  }
});

/**
 * GET /api/stats
 * Global aggregate stats across all sessions.
 */
app.get('/api/stats', async (_req, res) => {
  try {
    const files = discoverSessionFiles();

    let totalMessages = 0;
    let totalTokens = 0;
    const modelCounts: Record<string, number> = {};

    for (const { filePath } of files.slice(0, 200)) {
      // cap at 200 for perf
      try {
        const records = await readJSONLAll(filePath);
        totalMessages += records.filter(
          (r) => r.type === 'user' || r.type === 'assistant',
        ).length;
        for (const r of records) {
          if (r.usageMetadata?.totalTokenCount) {
            totalTokens += r.usageMetadata.totalTokenCount;
          }
          if (r.model) {
            modelCounts[r.model] = (modelCounts[r.model] ?? 0) + 1;
          }
        }
      } catch {
        // skip unreadable files
      }
    }

    const topModel =
      Object.entries(modelCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null;

    res.json({
      totalSessions: files.length,
      totalMessages,
      totalTokens,
      topModel,
      modelCounts,
      hopcodeDir: getHopcodeDir(),
    });
  } catch (err) {
    console.error('[dashboard] /api/stats error:', err);
    res.status(500).json({ error: 'Failed to compute stats' });
  }
});

/** SPA fallback — serve index.html for all non-API routes */
app.get('*', (_req, res) => {
  const indexPath = path.join(clientDistDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send(
      `<html><body style="font-family:monospace;padding:2rem">
        <h2>🐇 HopCode Dashboard</h2>
        <p>Frontend not built yet. Run <code>npm run build:client</code> first,
        or start dev mode with <code>npm run dev</code>.</p>
        <p><a href="/api/stats">API: /api/stats</a> &nbsp;|&nbsp;
           <a href="/api/sessions">API: /api/sessions</a></p>
      </body></html>`,
    );
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🐇 HopCode Dashboard`);
  console.log(`   URL:      http://localhost:${PORT}`);
  console.log(`   Data dir: ${getHopcodeDir()}`);
  console.log(
    `   Override: HOPCODE_RUNTIME_DIR=... or HOPCODE_DASHBOARD_PORT=...\n`,
  );
});
