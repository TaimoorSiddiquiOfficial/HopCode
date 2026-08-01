import { withoutTrailingSlash, withUserAgentSuffix, } from '@ai-sdk/provider-utils';
import { OpenAICompatibleChatLanguageModel } from './chat/openai-compatible-chat-language-model.js';
import { OpenAIResponsesLanguageModel } from './responses/openai-responses-language-model.js';
// Import the version or define it
const VERSION = '0.1.0';
/**
 * Create an OpenAI Compatible provider instance.
 */
export function createOpenaiCompatible(options = {}) {
    const baseURL = withoutTrailingSlash(options.baseURL ?? 'https://api.openai.com/v1');
    if (!baseURL) {
        throw new Error('baseURL is required');
    }
    // Merge headers: defaults first, then user overrides
    const headers = {
        // Default OpenAI Compatible headers (can be overridden by user)
        ...(options.apiKey && { Authorization: `Bearer ${options.apiKey}` }),
        ...options.headers,
    };
    const getHeaders = () => withUserAgentSuffix(headers, `ai-sdk/openai-compatible/${VERSION}`);
    const createChatModel = (modelId) => new OpenAICompatibleChatLanguageModel(modelId, {
        provider: `${options.name ?? 'openai-compatible'}.chat`,
        headers: getHeaders,
        url: ({ path }) => `${baseURL}${path}`,
        fetch: options.fetch,
    });
    const createResponsesModel = (modelId) => new OpenAIResponsesLanguageModel(modelId, {
        provider: `${options.name ?? 'openai-compatible'}.responses`,
        headers: getHeaders,
        url: ({ path }) => `${baseURL}${path}`,
        fetch: options.fetch,
    });
    const createLanguageModel = (modelId) => createChatModel(modelId);
    const provider = function (modelId) {
        return createChatModel(modelId);
    };
    provider.languageModel = createLanguageModel;
    provider.chat = createChatModel;
    provider.responses = createResponsesModel;
    return provider;
}
// Default OpenAI Compatible provider instance
export const openaiCompatible = createOpenaiCompatible();
//# sourceMappingURL=copilot-provider.js.map