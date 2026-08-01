/**
 * WorkspaceEventBus - Typed Event Bus for Automations System
 *
 * Per-workspace event bus that enables loose coupling between:
 * - Event producers (ConfigWatcher, SchedulerService)
 * - Event consumers (CommandHandler, PromptHandler, EventLogHandler)
 *
 * Benefits over the current callback-based approach:
 * - No global state - each workspace has its own bus instance
 * - Type-safe events with payload validation
 * - Easy to add/remove handlers dynamically
 * - Testable in isolation
 */
import type { AutomationEvent } from './types.ts';
/** Base event payload with common fields */
export interface BaseEventPayload {
    sessionId?: string;
    sessionName?: string;
    workspaceId: string;
    timestamp: number;
    labels?: string[];
}
/** Label events payload */
export interface LabelEventPayload extends BaseEventPayload {
    label: string;
}
/** Permission mode change payload */
export interface PermissionModeChangePayload extends BaseEventPayload {
    oldMode: string;
    newMode: string;
}
/** Flag change payload */
export interface FlagChangePayload extends BaseEventPayload {
    isFlagged: boolean;
}
/** Session status change payload */
export interface SessionStatusChangePayload extends BaseEventPayload {
    oldState: string;
    newState: string;
}
/** Scheduler tick payload */
export interface SchedulerTickPayload extends BaseEventPayload {
    localTime: string;
    utcTime: string;
}
/** Label config change payload */
export interface LabelConfigChangePayload extends BaseEventPayload {
}
/** Generic event payload for agent events */
export interface GenericEventPayload extends BaseEventPayload {
    data: Record<string, unknown>;
}
/**
 * Maps event types to their payload types for type safety.
 */
export interface EventPayloadMap {
    LabelAdd: LabelEventPayload;
    LabelRemove: LabelEventPayload;
    LabelConfigChange: LabelConfigChangePayload;
    PermissionModeChange: PermissionModeChangePayload;
    FlagChange: FlagChangePayload;
    SessionStatusChange: SessionStatusChangePayload;
    SchedulerTick: SchedulerTickPayload;
    PreToolUse: GenericEventPayload;
    PostToolUse: GenericEventPayload;
    PostToolUseFailure: GenericEventPayload;
    Notification: GenericEventPayload;
    UserPromptSubmit: GenericEventPayload;
    SessionStart: GenericEventPayload;
    SessionEnd: GenericEventPayload;
    Stop: GenericEventPayload;
    SubagentStart: GenericEventPayload;
    SubagentStop: GenericEventPayload;
    PreCompact: GenericEventPayload;
    PermissionRequest: GenericEventPayload;
    Setup: GenericEventPayload;
}
export type EventHandler<T extends AutomationEvent> = (payload: EventPayloadMap[T]) => void | Promise<void>;
export type AnyEventHandler = (event: AutomationEvent, payload: BaseEventPayload) => void | Promise<void>;
export interface EventBus {
    /** Emit an event to all registered handlers */
    emit<T extends AutomationEvent>(event: T, payload: EventPayloadMap[T]): Promise<void>;
    /** Register a handler for a specific event type */
    on<T extends AutomationEvent>(event: T, handler: EventHandler<T>): void;
    /** Unregister a handler for a specific event type */
    off<T extends AutomationEvent>(event: T, handler: EventHandler<T>): void;
    /** Register a handler for all events (useful for logging) */
    onAny(handler: AnyEventHandler): void;
    /** Unregister an all-events handler */
    offAny(handler: AnyEventHandler): void;
    /** Clean up all handlers */
    dispose(): void;
}
export declare class WorkspaceEventBus implements EventBus {
    private readonly workspaceId;
    private readonly handlers;
    private readonly anyHandlers;
    private readonly rateCounts;
    private disposed;
    constructor(workspaceId: string);
    /**
     * Emit an event to all registered handlers.
     * Handlers are called in parallel, errors are caught and logged.
     */
    emit<T extends AutomationEvent>(event: T, payload: EventPayloadMap[T]): Promise<void>;
    /**
     * Register a handler for a specific event type.
     */
    on<T extends AutomationEvent>(event: T, handler: EventHandler<T>): void;
    /**
     * Unregister a handler for a specific event type.
     */
    off<T extends AutomationEvent>(event: T, handler: EventHandler<T>): void;
    /**
     * Register a handler for all events.
     * Useful for logging, metrics, or debugging.
     */
    onAny(handler: AnyEventHandler): void;
    /**
     * Unregister an all-events handler.
     */
    offAny(handler: AnyEventHandler): void;
    /**
     * Clean up all handlers and mark as disposed.
     */
    dispose(): void;
    /**
     * Check if the bus has been disposed.
     */
    isDisposed(): boolean;
    /**
     * Get the workspace ID this bus belongs to.
     */
    getWorkspaceId(): string;
    /**
     * Get handler count for debugging.
     */
    getHandlerCount(event?: AutomationEvent): number;
}
