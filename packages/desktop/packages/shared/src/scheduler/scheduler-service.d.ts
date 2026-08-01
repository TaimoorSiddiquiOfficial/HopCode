/**
 * SchedulerService - Emits SchedulerTick events every minute
 *
 * Aligned to minute boundaries for consistent timing.
 * Automations can subscribe using cron expressions in automations.json.
 */
export interface SchedulerTickPayload {
    /** ISO 8601 UTC timestamp */
    timestamp: string;
    /** HH:MM in local time */
    localTime: string;
    /** Hour (0-23) */
    hour: number;
    /** Minute (0-59) */
    minute: number;
    /** Day of week (0-6, Sunday = 0) */
    dayOfWeek: number;
    /** Day name abbreviation (Sun, Mon, Tue, etc.) */
    dayName: string;
}
export declare class SchedulerService {
    private timer;
    private alignmentTimer;
    private isTicking;
    private onTick;
    constructor(onTick: (payload: SchedulerTickPayload) => Promise<void>);
    start(): void;
    stop(): void;
    private tick;
}
