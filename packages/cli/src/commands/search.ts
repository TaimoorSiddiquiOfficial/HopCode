/**
 * `hopcode search` — full-text search across session history.
 *
 * Scans ~/.hopcode/projects/<project>/chats/*.jsonl and returns messages
 * matching the query string. Supports filtering by date and model.
 *
 * Usage:
 *   hopcode search "fix the bug"
 *   hopcode search "typescript error" --limit 20
 *   hopcode search "refactor" --since 2025-01-01
 *   hopcode search "prompt" --model gpt-4
 */

import type { CommandModule, Argv } from 'yargs';
import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';
import readline from 'node:readline';

// ── Types ────────────────────────────────────────────────────────────────────

interface JsonlTurn {
  type?: string;
  role?: string;
  content?: string | Array<{ type: string; text?: string }>;
  model?: string;
  timestamp?: string;
  id?: string;
  parts?: Array<{ text?: string }>;
}

interface SearchMatch {
  sessionId: string;
  sessionFile: string;
  turnIndex: number;
  role: string;
  text: string;
  timestamp?: string;
  model?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getChatsRoot(): string {
  return path.join(homedir(), '.hopcode', 'projects');
}

async function* streamJsonlMatches(
  filePath: string,
  queryTokens: string[],
  sinceMs: number | undefined,
  modelFilter: string | undefined,
): AsyncGenerator<SearchMatch> {
  const sessionId = path.basename(path.dirname(path.dirname(filePath)));
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath, { encoding: 'utf-8' }),
    crlfDelay: Infinity,
  });

  let turnIndex = 0;
  for await (const line of rl) {
    turnIndex++;
    const trimmed = line.trim();
    if (!trimmed) continue;

    let turn: JsonlTurn;
    try {
      turn = JSON.parse(trimmed) as JsonlTurn;
    } catch {
      continue;
    }

    // Filter by timestamp
    if (sinceMs && turn.timestamp) {
      const ts = new Date(turn.timestamp).getTime();
      if (!isNaN(ts) && ts < sinceMs) continue;
    }

    // Filter by model
    if (modelFilter && turn.model) {
      if (!turn.model.toLowerCase().includes(modelFilter.toLowerCase())) {
        continue;
      }
    }

    // Extract text from various JSONL formats
    const texts: string[] = [];
    if (typeof turn.content === 'string') {
      texts.push(turn.content);
    } else if (Array.isArray(turn.content)) {
      for (const part of turn.content) {
        if (part.type === 'text' && part.text) texts.push(part.text);
      }
    } else if (Array.isArray(turn.parts)) {
      for (const part of turn.parts) {
        if (part.text) texts.push(part.text);
      }
    }

    const fullText = texts.join(' ');
    if (!fullText) continue;

    // Check all query tokens (case-insensitive)
    const lower = fullText.toLowerCase();
    const allMatch = queryTokens.every((tok) => lower.includes(tok));
    if (!allMatch) continue;

    yield {
      sessionId,
      sessionFile: filePath,
      turnIndex,
      role: turn.role ?? turn.type ?? 'unknown',
      text: fullText,
      timestamp: turn.timestamp,
      model: turn.model,
    };
  }
}

function findAllJsonlFiles(root: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(root)) return files;

  try {
    for (const project of fs.readdirSync(root)) {
      const chatsDir = path.join(root, project, 'chats');
      if (!fs.existsSync(chatsDir)) continue;
      for (const f of fs.readdirSync(chatsDir)) {
        if (f.endsWith('.jsonl')) {
          files.push(path.join(chatsDir, f));
        }
      }
    }
  } catch {
    // best-effort
  }
  return files;
}

function truncate(text: string, maxLen = 160): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 1) + '…';
}

// ── Args ─────────────────────────────────────────────────────────────────────

interface SearchArgs {
  query: string;
  limit: number;
  since?: string;
  model?: string;
  context: number;
  json: boolean;
}

// ── Command ──────────────────────────────────────────────────────────────────

export const searchCommand: CommandModule<object, SearchArgs> = {
  command: 'search <query>',
  describe: 'Full-text search across session history (~/.hopcode)',
  builder: (yargs: Argv) =>
    yargs
      .positional('query', {
        type: 'string',
        describe: 'Search query (all words must match)',
        demandOption: true,
      })
      .option('limit', {
        type: 'number',
        default: 10,
        describe: 'Maximum number of results to show',
      })
      .option('since', {
        type: 'string',
        describe: 'Only show results after this date (YYYY-MM-DD)',
      })
      .option('model', {
        type: 'string',
        describe: 'Filter by model name (partial match)',
      })
      .option('context', {
        type: 'number',
        default: 0,
        describe: 'Additional context lines to show around each match (0-5)',
      })
      .option('json', {
        type: 'boolean',
        default: false,
        describe: 'Output results as JSON',
      }) as Argv<SearchArgs>,
  handler: async (argv) => {
    const query = argv.query;
    const queryTokens = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 0);

    if (queryTokens.length === 0) {
      process.stderr.write('Error: query must contain at least one word\n');
      process.exit(1);
    }

    let sinceMs: number | undefined;
    if (argv.since) {
      const d = new Date(argv.since);
      if (isNaN(d.getTime())) {
        process.stderr.write(
          `Error: invalid --since date "${argv.since}". Use YYYY-MM-DD.\n`,
        );
        process.exit(1);
      }
      sinceMs = d.getTime();
    }

    const chatsRoot = getChatsRoot();
    const files = findAllJsonlFiles(chatsRoot);

    if (files.length === 0) {
      process.stdout.write('No session history found in ~/.hopcode/projects\n');
      return;
    }

    const results: SearchMatch[] = [];
    const limit = Math.max(1, argv.limit);

    outer: for (const file of files) {
      for await (const match of streamJsonlMatches(
        file,
        queryTokens,
        sinceMs,
        argv.model,
      )) {
        results.push(match);
        if (results.length >= limit) break outer;
      }
    }

    if (results.length === 0) {
      process.stdout.write(
        `No matches found for "${query}"` +
          (argv.since ? ` since ${argv.since}` : '') +
          '\n',
      );
      return;
    }

    if (argv.json) {
      process.stdout.write(JSON.stringify(results, null, 2) + '\n');
      return;
    }

    process.stdout.write(
      `Found ${results.length} match(es) for "${query}":\n\n`,
    );

    for (const m of results) {
      const ts = m.timestamp
        ? new Date(m.timestamp).toLocaleString()
        : 'unknown time';
      const model = m.model ? ` [${m.model}]` : '';
      const session = m.sessionId.slice(0, 12);

      process.stdout.write(
        `─── session:${session} · turn ${m.turnIndex} · ${m.role}${model} · ${ts}\n`,
      );
      process.stdout.write(`    ${truncate(m.text)}\n\n`);
    }

    if (results.length >= limit) {
      process.stdout.write(
        `(showing first ${limit} results — use --limit to see more)\n`,
      );
    }
  },
};
