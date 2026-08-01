import type { ModelMessage } from 'ai';
import type { JSONSchema7 } from '@ai-sdk/provider';
import type { JSONSchema } from 'zod/v4/core';
import type { Provider } from './provider.js';
export declare namespace ProviderTransform {
    const OUTPUT_TOKEN_MAX: number;
    function message(msgs: ModelMessage[], model: Provider.Model, options: Record<string, unknown>): ModelMessage[];
    function temperature(model: Provider.Model): 1 | 0.6 | 0.55 | undefined;
    function topP(model: Provider.Model): 1 | 0.95 | undefined;
    function topK(model: Provider.Model): 40 | 20 | 64 | undefined;
    function variants(model: Provider.Model): Record<string, Record<string, any>>;
    function options(input: {
        model: Provider.Model;
        sessionID: string;
        providerOptions?: Record<string, any>;
    }): Record<string, any>;
    function smallOptions(model: Provider.Model): {
        store: boolean;
        reasoningEffort: string;
        thinkingConfig?: undefined;
        reasoning?: undefined;
        veniceParameters?: undefined;
    } | {
        store: boolean;
        reasoningEffort?: undefined;
        thinkingConfig?: undefined;
        reasoning?: undefined;
        veniceParameters?: undefined;
    } | {
        thinkingConfig: {
            thinkingLevel: string;
            thinkingBudget?: undefined;
        };
        store?: undefined;
        reasoningEffort?: undefined;
        reasoning?: undefined;
        veniceParameters?: undefined;
    } | {
        thinkingConfig: {
            thinkingBudget: number;
            thinkingLevel?: undefined;
        };
        store?: undefined;
        reasoningEffort?: undefined;
        reasoning?: undefined;
        veniceParameters?: undefined;
    } | {
        reasoning: {
            enabled: boolean;
        };
        store?: undefined;
        reasoningEffort?: undefined;
        thinkingConfig?: undefined;
        veniceParameters?: undefined;
    } | {
        reasoningEffort: string;
        store?: undefined;
        thinkingConfig?: undefined;
        reasoning?: undefined;
        veniceParameters?: undefined;
    } | {
        veniceParameters: {
            disableThinking: boolean;
        };
        store?: undefined;
        reasoningEffort?: undefined;
        thinkingConfig?: undefined;
        reasoning?: undefined;
    } | {
        store?: undefined;
        reasoningEffort?: undefined;
        thinkingConfig?: undefined;
        reasoning?: undefined;
        veniceParameters?: undefined;
    };
    function providerOptions(model: Provider.Model, options: {
        [x: string]: any;
    }): Record<string, any>;
    function maxOutputTokens(model: Provider.Model): number;
    function schema(model: Provider.Model, schema: JSONSchema.BaseSchema | JSONSchema7): JSONSchema7;
}
