import type { SituationAnalysis } from '../types/quran-guidance.js';

type ClassifyInput = {
  userMessage: string;
  agentContext?: string;
  taskType?: string;
};

/**
 * Classifies the current user message into an agent situation.
 *
 * Uses keyword heuristics to detect risk, bugs, reviews, planning,
 * frustration, and other situations that need Quran-guided behavior.
 *
 * Future: Could be replaced by an LLM-based classifier for higher accuracy.
 */
export function classifySituation(input: ClassifyInput): SituationAnalysis {
  const text = `${input.userMessage} ${input.agentContext ?? ''}`.toLowerCase();

  if (
    text.includes('secret') ||
    text.includes('token') ||
    text.includes('api key') ||
    text.includes('password')
  ) {
    return {
      situation: 'security_risk',
      confidence: 0.9,
      detectedSignals: ['secret/token/password/API key mentioned'],
      requiredAngles: ['trust', 'privacy_and_trust', 'avoid_harm'],
    };
  }

  if (
    text.includes('private') ||
    text.includes('personal data') ||
    text.includes('user data') ||
    text.includes('sensitive')
  ) {
    return {
      situation: 'privacy_risk',
      confidence: 0.85,
      detectedSignals: ['privacy/sensitive data mentioned'],
      requiredAngles: ['privacy_and_trust', 'avoid_harm', 'responsibility'],
    };
  }

  if (
    text.includes('bug') ||
    text.includes('not working') ||
    text.includes('error') ||
    text.includes('failed')
  ) {
    return {
      situation: 'uncertain_bug',
      confidence: 0.75,
      detectedSignals: ['bug/error/failure language detected'],
      requiredAngles: ['verification', 'avoid_assumption', 'truthfulness'],
    };
  }

  if (
    text.includes('review') ||
    text.includes('improve') ||
    text.includes('refactor')
  ) {
    return {
      situation: 'code_review',
      confidence: 0.7,
      detectedSignals: ['review/improve/refactor language detected'],
      requiredAngles: ['justice', 'good_speech', 'beneficial_work'],
    };
  }

  if (
    text.includes('plan') ||
    text.includes('architecture') ||
    text.includes('design')
  ) {
    return {
      situation: 'planning_feature',
      confidence: 0.7,
      detectedSignals: ['planning/design language detected'],
      requiredAngles: ['wisdom', 'trust', 'beneficial_work'],
    };
  }

  if (
    text.includes('frustrated') ||
    text.includes('annoying') ||
    text.includes('useless') ||
    text.includes('waste of time')
  ) {
    return {
      situation: 'user_frustration',
      confidence: 0.8,
      detectedSignals: ['frustration/annoyance language detected'],
      requiredAngles: ['patience', 'mercy', 'good_speech'],
    };
  }

  if (
    text.includes('slow') ||
    text.includes('performance') ||
    text.includes('optimize') ||
    text.includes('speed')
  ) {
    return {
      situation: 'performance_issue',
      confidence: 0.7,
      detectedSignals: ['performance language detected'],
      requiredAngles: ['responsibility', 'beneficial_work', 'patience'],
    };
  }

  if (
    text.includes('ethical') ||
    text.includes('bias') ||
    text.includes('discriminate') ||
    text.includes('unfair')
  ) {
    return {
      situation: 'ethical_risk',
      confidence: 0.85,
      detectedSignals: ['ethical concern language detected'],
      requiredAngles: ['justice', 'avoid_harm', 'trust'],
    };
  }

  return {
    situation: 'general_advice',
    confidence: 0.5,
    detectedSignals: ['default classification'],
    requiredAngles: ['good_speech', 'beneficial_work', 'truthfulness'],
  };
}
