/**
 * Shared Utilities for Automations System
 *
 * Common helper functions used by both the legacy functional API (index.ts)
 * and the new Event Bus handlers (command-handler.ts, prompt-handler.ts).
 */
import type { BaseEventPayload } from './event-bus.ts';
import type { AutomationEvent, AutomationMatcher, PromptReferences, AgentEvent, SdkAutomationInput } from './types.ts';
/**
 * Convert camelCase to SNAKE_CASE.
 *
 * @example
 * toSnakeCase('newStatus') // 'new_status'
 * toSnakeCase('toolName')  // 'tool_name'
 */
export declare function toSnakeCase(str: string): string;
/**
 * Expand environment variables in a string.
 * Supports both $VAR and ${VAR} syntax.
 *
 * @example
 * expandEnvVars('Hello $NAME', { NAME: 'World' }) // 'Hello World'
 * expandEnvVars('${GREETING} World', { GREETING: 'Hi' }) // 'Hi World'
 */
export declare function expandEnvVars(str: string, env: Record<string, string>): string;
/**
 * Parse @mentions from a prompt (sources and skills both use @name syntax).
 *
 * Syntax:
 * - @name - references a source or skill (e.g., @linear, @github, @commit, @review-pr)
 *
 * References are case-insensitive and support hyphens (e.g., @my-source, @my-skill).
 * The caller should resolve which mentions are sources vs skills based on available configurations.
 */
export declare function parsePromptReferences(prompt: string): PromptReferences;
/**
 * Get the match value for regex matching based on event type.
 * Uses the most complete version with data.data?.tool_name fallback for tool events.
 *
 * Accepts both plain data objects (legacy API) and BaseEventPayload (handler API).
 */
export declare function getMatchValue(event: AutomationEvent, data: Record<string, unknown>): string;
/**
 * Get the match value for SDK agent events.
 * Mirrors backend hook `fieldToMatch` per event — each event type matches
 * against a specific field from the input.
 */
export declare function getMatchValueForSdkInput(event: AgentEvent, input: SdkAutomationInput): string;
export interface MatcherContext {
    /** Precomputed value used for regex matching */
    matchValue: string;
    /** Payload used for condition evaluation */
    payload: Record<string, unknown>;
    /** Fallback timezone source for time conditions */
    matcherTimezone?: string;
}
/**
 * Canonical matcher evaluation pipeline used by all automation entry points.
 */
export declare function matcherMatchesWithContext(matcher: AutomationMatcher, event: AutomationEvent, context: MatcherContext): boolean;
/**
 * App-event adapter for canonical matcher evaluation.
 */
export declare function matcherMatches(matcher: AutomationMatcher, event: AutomationEvent, data: Record<string, unknown>): boolean;
/**
 * SDK agent-event adapter for canonical matcher evaluation.
 */
export declare function matcherMatchesSdk(matcher: AutomationMatcher, event: AgentEvent, input: SdkAutomationInput): boolean;
/**
 * Get process.env as a clean Record<string, string> with undefined values filtered out.
 * Avoids the unsafe `process.env as Record<string, string>` cast that turns undefined
 * values into the string "undefined".
 */
export declare function cleanEnv(): Record<string, string>;
/**
 * Build environment variables from an event payload for prompt/command actions.
 * Includes full process.env and sanitizes user-controlled values for shell safety.
 */
export declare function buildEnvFromPayload(event: AutomationEvent, payload: BaseEventPayload): Record<string, string>;
/**
 * Build environment variables for webhook actions.
 *
 * Unlike buildEnvFromPayload (used by prompt actions), this:
 * - Does NOT spread process.env (no secret leakage)
 * - Does NOT apply shell sanitization (irrelevant for HTTP context)
 * - Only injects CRAFT_WH_* user-defined vars from process.env (webhook secrets)
 * - Includes CRAFT_* system vars derived from the event payload
 *
 * Users set webhook secrets in their shell profile:
 *   export CRAFT_WH_SLACK_URL="https://hooks.slack.com/services/T.../B.../xxx"
 *   export CRAFT_WH_DISCORD_TOKEN="abc123"
 *
 * Then reference them in automations.json:
 *   "url": "${CRAFT_WH_SLACK_URL}"
 *   "headers": { "Authorization": "Bearer ${CRAFT_WH_DISCORD_TOKEN}" }
 */
export declare function buildWebhookEnv(event: AutomationEvent, payload: BaseEventPayload): Record<string, string>;
