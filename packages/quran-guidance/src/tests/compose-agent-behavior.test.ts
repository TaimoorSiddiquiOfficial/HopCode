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

  it('includes verified ayah text when provided as Map', () => {
    const ayahTexts = new Map([
      ['49:6', 'O you who have believed, if a disobedient one comes...'],
    ]);
    const result = composeAgentBehavior(decision, ayahTexts);

    expect(result).toContain(
      'O you who have believed, if a disobedient one comes',
    );
    expect(result).toContain('49:6: ');
  });

  it('includes verified ayah text when provided as Record', () => {
    const ayahTexts = {
      '17:36': 'And do not pursue that of which you have no knowledge.',
    };
    const result = composeAgentBehavior(decision, ayahTexts);

    expect(result).toContain(
      'And do not pursue that of which you have no knowledge',
    );
    expect(result).toContain('17:36: ');
  });

  it('falls back to ref-only format for ayahs without text', () => {
    const ayahTexts = new Map([['49:6', 'Verified text']]);
    // 17:36 is not in the map, should appear as bare ref
    const result = composeAgentBehavior(decision, ayahTexts);

    expect(result).toContain('49:6: Verified text');
    // 17:36 should still appear but without text appended
    expect(result).toContain('17:36');
  });
});
