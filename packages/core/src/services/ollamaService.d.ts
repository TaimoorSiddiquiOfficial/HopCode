/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export interface OllamaModel {
    name: string;
    model: string;
    modified_at: string;
    size: number;
    digest: string;
    details?: {
        parent_model?: string;
        format?: string;
        family?: string;
        families?: string[];
        parameter_size?: string;
        quantization_level?: string;
    };
}
export interface OllamaMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface OllamaGenerateRequest {
    model: string;
    messages: OllamaMessage[];
    stream?: boolean;
    keep_alive?: string;
    options?: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
        num_predict?: number;
        stop?: string[];
        seed?: number;
        num_ctx?: number;
    };
}
export interface OllamaGenerateResponse {
    model: string;
    created_at: string;
    message?: OllamaMessage;
    done: boolean;
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    prompt_eval_duration?: number;
    eval_count?: number;
    eval_duration?: number;
}
export interface OllamaServiceConfig {
    /** Base URL for the Ollama API (e.g. http://localhost:11434) */
    endpoint: string;
    /** API key for cloud deployments, undefined for local */
    apiKey?: string;
    /** Max retry attempts for transient failures */
    maxRetries: number;
    /** Timeout per request in milliseconds */
    timeoutMs: number;
}
export declare const DEFAULT_OLLAMA_ENDPOINT = "http://localhost:11434";
export declare const DEFAULT_OLLAMA_CONFIG: OllamaServiceConfig;
/**
 * Detect the Ollama endpoint from environment or fall back to the default.
 * Supports OLLAMA_HOST (native Ollama env var) and custom endpoints.
 */
export declare function detectOllamaEndpoint(): string;
/**
 * Detect an API key for Ollama from environment variables.
 * Checks OLLAMA_CLOUD_API_KEY first (cloud), then OLLAMA_API_KEY (local dummy).
 */
export declare function detectOllamaApiKey(): string | undefined;
/**
 * Determine whether an endpoint is a cloud deployment.
 */
export declare function isCloudEndpoint(endpoint: string): boolean;
export declare class OllamaService {
    readonly config: OllamaServiceConfig;
    constructor(config?: Partial<OllamaServiceConfig>);
    /** Whether this is a cloud (remote) deployment. */
    get isCloud(): boolean;
    /** Returns the auth headers for HTTP requests. */
    private get headers();
    /**
     * Test connectivity to the Ollama server.
     * Returns true if the server responds with a 200 to GET /api/tags.
     */
    testConnection(): Promise<boolean>;
    /**
     * Check if the Ollama server is healthy and responding.
     * Returns diagnostic information about the deployment.
     */
    healthCheck(): Promise<{
        reachable: boolean;
        modelCount: number;
        isCloud: boolean;
        endpoint: string;
    }>;
    /**
     * Get the list of available models via the native `/api/tags` endpoint.
     */
    getAvailableModels(): Promise<OllamaModel[]>;
    /**
     * Check if a specific model is available (pulled) on the server.
     */
    isModelAvailable(modelName: string): Promise<boolean>;
    /**
     * Send a chat completion request to the native `/api/chat` endpoint.
     */
    chat(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse>;
    /**
     * Stream a chat completion via the native `/api/chat` endpoint.
     */
    chatStream(request: OllamaGenerateRequest): AsyncGenerator<OllamaGenerateResponse>;
    /**
     * Generate embeddings via the native `/api/embeddings` endpoint.
     */
    generateEmbedding(model: string, prompt: string): Promise<number[]>;
    private validateRequest;
    private validateResponse;
    private fetchWithRetry;
}
