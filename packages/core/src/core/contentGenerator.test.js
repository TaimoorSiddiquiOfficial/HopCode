/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createContentGenerator, createContentGeneratorConfig, AuthType, } from './contentGenerator.js';
import { GoogleGenAI } from '@google/genai';
import { LoggingContentGenerator } from './loggingContentGenerator/index.js';
vi.mock('@google/genai');
const openaiMockState = vi.hoisted(() => ({
    importError: null,
    generatorError: null,
}));
const hopcodeMockState = vi.hoisted(() => ({
    oauthError: null,
}));
vi.mock('./openaiContentGenerator/index.js', () => {
    if (openaiMockState.importError) {
        throw openaiMockState.importError;
    }
    return {
        createOpenAIContentGenerator: () => {
            if (openaiMockState.generatorError) {
                throw openaiMockState.generatorError;
            }
            return {};
        },
    };
});
vi.mock('../hopcode/hopCodeOAuth2.js', () => ({
    getHopCodeOAuthClient: async () => {
        if (hopcodeMockState.oauthError) {
            throw hopcodeMockState.oauthError;
        }
        return {};
    },
}));
vi.mock('../hopcode/hopCodeContentGenerator.js', () => ({
    HopCodeContentGenerator: class {
    },
}));
describe('createContentGenerator', () => {
    it('should create a Gemini content generator', async () => {
        const mockConfig = {
            getUsageStatisticsEnabled: () => true,
            getContentGeneratorConfig: () => ({}),
            getCliVersion: () => '1.0.0',
            getTelemetryEnabled: () => false,
            getSessionId: () => 'test-session',
        };
        const mockGenerator = {
            models: {},
        };
        vi.mocked(GoogleGenAI).mockImplementation(() => mockGenerator);
        const generator = await createContentGenerator({
            model: 'test-model',
            apiKey: 'test-api-key',
            authType: AuthType.USE_GEMINI,
        }, mockConfig);
        expect(GoogleGenAI).toHaveBeenCalledWith({
            apiKey: 'test-api-key',
            vertexai: undefined,
            httpOptions: {
                headers: {
                    'User-Agent': expect.any(String),
                    'x-gemini-api-privileged-user-id': expect.any(String),
                },
            },
        });
        // We expect it to be a LoggingContentGenerator wrapping a HopCodeContentGenerator
        expect(generator).toBeInstanceOf(LoggingContentGenerator);
        const wrapped = generator.getWrapped();
        expect(wrapped).toBeDefined();
    });
    it('should create a Gemini content generator with client install id logging disabled', async () => {
        const mockConfig = {
            getUsageStatisticsEnabled: () => false,
            getContentGeneratorConfig: () => ({}),
            getCliVersion: () => '1.0.0',
            getTelemetryEnabled: () => false,
            getSessionId: () => 'test-session',
        };
        const mockGenerator = {
            models: {},
        };
        vi.mocked(GoogleGenAI).mockImplementation(() => mockGenerator);
        const generator = await createContentGenerator({
            model: 'test-model',
            apiKey: 'test-api-key',
            authType: AuthType.USE_GEMINI,
        }, mockConfig);
        expect(GoogleGenAI).toHaveBeenCalledWith({
            apiKey: 'test-api-key',
            vertexai: undefined,
            httpOptions: {
                headers: {
                    'User-Agent': expect.any(String),
                },
            },
        });
        expect(generator).toBeInstanceOf(LoggingContentGenerator);
    });
    it('should throw when the config has no authType', async () => {
        const mockConfig = {
            getUsageStatisticsEnabled: () => true,
            getContentGeneratorConfig: () => ({}),
            getCliVersion: () => '1.0.0',
            getTelemetryEnabled: () => false,
            getSessionId: () => 'test-session',
        };
        await expect(createContentGenerator({ model: 'test-model', apiKey: 'test-key' }, mockConfig)).rejects.toThrow('must have an authType');
    });
    it('should throw on an unsupported authType', async () => {
        const mockConfig = {
            getUsageStatisticsEnabled: () => true,
            getContentGeneratorConfig: () => ({}),
            getCliVersion: () => '1.0.0',
            getTelemetryEnabled: () => false,
            getSessionId: () => 'test-session',
        };
        await expect(createContentGenerator({
            model: 'test-model',
            apiKey: 'test-key',
            authType: 'bogus',
        }, mockConfig)).rejects.toThrow('Unsupported authType');
    });
});
describe('createContentGenerator - ERR_MODULE_NOT_FOUND handling', () => {
    const mockConfig = {
        getUsageStatisticsEnabled: () => true,
        getContentGeneratorConfig: () => ({}),
        getCliVersion: () => '1.0.0',
        getTelemetryEnabled: () => false,
        getSessionId: () => 'test-session',
    };
    beforeEach(() => {
        openaiMockState.importError = null;
        openaiMockState.generatorError = null;
        hopcodeMockState.oauthError = null;
        vi.resetModules();
    });
    it('should throw friendly restart message with cause when dynamic import fails with ERR_MODULE_NOT_FOUND', async () => {
        const moduleError = new Error("Cannot find module './openaiContentGenerator-STALE.js'");
        moduleError.code = 'ERR_MODULE_NOT_FOUND';
        openaiMockState.importError = moduleError;
        try {
            await createContentGenerator({
                model: 'test-model',
                apiKey: 'test-key',
                authType: AuthType.USE_OPENAI,
            }, mockConfig);
            expect.unreachable('should have thrown');
        }
        catch (error) {
            expect(error).toBeInstanceOf(Error);
            const err = error;
            expect(err.message).toMatch(/updated in the background and needs to be restarted/);
            expect(err.message).toMatch(/openai/);
            expect(err.cause).toBe(moduleError);
        }
    });
    it('should re-throw non-module errors unchanged', async () => {
        openaiMockState.generatorError = new Error('network timeout');
        await expect(createContentGenerator({
            model: 'test-model',
            apiKey: 'test-key',
            authType: AuthType.USE_OPENAI,
        }, mockConfig)).rejects.toThrow('network timeout');
    });
    it('should preserve module-not-found errors from HopCode OAuth setup', async () => {
        const moduleError = new Error("Cannot find module '../hopcode/stale.js'");
        moduleError.code = 'ERR_MODULE_NOT_FOUND';
        hopcodeMockState.oauthError = moduleError;
        try {
            await createContentGenerator({
                model: 'test-model',
                authType: AuthType.HOPCODE_OAUTH,
            }, mockConfig);
            expect.unreachable('should have thrown');
        }
        catch (error) {
            expect(error).toBeInstanceOf(Error);
            const err = error;
            expect(err.message).toMatch(/updated in the background and needs to be restarted/);
            expect(err.message).toMatch(/hopcode-oauth/);
            expect(err.cause).toBe(moduleError);
        }
    });
});
describe('createContentGeneratorConfig', () => {
    const mockConfig = {
        getProxy: () => undefined,
    };
    it('should preserve provided fields and set authType for HOPCODE_OAUTH', () => {
        const cfg = createContentGeneratorConfig(mockConfig, AuthType.HOPCODE_OAUTH, {
            model: 'coder-model',
            apiKey: 'HOPCODE_OAUTH_DYNAMIC_TOKEN',
        });
        expect(cfg.authType).toBe(AuthType.HOPCODE_OAUTH);
        expect(cfg.model).toBe('coder-model');
        expect(cfg.apiKey).toBe('HOPCODE_OAUTH_DYNAMIC_TOKEN');
    });
    it('should not warn or fallback for HOPCODE_OAUTH (resolution handled by ModelConfigResolver)', () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => undefined);
        const cfg = createContentGeneratorConfig(mockConfig, AuthType.HOPCODE_OAUTH, {
            model: 'some-random-model',
        });
        expect(cfg.model).toBe('some-random-model');
        expect(cfg.apiKey).toBeUndefined();
        expect(warnSpy).not.toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});
//# sourceMappingURL=contentGenerator.test.js.map