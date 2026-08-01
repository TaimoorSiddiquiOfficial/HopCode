/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Native Ollama API service for local and cloud deployments.
 *
 * Complements the OpenAI-compatible pipeline by providing native
 * Ollama API operations: connection testing, live model listing,
 * health checks, embedding generation, and direct chat access.
 */
/** Environment variable key for local Ollama authentication (dummy value used by OpenAI SDK). */
const OLLAMA_API_KEY = 'OLLAMA_API_KEY';
/** Environment variable key for Ollama Cloud API authentication. */
const OLLAMA_CLOUD_API_KEY = 'OLLAMA_CLOUD_API_KEY';
export const DEFAULT_OLLAMA_ENDPOINT = 'http://localhost:11434';
export const DEFAULT_OLLAMA_CONFIG = {
    endpoint: DEFAULT_OLLAMA_ENDPOINT,
    maxRetries: 2,
    timeoutMs: 30000,
};
// ── Configuration discovery ─────────────────────────────────────────────────
/**
 * Detect the Ollama endpoint from environment or fall back to the default.
 * Supports OLLAMA_HOST (native Ollama env var) and custom endpoints.
 */
export function detectOllamaEndpoint() {
    if (process.env.OLLAMA_HOST)
        return process.env.OLLAMA_HOST;
    if (process.env.OLLAMA_ENDPOINT)
        return process.env.OLLAMA_ENDPOINT;
    return DEFAULT_OLLAMA_ENDPOINT;
}
/**
 * Detect an API key for Ollama from environment variables.
 * Checks OLLAMA_CLOUD_API_KEY first (cloud), then OLLAMA_API_KEY (local dummy).
 */
export function detectOllamaApiKey() {
    return process.env[OLLAMA_CLOUD_API_KEY] || process.env[OLLAMA_API_KEY];
}
/**
 * Determine whether an endpoint is a cloud deployment.
 */
