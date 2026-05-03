/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  OllamaService,
  detectOllamaEndpoint,
  detectOllamaApiKey,
  isCloudEndpoint,
  DEFAULT_OLLAMA_ENDPOINT,
  DEFAULT_OLLAMA_CONFIG,
} from './ollamaService.js';
import type {
  OllamaGenerateRequest,
  OllamaGenerateResponse,
} from './ollamaService.js';

// ── Mock fetch ────────────────────────────────────────────────────────────────

const mockFetch = vi.hoisted(() => vi.fn());
vi.stubGlobal('fetch', mockFetch);

// ── Helpers ────────────────────────────────────────────────────────────────────

function mockResponse(
  status: number,
  body: unknown,
  statusText = 'OK',
): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: () => Promise.resolve(body),
    text: () =>
      Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
    body: null,
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: () => mockResponse(status, body, statusText),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
  } as Response;
}

function mockTagsResponse(models: Array<{ name: string; size: number }>) {
  return mockResponse(200, { models });
}

function mockChatResponse(message?: { role: string; content: string }) {
  return mockResponse(200, {
    model: 'llama3.2',
    created_at: new Date().toISOString(),
    message: message || { role: 'assistant', content: 'Hello!' },
    done: true,
  });
}

function mockEmbeddingResponse(embedding: number[]) {
  return mockResponse(200, { embedding });
}

function createReadableStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

// ── Tests ───────────────────────────────────────────────────────────────────────

