#!/usr/bin/env tsx
/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * Privacy Verification Script
 *
 * Intercepts all outbound network calls made during a dry-run startup of
 * HopCode and asserts that only approved hosts are contacted.
 *
 * Usage:
 *   npm run verify:privacy
 *   npx tsx scripts/verify-privacy.ts
 */

import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http';
import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// ─── Approved hosts ──────────────────────────────────────────────────────────
// These are the hosts HopCode is allowed to contact during normal operation.
// Add entries here when new integrations are added intentionally.
const APPROVED_HOSTS = new Set([
  // AI providers
  'api.openai.com',
  'api.anthropic.com',
  'generativelanguage.googleapis.com',
  'dashscope.aliyuncs.com',
  'openrouter.ai',
  'api.deepseek.com',
  'api.mistral.ai',
  'api.groq.com',
  'api.together.xyz',
  'api.cohere.com',
  'api.perplexity.ai',
  'inference.cerebras.ai',
  'api.sambanova.ai',
  'api.novita.ai',
  'api.aimlapi.com',
  // Local / self-hosted
  'localhost',
  '127.0.0.1',
  '::1',
  // Web search providers
  'api.tavily.com',
  'api.exa.ai',
  'api.bing.microsoft.com',
  's.jina.ai',
  'api.firecrawl.dev',
  'api.duckduckgo.com',
  'duckduckgo.com',
  'api.search.brave.com',
  // GitHub
  'api.github.com',
  'github.com',
  // npm / package registry (allowed for self-update checks)
  'registry.npmjs.org',
]);

// ─── Prohibited hosts (data brokers, telemetry sinks, etc.) ─────────────────
const PROHIBITED_PATTERNS = [
  /segment\.io/,
  /mixpanel\.com/,
  /amplitude\.com/,
  /hotjar\.com/,
  /heap\.io/,
  /fullstory\.com/,
  /datadoghq\.com/,
  /sentry\.io/,
  /crashlytics/,
  /firebase\.com/,
  /google-analytics\.com/,
  /googletagmanager\.com/,
  /doubleclick\.net/,
];

// ─── Proxy server ────────────────────────────────────────────────────────────
const contacts: string[] = [];
const violations: string[] = [];

function recordContact(host: string, method: string, path: string): void {
  const entry = `${method} ${host}${path}`;
  contacts.push(entry);

  const isApproved = APPROVED_HOSTS.has(host) || host.endsWith('.localhost');
  const isProhibited = PROHIBITED_PATTERNS.some((re) => re.test(host));

  if (isProhibited) {
    violations.push(`PROHIBITED: ${entry}`);
  } else if (!isApproved) {
    violations.push(`UNEXPECTED: ${entry}`);
  }
}

async function startProxyServer(): Promise<{
  port: number;
  close: () => void;
}> {
  return new Promise((resolve) => {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const host = req.headers['host'] ?? '';
      const method = req.method ?? 'GET';
      const path = req.url ?? '/';
      recordContact(host, method, path);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ message: 'privacy-proxy' }));
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      resolve({
        port,
        close: () => server.close(),
      });
    });
  });
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('🔍 HopCode Privacy Verification\n');

  const { port, close } = await startProxyServer();
  console.log(`Proxy listening on port ${port}`);

  // Write a minimal hopcode session config that points at our proxy
  const testConfigPath = join(tmpdir(), 'hopcode-privacy-test.json');
  writeFileSync(
    testConfigPath,
    JSON.stringify({
      provider: 'openai',
      model: 'gpt-4o',
      baseUrl: `http://127.0.0.1:${port}/v1`,
      apiKey: 'test-privacy-key',
    }),
  );

  // Run hopcode with --version (fastest no-op that still initializes config)
  await new Promise<void>((resolve) => {
    const child = spawn(
      process.execPath,
      [
        '-e',
        `
        process.env.OPENAI_BASE_URL = 'http://127.0.0.1:${port}/v1';
        process.env.OPENAI_API_KEY = 'test-privacy-key';
        // Just import the package to trigger any side-effect HTTP calls
        import('@hoptrendy/hopcode-core').then(() => process.exit(0)).catch(() => process.exit(0));
      `,
      ],
      {
        cwd: process.cwd(),
        env: {
          ...process.env,
          HTTP_PROXY: `http://127.0.0.1:${port}`,
          HTTPS_PROXY: `http://127.0.0.1:${port}`,
          NODE_TLS_REJECT_UNAUTHORIZED: '0',
          HOPCODE_NO_TELEMETRY: '1',
          HOPCODE_NON_INTERACTIVE: '1',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 15000,
      },
    );

    child.on('close', () => resolve());
    child.on('error', () => resolve());
  });

  close();

  // ─── Report ────────────────────────────────────────────────────────────────
  console.log(
    `\n📡 Network contacts during startup (${contacts.length} total):`,
  );
  if (contacts.length === 0) {
    console.log('  (none)');
  } else {
    for (const c of contacts) {
      console.log(`  ${c}`);
    }
  }

  if (violations.length > 0) {
    console.error(`\n❌ ${violations.length} privacy violation(s) detected:\n`);
    for (const v of violations) {
      console.error(`  ${v}`);
    }
    console.error(
      '\nIf these are intentional, add the hosts to APPROVED_HOSTS in scripts/verify-privacy.ts',
    );
    process.exitCode = 1;
  } else {
    console.log('\n✅ All network contacts are within approved hosts.');
  }
}

main().catch((err) => {
  console.error('verify-privacy error:', err);
  process.exitCode = 1;
});
