/**
 * LLM Tool (call_llm)
 *
 * Session-scoped tool that enables the main agent to invoke secondary LLM calls
 * for specialized subtasks like summarization, classification, extraction, and analysis.
 *
 * Key features:
 * - Attachment-based file loading (agent passes paths, tool loads content)
 * - Line range support for large files
 * - Predefined output formats + custom JSON Schema (native structured output)
 * - Parallel execution support (multiple calls run simultaneously)
 * - Comprehensive validation with actionable error messages
 *
 * All calls are delegated to the agent backend's queryLlm() implementation.
 */
/**
 * Request passed to the agent-native queryFn callback.
 * The prompt includes serialized file content (attachments are pre-processed by the tool).
 */
export interface LLMQueryRequest {
    /** Full prompt including serialized file content */
    prompt: string;
    /** Optional system prompt */
    systemPrompt?: string;
    /** Model to use (validated against registry) */
    model?: string;
    /** Max output tokens */
    maxTokens?: number;
    /** Sampling temperature 0-1 */
    temperature?: number;
    /** Structured output JSON schema — backends handle natively when possible */
    outputSchema?: Record<string, unknown>;
}
/**
 * Result from an agent-native queryFn callback.
 */
export interface LLMQueryResult {
    text: string;
    model?: string;
    inputTokens?: number;
    outputTokens?: number;
    /** Non-fatal warning attached to a partially-successful result (e.g. SDK stopped at max_turns). */
    warning?: string;
}
/**
 * Unified timeout for secondary LLM calls (call_llm and mini-completion flows).
 * Keep this consistent across backends to avoid model-specific timeout behavior.
 */
export declare const LLM_QUERY_TIMEOUT_MS = 120000;
export declare function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T>;
export declare const OUTPUT_FORMATS: {
    summary: {
        type: "object";
        properties: {
            summary: {
                type: string;
                description: string;
            };
            key_points: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            word_count: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    classification: {
        type: "object";
        properties: {
            category: {
                type: string;
                description: string;
            };
            confidence: {
                type: string;
                description: string;
            };
            reasoning: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    extraction: {
        type: "object";
        properties: {
            items: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            count: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    analysis: {
        type: "object";
        properties: {
            findings: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            issues: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            recommendations: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
        };
        required: string[];
    };
    comparison: {
        type: "object";
        properties: {
            similarities: {
                type: string;
                items: {
                    type: string;
                };
            };
            differences: {
                type: string;
                items: {
                    type: string;
                };
            };
            verdict: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    validation: {
        type: "object";
        properties: {
            valid: {
                type: string;
                description: string;
            };
            errors: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            warnings: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
        };
        required: string[];
    };
};
export interface BuildCallLlmOptions {
    /** Backend name for error messages */
    backendName: string;
    /** Optional model validation hook — return undefined to reject (falls back to default), or corrected model ID */
    validateModel?: (resolvedModelId: string) => string | undefined;
    /** Session directory for resolving relative attachment paths */
    sessionPath?: string;
}
/**
 * Shared pre-execution pipeline for call_llm PreToolUse intercepts.
 * Validates input, processes attachments, resolves schema, and builds an LLMQueryRequest
 * ready to be passed to the backend's queryLlm().
 *
 * Used by backend adapters to avoid duplicating validation and permission logic.
 */
export declare function buildCallLlmRequest(input: Record<string, unknown>, options: BuildCallLlmOptions): Promise<LLMQueryRequest>;
interface AttachmentInput {
    path: string;
    startLine?: number;
    endLine?: number;
}
type AttachmentResult = {
    type: 'text';
    content: string;
    filename: string;
    bytes: number;
} | {
    type: 'image';
    base64: string;
    mediaType: string;
} | {
    type: 'error';
    message: string;
};
export declare function processAttachment(input: string | AttachmentInput, index: number, basePath?: string): Promise<AttachmentResult>;
export interface LLMToolOptions {
    sessionId: string;
    /** Session directory for resolving relative attachment paths */
    sessionPath?: string;
    /**
     * Lazy resolver for the agent-native query callback.
     * Called at execution time to get the current callback from the session registry.
     * Each backend implements queryLlm() with native structured output support.
     */
    getQueryFn: () => ((request: LLMQueryRequest) => Promise<LLMQueryResult>) | undefined;
}
export declare function createLLMTool(options: LLMToolOptions): import("../mcp/local-tools.ts").LocalTool;
export {};
