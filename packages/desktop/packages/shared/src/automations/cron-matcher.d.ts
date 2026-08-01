/**
 * Cron Matching Utilities for Automations
 *
 * Determines if a cron expression matches the current time.
 * Used by SchedulerTick automations to trigger at specific intervals.
 */
/**
 * Check if a cron expression matches the current time.
 * Uses croner's nextRun to determine if the current minute matches the cron pattern.
 *
 * @param cronExpr - Cron expression in 5-field format (minute hour day-of-month month day-of-week)
 * @param timezone - Optional IANA timezone (e.g., "Europe/Budapest", "America/New_York")
 * @returns true if the cron expression matches the current minute
 *
 * @example
 * matchesCron('* * * * *')                    // Matches every minute
 * matchesCron('0 9 * * *', 'Europe/Budapest') // Matches 9:00 AM Budapest time
 */
export declare function matchesCron(cronExpr: string, timezone?: string): boolean;
