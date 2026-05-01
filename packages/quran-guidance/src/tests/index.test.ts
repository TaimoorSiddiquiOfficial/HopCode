import { describe, it, expect } from 'vitest';
import { getQuranGuidedBehavior } from '../index.js';

describe('getQuranGuidedBehavior', () => {
  it('returns analysis, decision, and behavior prompt', () => {
    const result = getQuranGuidedBehavior({
      userMessage: 'there is a bug in my code',
    });

    expect(result.analysis).toBeDefined();
    expect(result.analysis.situation).toBe('uncertain_bug');
    expect(result.decision).toBeDefined();
    expect(result.decision.ayahRefs.length).toBeGreaterThan(0);
    expect(result.behaviorPrompt).toBeDefined();
    expect(result.behaviorPrompt.length).toBeGreaterThan(0);
  });

  it('detects security risk from secret keywords', () => {
    const result = getQuranGuidedBehavior({
      userMessage: 'how do I store my API key',
    });

    expect(result.analysis.situation).toBe('security_risk');
    expect(result.decision.strategy.tone).toContain('responsible');
  });

  it('applies Izn mode overlay', () => {
    const result = getQuranGuidedBehavior({
      userMessage: 'fix this bug',
      iznModeActive: true,
    });

    expect(result.decision.appliedAngles).toContain('accountability');
    expect(result.decision.responsePattern).toBe('izn_responsible_execution');
  });

  it('returns a non-empty behavior prompt', () => {
    const result = getQuranGuidedBehavior({
      userMessage: 'hello',
    });

    expect(result.behaviorPrompt).toBeTruthy();
    expect(typeof result.behaviorPrompt).toBe('string');
  });
});
