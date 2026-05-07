---
name: provider-auth-architecture
description: >
  How the HopCode provider and authentication system works — plugin-based
  provider registration, auth method types (OAuth vs API key), model resolution,
  and how to add or debug a provider. Use when working on auth flows, adding a
  new model provider (Ollama Cloud, Ollama Local, OpenAI-compatible), debugging
  "authentication failed" errors, or understanding how the AI SDK provider is
  selected at runtime. Triggers on: "provider", "auth", "Ollama", "OAuth",
  "API key", "model provider", "authentication", "OPENAI_API_KEY", "ProviderAuth".
---

# Provider and Auth Architecture

## Overview

HopCode resolves which AI backend to use through a layered system:

```
User intent (CLI args / /auth dialog / env vars)
       ↓
 ProviderAuth.methods()   ← Plugin-registered auth methods
       ↓
 Provider selection       ← packages/core/src/provider/provider.ts
       ↓
 AI SDK model client      ← packages/core/src/provider/sdk/
       ↓
 ContentGenerator         ← packages/core/src/core/contentGenerator.ts
```

---

## Auth Method Types

Every provider registers one or more auth methods of type:

```typescript
interface Method {
  type: 'oauth' | 'api'; // OAuth flow vs direct API key
  label: string; // User-facing label e.g. "Ollama Cloud (API Key)"
}
```

The `ProviderAuth` namespace (packages/core/src/provider/auth.ts) collects all registered methods via `Plugin.list()`.

### Supported provider types

| Provider           | Auth Type                                | Key Files                                           |
| ------------------ | ---------------------------------------- | --------------------------------------------------- |
| Ollama Local       | `api` (no key / localhost URL)           | Ollama plugin in `packages/core/src/`               |
| Ollama Cloud       | `api` (cloud API key)                    | Ollama plugin                                       |
| OpenAI-compatible  | `api` (OPENAI_API_KEY + OPENAI_BASE_URL) | copilot provider SDK                                |
| GitHub Copilot     | `oauth`                                  | `packages/core/src/hopcode/hopCodeOAuth2.ts`        |
| GitHub Device Flow | `oauth`                                  | `packages/core/src/auth/github-device-flow-auth.ts` |

---

## Plugin System

Providers are registered as plugins. `Plugin.list()` returns all registered plugins:

```typescript
// packages/core/src/plugin.ts
export class Plugin {
  static async list() {
    // Currently returns [] — stubs until extension loading is wired
    return [];
  }
}
```

Each plugin object can carry an `auth` property:

```typescript
{
  auth: {
    provider: 'ollama-cloud',     // Provider identifier
    methods: [
      { type: 'api', label: 'Ollama Cloud (API Key)' },
    ],
    // oauth() or api() handler functions
  }
}
```

---

## Auth Flow

### OAuth flow

1. `ProviderAuth.startOAuth(provider)` — generates an authorization URL
2. User visits the URL, authorizes the app
3. Callback receives a `code` and completes token exchange
4. Token stored via `SharedTokenManager` (packages/core/src/hopcode/sharedTokenManager.ts)

### API key flow

1. User runs `hopcode auth <provider> --key <key>` or enters it in `/auth` dialog
2. Key saved to `~/.hopcode/settings.json` under `modelProviders.<provider>.apiKey`
3. At runtime, `ProviderAuth.getAuth(provider)` reads and returns the stored key

---

## Model Resolution

`packages/core/src/models/modelConfigResolver.ts` resolves the active model config:

```
Priority (highest first):
  1. CLI --model flag
  2. OPENAI_MODEL env var (or provider-specific env)
  3. user settings.json → model.name
  4. project .hopcode/settings.json → model.name
  5. Provider default model
```

`ModelRegistry` (packages/core/src/models/modelRegistry.ts) maintains the catalog of known models with capabilities (tool_call, reasoning, attachment, etc.).

---

## Provider SDK Layer

The SDK lives at `packages/core/src/provider/sdk/copilot/`:

| File                                            | Purpose                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| `copilot-provider.ts`                           | Provider factory — creates language model instances |
| `chat/openai-compatible-chat-language-model.ts` | Chat completions (streaming)                        |
| `responses/openai-responses-language-model.ts`  | OpenAI Responses API (newer)                        |

The provider wraps AI SDK language models. Any OpenAI-compatible endpoint (Ollama, LM Studio, vLLM, etc.) works with `OPENAI_BASE_URL` pointing at the local server.

---

## Environment Variables

| Variable          | Effect                                                           |
| ----------------- | ---------------------------------------------------------------- |
| `OPENAI_API_KEY`  | API key for OpenAI-compatible providers                          |
| `OPENAI_BASE_URL` | Override base URL (e.g., `http://localhost:11434/v1` for Ollama) |
| `OPENAI_MODEL`    | Model to use with OpenAI-compatible provider                     |
| `HOPCODE_MODEL`   | Override model for all providers                                 |
| `HOPCODE_DEBUG`   | Enable verbose provider/auth logging                             |

---

## Adding a New Provider

1. **Create an auth plugin** in `packages/core/src/` (or a separate package):

```typescript
export const myProviderPlugin = {
  auth: {
    provider: 'my-provider',
    methods: [{ type: 'api' as const, label: 'My Provider (API Key)' }],
    async api(params: { key: string }) {
      // Validate and store the key
    },
    async getAuth() {
      // Return stored credentials
    },
  },
};
```

2. **Register the plugin** — until `Plugin.list()` is fully wired, add to the extension registration path in `packages/core/src/extension/`.

3. **Wire the SDK** — map the provider ID to an AI SDK language model in `copilot-provider.ts`.

4. **Add `/auth <provider>` command** — add a branch in `packages/cli/src/ui/commands/authCommand.ts`.

5. **Update `hopcode-claw` skill** — document the new provider in the auth section.

---

## Key Files

| File                                                | Purpose                                                |
| --------------------------------------------------- | ------------------------------------------------------ |
| `packages/core/src/provider/auth.ts`                | `ProviderAuth` namespace — method registry, OAuth flow |
| `packages/core/src/provider/provider.ts`            | Provider selection and factory                         |
| `packages/core/src/provider/models.ts`              | `ModelsDev` — model catalog from models.dev            |
| `packages/core/src/models/modelConfigResolver.ts`   | Priority-ordered model config resolution               |
| `packages/core/src/models/modelRegistry.ts`         | Known model capabilities registry                      |
| `packages/core/src/hopcode/hopCodeOAuth2.ts`        | GitHub Copilot OAuth2 implementation                   |
| `packages/core/src/hopcode/sharedTokenManager.ts`   | Cross-process token caching                            |
| `packages/core/src/auth/github-device-flow-auth.ts` | Device flow auth for GitHub                            |
| `packages/core/src/plugin.ts`                       | Plugin registry (stub, returns [])                     |
| `packages/cli/src/ui/commands/authCommand.ts`       | `/auth` CLI command                                    |
| `packages/cli/src/ui/auth/AuthDialog.tsx`           | Auth UI dialog component                               |
