/**
 * `hopcode cron` — persistent cron job manager.
 *
 * Jobs are stored in ~/.hopcode/cron.json and survive process restarts.
 * Unlike the in-session CronScheduler (core/src/services/cronScheduler.ts)
 * which is in-memory only, this CLI command manages a persistent job store
 * that other tools can read.
 *
 * Usage:
 *   hopcode cron add "<cron>" "<prompt>"   — add a recurring job
 *   hopcode cron once "<cron>" "<prompt>"  — add a one-shot job
 *   hopcode cron list                      — list all jobs
 *   hopcode cron remove <id>               — remove a job by ID
 *   hopcode cron clear                     — remove all jobs
 */

import type { CommandModule, Argv } from 'yargs';
import fs from 'node:fs';
import path from 'node:path';
import { homedir } from 'node:os';

// ── Types ───────────────────────────────────────────────────────────────────

interface PersistedCronJob {
  id: string;
  cronExpr: string;
  prompt: string;
  recurring: boolean;
  createdAt: string; // ISO
  description?: string;
}

interface CronStore {
  version: 1;
  jobs: PersistedCronJob[];
}

// ── Store helpers ────────────────────────────────────────────────────────────

function storePath(): string {
  return path.join(homedir(), '.hopcode', 'cron.json');
}

function loadStore(): CronStore {
  const p = storePath();
  if (!fs.existsSync(p)) return { version: 1, jobs: [] };
  try {
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as CronStore;
  } catch {
    return { version: 1, jobs: [] };
  }
}

function saveStore(store: CronStore): void {
  const p = storePath();
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(store, null, 2), 'utf-8');
}

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

function validateCron(expr: string): boolean {
  // Basic 5-field cron validation
  const fields = expr.trim().split(/\s+/);
  return fields.length === 5;
}

// ── Subcommands ──────────────────────────────────────────────────────────────

interface AddArgs {
  cron: string;
  prompt: string;
  description?: string;
  once: boolean;
}

const addCommand: CommandModule<object, AddArgs> = {
  command: 'add <cron> <prompt>',
  describe: 'Add a recurring cron job',
  builder: (yargs: Argv) =>
    yargs
      .positional('cron', {
        type: 'string',
        describe: 'Cron expression (5 fields: min hour day month weekday)',
        demandOption: true,
      })
      .positional('prompt', {
        type: 'string',
        describe: 'Prompt to run when the job fires',
        demandOption: true,
      })
      .option('description', {
        type: 'string',
        describe: 'Optional human-readable label',
      })
      .option('once', {
        type: 'boolean',
        default: false,
        describe: 'Run only once then delete (one-shot)',
      }) as Argv<AddArgs>,
  handler: (argv) => {
    if (!validateCron(argv.cron)) {
      process.stderr.write(
        `Error: Invalid cron expression "${argv.cron}". Expected 5 fields: min hour day month weekday\n` +
          `Example: "0 9 * * MON" = every Monday at 09:00\n`,
      );
      process.exit(1);
    }

    const store = loadStore();
    const job: PersistedCronJob = {
      id: generateId(),
      cronExpr: argv.cron,
      prompt: argv.prompt,
      recurring: !argv.once,
      createdAt: new Date().toISOString(),
      description: argv.description,
    };
    store.jobs.push(job);
    saveStore(store);

    const kind = argv.once ? 'one-shot' : 'recurring';
    process.stdout.write(
      `✓ Created ${kind} job [${job.id}]\n` +
        `  Schedule: ${argv.cron}\n` +
        `  Prompt:   ${argv.prompt}\n`,
    );
  },
};

interface RemoveArgs {
  id: string;
}

const removeCommand: CommandModule<object, RemoveArgs> = {
  command: 'remove <id>',
  describe: 'Remove a cron job by ID',
  aliases: ['rm', 'delete', 'del'],
  builder: (yargs: Argv) =>
    yargs.positional('id', {
      type: 'string',
      describe: 'Job ID (from hopcode cron list)',
      demandOption: true,
    }) as Argv<RemoveArgs>,
  handler: (argv) => {
    const store = loadStore();
    const before = store.jobs.length;
    store.jobs = store.jobs.filter((j) => j.id !== argv.id);
    if (store.jobs.length === before) {
      process.stderr.write(`Error: No job found with ID "${argv.id}"\n`);
      process.exit(1);
    }
    saveStore(store);
    process.stdout.write(`✓ Removed job [${argv.id}]\n`);
  },
};

const listCommand: CommandModule = {
  command: 'list',
  describe: 'List all cron jobs',
  aliases: ['ls'],
  builder: (yargs: Argv) => yargs,
  handler: () => {
    const store = loadStore();
    if (store.jobs.length === 0) {
      process.stdout.write('No cron jobs configured.\n');
      process.stdout.write(
        'Add one with: hopcode cron add "0 9 * * MON" "your prompt"\n',
      );
      return;
    }

    process.stdout.write(`${store.jobs.length} job(s):\n\n`);
    for (const job of store.jobs) {
      const kind = job.recurring ? 'recurring' : 'one-shot';
      const label = job.description ? ` (${job.description})` : '';
      process.stdout.write(
        `[${job.id}] ${job.cronExpr}${label}\n` +
          `  Type:    ${kind}\n` +
          `  Prompt:  ${job.prompt}\n` +
          `  Created: ${job.createdAt}\n\n`,
      );
    }
  },
};

const clearCommand: CommandModule = {
  command: 'clear',
  describe: 'Remove all cron jobs',
  builder: (yargs: Argv) => yargs,
  handler: () => {
    const store = loadStore();
    const count = store.jobs.length;
    store.jobs = [];
    saveStore(store);
    process.stdout.write(`✓ Removed ${count} job(s)\n`);
  },
};

interface ShowArgs {
  id: string;
}

const showCommand: CommandModule<object, ShowArgs> = {
  command: 'show <id>',
  describe: 'Show details of a cron job',
  builder: (yargs: Argv) =>
    yargs.positional('id', {
      type: 'string',
      describe: 'Job ID',
      demandOption: true,
    }) as Argv<ShowArgs>,
  handler: (argv) => {
    const store = loadStore();
    const job = store.jobs.find((j) => j.id === argv.id);
    if (!job) {
      process.stderr.write(`Error: No job found with ID "${argv.id}"\n`);
      process.exit(1);
    }
    process.stdout.write(JSON.stringify(job, null, 2) + '\n');
  },
};

// ── Root command ─────────────────────────────────────────────────────────────

export const cronCommand: CommandModule = {
  command: 'cron',
  describe: 'Manage persistent cron jobs (~/.hopcode/cron.json)',
  builder: (yargs: Argv) =>
    yargs
      .command(addCommand)
      .command(removeCommand)
      .command(listCommand)
      .command(clearCommand)
      .command(showCommand)
      .demandCommand(
        1,
        'You need at least one subcommand. Try: hopcode cron list',
      )
      .version(false),
  handler: () => {},
};
