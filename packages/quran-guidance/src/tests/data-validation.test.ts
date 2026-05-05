import { describe, it, expect } from 'vitest';
import { ayahGuidance } from '../data/ayah-guidance.js';
import { situationAngleMap } from '../data/situation-angle-map.js';
import { responsePatterns } from '../data/response-patterns.js';
import { iznBehaviorRules } from '../data/izn-behavior-rules.js';
import type { AgentSituation, QuranicAngle } from '../types/quran-guidance.js';
import type { DestructiveActionCategory } from '../types/izn-types.js';

/** Canonical sets derived from the union types — must match the type defs. */
const VALID_SITUATIONS: Set<string> = new Set<AgentSituation>([
  'uncertain_bug',
  'confirmed_bug',
  'user_mistake',
  'planning_feature',
  'code_review',
  'security_risk',
  'privacy_risk',
  'user_frustration',
  'architecture_decision',
  'missing_context',
  'performance_issue',
  'ethical_risk',
  'general_advice',
  'izn_mode_active',
  'complex_implementation',
  'empowered_execution',
]);

const VALID_ANGLES: Set<string> = new Set<QuranicAngle>([
  'verification',
  'truthfulness',
  'patience',
  'justice',
  'mercy',
  'trust',
  'humility',
  'good_speech',
  'avoid_harm',
  'avoid_mockery',
  'avoid_assumption',
  'beneficial_work',
  'wisdom',
  'privacy_and_trust',
  'responsibility',
  'gratitude',
  'excellence',
  'moderation',
  'transparency',
  'accountability',
  'steadfastness',
  'seeking_knowledge',
  'cooperation',
  'empowerment',
  'capability',
  'stewardship',
]);

const VALID_RESPONSE_PATTERNS: Set<string> = new Set([
  'verify_before_judging',
  'warn_and_offer_safe_path',
  'fair_review_with_constructive_fix',
  'responsible_step_by_step_plan',
  'truthful_helpful_response',
  'izn_responsible_execution',
  'grateful_acknowledgment',
  'gentle_correction',
  'empowered_build',
]);

const VALID_DESTRUCTIVE_CATEGORIES: Set<string> =
  new Set<DestructiveActionCategory>([
    'file_deletion',
    'force_push',
    'database_drop',
    'database_truncate',
    'permission_change',
  ]);

describe('Data validation — ayahGuidance', () => {
  it('every useWhen value is a valid AgentSituation', () => {
    for (const entry of ayahGuidance) {
      for (const situation of entry.agentStrategy.useWhen) {
        expect(
          VALID_SITUATIONS.has(situation),
          `"${situation}" in ayah "${entry.ref}" is not a valid AgentSituation`,
        ).toBe(true);
      }
    }
  });

  it('every angle is a valid QuranicAngle', () => {
    for (const entry of ayahGuidance) {
      for (const angle of entry.angles) {
        expect(
          VALID_ANGLES.has(angle),
          `"${angle}" in ayah "${entry.ref}" is not a valid QuranicAngle`,
        ).toBe(true);
      }
    }
  });

  it('every ayah has a ref in surah:ayah format', () => {
    for (const entry of ayahGuidance) {
      expect(entry.ref).toMatch(/^\d+:\d+(-\d+)?$/);
    }
  });

  it('no duplicate ayah refs', () => {
    const refs = ayahGuidance.map((e) => e.ref);
    const duplicates = refs.filter((r, i) => refs.indexOf(r) !== i);
    expect(duplicates).toEqual([]);
  });

  it('do, avoid, and tone arrays are non-empty', () => {
    for (const entry of ayahGuidance) {
      expect(
        entry.agentStrategy.do.length,
        `"${entry.ref}" has empty "do" array`,
      ).toBeGreaterThan(0);
      expect(
        entry.agentStrategy.avoid.length,
        `"${entry.ref}" has empty "avoid" array`,
      ).toBeGreaterThan(0);
      expect(
        entry.agentStrategy.tone.length,
        `"${entry.ref}" has empty "tone" array`,
      ).toBeGreaterThan(0);
    }
  });
});

describe('Data validation — situationAngleMap', () => {
  it('every key is a valid AgentSituation', () => {
    for (const key of Object.keys(situationAngleMap)) {
      expect(
        VALID_SITUATIONS.has(key),
        `"${key}" is not a valid AgentSituation`,
      ).toBe(true);
    }
  });

  it('every angle in every mapping is a valid QuranicAngle', () => {
    for (const [situation, angles] of Object.entries(situationAngleMap)) {
      for (const angle of angles) {
        expect(
          VALID_ANGLES.has(angle),
          `"${angle}" in situation "${situation}" is not a valid QuranicAngle`,
        ).toBe(true);
      }
    }
  });

  it('covers all AgentSituation values', () => {
    const mappedSituations = new Set(Object.keys(situationAngleMap));
    for (const situation of VALID_SITUATIONS) {
      expect(
        mappedSituations.has(situation),
        `AgentSituation "${situation}" is missing from situationAngleMap`,
      ).toBe(true);
    }
  });
});

describe('Data validation — responsePatterns', () => {
  it('every key is a valid response pattern', () => {
    for (const key of Object.keys(responsePatterns)) {
      expect(
        VALID_RESPONSE_PATTERNS.has(key),
        `"${key}" is not a valid response pattern key`,
      ).toBe(true);
    }
  });
});

describe('Data validation — iznBehaviorRules', () => {
  it('every category is a valid DestructiveActionCategory', () => {
    for (const rule of iznBehaviorRules) {
      expect(
        VALID_DESTRUCTIVE_CATEGORIES.has(rule.category),
        `"${rule.category}" is not a valid DestructiveActionCategory`,
      ).toBe(true);
    }
  });

  it('no duplicate categories', () => {
    const categories = iznBehaviorRules.map((r) => r.category);
    const unique = new Set(categories);
    expect(categories).toHaveLength(unique.size);
  });

  it('every rule has a valid regex pattern', () => {
    for (const rule of iznBehaviorRules) {
      expect(rule.detectPattern).toBeInstanceOf(RegExp);
    }
  });

  it('covers all DestructiveActionCategory values', () => {
    const ruleCategories = new Set(iznBehaviorRules.map((r) => r.category));
    for (const category of VALID_DESTRUCTIVE_CATEGORIES) {
      expect(
        ruleCategories.has(category),
        `DestructiveActionCategory "${category}" has no corresponding iznBehaviorRule`,
      ).toBe(true);
    }
  });

  it('every rule has preVerify, postReport, and impactAnalysis', () => {
    for (const rule of iznBehaviorRules) {
      expect(rule.preVerify.length).toBeGreaterThan(0);
      expect(rule.postReport.length).toBeGreaterThan(0);
      expect(rule.impactAnalysis.readTargets.length).toBeGreaterThan(0);
    }
  });
});
