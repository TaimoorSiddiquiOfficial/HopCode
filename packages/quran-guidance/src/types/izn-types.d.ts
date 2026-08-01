/**
 * Izn mode types for the Quran-guidance system.
 *
 * Izn (إذن) means "permission" — the user grants the agent full
 * trust to execute tools without individual approval, but the agent
 * must act with heightened responsibility and accountability.
 */
import type { AgentSituation, QuranicAngle } from './quran-guidance.js';
/** Categories of destructive actions that require self-verification in Izn mode. */
export type DestructiveActionCategory = 'file_deletion' | 'force_push' | 'database_drop' | 'database_truncate' | 'permission_change';
/** Result of the Izn pre-execution gate check. */
export type IznGateResult = {
    allowed: true;
} | {
    allowed: false;
    reason: string;
    requiredConfirmation: string;
    /** Intent clarification fields — model investigates before retrying. */
    category: DestructiveActionCategory[];
    /** Steps the model should take to understand impact before acting. */
    analysisPlan: string[];
    /** Questions to ask the user to clarify their intent. */
    intentQuestions: string[];
    /** What the model should investigate (files to read, deps to trace). */
    impactScope: string[];
    /** Escalation level when the same category has been blocked repeatedly. */
    escalationLevel?: 'caution' | 'warning' | 'refusal';
};
/** Izn mode behavior rules that layer onto the base guidance. */
export type IznBehaviorRule = {
    /** The destructive action category that triggers this rule. */
    category: DestructiveActionCategory;
    /** Pattern to detect in tool names or arguments. */
    detectPattern: RegExp;
    /** Required verification step before execution. */
    preVerify: string[];
    /** What the agent must report after execution. */
    postReport: string[];
    /** When to revert to consultation despite having Izn. */
    revertCondition: string;
    /** Impact analysis: what the model should investigate before acting. */
    impactAnalysis: {
        /** Files/patterns to read to understand what will be affected. */
        readTargets: string[];
        /** Dependency patterns to trace (imports, references, FK chains). */
        dependencyChecks: string[];
        /** Cascade-effect scenarios to predict and warn about. */
        cascadeScenarios: string[];
    };
    /** Questions to ask the user to clarify their intent. */
    intentQuestions: string[];
};
/** Extended situation angles when Izn mode is active. */
export declare const IZN_MODE_SITUATION: AgentSituation;
/** Additional angles applied when Izn mode is detected. */
export declare const IZN_MODE_ANGLES: QuranicAngle[];
/** Izn mode behavior constraints. */
export declare const IZN_MODE_DO: string[];
export declare const IZN_MODE_AVOID: string[];
export declare const IZN_MODE_TONE: string[];
