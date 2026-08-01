/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { BaseDeclarativeTool, BaseToolInvocation, Kind, } from '../tools.js';
import { ToolErrorType } from '../tool-error.js';
import { getErrorMessage } from '../../utils/errors.js';
import { createDebugLogger } from '../../utils/debugLogger.js';
import { buildContentWithSources } from './utils.js';
import { TavilyProvider } from './providers/tavily-provider.js';
import { GoogleProvider } from './providers/google-provider.js';
import { DashScopeProvider } from './providers/dashscope-provider.js';
import { DuckDuckGoProvider } from './providers/duckduckgo-provider.js';
import { ExaProvider } from './providers/exa-provider.js';
import { BingProvider } from './providers/bing-provider.js';
import { JinaProvider } from './providers/jina-provider.js';
import { FirecrawlProvider } from './providers/firecrawl-provider.js';
import { CustomProvider } from './providers/custom-provider.js';
import { ToolNames, ToolDisplayNames } from '../tool-names.js';
const debugLogger = createDebugLogger('WEB_SEARCH');
class WebSearchToolInvocation extends BaseToolInvocation {
    webSearchConfig;
    authType;
    constructor(webSearchConfig, authType, params) {
        super(params);
        this.webSearchConfig = webSearchConfig;
        this.authType = authType;
    }
    getDescription() {
        if (!this.webSearchConfig) {
            return ' (Web search is disabled - configure a provider in settings.json)';
        }
        const provider = this.params.provider || this.webSearchConfig.default;
        return ` (Searching the web via ${provider})`;
    }
    /**
     * WebSearch requires confirmation for external network requests.
     */
    async getDefaultPermission() {
        return 'ask';
    }
    /**
     * Constructs the web search confirmation details.
     */
    async getConfirmationDetails(_abortSignal) {
        // Extract the domain for the permission rule.
        const permissionRules = [`WebSearch`];
        const confirmationDetails = {
            type: 'info',
            title: 'Confirm Web Search',
            prompt: `Search the web for: "${this.params.query}"`,
            permissionRules,
            onConfirm: async (_outcome, _payload) => {
                // No-op: persistence is handled by coreToolScheduler via PM rules
            },
        };
        return confirmationDetails;
    }
    /**
     * Create a provider instance from configuration.
     */
    createProvider(config) {
        switch (config.type) {
            case 'tavily':
                return new TavilyProvider(config);
            case 'google':
                return new GoogleProvider(config);
            case 'dashscope': {
                // Pass auth type to DashScope provider for availability check
                const dashscopeConfig = {
                    ...config,
                    authType: this.authType,
                };
                return new DashScopeProvider(dashscopeConfig);
            }
            case 'duckduckgo':
                return new DuckDuckGoProvider(config);
            case 'exa':
                return new ExaProvider(config);
            case 'bing':
                return new BingProvider(config);
            case 'jina':
                return new JinaProvider(config);
            case 'firecrawl':
                return new FirecrawlProvider(config);
            case 'custom':
                return new CustomProvider(config);
            default: {
                // Exhaustive guard — should never reach here at runtime
                const unknownConfig = config;
                throw new Error(`Unknown provider type: ${unknownConfig.type ?? 'unknown'}`);
            }
        }
    }
    /**
     * Create all configured providers.
     */
    createProviders(configs) {
        const providers = new Map();
        for (const config of configs) {
            try {
                const provider = this.createProvider(config);
                if (provider.isAvailable()) {
                    providers.set(config.type, provider);
                }
            }
            catch (error) {
                debugLogger.warn(`Failed to create ${config.type} provider:`, error);
            }
        }
        return providers;
    }
    /**
     * Priority order for auto-chain failover mode.
     * Higher priority providers are tried first; DuckDuckGo is the last resort (always available).
     */
    static AUTO_CHAIN_PRIORITY = [
        'firecrawl',
        'tavily',
        'exa',
        'bing',
        'jina',
        'google',
        'dashscope',
        'custom',
        'duckduckgo',
    ];
    /**
     * Select the appropriate provider based on configuration and parameters.
     * In "auto" mode, tries providers in priority order with failover on error.
     */
    selectProvider(providers, requestedProvider, defaultProvider, mode) {
        // Explicit provider request always wins
        if (requestedProvider) {
            const provider = providers.get(requestedProvider);
            if (!provider) {
                const available = Array.from(providers.keys()).join(', ');
                throw new Error(`The specified provider "${requestedProvider}" is not available. Available: ${available}`);
            }
            return provider;
        }
        // Auto-chain mode: return a sentinel so execute() handles failover
        if (mode === 'auto' || (!mode && !defaultProvider)) {
            return 'auto';
        }
        // Manual mode: use default or first available
        if (defaultProvider && providers.has(defaultProvider)) {
            return providers.get(defaultProvider);
        }
        const firstProvider = providers.values().next().value;
        if (!firstProvider) {
            throw new Error('No web search providers are available.');
        }
        return firstProvider;
    }
    /**
     * Build an ordered list of providers for auto-chain failover.
     */
    buildAutoChain(providers) {
        const ordered = [];
        for (const type of WebSearchToolInvocation.AUTO_CHAIN_PRIORITY) {
            const p = providers.get(type);
            if (p)
                ordered.push(p);
        }
        // Include any providers not in the priority list at the end
        for (const [type, p] of providers) {
            if (!WebSearchToolInvocation.AUTO_CHAIN_PRIORITY.includes(type)) {
                ordered.push(p);
            }
        }
        return ordered;
    }
    /**
     * Format search results into a content string.
     */
    formatSearchResults(searchResult) {
        const sources = searchResult.results.map((r) => ({
            title: r.title,
            url: r.url,
        }));
        let content = searchResult.answer?.trim() || '';
        if (!content) {
            // Fallback: Build an informative summary with title + snippet + source link
            // This provides enough context for the LLM while keeping token usage efficient
            content = searchResult.results
                .slice(0, 5) // Top 5 results
                .map((r, i) => {
                const parts = [`${i + 1}. **${r.title}**`];
                // Include snippet/content if available
                if (r.content?.trim()) {
                    parts.push(`   ${r.content.trim()}`);
                }
                // Always include the source URL
                parts.push(`   Source: ${r.url}`);
                // Optionally include relevance score if available
                if (r.score !== undefined) {
                    parts.push(`   Relevance: ${(r.score * 100).toFixed(0)}%`);
                }
                // Optionally include publish date if available
                if (r.publishedDate) {
                    parts.push(`   Published: ${r.publishedDate}`);
                }
                return parts.join('\n');
            })
                .join('\n\n');
            // Add a note about using web_fetch for detailed content
            if (content) {
                content +=
                    '\n\n*Note: For detailed content from any source above, use the web_fetch tool with the URL.*';
            }
        }
        else {
            // When answer is available, append sources section
            content = buildContentWithSources(content, sources);
        }
        return { content, sources };
    }
    async execute(signal) {
        // Check if web search is configured
        if (!this.webSearchConfig) {
            return {
                llmContent: 'Web search is disabled. Please configure a web search provider in your settings.',
                returnDisplay: 'Web search is disabled.',
                error: {
                    message: 'Web search is disabled',
                    type: ToolErrorType.EXECUTION_FAILED,
                },
            };
        }
        try {
            // Create all available providers
            const providers = this.createProviders(this.webSearchConfig.provider);
            if (providers.size === 0) {
                return {
                    llmContent: 'No web search providers are available.',
                    returnDisplay: 'No web search providers are available.',
                    error: {
                        message: 'No web search providers are available.',
                        type: ToolErrorType.EXECUTION_FAILED,
                    },
                };
            }
            const selected = this.selectProvider(providers, this.params.provider, this.webSearchConfig.default, this.webSearchConfig.mode);
            // Auto-chain failover mode
            if (selected === 'auto') {
                const chain = this.buildAutoChain(providers);
                let lastError;
                for (const provider of chain) {
                    try {
                        const searchResult = await provider.search(this.params.query, signal);
                        const { content, sources } = this.formatSearchResults(searchResult);
                        if (content.trim()) {
                            return {
                                llmContent: `Web search results for "${this.params.query}" (via ${provider.name}):\n\n${content}`,
                                returnDisplay: `Search results for "${this.params.query}".`,
                                sources,
                            };
                        }
                    }
                    catch (error) {
                        debugLogger.warn(`Provider ${provider.name} failed, trying next:`, error);
                        lastError = error;
                    }
                }
                // All providers failed
                const errorMessage = `All web search providers failed. Last error: ${getErrorMessage(lastError)}`;
                return {
                    llmContent: errorMessage,
                    returnDisplay: 'Error performing web search.',
                    error: {
                        message: errorMessage,
                        type: ToolErrorType.EXECUTION_FAILED,
                    },
                };
            }
            // Single provider mode
            const searchResult = await selected.search(this.params.query, signal);
            const { content, sources } = this.formatSearchResults(searchResult);
            if (!content.trim()) {
                return {
                    llmContent: `No search results found for query: "${this.params.query}" (via ${selected.name})`,
                    returnDisplay: `No information found for "${this.params.query}".`,
                };
            }
            return {
                llmContent: `Web search results for "${this.params.query}" (via ${selected.name}):\n\n${content}`,
                returnDisplay: `Search results for "${this.params.query}".`,
                sources,
            };
        }
        catch (error) {
            const errorMessage = `Error during web search: ${getErrorMessage(error)}`;
            debugLogger.error(errorMessage, error);
            return {
                llmContent: errorMessage,
                returnDisplay: 'Error performing web search.',
                error: {
                    message: errorMessage,
                    type: ToolErrorType.EXECUTION_FAILED,
                },
            };
        }
    }
}
/**
 * A tool to perform web searches using configurable providers.
 */
