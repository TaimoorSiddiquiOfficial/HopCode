import OpenAI from 'openai';
import type { GenerateContentConfig } from '@google/genai';
import type { Config } from '../../../config/config.js';
import type { ContentGeneratorConfig } from '../../contentGenerator.js';
import type { DashScopeRequestMetadata } from './types.js';
import type { OpenAIResponseParsingOptions } from '../responseParsingOptions.js';
import { DefaultOpenAICompatibleProvider } from './default.js';
export declare class DashScopeOpenAICompatibleProvider extends DefaultOpenAICompatibleProvider {
    constructor(contentGeneratorConfig: ContentGeneratorConfig, cliConfig: Config);
    getResponseParsingOptions(): OpenAIResponseParsingOptions;
    /**
     * Determines whether to use the DashScope-compatible provider.
     * Covers dashscope.aliyuncs.com, dashscope-intl.aliyuncs.com,
     * Token Plan endpoints under token-plan.<region>.maas.aliyuncs.com,
     * internal Alibaba domains (*.alibaba-inc.com, *.aliyun-inc.com),
     * and proxy matches.
     *
     * Note: any *.alibaba-inc.com / *.aliyun-inc.com host is treated as a
     * DashScope-compatible endpoint by design. Keep this generic and avoid
     * embedding individual private gateway hostnames in provider detection.
     */
    static isDashScopeProvider(contentGeneratorConfig: ContentGeneratorConfig): boolean;
    buildHeaders(): Record<string, string | undefined>;
    buildClient(): OpenAI;
    /**
     * Build and configure the request for DashScope API.
     *
     * This method applies DashScope-specific configurations including:
     * - Cache control for the system message, last tool message (when tools are configured),
     *   and the latest history message
     * - Output token limits based on model capabilities
     * - Vision model specific parameters (vl_high_resolution_images)
     * - Request metadata for session tracking
     *
     * @param request - The original chat completion request parameters
     * @param userPromptId - Unique identifier for the user prompt for session tracking
     * @returns Configured request with DashScope-specific parameters applied
     */
    buildRequest(request: OpenAI.Chat.ChatCompletionCreateParams, userPromptId: string): OpenAI.Chat.ChatCompletionCreateParams;
    /**
     * Whether to send `enable_thinking: true` because the user selected a
     * reasoning effort. qwen's hybrid-thinking models expose thinking as the
     * boolean `enable_thinking` rather than a tiered `reasoning_effort`, so the
     * unified effort ladder collapses to on/off here. Gated to qwen-family wire
     * models (mirroring the pipeline's disable gate) so the qwen-specific field
     * never leaks to a non-qwen model sharing the DashScope endpoint.
     */
    private shouldEnableThinkingFromEffort;
    buildMetadata(userPromptId: string): DashScopeRequestMetadata;
    getDefaultGenerationConfig(): GenerateContentConfig;
    /**
     * Add cache control flag to specified message(s) for DashScope providers
     */
    private addDashScopeCacheControl;
    private addCacheControlToTools;
    /**
     * Add cache control to message content, handling both string and array formats
     */
    private addCacheControlToContent;
    /**
     * Normalize content to array format
     */
    private normalizeContentToArray;
    /**
     * Add cache control to the content array
     */
    private addCacheControlToContentArray;
    /**
     * True for glm-* models (e.g. glm-4.5, glm-5.2). Uses the same `^glm-` prefix
     * convention as the GLM matchers in tokenLimits.ts, keeping model detection
     * consistent across the codebase.
     */
    private isGlmModel;
    /**
     * Whether the request is in "function-calling mode" — it declares `tools`, or
     * its history already contains a tool result / assistant tool_call. glm needs
     * one of these present to parse structured content-part arrays.
     */
    private hasFunctionCallingContext;
    /**
     * Collapse text-only content arrays back to a plain string, leaving
     * media-bearing parts (image/audio/...) as arrays. Used for glm tool-less
     * requests, where the array form would otherwise be dropped server-side.
     * Multiple text parts are joined with a blank line, matching the DeepSeek
     * provider's flattening (separate parts read as separate blocks).
     * Only called on the flatten branch, which skips cache control, so no part
     * here carries a `cache_control` marker.
     */
    private flattenTextContent;
    /**
     * Vision-capable model patterns.
     * Supports exact matches and prefix patterns for easy extension.
     */
    private static readonly VISION_MODEL_EXACT_MATCHES;
    private static readonly VISION_MODEL_PREFIX_PATTERNS;
    private isVisionModel;
    /**
     * Check if cache control should be disabled based on configuration.
     *
     * @returns true if cache control should be enabled, false otherwise
     */
    private shouldEnableCacheControl;
}
