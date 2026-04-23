/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * `hopcode learn` — post-session skill distillation (learning loop).
 *
 * Reads a recent (or specified) session JSONL file, summarises the
 * conversation, and invokes HopCode with a prompt that asks it to
 * generate a reusable SKILL.md from the patterns found.
 *
 * Usage:
 *   hopcode learn                   — analyse the most recent session
 *   hopcode learn <session-id>      — analyse a specific session
 *   hopcode learn --list            — list recent sessions and exit
 *   hopcode learn --dry-run         — print the generated prompt without running it
 */

import type { CommandModule, Argv } from 'yargs';
import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';
import { spawn } from 'node:child_process';

interface LearnArgs {
  sessionId?: string;
  list: boolean;
  dryRun: boolean;
  maxTurns: number;
}

// ──────────────────────────────────────────────────────────────
// Session JSONL helpers
// ──────────────────────────────────────────────────────────────

interface SessionFile {
  sessionId: string;
  filePath: string;
  mtime: Date;
}

function findSessionFiles(limit = 20): SessionFile[] {
  const projectsDir = path.join(homedir(), '.hopcode', 'projects');
  if (!fs.existsSync(projectsDir)) return [];

  const results: SessionFile[] = [];
  const projectDirs = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const pd of projectDirs) {
    const chatsDir = path.join(projectsDir, pd.name, 'chats');
    if (!fs.existsSync(chatsDir)) continue;
    for (const file of fs.readdirSync(chatsDir)) {
      if (!file.endsWith('.jsonl')) continue;
      const filePath = path.join(chatsDir, file);
      try {
        const stat = fs.statSync(filePath);
        results.push({
          sessionId: file.replace(/\.jsonl$/, ''),
          filePath,
          mtime: stat.mtime,
        });
      } catch {
        // skip unreadable
      }
    }
  }

  return results
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
    .slice(0, limit);
}

function findSessionById(sessionId: string): SessionFile | undefined {
  const projectsDir = path.join(homedir(), '.hopcode', 'projects');
  if (!fs.existsSync(projectsDir)) return undefined;

  const projectDirs = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const pd of projectDirs) {
    const filePath = path.join(
      projectsDir,
      pd.name,
      'chats',
      `${sessionId}.jsonl`,
    );
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      return { sessionId, filePath, mtime: stat.mtime };
    }
  }
  return undefined;
}

interface ChatRecord {
  type: 'user' | 'assistant' | 'tool_result' | 'system';
  message?: unknown;
  timestamp?: string;
  sessionId?: string;
}

function readSession(filePath: string, maxRecords: number): ChatRecord[] {
  const content = fs.readFileSync(filePath, 'utf8');
  const records: ChatRecord[] = [];
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed) as ChatRecord);
    } catch {
      // skip malformed lines
    }
    if (records.length >= maxRecords) break;
  }
  return records;
}

/** Extract readable text from a Content part list (simplified). */
function extractText(message: unknown): string {
  if (!message) return '';
  if (typeof message === 'string') return message;
  const msg = message as Record<string, unknown>;
  if (typeof msg['text'] === 'string') return msg['text'];
  if (Array.isArray(msg['parts'])) {
    return (msg['parts'] as unknown[])
      .map((p) => {
        if (typeof p === 'string') return p;
        const part = p as Record<string, unknown>;
        return typeof part['text'] === 'string' ? part['text'] : '';
      })
      .join(' ');
  }
  if (Array.isArray(msg['content'])) {
    return (msg['content'] as unknown[])
      .map((c) => {
        const block = c as Record<string, unknown>;
        if (block['type'] === 'text' && typeof block['text'] === 'string') {
          return block['text'];
        }
        if (block['type'] === 'tool_use') {
          return `[tool: ${block['name']}]`;
        }
        return '';
      })
      .join(' ');
  }
  return '';
}

function buildTranscript(records: ChatRecord[]): string {
  const lines: string[] = [];
  for (const rec of records) {
    switch (rec.type) {
      case 'user': {
        const text = extractText(rec.message);
        if (text.trim()) lines.push(`USER: ${text.trim().slice(0, 500)}`);
        break;
      }
      case 'assistant': {
        const text = extractText(rec.message);
        if (text.trim()) lines.push(`ASSISTANT: ${text.trim().slice(0, 800)}`);
        break;
      }
      case 'tool_result':
        lines.push(`[tool result]`);
        break;
      default:
        break;
    }
  }
  return lines.join('\n');
}

