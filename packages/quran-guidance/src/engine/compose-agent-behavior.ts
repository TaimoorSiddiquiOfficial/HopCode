import { responsePatterns } from '../data/response-patterns.js';
import type { GuidanceDecision } from '../types/quran-guidance.js';
import type { ResponsePatternKey } from '../data/response-patterns.js';

/**
 * Composes the final agent behavior prompt from a guidance decision.
 *
 * Produces a structured behavior instruction string that can be
 * injected into the agent's system prompt or context.
 */
export function composeAgentBehavior(decision: GuidanceDecision): string {
  const patternKey = decision.responsePattern as ResponsePatternKey;
  const pattern =
    responsePatterns[patternKey] ?? responsePatterns.truthful_helpful_response;

  return [
    pattern.opening,
    '',
    pattern.body,
    '',
    'Apply these Quran-guided strategy rules:',
    ...decision.strategy.do.slice(0, 5).map((item) => `- ${item}`),
    '',
    'Avoid:',
    ...decision.strategy.avoid.slice(0, 3).map((item) => `- ${item}`),
    '',
    `Tone: ${decision.strategy.tone.join(', ')}`,
    '',
    `Relevant curated ayah references: ${decision.ayahRefs.join(', ')}`,
  ].join('\n');
}
