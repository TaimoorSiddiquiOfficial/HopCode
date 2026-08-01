import { describe, it, expect } from 'vitest';
import { resolveGuidance } from '../engine/resolve-guidance.js';
describe('resolveGuidance', () => {
    it('produces guidance for uncertain_bug', () => {
        const analysis = {
            situation: 'uncertain_bug',
            confidence: 0.75,
            detectedSignals: ['bug'],
            requiredAngles: ['verification', 'truthfulness'],
        };
        const result = resolveGuidance(analysis);
        expect(result.ayahRefs.length).toBeGreaterThan(0);
        expect(result.strategy.do.length).toBeGreaterThan(0);
        expect(result.strategy.avoid.length).toBeGreaterThan(0);
        expect(result.strategy.tone).toContain('careful');
    });
    it('produces guidance for code_review', () => {
        const analysis = {
            situation: 'code_review',
            confidence: 0.7,
            detectedSignals: ['review'],
            requiredAngles: ['justice', 'good_speech'],
        };
        const result = resolveGuidance(analysis);
        expect(result.ayahRefs.length).toBeGreaterThan(0);
        expect(result.situation).toBe('code_review');
    });
    it('produces guidance for security_risk', () => {
        const analysis = {
            situation: 'security_risk',
            confidence: 0.9,
            detectedSignals: ['secret'],
            requiredAngles: ['trust', 'privacy_and_trust', 'avoid_harm'],
        };
        const result = resolveGuidance(analysis);
        expect(result.strategy.tone).toContain('responsible');
    });
    it('layers Izn accountability angles when iznModeActive', () => {
        const analysis = {
            situation: 'general_advice',
            confidence: 0.5,
            detectedSignals: ['default'],
            requiredAngles: ['good_speech'],
        };
        const result = resolveGuidance(analysis, true);
        expect(result.appliedAngles).toContain('responsibility');
        expect(result.appliedAngles).toContain('accountability');
        expect(result.appliedAngles).toContain('transparency');
    });
    it('returns izn response pattern when in Izn mode', () => {
        const analysis = {
            situation: 'confirmed_bug',
            confidence: 0.8,
            detectedSignals: ['error confirmed'],
            requiredAngles: ['responsibility'],
        };
        const result = resolveGuidance(analysis, true);
        expect(result.responsePattern).toBe('izn_responsible_execution');
    });
    it('limits to maximum 5 ayah matches', () => {
        const analysis = {
            situation: 'general_advice',
            confidence: 0.5,
            detectedSignals: ['default'],
            requiredAngles: [
                'verification',
                'truthfulness',
                'good_speech',
                'wisdom',
                'justice',
                'humility',
                'patience',
                'responsibility',
            ],
        };
        const result = resolveGuidance(analysis);
        expect(result.ayahRefs.length).toBeLessThanOrEqual(5);
    });
});
//# sourceMappingURL=resolve-guidance.test.js.map