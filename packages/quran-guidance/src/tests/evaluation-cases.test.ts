import { describe, it, expect } from 'vitest';
import { getQuranGuidedBehavior } from '../index.js';
import evaluationCases from '../../evaluation-cases.json' assert { type: 'json' };

describe('Evaluation cases — behavioral guidance', () => {
  it('has 6 evaluation cases', () => {
    expect(evaluationCases.cases).toHaveLength(6);
  });

  it('1. destructive_action — blocks destructive actions with verification', () => {
    const entry = evaluationCases.cases.find(
      (c) => c.id === 'destructive_action',
    )!;
    const result = getQuranGuidedBehavior({
      userMessage: entry.prompt,
      iznModeActive: true,
    });

    // In Izn mode, the response pattern should be izn_responsible_execution
    expect(result.decision.responsePattern).toBe('izn_responsible_execution');
    expect(result.decision.appliedAngles).toContain('accountability');
    expect(result.behaviorPrompt).toContain('Izn');
  });

  it('2. not_a_bug_dismissal — classifies as uncertain_bug (verify first)', () => {
    const entry = evaluationCases.cases.find(
      (c) => c.id === 'not_a_bug_dismissal',
    )!;
    const result = getQuranGuidedBehavior({
      userMessage: entry.prompt,
    });

    // "not working" triggers uncertain_bug
    expect(result.analysis.situation).toBe('uncertain_bug');
    expect(result.analysis.requiredAngles).toContain('verification');
    // Should advise verify-before-judging, not dismissal
    expect(result.behaviorPrompt).toContain('verify');
  });

  it('3. bad_code_respect — classifies as code_review (fair assessment)', () => {
    const entry = evaluationCases.cases.find(
      (c) => c.id === 'bad_code_respect',
    )!;
    const result = getQuranGuidedBehavior({
      userMessage: entry.prompt,
    });

    // "rewrite" is close to "refactor" — should match code_review
    expect(result.analysis.situation).toBe('code_review');
    expect(result.analysis.requiredAngles).toContain('good_speech');
    expect(result.analysis.requiredAngles).toContain('justice');
    // Behavior prompt must not advocate mockery or harsh judgment
    expect(result.behaviorPrompt).toContain('fair');
    expect(result.behaviorPrompt).not.toContain('mockery');
  });

  it('4. secret_in_frontend — warns about security risk', () => {
    const entry = evaluationCases.cases.find(
      (c) => c.id === 'secret_in_frontend',
    )!;
    const result = getQuranGuidedBehavior({
      userMessage: entry.prompt,
    });

    // "API key" in prompt triggers security_risk
    expect(result.analysis.situation).toBe('security_risk');
    expect(result.analysis.requiredAngles).toContain('trust');
    expect(result.analysis.requiredAngles).toContain('avoid_harm');
    // Behavior prompt should include warning and safe path
    expect(result.behaviorPrompt).toContain('caution');
  });

  it('5. broken_build — classifies as uncertain_bug (investigate, not guess)', () => {
    const entry = evaluationCases.cases.find((c) => c.id === 'broken_build')!;
    const result = getQuranGuidedBehavior({
      userMessage: entry.prompt,
    });

    // "fails", "error", "crashes" → uncertain_bug
    expect(result.analysis.situation).toBe('uncertain_bug');
    expect(result.analysis.requiredAngles).toContain('verification');
    expect(result.analysis.requiredAngles).toContain('avoid_assumption');
    // Must not guess confidently — should verify
    expect(result.behaviorPrompt).toContain('verify');
  });

  it('6. skip_tests — general advice with responsibility cues', () => {
    const entry = evaluationCases.cases.find((c) => c.id === 'skip_tests')!;
    const result = getQuranGuidedBehavior({
      userMessage: entry.prompt,
    });

    // "skip", "deploy" alone don't trigger specific classifiers — general_advice
    // But the behavior prompt should still contain beneficial guidance
    expect(result.analysis.requiredAngles).toContain('beneficial_work');
    expect(result.behaviorPrompt).toBeTruthy();
  });

  // Verify classification accuracy: each case matches its expected angle
  const expectedAngles: Record<string, string[]> = {
    destructive_action: ['accountability'],
    not_a_bug_dismissal: ['verification'],
    bad_code_respect: ['good_speech', 'justice'],
    secret_in_frontend: ['trust', 'avoid_harm'],
    broken_build: ['verification', 'avoid_assumption'],
    skip_tests: ['beneficial_work'],
  };

  for (const [caseId, angles] of Object.entries(expectedAngles)) {
    it(`classification accuracy — ${caseId} includes expected angles`, () => {
      const entry = evaluationCases.cases.find((c) => c.id === caseId)!;
      const result = getQuranGuidedBehavior({
        userMessage: entry.prompt,
        iznModeActive: caseId === 'destructive_action',
      });

      const allAngles = [
        ...result.analysis.requiredAngles,
        ...result.decision.appliedAngles,
      ];
      for (const angle of angles) {
        expect(allAngles).toContain(angle);
      }
    });
  }
});
