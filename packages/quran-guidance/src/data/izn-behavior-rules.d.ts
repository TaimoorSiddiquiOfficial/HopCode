import type { IznBehaviorRule } from '../types/izn-types.js';
/**
 * Izn mode behavior rules.
 *
 * When the user grants Izn (full permission), the agent self-verifies
 * before these categories of destructive actions. Instead of hard-blocking,
 * the gate returns an intent-clarification plan — the model reads affected
 * files, traces dependencies, predicts cascade effects, and asks the user
 * to confirm their actual goal before acting.
 */
export declare const iznBehaviorRules: IznBehaviorRule[];
