/**
 * Source Guides System
 *
 * Provides parsing utilities for source guides.
 * Guides are now served exclusively via the craft-agents-docs MCP server.
 *
 * The agent should search the MCP docs for setup guidance when creating sources.
 */
export interface SourceGuideFrontmatter {
    domains?: string[];
    providers?: string[];
}
export interface ParsedSourceGuide {
    frontmatter: SourceGuideFrontmatter;
    knowledge: string;
    setupHints: string;
    raw: string;
}
/**
 * Parse a source guide into its components.
 * Splits on <!-- SETUP: --> marker.
 */
export declare function parseSourceGuide(content: string): ParsedSourceGuide;
/**
 * Extract the primary domain from a URL.
 * e.g., "https://mcp.linear.app/foo" -> "linear.app"
 */
export declare function extractDomainFromUrl(url: string): string | null;
/**
 * Extract domain from a source config for guide matching.
 */
export declare function extractDomainFromSource(source: {
    type?: string;
    provider?: string;
    mcp?: {
        url?: string;
    };
    api?: {
        baseUrl?: string;
    };
}): string | null;
/**
 * @deprecated Bundled guides have been removed.
 * Use the craft-agents-docs MCP server to search for setup guides.
 *
 * Example: mcp__craft-agents-docs__SearchCraftAgents({ query: "github source setup guide" })
 */
export declare function getSourceGuideForDomain(_domain: string): ParsedSourceGuide | null;
/**
 * @deprecated Bundled guides have been removed.
 * Use the craft-agents-docs MCP server to search for setup guides.
 */
export declare function getSourceGuide(_source: {
    type?: string;
    provider?: string;
    mcp?: {
        url?: string;
    };
    api?: {
        baseUrl?: string;
    };
}): ParsedSourceGuide | null;
/**
 * @deprecated Bundled guides have been removed.
 * Use the craft-agents-docs MCP server to search for setup guides.
 */
export declare function getSourceKnowledge(_source: {
    type?: string;
    provider?: string;
    mcp?: {
        url?: string;
    };
    api?: {
        baseUrl?: string;
    };
}): string | null;
