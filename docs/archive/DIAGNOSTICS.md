# HopCode API Provider Diagnostic Report

Generated: 2026-04-24T14:25:57.438Z

## Summary

- **Total Providers**: 24
- **Reachable**: 11
- **Unreachable/Errors**: 10
- **Skipped**: 3 (native auth or local providers)

## Provider Status

| Status | Provider                               | Base URL                                                 | API Key | Details                                               |
| ------ | -------------------------------------- | -------------------------------------------------------- | ------- | ----------------------------------------------------- |
| ○      | OpenAI (`openai`)                      | N/A (native auth)                                        | ✕       | Native auth provider (no HTTP endpoint)               |
| ✓      | Anthropic (`anthropic`)                | `https://api.anthropic.com`                              | ✕       | HTTP 404 (456ms) ⚠️ No API key                        |
| ○      | Google Gemini (`gemini`)               | N/A (native auth)                                        | ✕       | Native auth provider (no HTTP endpoint)               |
| ✓      | DeepSeek (`deepseek`)                  | `https://api.deepseek.com/v1`                            | ✕       | HTTP 401 (702ms) ⚠️ No API key                        |
| ✓      | Groq (`groq`)                          | `https://api.groq.com/openai/v1`                         | ✕       | HTTP 401 (513ms) ⚠️ No API key                        |
| ✓      | Mistral AI (`mistral`)                 | `https://api.mistral.ai/v1`                              | ✕       | HTTP 401 (274ms) ⚠️ No API key                        |
| ✓      | OpenRouter (`openrouter`)              | `https://openrouter.ai/api/v1`                           | ✕       | HTTP 200 (434ms) ⚠️ No API key                        |
| ✓      | Together AI (`togetherai`)             | `https://api.together.xyz/v1`                            | ✕       | HTTP 401 (487ms) ⚠️ No API key                        |
| ✓      | Fireworks AI (`fireworks`)             | `https://api.fireworks.ai/openai/v1`                     | ✕       | HTTP 404 (366ms) ⚠️ No API key                        |
| ✓      | xAI (`xai`)                            | `https://api.x.ai/v1`                                    | ✕       | HTTP 401 (632ms) ⚠️ No API key                        |
| ✓      | Perplexity (`perplexity`)              | `https://api.perplexity.ai`                              | ✕       | HTTP 404 (361ms) ⚠️ No API key                        |
| ✓      | Cohere (`cohere`)                      | `https://api.cohere.ai/compatibility/v1`                 | ✕       | HTTP 401 (439ms) ⚠️ No API key                        |
| ✓      | HuggingFace (`huggingface`)            | `https://api-inference.huggingface.co/v1`                | ✕       | HTTP 200 (311ms) ⚠️ No API key                        |
| ✕      | Replicate (`replicate`)                | `https://openai-proxy.replicate.com/v1`                  | ✕       | Timeout (>10s)                                        |
| ○      | Ollama (Local) (`ollama-local`)        | `http://localhost:11434/v1`                              | ✕       | Local provider - requires local service to be running |
| ✕      | Ollama Cloud (`ollama-cloud`)          | `https://ollama.com/v1`                                  | ✕       | Timeout (>10s)                                        |
| ✕      | Cerebras (`cerebras`)                  | `https://api.cerebras.ai/v1`                             | ✕       | Timeout (>10s)                                        |
| ✕      | NVIDIA NIM (`nvidia-nim`)              | `https://integrate.api.nvidia.com/v1`                    | ✕       | Timeout (>10s)                                        |
| ✕      | SambaNova Cloud (`sambanova`)          | `https://api.sambanova.ai/v1`                            | ✕       | Timeout (>10s)                                        |
| ✕      | AI21 Labs (`ai21`)                     | `https://api.ai21.com/studio/v1`                         | ✕       | Timeout (>10s)                                        |
| ✕      | Alibaba DashScope (Qwen) (`dashscope`) | `https://dashscope-intl.aliyuncs.com/compatible-mode/v1` | ✕       | Timeout (>10s)                                        |
| ✕      | Moonshot AI (Kimi) (`moonshot`)        | `https://api.moonshot.cn/v1`                             | ✕       | Timeout (>10s)                                        |
| ✕      | 01.AI (Yi) (`yi-01`)                   | `https://api.lingyiwanwu.com/v1`                         | ✕       | Timeout (>10s)                                        |
| ✕      | LM Studio (Local) (`lm-studio`)        | `http://localhost:1234/v1`                               | ✕       | Connection failed: network error                      |

