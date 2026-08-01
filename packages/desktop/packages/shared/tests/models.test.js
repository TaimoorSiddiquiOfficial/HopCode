/**
 * Tests for hopcode model utilities in config/models.ts
 */
import { describe, it, expect } from 'bun:test';
import { DEFAULT_MODEL, HOPCODE_MODELS, getModelShortName, getModelDisplayName, getModelContextWindow, getModelProvider, isQwenModel, } from '../src/config/models.ts';
describe('Qwen model registry', () => {
    it('uses qwen3-coder as the fallback model', () => {
        expect(DEFAULT_MODEL).toBe('qwen3-coder');
        expect(HOPCODE_MODELS.map(model => model.id)).toContain('qwen3-coder');
    });
    it('detects hopcode model IDs', () => {
        expect(isQwenModel('qwen3-coder')).toBe(true);
        expect(isQwenModel('HOPCODE_MAX')).toBe(true);
        expect(isQwenModel('gpt-4o')).toBe(false);
    });
    it('resolves provider metadata for hopcode models', () => {
        expect(getModelProvider('qwen3-coder')).toBe('hopcode');
        expect(getModelProvider('qwen-max')).toBe('hopcode');
        expect(getModelProvider('gpt-4o')).toBeUndefined();
    });
    it('formats hopcode model names', () => {
        expect(getModelShortName('qwen3-coder')).toBe('hopcode');
        expect(getModelDisplayName('qwen-max')).toBe('Qwen max');
        expect(getModelContextWindow('qwen3-coder')).toBe(1_000_000);
    });
});
//# sourceMappingURL=models.test.js.map