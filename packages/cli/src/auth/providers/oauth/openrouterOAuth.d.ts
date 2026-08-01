/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import open from 'open';
import { type ProviderModelConfig as ModelConfig } from '@hoptrendy/hopcode-core';
export declare const OPENROUTER_ENV_KEY = "OPENROUTER_API_KEY";
export declare const OPENROUTER_DEFAULT_MODEL = "z-ai/glm-4.5-air:free";
export declare const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
export declare const OPENROUTER_OAUTH_AUTHORIZE_URL = "https://openrouter.ai/auth";
export declare const OPENROUTER_OAUTH_EXCHANGE_URL = "https://openrouter.ai/api/v1/auth/keys";
export declare const OPENROUTER_MODELS_URL = "https://openrouter.ai/api/v1/models";
export declare const OPENROUTER_OAUTH_CALLBACK_PORT = 3000;
export declare const OPENROUTER_OAUTH_CALLBACK_URL = "http://localhost:3000/openrouter/callback";
export declare const OPENROUTER_DEFAULT_MODELS: ModelConfig[];
export interface OpenRouterOAuthResult {
    apiKey: string;
    userId?: string;
    authorizationUrl?: string;
    authorizationCodeWaitMs?: number;
    apiKeyExchangeMs?: number;
}
export interface PkcePair {
    codeVerifier: string;
    codeChallenge: string;
}
export interface OpenRouterOAuthSession {
    callbackUrl: string;
    codeVerifier: string;
    state: string;
    authorizationUrl: string;
}
export interface OAuthCallbackListener {
    ready: Promise<void>;
    waitForCode: Promise<string>;
    close: () => Promise<void>;
}
export declare function createPkcePair(): PkcePair;
export declare function buildOpenRouterAuthorizationUrl(params: {
    callbackUrl: string;
    codeChallenge: string;
    state: string;
    codeChallengeMethod?: 'S256';
    limit?: number;
}): string;
export declare function createOAuthState(): string;
export declare function createOpenRouterOAuthSession(callbackUrl?: string, pkcePair?: PkcePair, state?: string): OpenRouterOAuthSession;
export interface OAuthCallbackListenerWithPort extends OAuthCallbackListener {
    /** The actual port the server bound to (may differ from the requested port). */
    port: number;
}
export declare function startOAuthCallbackListener(callbackUrl: string | undefined, timeoutMs: number | undefined, expectedState: string): OAuthCallbackListenerWithPort;
export declare function startOAuthCallbackListenerWithRetry(callbackUrl: string | undefined, timeoutMs: number | undefined, expectedState: string, maxRetries?: number): Promise<OAuthCallbackListenerWithPort>;
export declare function getPreferredOpenRouterModelId(models: ModelConfig[]): string | undefined;
export declare function selectRecommendedOpenRouterModels(models: ModelConfig[], limit?: number): ModelConfig[];
export declare function isOpenRouterConfig(config: ModelConfig): boolean;
export declare function mergeOpenRouterConfigs(existingConfigs: ModelConfig[], openRouterModels?: ModelConfig[]): ModelConfig[];
export declare function fetchOpenRouterModels(): Promise<ModelConfig[]>;
export declare function getOpenRouterModelsWithFallback(): Promise<ModelConfig[]>;
export declare function exchangeAuthCodeForApiKey(params: {
    code: string;
    codeVerifier: string;
}): Promise<OpenRouterOAuthResult>;
interface OAuthSignalTarget {
    once(event: NodeJS.Signals, listener: (signal: NodeJS.Signals) => void): void;
    removeListener(event: NodeJS.Signals, listener: (signal: NodeJS.Signals) => void): void;
}
export interface OpenRouterOAuthLoginDeps {
    openBrowser?: typeof open;
    startListener?: typeof startOAuthCallbackListenerWithRetry;
    exchangeApiKey?: typeof exchangeAuthCodeForApiKey;
    now?: () => number;
    signalTarget?: OAuthSignalTarget;
    abortSignal?: AbortSignal;
    session?: OpenRouterOAuthSession;
}
export declare function runOpenRouterOAuthLogin(callbackUrl?: string, deps?: OpenRouterOAuthLoginDeps): Promise<OpenRouterOAuthResult>;
export {};
