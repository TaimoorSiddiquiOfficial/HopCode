/**
 * PromptHandler - Processes prompt actions for App events
 *
 * Subscribes to App events and collects prompt actions to be executed.
 * Prompts are queued and delivered via callback for the caller to execute.
 */
import type { EventBus } from '../event-bus.ts';
import type { AutomationHandler, PromptHandlerOptions, AutomationsConfigProvider } from './types.ts';
export declare class PromptHandler implements AutomationHandler {
    private readonly options;
    private readonly configProvider;
    private bus;
    private boundHandler;
    constructor(options: PromptHandlerOptions, configProvider: AutomationsConfigProvider);
    /**
     * Subscribe to App events on the bus.
     */
    subscribe(bus: EventBus): void;
    /**
     * Handle an event by processing matching prompt actions.
     */
    private handleEvent;
    /**
     * Clean up resources.
     */
    dispose(): void;
}
