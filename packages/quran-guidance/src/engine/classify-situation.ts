import type {
  ClassifierTelemetry,
  SituationAnalysis,
} from '../types/quran-guidance.js';

type ClassifyInput = {
  userMessage: string;
  agentContext?: string;
  taskType?: string;
  /** Optional telemetry callback for recording classification events. */
  telemetry?: ClassifierTelemetry;
};

/**
 * Classifies the current user message into an agent situation.
 *
 * Uses keyword heuristics ordered from most-specific to most-general.
 * Early matches (security, privacy) short-circuit; later categories
 * (uncertain_bug, code_review) are checked after more-specific
 * siblings (confirmed_bug, planning_feature / architecture_decision).
 *
 * When a telemetry callback is provided, `recordClassification` is
 * called with the detected situation and confidence before returning.
 *
 * Future: Could be replaced by an LLM-based or scoring classifier
 * for higher accuracy.
 */
export function classifySituation(input: ClassifyInput): SituationAnalysis {
  const result = classifySituationInternal(input);
  input.telemetry?.recordClassification(result.situation, result.confidence);
  return result;
}

function classifySituationInternal(input: ClassifyInput): SituationAnalysis {
  const text = `${input.userMessage} ${input.agentContext ?? ''}`.toLowerCase();
  const msgLen = input.userMessage.length;

  // ── 1. Security risk (highest priority) ─────────────────────────
  if (matchesAny(text, ['secret', 'token', 'api key', 'password'])) {
    return {
      situation: 'security_risk',
      confidence: 0.9,
      detectedSignals: ['secret/token/password/API key mentioned'],
      requiredAngles: ['trust', 'privacy_and_trust', 'avoid_harm'],
    };
  }

  // ── 2. Privacy risk ─────────────────────────────────────────────
  if (
    matchesAny(text, ['private', 'personal data', 'user data', 'sensitive'])
  ) {
    return {
      situation: 'privacy_risk',
      confidence: 0.85,
      detectedSignals: ['privacy/sensitive data mentioned'],
      requiredAngles: ['privacy_and_trust', 'avoid_harm', 'responsibility'],
    };
  }

  // ── 3. Confirmed bug (bug keywords + concrete evidence) ─────────
  if (hasBugSignals(text) && hasConcreteEvidence(text)) {
    return {
      situation: 'confirmed_bug',
      confidence: 0.85,
      detectedSignals: ['bug/error reported with concrete evidence'],
      requiredAngles: [
        'responsibility',
        'beneficial_work',
        'patience',
        'excellence',
      ],
    };
  }

  // ── 4. Uncertain bug (bug keywords, no concrete evidence) ───────
  if (hasBugSignals(text)) {
    return {
      situation: 'uncertain_bug',
      confidence: 0.75,
      detectedSignals: ['bug/error/failure language detected'],
      requiredAngles: ['verification', 'avoid_assumption', 'truthfulness'],
    };
  }

  // ── 5. Architecture decision (trade-off / choice language) ──────
  //     Check before planning_feature so "should I use X or Y"
  //     maps to architecture_decision, not planning_feature.
  if (hasArchDecisionSignals(text)) {
    return {
      situation: 'architecture_decision',
      confidence: 0.7,
      detectedSignals: ['architecture decision language detected'],
      requiredAngles: [
        'wisdom',
        'trust',
        'beneficial_work',
        'moderation',
        'excellence',
      ],
    };
  }

  // ── 6. Planning / design ────────────────────────────────────────
  //     Check before code_review so "plan the refactor" maps to
  //     planning_feature, not code_review.
  if (hasPlanningSignals(text)) {
    return {
      situation: 'planning_feature',
      confidence: 0.6,
      detectedSignals: ['planning/design language detected'],
      requiredAngles: ['wisdom', 'trust', 'beneficial_work'],
    };
  }

  // ── 7. Code review / refactor ───────────────────────────────────
  if (matchesAny(text, ['review', 'improve', 'refactor', 'rewrite'])) {
    return {
      situation: 'code_review',
      confidence: 0.6,
      detectedSignals: ['review/improve/refactor language detected'],
      requiredAngles: ['justice', 'good_speech', 'beneficial_work'],
    };
  }

  // ── 8. User frustration ─────────────────────────────────────────
  if (
    matchesAny(text, ['frustrated', 'annoying', 'useless', 'waste of time'])
  ) {
    return {
      situation: 'user_frustration',
      confidence: 0.8,
      detectedSignals: ['frustration/annoyance language detected'],
      requiredAngles: ['patience', 'mercy', 'good_speech'],
    };
  }

  // ── 9. Performance ─────────────────────────────────────────────
  if (matchesAny(text, ['slow', 'performance', 'optimize', 'speed'])) {
    return {
      situation: 'performance_issue',
      confidence: 0.65,
      detectedSignals: ['performance language detected'],
      requiredAngles: ['responsibility', 'beneficial_work', 'patience'],
    };
  }

  // ── 10. Ethical risk ────────────────────────────────────────────
  if (matchesAny(text, ['ethical', 'bias', 'discriminate', 'unfair'])) {
    return {
      situation: 'ethical_risk',
      confidence: 0.85,
      detectedSignals: ['ethical concern language detected'],
      requiredAngles: ['justice', 'avoid_harm', 'trust'],
    };
  }

  // ── 11. Empowered execution ─────────────────────────────────────
  //     Check before complex_implementation; stronger build signals.
  if (
    matchPhrase(text, 'build everything') ||
    matchPhrase(text, 'implement fully') ||
    matchPhrase(text, 'from scratch') ||
    matchPhrase(text, 'whole system') ||
    matchPhrase(text, 'complete implementation') ||
    hasWord(text, 'entire') ||
    (hasWord(text, 'full') &&
      (hasWord(text, 'system') || hasWord(text, 'implementation')))
  ) {
    return {
      situation: 'empowered_execution',
      confidence: 0.75,
      detectedSignals: ['empowered / full-build language detected'],
      requiredAngles: [
        'empowerment',
        'capability',
        'stewardship',
        'excellence',
        'beneficial_work',
        'trust',
      ],
    };
  }

  // ── 12. Complex implementation ──────────────────────────────────
  if (
    matchesAny(text, [
      'build',
      'implement',
      'create',
      'complex',
      'system',
      'feature',
    ])
  ) {
    return {
      situation: 'complex_implementation',
      confidence: 0.55,
      detectedSignals: ['build/implement/complex system language detected'],
      requiredAngles: [
        'empowerment',
        'capability',
        'stewardship',
        'excellence',
      ],
    };
  }

  // ── 13. Missing context (vague messages that fell through) ──────
  if (
    msgLen < 40 ||
    matchPhrase(text, 'not sure') ||
    matchPhrase(text, 'i think') ||
    hasWord(text, 'maybe') ||
    hasWord(text, 'idk')
  ) {
    return {
      situation: 'missing_context',
      confidence: resolveMissingContextConfidence(msgLen, text),
      detectedSignals: ['vague or missing-context language detected'],
      requiredAngles: [
        'verification',
        'humility',
        'truthfulness',
        'seeking_knowledge',
      ],
    };
  }

  // ── 14. Default ─────────────────────────────────────────────────
  return {
    situation: 'general_advice',
    confidence: 0.5,
    detectedSignals: ['default classification'],
    requiredAngles: ['good_speech', 'beneficial_work', 'truthfulness'],
  };
}

