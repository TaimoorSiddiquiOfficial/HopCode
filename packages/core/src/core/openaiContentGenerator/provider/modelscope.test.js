/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ModelScopeOpenAICompatibleProvider } from './modelscope.js';
vi.mock('openai');
describe('ModelScopeOpenAICompatibleProvider', () => {
    let provider;
    let mockContentGeneratorConfig;
    let mockCliConfig;
    beforeEach(() => {
        mockContentGeneratorConfig = {
            apiKey: 'test-api-key',
            baseUrl: 'https://api.modelscope.cn/v1',
            model: 'hopcode-max',
        };
        mockCliConfig = {
            getCliVersion: vi.fn().mockReturnValue('1.0.0'),
        };
        provider = new ModelScopeOpenAICompatibleProvider(mockContentGeneratorConfig, mockCliConfig);
    });
    describe('isModelScopeProvider', () => {
        it('should return true for ModelScope hostnames', () => {
            const configs = [
                { baseUrl: 'https://api-inference.modelscope.cn/v1' },
                { baseUrl: 'https://api.modelscope.cn/v1' },
                { baseUrl: 'https://modelscope.cn/v1' },
            ];
            configs.forEach((config) => {
                expect(ModelScopeOpenAICompatibleProvider.isModelScopeProvider(config)).toBe(true);
            });
        });
        it('should return false for non-ModelScope hostnames', () => {
            const configs = [
                { baseUrl: 'https://api.openai.com/v1' },
                { baseUrl: 'https://example.com/modelscope/v1' },
                { baseUrl: 'https://modelscope.cn.evil.example/v1' },
                { baseUrl: 'not a url with modelscope' },
                { baseUrl: undefined },
            ];
            configs.forEach((config) => {
                expect(ModelScopeOpenAICompatibleProvider.isModelScopeProvider(config)).toBe(false);
            });
        });
    });
    describe('buildRequest', () => {
        it('should remove stream_options when stream is false', () => {
            const originalRequest = {
                model: 'hopcode-max',
                messages: [{ role: 'user', content: 'Hello!' }],
                stream: false,
                stream_options: { include_usage: true },
            };
            const result = provider.buildRequest(originalRequest, 'prompt-id');
            expect(result).not.toHaveProperty('stream_options');
        });
        it('should keep stream_options when stream is true', () => {
            const originalRequest = {
                model: 'hopcode-max',
                messages: [{ role: 'user', content: 'Hello!' }],
                stream: true,
                stream_options: { include_usage: true },
            };
            const result = provider.buildRequest(originalRequest, 'prompt-id');
            expect(result).toHaveProperty('stream_options');
        });
        it('should handle requests without stream_options', () => {
            const originalRequest = {
                model: 'hopcode-max',
                messages: [{ role: 'user', content: 'Hello!' }],
                stream: false,
            };
            const result = provider.buildRequest(originalRequest, 'prompt-id');
            expect(result).not.toHaveProperty('stream_options');
        });
    });
});
//# sourceMappingURL=modelscope.test.js.map