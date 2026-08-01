/**
 * Documentation Utilities
 *
 * Provides access to built-in documentation that the agent can reference
 * when performing configuration tasks (sources, agents, permissions, etc.).
 *
 * Docs are stored at ~/.craft-agent/docs/ and synced from bundled assets.
 * Source content lives in apps/electron/resources/docs/*.md for easier editing.
 */
/**
 * Get bundled docs, loading them lazily on first access.
 * This ensures docs are loaded AFTER setBundledAssetsRoot() has been called.
 */
declare function getBundledDocs(): Record<string, string>;
/**
 * Get the docs directory path
 */
export declare function getDocsDir(): string;
/**
 * Get path to a specific doc file
 */
export declare function getDocPath(filename: string): string;
export declare const APP_ROOT = "~/.craft-agent";
/**
 * Documentation file references for use in error messages and tool descriptions.
 * Use these constants instead of hardcoding paths to keep references in sync.
 */
export declare const DOC_REFS: {
    readonly appRoot: "~/.craft-agent";
    readonly sources: "~/.craft-agent/docs/sources.md";
    readonly permissions: "~/.craft-agent/docs/permissions.md";
    readonly skills: "~/.craft-agent/docs/skills.md";
    readonly themes: "~/.craft-agent/docs/themes.md";
    readonly statuses: "~/.craft-agent/docs/statuses.md";
    readonly labels: "~/.craft-agent/docs/labels.md";
    readonly toolIcons: "~/.craft-agent/docs/tool-icons.md";
    readonly automations: "~/.craft-agent/docs/automations.md";
    readonly hooks: "~/.craft-agent/docs/automations.md";
    readonly tasks: "~/.craft-agent/docs/automations.md";
    readonly mermaid: "~/.craft-agent/docs/mermaid.md";
    readonly dataTables: "~/.craft-agent/docs/data-tables.md";
    readonly htmlPreview: "~/.craft-agent/docs/html-preview.md";
    readonly pdfPreview: "~/.craft-agent/docs/pdf-preview.md";
    readonly imagePreview: "~/.craft-agent/docs/image-preview.md";
    readonly llmTool: "~/.craft-agent/docs/llm-tool.md";
    readonly browserTools: "~/.craft-agent/docs/browser-tools.md";
    readonly craftCli: "~/.craft-agent/docs/craft-cli.md";
    readonly docsDir: "~/.craft-agent/docs/";
};
/**
 * Check if docs directory exists
 */
export declare function docsExist(): boolean;
/**
 * List available doc files
 */
export declare function listDocs(): string[];
/**
 * Initialize docs directory with bundled documentation.
 * Always writes all docs on launch to ensure consistency across debug and release modes.
 */
export declare function initializeDocs(): void;
export { getBundledDocs };
export { parseSourceGuide, getSourceGuide, getSourceGuideForDomain, getSourceKnowledge, extractDomainFromSource, extractDomainFromUrl, type ParsedSourceGuide, type SourceGuideFrontmatter, } from './source-guides.ts';
export { getDocUrl, getDocInfo, DOCS, type DocFeature, type DocInfo, } from './doc-links.ts';
