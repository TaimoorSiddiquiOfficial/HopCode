/**
 * Automation Condition Evaluator
 *
 * Pure synchronous evaluation engine for automation conditions.
 * Inspired by Home Assistant's condition system.
 *
 * Supports:
 * - time: Time-of-day and day-of-week checks
 * - state: Event payload field checks with HA-style from/to for transitions
 * - and/or/not: Logical composition with short-circuit evaluation
 */
import type { AutomationCondition } from './types.ts';
/** Context passed to condition evaluators */
export interface ConditionContext {
    /** Event payload fields */
    payload: Record<string, unknown>;
    /** Injectable current time (for testing) */
    now?: Date;
    /** Fallback timezone from the matcher */
    matcherTimezone?: string;
}
/**
 * Evaluate an array of conditions (top-level AND).
 * Returns true if all conditions pass, or if the array is empty/undefined.
 */
export declare function evaluateConditions(conditions: AutomationCondition[], context: ConditionContext): boolean;
