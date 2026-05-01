import { describe, it, expect } from 'vitest';
import { composeAgentBehavior } from '../engine/compose-agent-behavior.js';
import type { GuidanceDecision } from '../types/quran-guidance.js';

describe('composeAgentBehavior', () => {
  const decision: GuidanceDecision = {
    situation: 'uncertain_bug',
    appliedAngles: ['verification', 'truthfulness'],
    ayahRefs: ['49:6', '17:36'],
    strategy: {
      do: ['Verify before acting.', 'Separate facts from assumptions.'],
      avoid: ['Do not guess confidently.', 'Do not blame the user.'],
      tone: ['careful', 'fair', 'calm'],
    },
    responsePattern: 'verify_before_judging',
  };

  it('composes a behavior prompt with strategy rules', () => {
    const result = composeAgentBehavior(decision);
    expect(result).toContain('Verify before acting');
    expect(result).toContain('Do not guess confidently');
    expect(result).toContain('careful, fair, calm');
    expect(result).toContain('49:6');
    expect(result).toContain('17:36');
  });

  it('includes the response pattern opening', () => {
    const result = composeAgentBehavior(decision);
    expect(result).toContain("Let's verify this carefully");
  });
});