describe('OllamaService', () => {
  let service: OllamaService;

  beforeEach(() => {
    mockFetch.mockReset();
    service = new OllamaService({
      endpoint: 'http://localhost:11434',
      apiKey: undefined,
      maxRetries: 1,
      timeoutMs: 5000,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Configuration ──────────────────────────────────────────────────────────

  describe('configuration', () => {
    it('uses provided config over defaults', () => {
      const s = new OllamaService({ endpoint: 'http://custom:9999' });
      expect(s.config.endpoint).toBe('http://custom:9999');
    });

    it('strips trailing slashes from endpoint', () => {
      const s = new OllamaService({ endpoint: 'http://localhost:11434///' });
      expect(s.config.endpoint).toBe('http://localhost:11434');
    });

    it('detects local vs cloud deployment', () => {
      expect(service.isCloud).toBe(false);
      const cloud = new OllamaService({
        endpoint: 'https://ollama.com/v1',
        apiKey: 'test-key',
      });
      expect(cloud.isCloud).toBe(true);
    });

    it('includes auth headers when apiKey is set', () => {
      const s = new OllamaService({ apiKey: 'my-token' });
      // Headers are private but we can verify through the fetch call
      mockFetch.mockResolvedValueOnce(mockTagsResponse([]));
      s.getAvailableModels();
      const callArgs = mockFetch.mock.calls[0];
      const init = callArgs[1] as RequestInit;
      const headers = init?.headers as Record<string, string>;
      expect(headers?.['Authorization']).toBe('Bearer my-token');
    });
  });

  // ── Connection ──────────────────────────────────────────────────────────────

  describe('testConnection', () => {
    it('returns true when server responds with 200', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(200, {}));
      const result = await service.testConnection();
      expect(result).toBe(true);
    });

    it('returns false when server responds with error', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(500, {}));
      const result = await service.testConnection();
      expect(result).toBe(false);
    });

    it('returns false on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      const result = await service.testConnection();
      expect(result).toBe(false);
    });
  });

  // ── Health Check ────────────────────────────────────────────────────────────

  describe('healthCheck', () => {
    it('returns healthy state when server is reachable', async () => {
      mockFetch.mockResolvedValueOnce(
        mockTagsResponse([
          { name: 'llama3.2:latest', size: 2e9 },
          { name: 'qwen2.5:14b', size: 9e9 },
        ]),
      );
      const result = await service.healthCheck();
      expect(result).toEqual({
        reachable: true,
        modelCount: 2,
        isCloud: false,
        endpoint: 'http://localhost:11434',
      });
    });

    it('returns unhealthy state when server is unreachable', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const result = await service.healthCheck();
      expect(result).toEqual({
        reachable: false,
        modelCount: 0,
        isCloud: false,
        endpoint: 'http://localhost:11434',
      });
    });
  });

  // ── Model Discovery ─────────────────────────────────────────────────────────

  describe('getAvailableModels', () => {
    it('returns installed models', async () => {
      mockFetch.mockResolvedValueOnce(
        mockTagsResponse([
          { name: 'llama3.2:latest', size: 2e9 },
          { name: 'codellama:7b', size: 4e9 },
        ]),
      );
      const models = await service.getAvailableModels();
      expect(models).toHaveLength(2);
      expect(models[0]).toMatchObject({ name: 'llama3.2:latest', size: 2e9 });
      expect(models[1]).toMatchObject({ name: 'codellama:7b', size: 4e9 });
    });

    it('returns empty array when no models', async () => {
      mockFetch.mockResolvedValueOnce(mockTagsResponse([]));
      const models = await service.getAvailableModels();
      expect(models).toEqual([]);
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse(500, {}, 'Internal Error'));
      await expect(service.getAvailableModels()).rejects.toThrow(
        'Failed to fetch models',
      );
    });

    it('retries on network error', async () => {
      mockFetch
        .mockRejectedValueOnce(new Error('ECONNRESET'))
        .mockResolvedValueOnce(
          mockTagsResponse([{ name: 'llama3.2', size: 2e9 }]),
        );
      const models = await service.getAvailableModels();
      expect(models).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('isModelAvailable', () => {
    it('finds exact model name', async () => {
      mockFetch.mockResolvedValueOnce(
        mockTagsResponse([{ name: 'llama3.2:latest', size: 2e9 }]),
      );
      const available = await service.isModelAvailable('llama3.2:latest');
      expect(available).toBe(true);
    });

    it('finds model by prefix match', async () => {
      mockFetch.mockResolvedValueOnce(
        mockTagsResponse([{ name: 'llama3.2:latest', size: 2e9 }]),
      );
      const available = await service.isModelAvailable('llama3.2');
      expect(available).toBe(true);
    });

    it('returns false for missing model', async () => {
      mockFetch.mockResolvedValueOnce(
        mockTagsResponse([{ name: 'llama3.2:latest', size: 2e9 }]),
      );
      const available = await service.isModelAvailable('nonexistent');
      expect(available).toBe(false);
    });

    it('returns false on fetch error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      const available = await service.isModelAvailable('any-model');
      expect(available).toBe(false);
    });
  });

  // ── Chat ────────────────────────────────────────────────────────────────────

  describe('chat', () => {
    const validRequest: OllamaGenerateRequest = {
      model: 'llama3.2',
      messages: [{ role: 'user', content: 'Hello' }],
    };

    it('sends a chat request and returns response', async () => {
      mockFetch.mockResolvedValueOnce(
        mockChatResponse({ role: 'assistant', content: 'Hi there!' }),
      );
      const response = await service.chat(validRequest);
      expect(response.message?.content).toBe('Hi there!');
      expect(response.done).toBe(true);
    });

    it('throws on missing model', async () => {
      const request: OllamaGenerateRequest = {
        model: '',
        messages: [{ role: 'user', content: 'Hello' }],
      };
      await expect(service.chat(request)).rejects.toThrow(
        'model name is required',
      );
    });

    it('throws on empty messages', async () => {
      const request: OllamaGenerateRequest = {
        model: 'llama3.2',
        messages: [],
      };
      await expect(service.chat(request)).rejects.toThrow(
        'messages array is empty',
      );
    });

    it('throws on missing messages', async () => {
      const request = { model: 'llama3.2' } as unknown as OllamaGenerateRequest;
      await expect(service.chat(request)).rejects.toThrow(
        'messages must be an array',
      );
    });

    it('throws on invalid message role', async () => {
      const request: OllamaGenerateRequest = {
        model: 'llama3.2',
        messages: [{ role: 'invalid' as 'user', content: 'Hello' }],
      };
      await expect(service.chat(request)).rejects.toThrow('invalid role');
    });

    it('throws on non-string content', async () => {
      const request = {
        model: 'llama3.2',
        messages: [{ role: 'user', content: 123 }],
      } as unknown as OllamaGenerateRequest;
      await expect(service.chat(request)).rejects.toThrow(
        'content must be a string',
      );
    });

    it('handles 404 model not found', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(404, 'model not found', 'Not Found'),
      );
      await expect(service.chat(validRequest)).rejects.toThrow(
        'Model not found',
      );
    });

    it('handles 500 server error', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(500, 'Internal', 'Server Error'),
      );
      await expect(service.chat(validRequest)).rejects.toThrow(
        'Ollama server error',
      );
    });

    it('handles 401 unauthorized for cloud', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(401, 'unauthorized', 'Unauthorized'),
      );
      await expect(service.chat(validRequest)).rejects.toThrow(
        'Authentication failed',
      );
    });
  });

  // ── Chat Stream ─────────────────────────────────────────────────────────────

  describe('chatStream', () => {
    const validRequest: OllamaGenerateRequest = {
      model: 'llama3.2',
      messages: [{ role: 'user', content: 'Hello' }],
    };

    it('yields streaming chunks', async () => {
      const stream = createReadableStream([
        JSON.stringify({
          model: 'llama3.2',
          message: { role: 'assistant', content: 'Hello' },
          done: false,
        }) + '\n',
        JSON.stringify({
          model: 'llama3.2',
          message: { role: 'assistant', content: ' World' },
          done: true,
        }) + '\n',
      ]);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        body: stream,
        text: () => Promise.resolve(''),
        json: () => Promise.resolve({}),
        headers: new Headers(),
        redirected: false,
        type: 'basic' as ResponseType,
        url: '',
        clone: () => ({}) as Response,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
      } as Response);

      const chunks: OllamaGenerateResponse[] = [];
      for await (const chunk of service.chatStream(validRequest)) {
        chunks.push(chunk);
      }

      expect(chunks).toHaveLength(2);
      expect(chunks[0].message?.content).toBe('Hello');
      expect(chunks[1].message?.content).toBe(' World');
    });

    it('skips malformed chunks', async () => {
      const stream = createReadableStream([
        'not-json\n',
        JSON.stringify({
          model: 'llama3.2',
          message: { role: 'assistant', content: 'Valid' },
          done: true,
        }) + '\n',
      ]);
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: 'OK',
        body: stream,
        text: () => Promise.resolve(''),
        json: () => Promise.resolve({}),
        headers: new Headers(),
        redirected: false,
        type: 'basic' as ResponseType,
        url: '',
        clone: () => ({}) as Response,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
        blob: () => Promise.resolve(new Blob()),
        formData: () => Promise.resolve(new FormData()),
      } as Response);

      const chunks: OllamaGenerateResponse[] = [];
      for await (const chunk of service.chatStream(validRequest)) {
        chunks.push(chunk);
      }

      expect(chunks).toHaveLength(1);
      expect(chunks[0].message?.content).toBe('Valid');
    });

    it('throws on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(500, 'Server error', 'Internal Server Error'),
      );
      await expect(async () => {
        for await (const _ of service.chatStream(validRequest)) {
          // should not reach here
        }
      }).rejects.toThrow('Ollama server error');
    });
  });

  // ── Embeddings ─────────────────────────────────────────────────────────────

  describe('generateEmbedding', () => {
    it('returns embedding array', async () => {
      const embedding = Array.from({ length: 768 }, () => Math.random());
      mockFetch.mockResolvedValueOnce(mockEmbeddingResponse(embedding));
      const result = await service.generateEmbedding(
        'nomic-embed-text',
        'Hello',
      );
      expect(result).toEqual(embedding);
    });

    it('throws on error response', async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(500, 'Server error', 'Internal Server Error'),
      );
      await expect(
        service.generateEmbedding('nomic-embed-text', 'Hello'),
      ).rejects.toThrow('Ollama embedding error');
    });
  });

  // ── Error Handling ─────────────────────────────────────────────────────────

  describe('error handling', () => {
    it('enhances ECONNREFUSED errors', async () => {
      mockFetch.mockRejectedValue(new Error('ECONNREFUSED'));
      await expect(service.getAvailableModels()).rejects.toThrow(
        /Troubleshooting/,
      );
    });

    it('enhances timeout errors', async () => {
      const timeoutError = new Error('The operation was aborted');
      timeoutError.name = 'AbortError';
      mockFetch.mockRejectedValue(timeoutError);
      await expect(service.getAvailableModels()).rejects.toThrow(
        /Troubleshooting/,
      );
    });

    it('does not retry aborted requests', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      mockFetch.mockRejectedValue(abortError);
      await expect(service.getAvailableModels()).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});

// ── Configuration discovery functions ──────────────────────────────────────────

describe('detectOllamaEndpoint', () => {
  afterEach(() => {
    delete process.env.OLLAMA_HOST;
    delete process.env.OLLAMA_ENDPOINT;
  });

  it('returns default when no env vars set', () => {
    expect(detectOllamaEndpoint()).toBe(DEFAULT_OLLAMA_ENDPOINT);
  });

  it('detects OLLAMA_HOST', () => {
    process.env.OLLAMA_HOST = 'http://10.0.0.5:11434';
    expect(detectOllamaEndpoint()).toBe('http://10.0.0.5:11434');
  });

  it('detects OLLAMA_ENDPOINT', () => {
    process.env.OLLAMA_ENDPOINT = 'http://custom:9999';
    expect(detectOllamaEndpoint()).toBe('http://custom:9999');
  });
});

describe('detectOllamaApiKey', () => {
  const originalKey = process.env.OLLAMA_API_KEY;

  beforeEach(() => {
    delete process.env.OLLAMA_API_KEY;
  });

  afterEach(() => {
    if (originalKey) {
      process.env.OLLAMA_API_KEY = originalKey;
    } else {
      delete process.env.OLLAMA_API_KEY;
    }
  });

  it('returns undefined when no key set', () => {
    expect(detectOllamaApiKey()).toBeUndefined();
  });

  it('detects from OLLAMA_API_KEY', () => {
    process.env.OLLAMA_API_KEY = 'sk-test-key';
    expect(detectOllamaApiKey()).toBe('sk-test-key');
  });
});

describe('isCloudEndpoint', () => {
  it('returns false for localhost', () => {
    expect(isCloudEndpoint('http://localhost:11434')).toBe(false);
    expect(isCloudEndpoint('http://127.0.0.1:11434')).toBe(false);
    expect(isCloudEndpoint('http://0.0.0.0:8080')).toBe(false);
    expect(isCloudEndpoint('http://::1:11434')).toBe(false);
  });

  it('returns true for remote endpoints', () => {
    expect(isCloudEndpoint('https://ollama.com')).toBe(true);
    expect(isCloudEndpoint('http://192.168.1.100:11434')).toBe(true);
  });

  it('returns false for invalid URLs', () => {
    expect(isCloudEndpoint('not-a-url')).toBe(false);
  });
});

describe('DEFAULT_OLLAMA_CONFIG', () => {
  it('has expected defaults', () => {
    expect(DEFAULT_OLLAMA_CONFIG.endpoint).toBe('http://localhost:11434');
    expect(DEFAULT_OLLAMA_CONFIG.maxRetries).toBe(2);
    expect(DEFAULT_OLLAMA_CONFIG.timeoutMs).toBe(30000);
  });
});