function buildLearningPrompt(sessionId: string, transcript: string): string {
  return `You are HopCode's learning system. Analyze the following conversation transcript and generate a reusable SKILL.md file that captures the most useful pattern or workflow demonstrated.

SESSION ID: ${sessionId}

CONVERSATION TRANSCRIPT:
---
${transcript}
---

INSTRUCTIONS:
1. Identify the most reusable pattern in this conversation (a workflow, a repeated task, or a useful tool sequence).
2. If no clear pattern exists (e.g., one-off Q&A with no repeatable workflow), say so and stop — do not generate a skill.
3. Generate a SKILL.md with proper YAML frontmatter (name, description, allowedTools) and clear step-by-step instructions.
4. Save the file to ~/.hopcode/skills/<skill-name>/SKILL.md using the write_file tool.
5. Confirm what was created and how to invoke it (/<skill-name>).

The skill MUST be:
- Specific enough to be useful (not just "write code" or "answer questions")
- General enough to apply in future sessions
- Actionable (step-by-step instructions another LLM can follow)

Use the write_file tool to save the skill. Then confirm what you created.`;
}

// ──────────────────────────────────────────────────────────────
// Main handler
// ──────────────────────────────────────────────────────────────

async function handleLearn(
  sessionIdArg: string | undefined,
  list: boolean,
  dryRun: boolean,
  maxTurns: number,
): Promise<void> {
  // --list mode
  if (list) {
    const sessions = findSessionFiles(20);
    if (sessions.length === 0) {
      process.stdout.write('No sessions found in ~/.hopcode/projects/\n');
      return;
    }
    process.stdout.write('Recent sessions (newest first):\n\n');
    for (const s of sessions) {
      const age = Math.round((Date.now() - s.mtime.getTime()) / 60000);
      const label = age < 60 ? `${age}m ago` : `${Math.round(age / 60)}h ago`;
      process.stdout.write(`  ${s.sessionId}  (${label})\n`);
    }
    process.stdout.write(`\nRun: hopcode learn <session-id>\n`);
    return;
  }

  // Resolve session file
  let sessionFile: SessionFile | undefined;
  if (sessionIdArg) {
    sessionFile = findSessionById(sessionIdArg);
    if (!sessionFile) {
      process.stderr.write(`Session not found: ${sessionIdArg}\n`);
      process.exit(1);
    }
  } else {
    const all = findSessionFiles(1);
    if (all.length === 0) {
      process.stderr.write(
        'No sessions found. Run hopcode first to create a session.\n',
      );
      process.exit(1);
    }
    sessionFile = all[0];
    process.stdout.write(
      `📖  Analysing most recent session: ${sessionFile.sessionId}\n`,
    );
  }

  // Read and format session
  const records = readSession(sessionFile.filePath, maxTurns);
  if (records.length < 3) {
    process.stderr.write(
      `Session ${sessionFile.sessionId} is too short (${records.length} records). ` +
        `Run more interactions first.\n`,
    );
    process.exit(1);
  }

  const transcript = buildTranscript(records);
  const prompt = buildLearningPrompt(sessionFile.sessionId, transcript);

  if (dryRun) {
    process.stdout.write('\n─── Learning Prompt (dry-run) ───\n\n');
    process.stdout.write(prompt);
    process.stdout.write('\n\n─────────────────────────────────\n');
    return;
  }

  process.stdout.write(
    `🧠  Distilling skill from session (${records.length} records)…\n\n`,
  );

  // Spawn hopcode with the learning prompt
  const cliScript = process.argv[1];
  const child = spawn(process.execPath, [cliScript, '--prompt', prompt], {
    cwd: process.cwd(),
    env: { ...process.env },
    stdio: 'inherit',
  });

  child.on('error', (err) => {
    process.stderr.write(`Failed to run HopCode: ${err.message}\n`);
    process.exit(1);
  });

  await new Promise<void>((resolve) => {
    child.on('exit', (code) => {
      if (code !== 0) {
        process.stderr.write(`\nHopCode exited with code ${code ?? 1}\n`);
      }
      resolve();
    });
  });
}

export const learnCommand: CommandModule<object, LearnArgs> = {
  command: 'learn [session-id]',
  describe: 'Distil a reusable skill from a recent session (learning loop)',
  builder: (yargs: Argv) =>
    yargs
      .positional('session-id', {
        type: 'string',
        describe: 'Session ID to analyse (default: most recent)',
      })
      .option('list', {
        alias: 'l',
        type: 'boolean',
        default: false,
        describe: 'List recent sessions and exit',
      })
      .option('dryRun', {
        alias: 'n',
        type: 'boolean',
        default: false,
        describe: 'Print the learning prompt without running HopCode',
      })
      .option('maxTurns', {
        alias: 'm',
        type: 'number',
        default: 200,
        describe: 'Maximum number of session records to read',
      })
      .version(false) as Argv<LearnArgs>,
  handler: async (argv) => {
    await handleLearn(argv.sessionId, argv.list, argv.dryRun, argv.maxTurns);
  },
};