export class WebSearchTool extends BaseDeclarativeTool {
    webSearchConfig;
    authType;
    static Name = ToolNames.WEB_SEARCH;
    constructor(webSearchConfig, authType) {
        super(WebSearchTool.Name, ToolDisplayNames.WEB_SEARCH, 'Allows searching the web and using results to inform responses. Provides up-to-date information for current events and recent data beyond the training data cutoff. Returns search results formatted with concise answers and source links. Use this tool when accessing information that may be outdated or beyond the knowledge cutoff.', Kind.Search, {
            type: 'object',
            properties: {
                query: {
                    type: 'string',
                    description: 'The search query to find information on the web.',
                },
                provider: {
                    type: 'string',
                    description: 'Optional provider to use for the search (e.g., "tavily", "google", "dashscope"). IMPORTANT: Only specify this parameter if you explicitly know which provider to use. Otherwise, omit this parameter entirely and let the system automatically select the appropriate provider based on availability and configuration. The system will choose the best available provider automatically.',
                },
            },
            required: ['query'],
        });
        this.webSearchConfig = webSearchConfig;
        this.authType = authType;
    }
    /**
     * Validates the parameters for the WebSearchTool.
     * @param params The parameters to validate
     * @returns An error message string if validation fails, null if valid
     */
    validateToolParamValues(params) {
        if (!params.query || params.query.trim() === '') {
            return "The 'query' parameter cannot be empty.";
        }
        // Validate provider parameter if provided
        if (params.provider !== undefined && params.provider.trim() === '') {
            return "The 'provider' parameter cannot be empty if specified.";
        }
        return null;
    }
    createInvocation(params) {
        return new WebSearchToolInvocation(this.webSearchConfig, this.authType, params);
    }
}
//# sourceMappingURL=index.js.map