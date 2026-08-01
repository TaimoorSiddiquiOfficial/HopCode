/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type OpenAI from 'openai';
import { type GenerateContentParameters, GenerateContentResponse } from '@google/genai';
import type { PipelineConfig } from './types.js';
/**
 * Error thrown when the API returns an error embedded as stream content
 * instead of a proper HTTP error. Some providers (e.g., certain OpenAI-compatible
 * endpoints) return throttling errors as a normal SSE chunk with
 * finish_reason="error_finish" and the error message in delta.content.
 */
export declare class StreamContentError extends Error {
    constructor(message: string);
}
/**
 * Thrown when a streaming response goes silent past the inactivity timeout.
 * `code: 'ETIMEDOUT'` makes `classifyRetryError` treat it as a retryable
 * transport error, identical to a real socket read timeout.
 */
export declare class StreamInactivityTimeoutError extends Error {
    readonly idleMs: number;
    readonly chunksReceived: number;
    readonly streamLifetimeMs: number;
    readonly code: "ETIMEDOUT";
    constructor(idleMs: number, chunksReceived: number, streamLifetimeMs: number);
}
/**
 * Thrown when the HTTP 200 response to a streaming request has a content-type
 * incompatible with SSE (e.g. `text/html` from a gateway block page). Carries
 * bounded diagnostic metadata so the user/maintainer can distinguish "model
 * returned empty stream" from "upstream returned a non-SSE page".
 */
export declare class NonSSEResponseError extends Error {
    readonly contentType: string | null;
    readonly httpStatus: number;
    readonly bodyPrefix: string;
    readonly requestId: string | null;
    readonly status: number;
    readonly request_id: string | null;
    constructor(contentType: string | null, httpStatus: number, bodyPrefix: string, requestId: string | null);
}
export type { PipelineConfig } from './types.js';
export declare class ContentGenerationPipeline {
    private config;
    client: OpenAI;
    private contentGeneratorConfig;
    private readonly streamIdleTimeoutMs;
    constructor(config: PipelineConfig);
    execute(request: GenerateContentParameters, userPromptId: string): Promise<GenerateContentResponse>;
    executeStream(request: GenerateContentParameters, userPromptId: string): Promise<AsyncGenerator<GenerateContentResponse>>;
    /**
     * Stage 2: Process OpenAI stream with conversion and logging
     * This method handles the complete stream processing pipeline:
     * 1. Convert OpenAI chunks to Gemini format while preserving original chunks
     * 2. Filter empty responses
     * 3. Handle chunk merging for providers that send finishReason and usageMetadata separately
     * 4. Handle success/error logging
     */
    private processStreamWithLogging;
    /**
     * Handle chunk merging for providers that send finishReason and usageMetadata separately.
     *
     * Strategy: When we encounter a finishReason chunk, we hold it and merge all subsequent
     * chunks into it until the stream ends. This ensures the final chunk contains both
     * finishReason and the most up-to-date usage information from any provider pattern.
     *
     * @param response Current Gemini response
     * @param pendingFinishResponse Finish response currently held for merging
     * @param setPendingFinish Callback to set pending finish response
     * @returns true if the response should be yielded, false if it should be held for merging
     */
    private handleChunkMerging;
    private buildRequest;
    private buildGenerateContentConfig;
    private buildReasoningConfig;
    /**
     * Common error handling wrapper for execute methods
     */
    private executeWithErrorHandling;
    /**
     * Shared error handling logic for both executeWithErrorHandling and processStreamWithLogging
     * This centralizes the common error processing steps to avoid duplication
     */
    private handleError;
    /**
     * Create request context with common properties
     */
    private createRequestContext;
}
