import type { DestructiveActionCategory, IznGateResult } from '../types/izn-types.js';
export declare const IZN_ESCALATION_LEVELS: {
    /** Standard self-verification — first-time or isolated destructive call. */
    readonly CAUTION: "caution";
    /** Repeated same-category block — stronger warning with regression risk. */
    readonly WARNING: "warning";
    /** Persistent same-category block — refusal with explicit justification. */
    readonly REFUSAL: "refusal";
};
export type IznEscalationLevel = (typeof IZN_ESCALATION_LEVELS)[keyof typeof IZN_ESCALATION_LEVELS];
export interface IznBlockHistoryEntry {
    category: DestructiveActionCategory;
}
/**
 * Izn pre-execution gate.
 *
 * When the agent is in Izn mode, this function checks whether a
 * tool call is a destructive action. Instead of hard-blocking, it
 * returns an intent-clarification plan — the model reads affected
 * files, traces dependencies, predicts cascade effects, and asks
 * the user to confirm their actual goal before acting.
 *
 * Non-destructive actions (reads, normal writes, searches) pass through.
 * Destructive categories trigger the clarification workflow.
 *
 * When `blockHistory` is provided, the gate escalates after repeated
 * same-category blocks: caution → warning (3+) → refusal (5+).
 */
export declare function checkIznGate(input: {
    toolName: string;
    toolArgs?: Record<string, unknown>;
    command?: string;
}, blockHistory?: IznBlockHistoryEntry[]): IznGateResult;
/**
 * Izn post-execution scope report.
 *
 * After a tool executes in Izn mode, appends a brief scope-verification
 * reminder to the model's context. For destructive actions, includes
 * the category-specific post-report checklist. For normal tools, a
 * generic reminder to verify the result matches intent.
 *
 * When `blockHistory` is provided and escalation applies, the report
 * includes stronger regression-risk warnings.
 */
export declare function reportIznScope(input: {
    toolName: string;
    toolArgs?: Record<string, unknown>;
    command?: string;
}, blockHistory?: IznBlockHistoryEntry[]): {
    context: string;
};
