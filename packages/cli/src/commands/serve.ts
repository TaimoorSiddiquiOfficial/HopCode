/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * `hopcode serve` — starts HopCode as a headless HTTP API server.
 *
 * Endpoints:
 *   GET  /health              — liveness probe (returns 200 {"status":"ok"})
 *   POST /api/v1/run          — run a prompt, streaming SSE response
 *   GET  /api/v1/sessions     — list recent chat sessions (metadata)
 *
 * The /api/v1/run endpoint spawns a child `hopcode --json` process per request
 * and streams the JSON-ND events as Server-Sent Events (SSE) back to the caller.
 * This keeps each request fully isolated and reuses all existing HopCode logic.
 *
 * Usage:
 *   hopcode serve [--port 7900] [--host localhost]
 *
 * Client example (curl):
 *   curl -N -X POST http://localhost:7900/api/v1/run \
 *        -H 'Content-Type: application/json' \
 *        -d '{"prompt":"List files in the current directory"}'
 */

import type { CommandModule, Argv } from 'yargs';
import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';

interface ServeArgs {
  port: number;
  host: string;
  allowOrigin: string;
}

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

/** Parse a JSON body from an IncomingMessage. */
function readBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

/** Send a JSON response. */
function sendJson(
  res: http.ServerResponse,
  status: number,
  body: unknown,
  corsOrigin: string,
): void {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Content-Length': Buffer.byteLength(json),
  });
  res.end(json);
}

/** List session JSONL files sorted newest-first. */
async function listSessionFiles(): Promise<
  Array<{ sessionId: string; mtime: Date; filePath: string }>
> {
  const projectsDir = path.join(homedir(), '.hopcode', 'projects');
  if (!fs.existsSync(projectsDir)) return [];

  const results: Array<{ sessionId: string; mtime: Date; filePath: string }> =
    [];

  const projects = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(projectsDir, d.name, 'chats'));

  for (const chatsDir of projects) {
    if (!fs.existsSync(chatsDir)) continue;
    const files = fs.readdirSync(chatsDir).filter((f) => f.endsWith('.jsonl'));
    for (const file of files) {
      const filePath = path.join(chatsDir, file);
      try {
        const stat = fs.statSync(filePath);
        results.push({
          sessionId: file.replace(/\.jsonl$/, ''),
          mtime: stat.mtime,
          filePath,
        });
      } catch {
        // skip unreadable
      }
    }
  }

  return results.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

// ──────────────────────────────────────────────────────────────
// HTTP API route handlers
// ──────────────────────────────────────────────────────────────

/** GET /health */
function handleHealth(res: http.ServerResponse, corsOrigin: string): void {
  sendJson(
    res,
    200,
    { status: 'ok', service: 'hopcode-api', version: '0.15.1' },
    corsOrigin,
  );
}

/** GET /api/v1/sessions */
async function handleSessions(
  res: http.ServerResponse,
  corsOrigin: string,
): Promise<void> {
  try {
    const files = await listSessionFiles();
    const sessions = files.slice(0, 50).map((f) => ({
      sessionId: f.sessionId,
      updatedAt: f.mtime.toISOString(),
    }));
    sendJson(res, 200, { sessions }, corsOrigin);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: msg }, corsOrigin);
  }
}

/**
 * POST /api/v1/run
 *
 * Body: { "prompt": string, "model"?: string, "sessionId"?: string,
 *         "cwd"?: string, "maxTurns"?: number }
 *
 * Response: text/event-stream (SSE)
 *   Each SSE event carries one line of the JSON-ND output from `hopcode --json`.
 *   On completion, a final "event: done\ndata: {}\n\n" is sent.
 */
