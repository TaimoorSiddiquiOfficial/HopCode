/**
 * EventLogHandler - Logs all automation events to events.jsonl
 *
 * Subscribes to all events and logs them for audit trail and replay.
 * Uses the existing AutomationEventLogger for buffered I/O.
 */
import type { EventBus } from '../event-bus.ts';
import type { AutomationHandler, EventLogHandlerOptions } from './types.ts';
export declare class EventLogHandler implements AutomationHandler {
    private readonly options;
    private readonly logger;
    private bus;
    private boundHandler;
    constructor(options: EventLogHandlerOptions);
    /**
     * Subscribe to all events on the bus.
     */
    subscribe(bus: EventBus): void;
    /**
     * Handle an event by logging it.
     */
    private handleEvent;
    /**
     * Get the path to the event log file.
     */
    getLogPath(): string;
    /**
     * Clean up resources.
     */
    dispose(): Promise<void>;
}
