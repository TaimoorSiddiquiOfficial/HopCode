import { ayahGuidance } from '../data/ayah-guidance.js';
import type {
  GuidanceDecision,
  SituationAnalysis,
} from '../types/quran-guidance.js';
import { IZN_MODE_ANGLES } from '../types/izn-types.js';

/**
 * Resolves a situation analysis into a concrete guidance decision.
 *
 * Matches the detected situation against curated ayah guidance entries
 * to produce a strategy (do/avoid/tone) and relevant ayah references.
 *
 * When iznModeActive is true, accountability and transparency angles
 * are layered onto the base strategy.
 */
export function resolveGuidance(
  analysis: SituationAnalysis,
  iznModeActive: boolean = false,
): GuidanceDecision {
  let matches = ayahGuidance.filter((entry) => {
    const situationMatch = entry.agentStrategy.useWhen.includes(
      analysis.situation,
    );

    const angleMatch = entry.angles.some((angle) =>
      analysis.requiredAngles.includes(angle),
    );

    return situationMatch || angleMatch;
  });

  // Izn overlay: if in Izn mode, also match izn-specific guidance
  if (iznModeActive) {
    const iznMatches = ayahGuidance.filter((entry) =>
      entry.agentStrategy.useWhen.includes('izn_mode_active'),
    );
    matches = [...matches, ...iznMatches];
  }

  // Take up to 5 best matches
  const selected = matches.slice(0, 5);

  let appliedAngles = Array.from(
    new Set(selected.flatMap((entry) => entry.angles)),
  );

  // Add Izn-specific angles if in Izn mode
  if (iznModeActive) {
    appliedAngles = Array.from(new Set([...appliedAngles, ...IZN_MODE_ANGLES]));
  }

  const ayahRefs = selected.map((entry) => entry.ref);

  const doActions = Array.from(
    new Set(selected.flatMap((entry) => entry.agentStrategy.do)),
  );

  const avoidActions = Array.from(
    new Set(selected.flatMap((entry) => entry.agentStrategy.avoid)),
  );

  const tone = Array.from(
    new Set(selected.flatMap((entry) => entry.agentStrategy.tone)),
  );

  return {
    situation: analysis.situation,
    appliedAngles,
    ayahRefs,
    strategy: {
      do: doActions,
      avoid: avoidActions,
      tone,
    },
    responsePattern: chooseResponsePattern(analysis.situation, iznModeActive),
  };
}

function chooseResponsePattern(
  situation: string,
  iznModeActive: boolean,
): string {
  if (iznModeActive) {
    return 'izn_responsible_execution';
  }

  switch (situation) {
    case 'uncertain_bug':
      return 'verify_before_judging';
    case 'security_risk':
    case 'privacy_risk':
      return 'warn_and_offer_safe_path';
    case 'code_review':
      return 'fair_review_with_constructive_fix';
    case 'planning_feature':
    case 'architecture_decision':
      return 'responsible_step_by_step_plan';
    case 'user_mistake':
      return 'gentle_correction';
    default:
      return 'truthful_helpful_response';
  }
}