function handleRun(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  corsOrigin: string,
): void {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': corsOrigin,
    'X-Accel-Buffering': 'no', // disable nginx buffering
  });

  readBody(req)
    .then((body) => {
      const b = body as Record<string, unknown>;
      const prompt = String(b['prompt'] ?? '').trim();
      if (!prompt) {
        res.write('event: error\ndata: {"error":"prompt is required"}\n\n');
        res.end();
        return;
      }

      // Build the hopcode CLI arguments
      const cliArgs: string[] = ['--json', '--prompt', prompt];
      if (b['model']) cliArgs.push('--model', String(b['model']));
      if (b['sessionId']) cliArgs.push('--resume', String(b['sessionId']));
      if (b['maxTurns']) cliArgs.push('--max-turns', String(b['maxTurns']));

      const cwd = b['cwd'] ? String(b['cwd']) : process.cwd();

      // Use the same node executable + current CLI script
      const cliScript = process.argv[1];

      const child = spawn(process.execPath, [cliScript, ...cliArgs], {
        cwd,
        env: {
          ...process.env,
          // Suppress interactive UI features inside the child
          HOPCODE_NONINTERACTIVE: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

      let buffer = '';

      child.stdout.on('data', (chunk: Buffer) => {
        buffer += chunk.toString('utf8');
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            res.write(`data: ${trimmed}\n\n`);
          }
        }
      });

      child.stderr.on('data', (chunk: Buffer) => {
        const text = chunk.toString('utf8').trim();
        if (text) {
          const payload = JSON.stringify({ type: 'stderr', text });
          res.write(`event: stderr\ndata: ${payload}\n\n`);
        }
      });

      child.on('error', (err) => {
        const payload = JSON.stringify({ error: err.message });
        res.write(`event: error\ndata: ${payload}\n\n`);
        res.end();
      });

      child.on('close', (code) => {
        // Flush remaining buffer
        if (buffer.trim()) {
          res.write(`data: ${buffer.trim()}\n\n`);
        }
        const payload = JSON.stringify({ exitCode: code ?? 0 });
        res.write(`event: done\ndata: ${payload}\n\n`);
        res.end();
      });

      // If client disconnects, kill the child
      req.on('close', () => {
        if (!child.killed) child.kill('SIGTERM');
      });
    })
    .catch((err) => {
      const msg = err instanceof Error ? err.message : String(err);
      res.write(`event: error\ndata: ${JSON.stringify({ error: msg })}\n\n`);
      res.end();
    });
}

// ──────────────────────────────────────────────────────────────
// Server bootstrap
// ──────────────────────────────────────────────────────────────

function createServer(corsOrigin: string): http.Server {
  return http.createServer((req, res) => {
    const url = req.url ?? '/';
    const method = req.method?.toUpperCase() ?? 'GET';

    // CORS preflight
    if (method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      });
      res.end();
      return;
    }

    if (method === 'GET' && url === '/health') {
      handleHealth(res, corsOrigin);
    } else if (method === 'GET' && url.startsWith('/api/v1/sessions')) {
      handleSessions(res, corsOrigin).catch(() => {});
    } else if (method === 'POST' && url === '/api/v1/run') {
      handleRun(req, res, corsOrigin);
    } else {
      sendJson(
        res,
        404,
        {
          error: 'Not found',
          endpoints: [
            'GET /health',
            'GET /api/v1/sessions',
            'POST /api/v1/run',
          ],
        },
        corsOrigin,
      );
    }
  });
}

async function handleServe(
  port: number,
  host: string,
  allowOrigin: string,
): Promise<void> {
  const server = createServer(allowOrigin);

  await new Promise<void>((resolve, reject) => {
    server.listen(port, host, () => resolve());
    server.on('error', reject);
  });

  process.stdout.write(
    `🐇  HopCode API server listening on http://${host}:${port}\n` +
      `    Endpoints:\n` +
      `      GET  http://${host}:${port}/health\n` +
      `      GET  http://${host}:${port}/api/v1/sessions\n` +
      `      POST http://${host}:${port}/api/v1/run\n` +
      `\n` +
      `    Example:\n` +
      `      curl -N -X POST http://${host}:${port}/api/v1/run \\\n` +
      `           -H 'Content-Type: application/json' \\\n` +
      `           -d '{"prompt":"list files"}'\n`,
  );

  process.on('SIGINT', () => {
    server.close(() => process.exit(0));
  });
  process.on('SIGTERM', () => {
    server.close(() => process.exit(0));
  });

  // Keep the process alive
  await new Promise<void>(() => {});
}

export const serveCommand: CommandModule<object, ServeArgs> = {
  command: 'serve',
  describe: 'Start HopCode as a headless HTTP API server (SSE streaming)',
  builder: (yargs: Argv) =>
    yargs
      .option('port', {
        alias: 'p',
        type: 'number',
        default: 7900,
        describe: 'Port to listen on',
      })
      .option('host', {
        alias: 'H',
        type: 'string',
        default: 'localhost',
        describe:
          'Host / interface to bind to (use 0.0.0.0 for all interfaces)',
      })
      .option('allowOrigin', {
        alias: 'o',
        type: 'string',
        default: '*',
        describe: 'Value for Access-Control-Allow-Origin header',
      })
      .version(false) as Argv<ServeArgs>,
  handler: async (argv) => {
    await handleServe(argv.port, argv.host, argv.allowOrigin);
  },
};
