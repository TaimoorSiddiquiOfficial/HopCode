/**
 * Shared automation utilities.
 *
 * Cron helpers used by CronBuilder (visual editor) and AutomationInfoPage (info display).
 * Time formatting shared by AutomationsListPanel and AutomationEventTimeline.
 */
/**
 * Format a timestamp as a compact relative time string (e.g. "3m", "2h", "5d").
 * Used by both AutomationsListPanel (trailing timestamp) and AutomationEventTimeline.
 */
export declare function formatShortRelativeTime(timestamp: number): string;
/**
 * Describe a cron expression in human-readable form.
 */
export declare function describeCron(cron: string): string;
/**
 * Compute the next N run times for a cron expression using croner.
 */
export declare function computeNextRuns(cron: string, count?: number): Date[];
