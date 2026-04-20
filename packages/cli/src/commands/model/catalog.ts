/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Static model catalog for all supported AI providers.
 * Each category within a provider groups models by capability tier.
 *
 * Models are listed most-capable first within each category.
 * IDs use the format expected by the active provider's API.
 */

export interface ModelEntry {
  id: string;
  label: string;
  description?: string;
  /** Rough context window hint shown to the user */
  context?: string;
}

export interface ModelCategory {
  name: string;
  models: ModelEntry[];
}

export interface ProviderCatalog {
  providerId: string;
  categories: ModelCategory[];
}

const catalogs: ProviderCatalog[] = [
  // ── OpenAI ──────────────────────────────────────────────────────────────
  {
    providerId: 'openai',
    categories: [
      {
        name: 'Flagship',
        models: [
          {
            id: 'gpt-4o',
            label: 'GPT-4o',
            description: 'Multimodal, fast',
            context: '128k',
          },
          {
            id: 'o3',
            label: 'o3',
            description: 'Advanced reasoning',
            context: '200k',
          },
          {
            id: 'o4-mini',
            label: 'o4-mini',
            description: 'Compact reasoning',
            context: '200k',
          },
          {
            id: 'gpt-4.1',
            label: 'GPT-4.1',
            description: 'Latest GPT-4 variant',
            context: '1M',
          },
        ],
      },
      {
        name: 'Fast',
        models: [
          {
            id: 'gpt-4o-mini',
            label: 'GPT-4o mini',
            description: 'Cheap, fast',
            context: '128k',
          },
          {
            id: 'gpt-4.1-mini',
            label: 'GPT-4.1 mini',
            description: 'Small + capable',
            context: '1M',
          },
          {
            id: 'gpt-4.1-nano',
            label: 'GPT-4.1 nano',
            description: 'Ultra-fast',
            context: '1M',
          },
          {
            id: 'o3-mini',
            label: 'o3-mini',
            description: 'Fast reasoning',
            context: '200k',
          },
        ],
      },
    ],
  },

  // ── Anthropic ───────────────────────────────────────────────────────────
  {
    providerId: 'anthropic',
    categories: [
      {
        name: 'Opus',
        models: [
          {
            id: 'claude-opus-4-5',
            label: 'Claude Opus 4.5',
            description: 'Most powerful',
            context: '200k',
          },
          {
            id: 'claude-opus-4',
            label: 'Claude Opus 4',
            description: 'Powerful, hybrid reasoning',
            context: '200k',
          },
        ],
      },
      {
        name: 'Sonnet',
        models: [
          {
            id: 'claude-sonnet-4-5',
            label: 'Claude Sonnet 4.5',
            description: 'Balanced',
            context: '200k',
          },
          {
            id: 'claude-sonnet-4',
            label: 'Claude Sonnet 4',
            description: 'Fast, capable',
            context: '200k',
          },
          {
            id: 'claude-3-5-sonnet-20241022',
            label: 'Claude 3.5 Sonnet',
            description: 'Previous gen',
            context: '200k',
          },
        ],
      },
      {
        name: 'Haiku',
        models: [
          {
            id: 'claude-haiku-4-5',
            label: 'Claude Haiku 4.5',
            description: 'Ultra-fast',
            context: '200k',
          },
          {
            id: 'claude-3-5-haiku-20241022',
            label: 'Claude 3.5 Haiku',
            description: 'Previous gen',
            context: '200k',
          },
        ],
      },
    ],
  },

  // ── Google Gemini ────────────────────────────────────────────────────────
  {
    providerId: 'gemini',
    categories: [
      {
        name: 'Pro',
        models: [
          {
            id: 'gemini-2.5-pro',
            label: 'Gemini 2.5 Pro',
            description: 'Flagship reasoning',
            context: '1M',
          },
          {
            id: 'gemini-2.0-pro-exp',
            label: 'Gemini 2.0 Pro (exp)',
            description: 'Experimental',
            context: '2M',
          },
        ],
      },
      {
        name: 'Flash',
        models: [
          {
            id: 'gemini-2.5-flash',
            label: 'Gemini 2.5 Flash',
            description: 'Fast + capable',
            context: '1M',
          },
          {
            id: 'gemini-2.0-flash',
            label: 'Gemini 2.0 Flash',
            description: 'Very fast',
            context: '1M',
          },
          {
            id: 'gemini-1.5-flash',
            label: 'Gemini 1.5 Flash',
            description: 'Previous gen',
            context: '1M',
          },
        ],
      },
    ],
  },

  // ── DeepSeek ─────────────────────────────────────────────────────────────
  {
    providerId: 'deepseek',
    categories: [
      {
        name: 'Chat',
        models: [
          {
            id: 'deepseek/deepseek-chat',
            label: 'DeepSeek Chat',
            description: 'General use',
            context: '64k',
          },
          {
            id: 'deepseek/deepseek-chat-v3-0324',
            label: 'DeepSeek Chat v3 (Mar)',
            description: 'March snapshot',
            context: '64k',
          },
        ],
      },
      {
        name: 'Reasoning',
        models: [
          {
            id: 'deepseek/deepseek-reasoner',
            label: 'DeepSeek Reasoner',
            description: 'Deep thinking',
            context: '64k',
          },
          {
            id: 'deepseek/deepseek-r1',
            label: 'DeepSeek R1',
            description: 'Chain-of-thought',
            context: '64k',
          },
          {
            id: 'deepseek/deepseek-r1-distill-llama-70b',
            label: 'R1 Distill 70B',
            description: 'Efficient reasoning',
            context: '32k',
          },
        ],
      },
    ],
  },

  // ── Groq ─────────────────────────────────────────────────────────────────
  {
    providerId: 'groq',
    categories: [
      {
        name: 'Llama',
        models: [
          {
            id: 'groq/llama-3.3-70b-versatile',
            label: 'Llama 3.3 70B',
            description: 'Best quality',
            context: '128k',
          },
          {
            id: 'groq/llama-3.1-70b-versatile',
            label: 'Llama 3.1 70B',
            description: 'Previous gen',
            context: '128k',
          },
          {
            id: 'groq/llama3-8b-8192',
            label: 'Llama 3 8B',
            description: 'Ultra-fast',
            context: '8k',
          },
        ],
      },
      {
        name: 'Other',
        models: [
          {
            id: 'groq/mixtral-8x7b-32768',
            label: 'Mixtral 8×7B',
            description: 'MoE model',
            context: '32k',
          },
          {
            id: 'groq/gemma2-9b-it',
            label: 'Gemma 2 9B',
            description: 'Google model',
            context: '8k',
          },
        ],
      },
    ],
  },

  // ── Mistral ───────────────────────────────────────────────────────────────
  {
    providerId: 'mistral',
    categories: [
      {
        name: 'Flagship',
        models: [
          {
            id: 'mistral/mistral-large-latest',
            label: 'Mistral Large',
            description: 'Most capable',
            context: '128k',
          },
          {
            id: 'mistral/mistral-medium-latest',
            label: 'Mistral Medium',
            description: 'Balanced',
            context: '128k',
          },
        ],
      },
      {
        name: 'Code',
        models: [
          {
            id: 'mistral/codestral-latest',
            label: 'Codestral',
            description: 'Code specialist',
            context: '256k',
          },
          {
            id: 'mistral/devstral-small-latest',
            label: 'Devstral Small',
            description: 'Agentic coding',
            context: '128k',
          },
        ],
      },
      {
        name: 'Fast',
        models: [
          {
            id: 'mistral/mistral-small-latest',
            label: 'Mistral Small',
            description: 'Fast, cheap',
            context: '128k',
          },
          {
            id: 'mistral/mistral-tiny-latest',
            label: 'Mistral Tiny',
            description: 'Lightest',
            context: '128k',
          },
        ],
      },
    ],
  },

  // ── OpenRouter ────────────────────────────────────────────────────────────
  {
    providerId: 'openrouter',
    categories: [
      {
        name: 'Anthropic',
        models: [
          {
            id: 'anthropic/claude-opus-4-5',
            label: 'Claude Opus 4.5',
            description: 'Most capable',
            context: '200k',
          },
          {
            id: 'anthropic/claude-sonnet-4-5',
            label: 'Claude Sonnet 4.5',
            description: 'Balanced',
            context: '200k',
          },
        ],
      },
      {
        name: 'OpenAI',
        models: [
          {
            id: 'openai/gpt-4o',
            label: 'GPT-4o',
            description: 'Multimodal flagship',
            context: '128k',
          },
          {
            id: 'openai/o3',
            label: 'o3',
            description: 'Advanced reasoning',
            context: '200k',
          },
          {
            id: 'openai/gpt-4.1',
            label: 'GPT-4.1',
            description: 'Fast + smart',
            context: '1M',
          },
        ],
      },
      {
        name: 'Google',
        models: [
          {
            id: 'google/gemini-2.5-pro',
            label: 'Gemini 2.5 Pro',
            description: 'Largest context',
            context: '1M',
          },
          {
            id: 'google/gemini-2.5-flash',
            label: 'Gemini 2.5 Flash',
            description: 'Fast + affordable',
            context: '1M',
          },
        ],
      },
      {
        name: 'Meta',
        models: [
          {
            id: 'meta-llama/llama-3.3-70b-instruct',
            label: 'Llama 3.3 70B',
            description: 'Open source',
            context: '128k',
          },
          {
            id: 'meta-llama/llama-3.1-405b-instruct',
            label: 'Llama 3.1 405B',
            description: 'Most capable open',
            context: '128k',
          },
        ],
      },
      {
        name: 'DeepSeek',
        models: [
          {
            id: 'deepseek/deepseek-r1',
            label: 'DeepSeek R1',
            description: 'Reasoning model',
            context: '64k',
          },
          {
            id: 'deepseek/deepseek-chat-v3-5',
            label: 'DeepSeek V3.5',
            description: 'Fast + capable',
            context: '64k',
          },
        ],
      },
      {
        name: 'Mistral',
        models: [
          {
            id: 'mistralai/mistral-large',
            label: 'Mistral Large',
            description: 'Frontier',
            context: '128k',
          },
          {
            id: 'mistralai/codestral-2501',
            label: 'Codestral',
            description: 'Code specialist',
            context: '256k',
          },
        ],
      },
      {
        name: 'xAI',
        models: [
          {
            id: 'x-ai/grok-3',
            label: 'Grok 3',
            description: 'xAI flagship',
            context: '131k',
          },
        ],
      },
      {
        name: 'Moonshot',
        models: [
          {
            id: 'moonshotai/kimi-k2',
            label: 'Kimi K2',
            description: 'Agentic + code',
            context: '128k',
          },
        ],
      },
    ],
  },

  // ── xAI ───────────────────────────────────────────────────────────────────
  {
    providerId: 'xai',
    categories: [
      {
        name: 'Grok 3',
        models: [
          {
            id: 'xai/grok-3',
            label: 'Grok 3',
            description: 'Flagship',
            context: '131k',
          },
          {
            id: 'xai/grok-3-fast',
            label: 'Grok 3 Fast',
            description: 'Faster variant',
            context: '131k',
          },
          {
            id: 'xai/grok-3-mini',
            label: 'Grok 3 Mini',
            description: 'Efficient',
            context: '131k',
          },
          {
            id: 'xai/grok-3-mini-fast',
            label: 'Grok 3 Mini Fast',
            description: 'Fastest',
            context: '131k',
          },
        ],
      },
    ],
  },

  // ── Perplexity ────────────────────────────────────────────────────────────
  {
    providerId: 'perplexity',
    categories: [
      {
        name: 'Sonar (Search-augmented)',
        models: [
          {
            id: 'perplexity/sonar-pro',
            label: 'Sonar Pro',
            description: 'Best search quality',
            context: '200k',
          },
          {
            id: 'perplexity/sonar',
            label: 'Sonar',
            description: 'Fast web search',
            context: '127k',
          },
          {
            id: 'perplexity/sonar-reasoning-pro',
            label: 'Sonar Reasoning Pro',
            description: 'Chain-of-thought + search',
            context: '128k',
          },
          {
            id: 'perplexity/sonar-reasoning',
            label: 'Sonar Reasoning',
            description: 'Lightweight reasoning',
            context: '127k',
          },
        ],
      },
      {
        name: 'Deep Research',
        models: [
          {
            id: 'perplexity/sonar-deep-research',
            label: 'Sonar Deep Research',
            description: 'Multi-step research',
            context: '128k',
          },
        ],
      },
    ],
  },

  // ── Cohere ────────────────────────────────────────────────────────────────
  {
    providerId: 'cohere',
    categories: [
      {
        name: 'Command',
        models: [
          {
            id: 'cohere/command-r-plus',
            label: 'Command R+',
            description: 'Best quality',
            context: '128k',
          },
          {
            id: 'cohere/command-r',
            label: 'Command R',
            description: 'Balanced',
            context: '128k',
          },
          {
            id: 'cohere/command-r7b-12-2024',
            label: 'Command R7B',
            description: 'Compact, fast',
            context: '128k',
          },
          {
            id: 'cohere/command',
            label: 'Command',
            description: 'Legacy',
            context: '4k',
          },
        ],
      },
    ],
  },

  // ── Together AI ───────────────────────────────────────────────────────────
  {
    providerId: 'togetherai',
    categories: [
      {
        name: 'Llama',
        models: [
          {
            id: 'togetherai/meta-llama/Llama-3-70b-chat-hf',
            label: 'Llama 3 70B',
            description: 'Most capable',
            context: '8k',
          },
          {
            id: 'togetherai/meta-llama/Llama-3-8b-chat-hf',
            label: 'Llama 3 8B',
            description: 'Fast',
            context: '8k',
          },
          {
            id: 'togetherai/meta-llama/Llama-Vision-Free',
            label: 'Llama Vision (Free)',
            description: 'Vision, free tier',
            context: '8k',
          },
        ],
      },
      {
        name: 'Other',
        models: [
          {
            id: 'togetherai/mistralai/Mixtral-8x7B-Instruct-v0.1',
            label: 'Mixtral 8×7B',
            description: 'MoE model',
            context: '32k',
          },
          {
            id: 'togetherai/Qwen/Qwen2.5-72B-Instruct-Turbo',
            label: 'Qwen 2.5 72B',
            description: 'Alibaba model',
            context: '32k',
          },
        ],
      },
    ],
  },

  // ── Fireworks AI ──────────────────────────────────────────────────────────
  {
    providerId: 'fireworks',
    categories: [
      {
        name: 'Llama',
        models: [
          {
            id: 'fireworks/accounts/fireworks/models/llama-v3p1-70b-instruct',
            label: 'Llama 3.1 70B',
            description: 'Best quality',
            context: '131k',
          },
          {
            id: 'fireworks/accounts/fireworks/models/llama-v3p1-8b-instruct',
            label: 'Llama 3.1 8B',
            description: 'Fast',
            context: '131k',
          },
          {
            id: 'fireworks/accounts/fireworks/models/llama-v3p3-70b-instruct',
            label: 'Llama 3.3 70B',
            description: 'Latest',
            context: '131k',
          },
        ],
      },
      {
        name: 'Other',
        models: [
          {
            id: 'fireworks/accounts/fireworks/models/mixtral-8x7b-instruct',
            label: 'Mixtral 8×7B',
            description: 'MoE',
            context: '32k',
          },
          {
            id: 'fireworks/accounts/fireworks/models/deepseek-r1',
            label: 'DeepSeek R1',
            description: 'Reasoning',
            context: '64k',
          },
          {
            id: 'fireworks/accounts/fireworks/models/qwen2p5-coder-32b-instruct',
            label: 'Qwen 2.5 Coder 32B',
            description: 'Code specialist',
            context: '32k',
          },
        ],
      },
    ],
  },

  // ── HuggingFace ───────────────────────────────────────────────────────────
  {
    providerId: 'huggingface',
    categories: [
      {
        name: 'Popular Models',
        models: [
          {
            id: 'meta-llama/Llama-3.1-70B-Instruct',
            label: 'Llama 3.1 70B',
            description: 'Top open model',
            context: '128k',
          },
          {
            id: 'meta-llama/Llama-3.1-8B-Instruct',
            label: 'Llama 3.1 8B',
            description: 'Fast open model',
            context: '128k',
          },
          {
            id: 'mistralai/Mistral-7B-Instruct-v0.3',
            label: 'Mistral 7B',
            description: 'Compact, capable',
            context: '32k',
          },
          {
            id: 'Qwen/Qwen2.5-72B-Instruct',
            label: 'Qwen 2.5 72B',
            description: 'Alibaba model',
            context: '128k',
          },
          {
            id: 'microsoft/Phi-3.5-mini-instruct',
            label: 'Phi-3.5 Mini',
            description: 'Microsoft, tiny',
            context: '128k',
          },
        ],
      },
    ],
  },

  // ── Replicate ─────────────────────────────────────────────────────────────
  {
    providerId: 'replicate',
    categories: [
      {
        name: 'Llama',
        models: [
          {
            id: 'meta/meta-llama-3.1-70b-instruct',
            label: 'Llama 3.1 70B',
            description: 'Best quality',
            context: '128k',
          },
          {
            id: 'meta/meta-llama-3.1-8b-instruct',
            label: 'Llama 3.1 8B',
            description: 'Fast',
            context: '128k',
          },
          {
            id: 'meta/meta-llama-3-70b-instruct',
            label: 'Llama 3 70B',
            description: 'Previous gen',
            context: '8k',
          },
        ],
      },
      {
        name: 'Other',
        models: [
          {
            id: 'mistralai/mistral-7b-instruct-v0.2',
            label: 'Mistral 7B v0.2',
            description: 'Compact',
            context: '32k',
          },
          {
            id: 'snowflake/snowflake-arctic-instruct',
            label: 'Snowflake Arctic',
            description: 'MoE, large',
            context: '4k',
          },
        ],
      },
    ],
  },

  // ── Ollama Local ──────────────────────────────────────────────────────────
  // Note: ollama-local fetches a live list via catalog/ollama.ts.
  // This static fallback is shown if the Ollama daemon is unreachable.
  {
    providerId: 'ollama-local',
    categories: [
      {
        name: 'Common Models (install with: ollama pull <name>)',
        models: [
          {
            id: 'llama3.2',
            label: 'Llama 3.2',
            description: '3B, fast',
            context: '8k',
          },
          {
            id: 'llama3.1:8b',
            label: 'Llama 3.1 8B',
            description: 'Balanced',
            context: '128k',
          },
          {
            id: 'llama3.1:70b',
            label: 'Llama 3.1 70B',
            description: 'High quality',
            context: '128k',
          },
          {
            id: 'deepseek-r1:7b',
            label: 'DeepSeek R1 7B',
            description: 'Local reasoning',
            context: '32k',
          },
          {
            id: 'qwen2.5-coder:7b',
            label: 'Qwen 2.5 Coder 7B',
            description: 'Code specialist',
            context: '32k',
          },
          {
            id: 'mistral:7b',
            label: 'Mistral 7B',
            description: 'General use',
            context: '8k',
          },
          {
            id: 'phi4',
            label: 'Phi-4',
            description: 'Microsoft, small',
            context: '16k',
          },
          {
            id: 'gemma3:12b',
            label: 'Gemma 3 12B',
            description: 'Google, capable',
            context: '128k',
          },
          {
            id: 'codellama:7b',
            label: 'CodeLlama 7B',
            description: 'Code',
            context: '16k',
          },
        ],
      },
    ],
  },

  // ── Ollama Cloud ──────────────────────────────────────────────────────────
  {
    providerId: 'ollama-cloud',
    categories: [
      {
        name: 'Cloud Models',
        models: [
          {
            id: 'gpt-oss:120b-cloud',
            label: 'GPT-OSS 120B',
            description: 'OpenAI open-source, Ollama cloud',
            context: '128k',
          },
          {
            id: 'deepseek-v3:685b-cloud',
            label: 'DeepSeek V3 685B',
            description: 'Flagship cloud',
            context: '64k',
          },
          {
            id: 'llama3.3:70b-cloud',
            label: 'Llama 3.3 70B',
            description: 'Meta flagship',
            context: '128k',
          },
          {
            id: 'qwen2.5:72b-cloud',
            label: 'Qwen 2.5 72B',
            description: 'Alibaba cloud',
            context: '128k',
          },
          {
            id: 'mistral:7b-cloud',
            label: 'Mistral 7B',
            description: 'Cloud inference',
            context: '32k',
          },
          {
            id: 'phi4:cloud',
            label: 'Phi-4',
            description: 'Microsoft cloud',
            context: '16k',
          },
        ],
      },
    ],
  },

  // ── Cerebras ──────────────────────────────────────────────────────────────
  {
    providerId: 'cerebras',
    categories: [
      {
        name: 'Llama (2000+ t/s)',
        models: [
          {
            id: 'llama-3.3-70b',
            label: 'Llama 3.3 70B',
            description: 'Best quality, ultra-fast',
            context: '128k',
          },
          {
            id: 'llama-3.1-70b',
            label: 'Llama 3.1 70B',
            description: 'Stable, ultra-fast',
            context: '128k',
          },
          {
            id: 'llama3.1-8b',
            label: 'Llama 3.1 8B',
            description: 'Compact, fastest',
            context: '128k',
          },
        ],
      },
    ],
  },

  // ── NVIDIA NIM ────────────────────────────────────────────────────────────
  {
    providerId: 'nvidia-nim',
    categories: [
      {
        name: 'Llama',
        models: [
          {
            id: 'nvidia/llama-3.1-nemotron-70b-instruct',
            label: 'Llama Nemotron 70B',
            description: 'NVIDIA-tuned, top quality',
            context: '128k',
          },
          {
            id: 'meta/llama-3.3-70b-instruct',
            label: 'Llama 3.3 70B',
            description: 'Latest Meta model',
            context: '128k',
          },
          {
            id: 'meta/llama-3.1-8b-instruct',
            label: 'Llama 3.1 8B',
            description: 'Fast',
            context: '128k',
          },
        ],
      },
      {
        name: 'Other',
        models: [
          {
            id: 'mistralai/mistral-large-2-instruct',
            label: 'Mistral Large 2',
            description: 'Frontier model',
            context: '128k',
          },
          {
            id: 'deepseek-ai/deepseek-r1',
            label: 'DeepSeek R1',
            description: 'Reasoning model',
            context: '64k',
          },
          {
            id: 'qwen/qwen2.5-72b-instruct',
            label: 'Qwen 2.5 72B',
            description: 'Alibaba model',
            context: '32k',
          },
        ],
      },
    ],
  },

  // ── SambaNova ─────────────────────────────────────────────────────────────
  {
    providerId: 'sambanova',
    categories: [
      {
        name: 'Llama',
        models: [
          {
            id: 'Meta-Llama-3.3-70B-Instruct',
            label: 'Llama 3.3 70B',
            description: 'Best quality',
            context: '128k',
          },
          {
            id: 'Meta-Llama-3.1-405B-Instruct',
            label: 'Llama 3.1 405B',
            description: 'Most capable open',
            context: '16k',
          },
          {
            id: 'Meta-Llama-3.1-8B-Instruct',
            label: 'Llama 3.1 8B',
            description: 'Fast',
            context: '16k',
          },
        ],
      },
      {
        name: 'Other',
        models: [
          {
            id: 'DeepSeek-R1',
            label: 'DeepSeek R1',
            description: 'Reasoning model',
            context: '32k',
          },
          {
            id: 'Qwen2.5-72B-Instruct',
            label: 'Qwen 2.5 72B',
            description: 'Alibaba model',
            context: '8k',
          },
        ],
      },
    ],
  },

  // ── AI21 Labs ─────────────────────────────────────────────────────────────
  {
    providerId: 'ai21',
    categories: [
      {
        name: 'Jamba',
        models: [
          {
            id: 'jamba-1.5-large',
            label: 'Jamba 1.5 Large',
            description: 'Most capable, 256k context',
            context: '256k',
          },
          {
            id: 'jamba-1.5-mini',
            label: 'Jamba 1.5 Mini',
            description: 'Fast, efficient',
            context: '256k',
          },
          {
            id: 'jamba-instruct',
            label: 'Jamba Instruct',
            description: 'Previous gen',
            context: '256k',
          },
        ],
      },
    ],
  },

  // ── Alibaba DashScope (Qwen) ──────────────────────────────────────────────
  {
    providerId: 'dashscope',
    categories: [
      {
        name: 'Qwen',
        models: [
          {
            id: 'qwen-max',
            label: 'Qwen Max',
            description: 'Most capable',
            context: '32k',
          },
          {
            id: 'qwen-max-latest',
            label: 'Qwen Max (latest)',
            description: 'Latest snapshot',
            context: '32k',
          },
          {
            id: 'qwen-plus',
            label: 'Qwen Plus',
            description: 'Balanced',
            context: '128k',
          },
          {
            id: 'qwen-long',
            label: 'Qwen Long',
            description: 'Long context',
            context: '1M',
          },
          {
            id: 'qwen-turbo',
            label: 'Qwen Turbo',
            description: 'Fast, cheap',
            context: '1M',
          },
        ],
      },
      {
        name: 'Qwen Coder',
        models: [
          {
            id: 'qwen2.5-coder-32b-instruct',
            label: 'Qwen 2.5 Coder 32B',
            description: 'Code specialist',
            context: '128k',
          },
          {
            id: 'qwen2.5-coder-7b-instruct',
            label: 'Qwen 2.5 Coder 7B',
            description: 'Compact code model',
            context: '128k',
          },
        ],
      },
    ],
  },

  // ── Moonshot AI (Kimi) ────────────────────────────────────────────────────
  {
    providerId: 'moonshot',
    categories: [
      {
        name: 'Moonshot v1',
        models: [
          {
            id: 'moonshot-v1-128k',
            label: 'Moonshot v1 128K',
            description: '128k context',
            context: '128k',
          },
          {
            id: 'moonshot-v1-32k',
            label: 'Moonshot v1 32K',
            description: '32k context',
            context: '32k',
          },
          {
            id: 'moonshot-v1-8k',
            label: 'Moonshot v1 8K',
            description: 'Fast, compact',
            context: '8k',
          },
        ],
      },
    ],
  },

  // ── 01.AI (Yi) ────────────────────────────────────────────────────────────
  {
    providerId: 'yi-01',
    categories: [
      {
        name: 'Yi',
        models: [
          {
            id: 'yi-lightning',
            label: 'Yi Lightning',
            description: 'Fastest, most capable',
            context: '16k',
          },
          {
            id: 'yi-large-turbo',
            label: 'Yi Large Turbo',
            description: 'Balanced',
            context: '16k',
          },
          {
            id: 'yi-large',
            label: 'Yi Large',
            description: 'High quality',
            context: '32k',
          },
          {
            id: 'yi-medium',
            label: 'Yi Medium',
            description: 'Compact',
            context: '16k',
          },
        ],
      },
    ],
  },

  // ── LM Studio (Local) ─────────────────────────────────────────────────────
  // Note: lm-studio fetches live model list from the local server.
  // This static fallback is shown if LM Studio is not running.
  {
    providerId: 'lm-studio',
    categories: [
      {
        name: 'Local Models (load via LM Studio)',
        models: [
          {
            id: 'local-model',
            label: 'Active Model',
            description: 'Whatever model is loaded in LM Studio',
            context: 'varies',
          },
        ],
      },
    ],
  },
];

/** Returns the static model catalog for a given providerId, or undefined. */
export function getCatalog(providerId: string): ProviderCatalog | undefined {
  return catalogs.find((c) => c.providerId === providerId);
}

/** Returns all catalog entries (useful for listing all providers). */
export function getAllCatalogs(): ProviderCatalog[] {
  return catalogs;
}
