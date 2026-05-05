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

  it('detects confirmed_bug from bug + concrete evidence', () => {
    const result = classifySituation({
      userMessage: 'the error is at line 42 — NullPointerException',
    });
    expect(result.situation).toBe('confirmed_bug');
    expect(result.confidence).toBe(0.85);
  });

  it('detects uncertain_bug from bug keywords without evidence', () => {
    const result = classifySituation({
      userMessage: 'my app is not working, there is a bug',
    });
    expect(result.situation).toBe('uncertain_bug');
    expect(result.confidence).toBe(0.75);
  });

  it('detects architecture_decision from trade-off language', () => {
    const result = classifySituation({
      userMessage: 'should I use React or Vue for this project',
    });
    expect(result.situation).toBe('architecture_decision');
  });

  it('architecture_decision wins over planning_feature for choices', () => {
    const result = classifySituation({
      userMessage: 'should I plan a microservice architecture vs monolith',
    });
    expect(result.situation).toBe('architecture_decision');
  });

  it('planning_feature wins over code_review for plan + refactor', () => {
    const result = classifySituation({
      userMessage: 'plan the refactor of auth module',
    });
    expect(result.situation).toBe('planning_feature');
  });

  it('detects code_review from review keywords', () => {
    const result = classifySituation({
      userMessage: 'review my code and suggest improvements',
    });
    expect(result.situation).toBe('code_review');
    expect(result.confidence).toBe(0.6);
  });

  it('detects empowered_execution from full-build language', () => {
    const result = classifySituation({
      userMessage: 'build everything from scratch',
    });
    expect(result.situation).toBe('empowered_execution');
  });

  it('empowered_execution wins over complex_implementation', () => {
    const result = classifySituation({
      userMessage:
        'build the whole system from scratch with full implementation',
    });
    expect(result.situation).toBe('empowered_execution');
  });

  it('detects missing_context from very short messages', () => {
    const result = classifySituation({ userMessage: 'help' });
    expect(result.situation).toBe('missing_context');
  });

  it('detects missing_context from hedge language', () => {
    const result = classifySituation({
      userMessage: 'I think something might be wrong idk',
    });
    expect(result.situation).toBe('missing_context');
  });

  it('defaults to general_advice for neutral messages', () => {
    const result = classifySituation({
      userMessage: 'thanks, that resolved my question perfectly',
    });
    expect(result.situation).toBe('general_advice');
    expect(result.confidence).toBe(0.5);
  });

  it('short vague message falls to missing_context not general', () => {
    const result = classifySituation({
      userMessage: 'hello how are you',
    });
    expect(result.situation).toBe('missing_context');
    expect(result.confidence).toBe(0.7);
  });

  // ── Word-boundary regression tests (L2.1) ───────────────────────
  it('word-boundary: "explanation" does NOT match "plan"', () => {
    const result = classifySituation({
      userMessage: 'the documentation explanation was confusing and unhelpful',
    });
    // Old substring matching would have classified this as planning_feature
    // (text.includes("plan") matched "explanation")
    expect(result.situation).not.toBe('planning_feature');
  });

  it('word-boundary: "debugging" does NOT match "bug"', () => {
    const result = classifySituation({
      userMessage: 'I spent the afternoon debugging the caching layer',
    });
    // "debugging" contains "bug" as substring but not as \bbug\b
    expect(result.situation).not.toBe('uncertain_bug');
    expect(result.situation).not.toBe('confirmed_bug');
  });

  it('word-boundary: standalone "bug" still matches', () => {
    const result = classifySituation({
      userMessage: 'I found a bug in the login code',
    });
    // \bbug\b still matches standalone "bug"
    expect(result.situation).toBe('uncertain_bug');
  });

  it('word-boundary: standalone "plan" still matches', () => {
    const result = classifySituation({
      userMessage: 'we need to plan the architecture for this feature',
    });
    // \bplan\b still matches standalone "plan"
    expect(result.situation).toBe('planning_feature');
  });

  describe('telemetry callback', () => {
    it('calls recordClassification with situation and confidence', () => {
      const calls: Array<{ situation: string; confidence: number }> = [];
      const telemetry = {
        recordClassification(situation: string, confidence: number) {
          calls.push({ situation, confidence });
        },
      };

      classifySituation({
        userMessage: 'I have a secret token in my code',
        telemetry,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0]).toEqual({
        situation: 'security_risk',
        confidence: 0.9,
      });
    });

    it('does not throw when telemetry is not provided', () => {
      expect(() =>
        classifySituation({
          userMessage: 'help me refactor this code',
        }),
      ).not.toThrow();
    });

    it('records for general_advice default fallback', () => {
      const calls: Array<{ situation: string; confidence: number }> = [];
      const telemetry = {
        recordClassification(situation: string, confidence: number) {
          calls.push({ situation, confidence });
        },
      };

      classifySituation({
        userMessage:
          'can you help me understand something about the project structure',
        telemetry,
      });

      expect(calls).toHaveLength(1);
      expect(calls[0].situation).toBe('general_advice');
      expect(calls[0].confidence).toBe(0.5);
    });
  });
});