export function isCloudEndpoint(endpoint) {
    try {
        const hostname = new URL(endpoint).hostname;
        return !['localhost', '127.0.0.1', '0.0.0.0', '::1'].includes(hostname);
    }
    catch {
        return false;
    }
}
// ── Service ──────────────────────────────────────────────────────────────────
export class OllamaService {
    config;
    constructor(config) {
        this.config = {
            ...DEFAULT_OLLAMA_CONFIG,
            endpoint: detectOllamaEndpoint(),
            apiKey: detectOllamaApiKey(),
            ...config,
        };
        // Strip trailing slash for consistency
        this.config.endpoint = this.config.endpoint.replace(/\/+$/, '');
    }
    /** Whether this is a cloud (remote) deployment. */
    get isCloud() {
        return isCloudEndpoint(this.config.endpoint);
    }
    /** Returns the auth headers for HTTP requests. */
    get headers() {
        const h = {
            'Content-Type': 'application/json',
        };
        if (this.config.apiKey) {
            h['Authorization'] = `Bearer ${this.config.apiKey}`;
        }
        return h;
    }
    // ── Connection & Health ────────────────────────────────────────────────
    /**
     * Test connectivity to the Ollama server.
     * Returns true if the server responds with a 200 to GET /api/tags.
     */
    async testConnection() {
        try {
            const response = await this.fetchWithRetry(`${this.config.endpoint}/api/tags`, {
                method: 'GET',
                headers: this.headers,
                signal: AbortSignal.timeout(5000),
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Check if the Ollama server is healthy and responding.
     * Returns diagnostic information about the deployment.
     */
    async healthCheck() {
        try {
            const models = await this.getAvailableModels();
            return {
                reachable: true,
                modelCount: models.length,
                isCloud: this.isCloud,
                endpoint: this.config.endpoint,
            };
        }
        catch {
            return {
                reachable: false,
                modelCount: 0,
                isCloud: this.isCloud,
                endpoint: this.config.endpoint,
            };
        }
    }
    // ── Model Discovery ────────────────────────────────────────────────────
    /**
     * Get the list of available models via the native `/api/tags` endpoint.
     */
    async getAvailableModels() {
        const response = await this.fetchWithRetry(`${this.config.endpoint}/api/tags`, { method: 'GET', headers: this.headers });
        if (!response.ok) {
            throw new Error(`Failed to fetch models from Ollama: ${response.status} ${response.statusText}`);
        }
        const data = (await response.json());
        return data.models || [];
    }
    /**
     * Check if a specific model is available (pulled) on the server.
     */
    async isModelAvailable(modelName) {
        try {
            const models = await this.getAvailableModels();
            return models.some((m) => m.name === modelName ||
                m.model === modelName ||
                m.name.startsWith(`${modelName}:`) ||
                m.model.startsWith(`${modelName}:`));
        }
        catch {
            return false;
        }
    }
    // ── Chat / Generate ────────────────────────────────────────────────────
    /**
     * Send a chat completion request to the native `/api/chat` endpoint.
     */
    async chat(request) {
        this.validateRequest(request);
        const response = await this.fetchWithRetry(`${this.config.endpoint}/api/chat`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ ...request, stream: false }),
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(parseOllamaError(response.status, errorText));
        }
        const data = (await response.json());
        this.validateResponse(data);
        return data;
    }
    /**
     * Stream a chat completion via the native `/api/chat` endpoint.
     */
    async *chatStream(request) {
        this.validateRequest(request);
        const response = await this.fetchWithRetry(`${this.config.endpoint}/api/chat`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ ...request, stream: true }),
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(parseOllamaError(response.status, errorText));
        }
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }
        const decoder = new TextDecoder();
        let buffer = '';
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed)
                        continue;
                    try {
                        const chunk = JSON.parse(trimmed);
                        if (chunk && typeof chunk === 'object' && 'done' in chunk) {
                            yield chunk;
                        }
                    }
                    catch {
                        // Skip malformed chunks in streaming
                    }
                }
            }
            // Process remaining buffer
            if (buffer.trim()) {
                try {
                    const chunk = JSON.parse(buffer.trim());
                    if (chunk && typeof chunk === 'object' && 'done' in chunk) {
                        yield chunk;
                    }
                }
                catch {
                    // Skip malformed final chunk
                }
            }
        }
        finally {
            reader.releaseLock();
        }
    }
    // ── Embeddings ─────────────────────────────────────────────────────────
    /**
     * Generate embeddings via the native `/api/embeddings` endpoint.
     */
    async generateEmbedding(model, prompt) {
        const response = await this.fetchWithRetry(`${this.config.endpoint}/api/embeddings`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ model, prompt }),
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Ollama embedding error (${response.status}): ${errorText}`);
        }
        const data = (await response.json());
        return data.embedding;
    }
    // ── Validation ─────────────────────────────────────────────────────────
    validateRequest(request) {
        if (!request.model || typeof request.model !== 'string') {
            throw new Error('Invalid Ollama request: model name is required');
        }
        if (!request.messages || !Array.isArray(request.messages)) {
            throw new Error('Invalid Ollama request: messages must be an array');
        }
        if (request.messages.length === 0) {
            throw new Error('Invalid Ollama request: messages array is empty');
        }
        for (let i = 0; i < request.messages.length; i++) {
            const msg = request.messages[i];
            if (!msg ||
                !msg.role ||
                !['system', 'user', 'assistant'].includes(msg.role)) {
                throw new Error(`Invalid Ollama request: message ${i} has invalid role "${msg?.role}"`);
            }
            if (typeof msg.content !== 'string') {
                throw new Error(`Invalid Ollama request: message ${i} content must be a string`);
            }
        }
    }
    validateResponse(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid Ollama response: not an object');
        }
        if (!('done' in data)) {
            throw new Error('Invalid Ollama response: missing "done" field');
        }
    }
    // ── HTTP ────────────────────────────────────────────────────────────────
    async fetchWithRetry(url, init) {
        let lastError;
        for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), init.signal ? this.config.timeoutMs : this.config.timeoutMs);
                const response = await fetch(url, {
                    ...init,
                    signal: init.signal || controller.signal,
                });
                clearTimeout(timeoutId);
                return response;
            }
            catch (error) {
                lastError = error;
                // Don't retry aborted requests (including AbortSignal.timeout)
                if (error instanceof Error &&
                    (error.name === 'AbortError' || error.name === 'TimeoutError')) {
                    throw enhanceOllamaError(error, 'request', this.config.endpoint);
                }
                // Only retry on network errors (ECONNREFUSED, etc.), not HTTP errors
                if (attempt < this.config.maxRetries) {
                    await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 500));
                }
            }
        }
        throw enhanceOllamaError(lastError || new Error('Failed after retries'), 'request', this.config.endpoint);
    }
}
// ── Error Helpers ───────────────────────────────────────────────────────────
function parseOllamaError(status, errorText) {
    switch (status) {
        case 400:
            if (errorText.includes('model')) {
                return `Model error: ${errorText}. Check if the model exists with 'ollama list'.`;
            }
            return `Bad request: ${errorText}`;
        case 401:
        case 403:
            return `Authentication failed: ${errorText}. Check your OLLAMA_API_KEY or Ollama Cloud credentials.`;
        case 404:
            if (errorText.includes('model') || errorText.includes('not found')) {
                return `Model not found. Pull it with: ollama pull <model-name>`;
            }
            return `Not found: ${errorText}`;
        case 500:
            return `Ollama server error: ${errorText}. Try restarting the Ollama service.`;
        case 503:
            return `Ollama service unavailable: ${errorText}. Ensure Ollama is running.`;
        default:
            return `Ollama API error (${status}): ${errorText}`;
    }
}
function enhanceOllamaError(error, operation, endpoint) {
    const baseMessage = `Ollama ${operation} failed: ${error.message}`;
    if (error.message.includes('ECONNREFUSED')) {
        return new Error(`${baseMessage}\n\nTroubleshooting:\n` +
            `• Start Ollama: ollama serve\n` +
            `• Check endpoint: ${endpoint}\n` +
            `• For cloud: verify network and OLLAMA_API_KEY`);
    }
    if (error.name === 'AbortError' ||
        error.name === 'TimeoutError' ||
        error.message.includes('timeout') ||
        error.message.includes('abort')) {
        return new Error(`${baseMessage}\n\nTroubleshooting:\n` +
            `• Increase timeout if on slow hardware\n` +
            `• Check network connectivity to ${endpoint}\n` +
            `• Verify the Ollama server is responding`);
    }
    if (error.message.includes('model')) {
        return new Error(`${baseMessage}\n\nTroubleshooting:\n` +
            `• List installed models: ollama list\n` +
            `• Pull a model: ollama pull <model-name>`);
    }
    return new Error(baseMessage);
}
//# sourceMappingURL=ollamaService.js.map