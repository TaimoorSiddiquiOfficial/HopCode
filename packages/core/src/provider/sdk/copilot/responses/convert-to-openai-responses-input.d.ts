import { type LanguageModelV2CallWarning, type LanguageModelV2Prompt } from '@ai-sdk/provider';
import { z } from 'zod/v4';
import type { OpenAIResponsesInput } from './openai-responses-api-types.js';
export declare function convertToOpenAIResponsesInput({ prompt, systemMessageMode, fileIdPrefixes, store, hasLocalShellTool, }: {
    prompt: LanguageModelV2Prompt;
    systemMessageMode: 'system' | 'developer' | 'remove';
    fileIdPrefixes?: readonly string[];
    store: boolean;
    hasLocalShellTool?: boolean;
}): Promise<{
    input: OpenAIResponsesInput;
    warnings: LanguageModelV2CallWarning[];
}>;
declare const openaiResponsesReasoningProviderOptionsSchema: z.ZodObject<{
    itemId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reasoningEncryptedContent: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type OpenAIResponsesReasoningProviderOptions = z.infer<typeof openaiResponsesReasoningProviderOptionsSchema>;
export {};