## Issues Detected

### Replicate (`replicate`)

- **Status**: ✕
- **Base URL**: https://openai-proxy.replicate.com/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### Ollama Cloud (`ollama-cloud`)

- **Status**: ✕
- **Base URL**: https://ollama.com/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### Cerebras (`cerebras`)

- **Status**: ✕
- **Base URL**: https://api.cerebras.ai/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### NVIDIA NIM (`nvidia-nim`)

- **Status**: ✕
- **Base URL**: https://integrate.api.nvidia.com/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### SambaNova Cloud (`sambanova`)

- **Status**: ✕
- **Base URL**: https://api.sambanova.ai/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### AI21 Labs (`ai21`)

- **Status**: ✕
- **Base URL**: https://api.ai21.com/studio/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### Alibaba DashScope (Qwen) (`dashscope`)

- **Status**: ✕
- **Base URL**: https://dashscope-intl.aliyuncs.com/compatible-mode/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### Moonshot AI (Kimi) (`moonshot`)

- **Status**: ✕
- **Base URL**: https://api.moonshot.cn/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### 01.AI (Yi) (`yi-01`)

- **Status**: ✕
- **Base URL**: https://api.lingyiwanwu.com/v1
- **Issue**: Timeout (>10s)

**Troubleshooting:**

- The endpoint is slow to respond
- Check for firewall or proxy issues

### LM Studio (Local) (`lm-studio`)

- **Status**: ✕
- **Base URL**: http://localhost:1234/v1
- **Issue**: Connection failed: network error

**Troubleshooting:**

- Verify network connectivity
- Check firewall/proxy settings
- Verify the API endpoint is accessible

## Recommendations

### Missing API Keys

The following providers are reachable but do not have API keys configured:

- **Anthropic**: Run `hopcode auth anthropic` to configure
- **DeepSeek**: Run `hopcode auth deepseek` to configure
- **Groq**: Run `hopcode auth groq` to configure
- **Mistral AI**: Run `hopcode auth mistral` to configure
- **OpenRouter**: Run `hopcode auth openrouter` to configure
- **Together AI**: Run `hopcode auth togetherai` to configure
- **Fireworks AI**: Run `hopcode auth fireworks` to configure
- **xAI**: Run `hopcode auth xai` to configure
- **Perplexity**: Run `hopcode auth perplexity` to configure
- **Cohere**: Run `hopcode auth cohere` to configure
- **HuggingFace**: Run `hopcode auth huggingface` to configure
- **Replicate**: Run `hopcode auth replicate` to configure
- **Ollama Cloud**: Run `hopcode auth ollama-cloud` to configure
- **Cerebras**: Run `hopcode auth cerebras` to configure
- **NVIDIA NIM**: Run `hopcode auth nvidia-nim` to configure
- **SambaNova Cloud**: Run `hopcode auth sambanova` to configure
- **AI21 Labs**: Run `hopcode auth ai21` to configure
- **Alibaba DashScope (Qwen)**: Run `hopcode auth dashscope` to configure
- **Moonshot AI (Kimi)**: Run `hopcode auth moonshot` to configure
- **01.AI (Yi)**: Run `hopcode auth yi-01` to configure
- **LM Studio (Local)**: Run `hopcode auth lm-studio` to configure
