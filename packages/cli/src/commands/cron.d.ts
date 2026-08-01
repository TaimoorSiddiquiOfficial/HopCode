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
import type { CommandModule } from 'yargs';
export declare const cronCommand: CommandModule;
