import { describe, it, expect } from 'vitest';
import { classifySituation } from '../engine/classify-situation.js';

describe('classifySituation', () => {
  it('detects security_risk from secret keywords', () => {
    const result = classifySituation({
      userMessage: 'I have an API key that needs to be stored',
    });
    expect(result.situation).toBe('security_risk');
    expect(result.confidence).toBe(0.9);
  });

  it('detects privacy_risk from privacy keywords', () => {
    const result = classifySituation({
      userMessage: 'how do I handle user data securely',
    });
    expect(result.situation).toBe('privacy_risk');
    expect(result.confidence).toBe(0.85);
  });

  it('detects uncertain_bug from bug keywords', () => {
    const result = classifySituation({
      userMessage: 'my app is not working, there is a bug',
    });
    expect(result.situation).toBe('uncertain_bug');
    expect(result.confidence).toBe(0.75);
  });

  it('detects code_review from review keywords', () => {
    const result = classifySituation({
      userMessage: 'review my code and suggest improvements',
    });
    expect(result.situation).toBe('code_review');
    expect(result.confidence).toBe(0.7);
  });

  it('detects planning_feature from plan keywords', () => {
    const result = classifySituation({
      userMessage: 'help me design the architecture',
    });
    expect(result.situation).toBe('planning_feature');
  });

  it('detects user_frustration from frustration keywords', () => {
    const result = classifySituation({
      userMessage: 'this is so annoying and useless',
    });
    expect(result.situation).toBe('user_frustration');
    expect(result.confidence).toBe(0.8);
  });

  it('detects performance_issue from slow keywords', () => {
    const result = classifySituation({
      userMessage: 'my app is slow, can you optimize it',
    });
    expect(result.situation).toBe('performance_issue');
  });

  it('detects ethical_risk from ethical keywords', () => {
    const result = classifySituation({
      userMessage: 'is this code biased or unfair',
    });
    expect(result.situation).toBe('ethical_risk');
    expect(result.confidence).toBe(0.85);
  });

  it('defaults to general_advice', () => {
    const result = classifySituation({
      userMessage: 'hello how are you',
    });
    expect(result.situation).toBe('general_advice');
    expect(result.confidence).toBe(0.5);
  });
});
