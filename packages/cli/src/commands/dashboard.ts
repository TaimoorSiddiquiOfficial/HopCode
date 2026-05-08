/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 *
 * `hopcode dashboard` command — starts the web dashboard server
 */

import type { CommandModule, Argv } from 'yargs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

interface DashboardArgs {
  port: number;
  open: boolean;
}

function findDashboardServer(): string | null {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  // Possible locations relative to this file in the CLI package
  const candidates = [
    // Installed / built: packages/web-dashboard/dist/server/index.js
    path.resolve(__dirname, '../../web-dashboard/dist/server/index.js'),
    // Dev layout from packages/cli/dist/
    path.resolve(__dirname, '../../../web-dashboard/dist/server/index.js'),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

async function handleDashboard(port: number, open: boolean): Promise<void> {
  const serverPath = findDashboardServer();

  if (!serverPath) {
    process.stderr.write(
      '❌  Dashboard server not found.\n' +
        '   Build it first:\n' +
        '   cd packages/web-dashboard && npm run build\n',
    );
    process.exit(1);
  }

  const env = {
    ...process.env,
    HOPCODE_DASHBOARD_PORT: String(port),
  };

  process.stdout.write(
    `🐇  Starting HopCode Dashboard on http://localhost:${port} …\n`,
  );

  const child = spawn(process.execPath, [serverPath], {
    env,
    stdio: 'inherit',
    detached: false,
  });

  child.on('error', (err) => {
    process.stderr.write(`Failed to start dashboard: ${err.message}\n`);
    process.exit(1);
  });

  if (open) {
    // Give server a moment to start, then open browser
    setTimeout(async () => {
      const url = `http://localhost:${port}`;
      let cmd: string;
      if (process.platform === 'win32') {
        cmd = `start ${url}`;
      } else if (process.platform === 'darwin') {
        cmd = `open ${url}`;
      } else {
        cmd = `xdg-open ${url}`;
      }
      const { exec } = await import('node:child_process');
      exec(cmd);
    }, 1500);
  }

  // Keep running until Ctrl+C
  process.on('SIGINT', () => {
    child.kill('SIGINT');
    process.exit(0);
  });
  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
    process.exit(0);
  });

  await new Promise<void>((resolve) => {
    child.on('exit', resolve);
  });
}

export const dashboardCommand: CommandModule<object, DashboardArgs> = {
  command: 'dashboard',
  describe: 'Start the web dashboard (session browser, stats, cost tracking)',
  builder: (yargs: Argv) =>
    yargs
      .option('port', {
        alias: 'p',
        type: 'number',
        default: 7899,
        describe: 'Port to listen on',
      })
      .option('open', {
        alias: 'o',
        type: 'boolean',
        default: true,
        describe: 'Open browser automatically',
      })
      .version(false) as Argv<DashboardArgs>,
  handler: async (argv) => {
    await handleDashboard(argv.port, argv.open);
  },
};
