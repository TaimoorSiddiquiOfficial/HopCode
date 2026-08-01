/**
 * AutomationEventLogger - Logs automation events to events.jsonl
 *
 * CloudEvents-inspired schema with batched I/O for performance.
 * Append-only design for audit trail and replay capabilities.
 */
import type { ActionExecutionResult } from './types.ts';
export interface LoggedAutomationEvent {
    /** Unique event ID (UUID) */
    id: string;
    /** Event type (e.g., 'LabelAdd', 'PermissionModeChange') */
    type: string;
    /** ISO 8601 UTC timestamp */
    time: string;
    /** Origin identifier */
    source: string;
    /** Session context (if applicable) */
    sessionId?: string;
    /** Workspace context */
    workspaceId?: string;
    /** Event payload */
    data: Record<string, unknown>;
    /** Automation execution results */
    results: ActionExecutionResult[];
    /** Total execution time in milliseconds */
    durationMs: number;
}
export type LoggedAutomationEventInput = Omit<LoggedAutomationEvent, 'id' | 'time' | 'source'>;
export declare class AutomationEventLogger {
    private logPath;
    private buffer;
    private flushTimer;
    private isDisposed;
    private flushInProgress;
    private readonly FLUSH_DELAY_MS;
    private readonly MAX_RETRIES;
    private readonly RETRY_DELAY_MS;
    /** Optional callback when events are lost (after all retries fail) */
    onEventLost?: (events: string[], error: Error) => void;
    constructor(workspaceRootPath: string);
    /**
     * Log an event to the event stream.
     * Events are buffered and flushed after a short delay to coalesce rapid writes.
     */
    log(event: LoggedAutomationEventInput): void;
    /**
     * Get the path to the event log file.
     */
    getLogPath(): string;
    /**
     * Schedule a flush if not already scheduled.
     */
    private scheduleFlush;
    /**
     * Flush buffered events to disk with retry logic.
     * Uses atomic buffer swap to prevent race conditions.
     */
    private flush;
    /**
     * Close the logger, flushing any remaining events.
     * Call this during application shutdown.
     */
    close(): Promise<void>;
    /**
     * Dispose the logger, clearing timers and preventing further logging.
     * Alias for close() with additional cleanup.
     */
    dispose(): Promise<void>;
}
