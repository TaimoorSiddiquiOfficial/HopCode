import type { ClassifierTelemetry, SituationAnalysis } from '../types/quran-guidance.js';
type ClassifyInput = {
    userMessage: string;
    agentContext?: string;
    taskType?: string;
    /** Optional telemetry callback for recording classification events. */
    telemetry?: ClassifierTelemetry;
};
/**
 * Classifies the current user message into an agent situation.
 *
 * Uses keyword heuristics ordered from most-specific to most-general.
 * Early matches (security, privacy) short-circuit; later categories
 * (uncertain_bug, code_review) are checked after more-specific
 * siblings (confirmed_bug, planning_feature / architecture_decision).
 *
 * When a telemetry callback is provided, `recordClassification` is
 * called with the detected situation and confidence before returning.
 *
 * Future: Could be replaced by an LLM-based or scoring classifier
 * for higher accuracy.
 */
export declare function classifySituation(input: ClassifyInput): SituationAnalysis;
export {};
