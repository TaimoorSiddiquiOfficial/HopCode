import type { GuidanceDecision, SituationAnalysis } from '../types/quran-guidance.js';
/**
 * Resolves a situation analysis into a concrete guidance decision.
 *
 * Matches the detected situation against curated ayah guidance entries
 * to produce a strategy (do/avoid/tone) and relevant ayah references.
 *
 * When iznModeActive is true, accountability and transparency angles
 * are layered onto the base strategy.
 */
export declare function resolveGuidance(analysis: SituationAnalysis, iznModeActive?: boolean): GuidanceDecision;
