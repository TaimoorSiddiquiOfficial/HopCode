/**
 * Automation UI Types
 *
 * UI-specific types for the automations components.
 *
 * ARCHITECTURE NOTE: These types are mirrored from packages/shared/src/automations/types.ts.
 * The renderer runs in a browser context and CANNOT import from @craft-agent/shared,
 * which uses Node.js APIs (crypto, fs, etc.). Additionally, the automations package is not
 * exported as a package entry point. These types must be manually kept in sync.
 * Renderer code must not call Node.js APIs directly.
 */
import type { PermissionMode } from '../../../shared/types';
export type AppEvent = 'LabelAdd' | 'LabelRemove' | 'LabelConfigChange' | 'PermissionModeChange' | 'FlagChange' | 'TodoStateChange' | 'SessionStatusChange' | 'SchedulerTick';
export type AgentEvent = 'PreToolUse' | 'PostToolUse' | 'PostToolUseFailure' | 'Notification' | 'UserPromptSubmit' | 'SessionStart' | 'SessionEnd' | 'Stop' | 'SubagentStart' | 'SubagentStop' | 'PreCompact' | 'PermissionRequest' | 'Setup';
export type AutomationTrigger = AppEvent | AgentEvent;
export declare const APP_EVENTS: AppEvent[];
export declare const AGENT_EVENTS: AgentEvent[];
export interface PromptAction {
    type: 'prompt';
    prompt: string;
}
export interface WebhookAction {
    type: 'webhook';
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    bodyFormat?: 'json' | 'form' | 'raw';
    body?: unknown;
    captureResponse?: boolean;
    auth?: {
        type: 'basic';
        username: string;
        password: string;
    } | {
        type: 'bearer';
        token: string;
    };
}
export type AutomationAction = PromptAction | WebhookAction;
export interface TimeConditionUI {
    condition: 'time';
    after?: string;
    before?: string;
    weekday?: string[];
    timezone?: string;
}
export interface StateConditionUI {
    condition: 'state';
    field: string;
    value?: unknown;
    from?: unknown;
    to?: unknown;
    contains?: string;
    not_value?: unknown;
}
export interface LogicalConditionUI {
    condition: 'and' | 'or' | 'not';
    conditions: AutomationConditionUI[];
}
export type AutomationConditionUI = TimeConditionUI | StateConditionUI | LogicalConditionUI;
/**
 * Flatten a condition tree into displayable rows.
 * Logical conditions are expanded so their children appear as joined text.
 * Returns an array of { label, description } for rendering in Info_Table.
 */
export declare function flattenConditions(conditions: AutomationConditionUI[]): {
    label: string;
    description: string;
}[];
export interface AutomationListItem {
    /** Stable 6-char hex ID from automations.json, with fallback to event+index for legacy configs */
    id: string;
    /** The event this automation listens to */
    event: AutomationTrigger;
    /** Index of this matcher within its event array in automations.json (for write-back) */
    matcherIndex: number;
    /** Display name (user-set or auto-derived) */
    name: string;
    /** Human-readable summary */
    summary: string;
    /** Whether this automation is enabled */
    enabled: boolean;
    /** Regex matcher (if any) */
    matcher?: string;
    /** Cron expression (SchedulerTick only) */
    cron?: string;
    /** IANA timezone for cron */
    timezone?: string;
    /** Permission mode */
    permissionMode?: PermissionMode;
    /** Labels for prompt sessions */
    labels?: string[];
    /** Conditions that must pass before actions run */
    conditions?: AutomationConditionUI[];
    /** The actions this automation performs */
    actions: AutomationAction[];
    /** Timestamp of last execution (ms since epoch) */
    lastExecutedAt?: number;
}
export type AutomationFilterKind = 'all' | 'app' | 'agent' | 'scheduled';
export interface AutomationListFilter {
    kind: AutomationFilterKind;
}
/** Maps task type (from route) to AutomationFilterKind for the list panel */
export declare const AUTOMATION_TYPE_TO_FILTER_KIND: Record<string, AutomationFilterKind>;
export type ExecutionStatus = 'success' | 'error' | 'blocked';
export interface WebhookDetails {
    method: string;
    url: string;
    statusCode: number;
    durationMs: number;
    attempts?: number;
    error?: string;
    responseBody?: string;
}
export interface ExecutionEntry {
    id: string;
    automationId: string;
    event: AutomationTrigger;
    status: ExecutionStatus;
    /** Duration in milliseconds */
    duration: number;
    /** Timestamp in ms since epoch */
    timestamp: number;
    /** Error message (if status === 'error') */
    error?: string;
    /** Truncated action summary */
    actionSummary?: string;
    /** Session ID created by this execution (for deep linking) */
    sessionId?: string;
    /** Structured webhook execution details (expandable in timeline) */
    webhookDetails?: WebhookDetails;
}
export type TestState = 'idle' | 'running' | 'success' | 'error';
export interface TestResult {
    state: TestState;
    stderr?: string;
    duration?: number;
}
/** Maps internal event names to user-friendly labels */
export declare const EVENT_DISPLAY_NAMES: Record<AutomationTrigger, string>;
export declare function getEventDisplayName(event: AutomationTrigger): string;
/** Maps permission mode values to user-friendly labels */
export declare const PERMISSION_DISPLAY_NAMES: Record<PermissionMode, string>;
export declare function getPermissionDisplayName(mode?: PermissionMode): string;
export type EventCategory = 'scheduled' | 'label' | 'permission' | 'flag' | 'todo' | 'agent-pre' | 'agent-post' | 'agent-error' | 'session' | 'other';
/**
 * Parse an automations.json file into a flat list of AutomationListItem[].
 * Each matcher entry under each event becomes one item.
 */
export declare function parseAutomationsConfig(json: unknown): AutomationListItem[];
export declare function getEventCategory(event: AutomationTrigger): EventCategory;
