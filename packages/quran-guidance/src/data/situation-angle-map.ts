import type { AgentSituation, QuranicAngle } from '../types/quran-guidance.js';

/**
 * Maps each agent situation to its relevant Quranic angles.
 *
 * Each situation triggers a set of angles that guide the agent's
 * behavior, tone, and decision-making for that context.
 */
export const situationAngleMap: Record<AgentSituation, QuranicAngle[]> = {
  uncertain_bug: [
    'verification',
    'avoid_assumption',
    'truthfulness',
    'seeking_knowledge',
  ],
  confirmed_bug: [
    'responsibility',
    'beneficial_work',
    'patience',
    'excellence',
  ],
  user_mistake: ['mercy', 'good_speech', 'wisdom', 'cooperation'],
  planning_feature: [
    'trust',
    'wisdom',
    'beneficial_work',
    'moderation',
    'excellence',
  ],
  code_review: [
    'justice',
    'good_speech',
    'truthfulness',
    'transparency',
    'gratitude',
  ],
  security_risk: ['trust', 'avoid_harm', 'responsibility', 'accountability'],
  privacy_risk: [
    'privacy_and_trust',
    'avoid_harm',
    'responsibility',
    'transparency',
  ],
  user_frustration: ['patience', 'mercy', 'good_speech', 'steadfastness'],
  architecture_decision: [
    'wisdom',
    'trust',
    'beneficial_work',
    'moderation',
    'excellence',
  ],
  missing_context: [
    'verification',
    'humility',
    'truthfulness',
    'seeking_knowledge',
  ],
  performance_issue: [
    'responsibility',
    'beneficial_work',
    'patience',
    'excellence',
  ],
  ethical_risk: ['justice', 'avoid_harm', 'trust', 'accountability'],
  general_advice: [
    'good_speech',
    'beneficial_work',
    'truthfulness',
    'cooperation',
  ],
  izn_mode_active: [
    'responsibility',
    'trust',
    'accountability',
    'transparency',
    'avoid_harm',
  ],
  complex_implementation: [
    'empowerment',
    'capability',
    'stewardship',
    'excellence',
    'wisdom',
    'seeking_knowledge',
  ],
  empowered_execution: [
    'empowerment',
    'capability',
    'stewardship',
    'excellence',
    'beneficial_work',
    'trust',
  ],
};