// ── Keyword matching helpers ────────────────────────────────────────

/** Escape regex special characters. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Match a single word using `\b` word boundaries. */
function hasWord(text: string, word: string): boolean {
  return new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(text);
}

/** Match a multi-word phrase as a substring. */
function matchPhrase(text: string, phrase: string): boolean {
  return text.includes(phrase);
}

/**
 * Match any keyword in the list.
 * Single-word keywords use `\b` boundaries; multi-word phrases use `includes`.
 */
function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) =>
    kw.includes(' ') ? matchPhrase(text, kw) : hasWord(text, kw),
  );
}

// ── Signal helpers ──────────────────────────────────────────────────

function hasBugSignals(text: string): boolean {
  return (
    matchesAny(text, ['bug', 'error', 'fail', 'crash']) ||
    matchPhrase(text, 'not working') ||
    matchPhrase(text, "what's wrong")
  );
}

function hasConcreteEvidence(text: string): boolean {
  return (
    // Line numbers
    /\bline\s+\d+/i.test(text) ||
    /:\d+:\d+/.test(text) ||
    // Stack traces
    matchPhrase(text, 'stack trace') ||
    matchPhrase(text, 'traceback') ||
    // "at " is a stack-trace signal but needs context — require
    // it to appear after a newline or at start (stack frame pattern)
    /\bat\s+\S+/i.test(text) ||
    // Confirmation language
    matchPhrase(text, 'i confirmed') ||
    matchPhrase(text, 'i reproduced') ||
    matchPhrase(text, 'the error is') ||
    matchPhrase(text, 'the issue is at') ||
    // Error codes
    /\b[A-Z]+_\d+\b/.test(text) ||
    /\b\d{3,4}\b/.test(text)
  );
}

function hasArchDecisionSignals(text: string): boolean {
  return (
    matchPhrase(text, 'should i use') ||
    matchPhrase(text, 'should i choose') ||
    matchPhrase(text, 'which is better') ||
    matchPhrase(text, 'what is the best') ||
    matchPhrase(text, 'vs ') ||
    hasWord(text, 'versus') ||
    hasWord(text, 'tradeoff') ||
    hasWord(text, 'trade-off') ||
    hasWord(text, 'alternative') ||
    hasWord(text, 'approach') ||
    hasWord(text, 'decision')
  );
}

function hasPlanningSignals(text: string): boolean {
  return matchesAny(text, ['plan', 'architecture', 'design']);
}

function resolveMissingContextConfidence(msgLen: number, text: string): number {
  if (msgLen < 15) return 0.85;
  if (matchPhrase(text, 'not sure') || hasWord(text, 'idk')) return 0.8;
  if (msgLen < 40) return 0.7;
  return 0.65;
}
