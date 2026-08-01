/**
 * WebhookHandler - Processes webhook actions for App events
 *
 * Subscribes to App events and executes HTTP webhook requests.
 * Sends requests to configured HTTP/HTTPS endpoints with configurable
 * method, headers, and body format (JSON or raw).
 */
import type { EventBus } from '../event-bus.ts';
import type { AutomationHandler, AutomationsConfigProvider } from './types.ts';
import { type AutomationEvent, type WebhookActionResult } from '../types.ts';
export interface WebhookHandlerOptions {
    /** Workspace ID */
    workspaceId: string;
    /** Workspace root path */
    workspaceRootPath: string;
    /** Called when webhook results are available */
    onWebhookResults?: (results: WebhookActionResult[]) => void;
    /** Called when a webhook execution fails */
    onError?: (event: AutomationEvent, error: Error) => void;
}
export declare class WebhookHandler implements AutomationHandler {
    private readonly options;
    private readonly configProvider;
    private readonly rateLimiter;
    private readonly retryScheduler;
    private bus;
    private boundHandler;
    constructor(options: WebhookHandlerOptions, configProvider: AutomationsConfigProvider);
    /**
     * Subscribe to App events on the bus.
     */
    subscribe(bus: EventBus): void;
    /**
     * Handle an event by processing matching webhook actions.
     */
    private handleEvent;
    /**
     * Clean up resources.
     */
    dispose(): void;
}
