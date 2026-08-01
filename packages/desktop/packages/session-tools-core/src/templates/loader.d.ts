/**
 * Template Loader
 *
 * Discovers and loads HTML templates from source directories.
 * Parses self-describing header comments for metadata and validation.
 *
 * Template header format:
 * <!--
 *   @template issue-detail
 *   @name Issue Detail
 *   @description Renders a single Linear issue
 *   @required identifier, title, status
 *   @optional priority, assignee, team
 * -->
 */
export interface TemplateMeta {
    /** Template identifier (from @template) */
    id: string;
    /** Human-readable name (from @name) */
    name: string;
    /** Description of what the template renders (from @description) */
    description: string;
    /** Required data fields (from @required) */
    required: string[];
    /** Optional data fields (from @optional) */
    optional: string[];
}
export interface LoadedTemplate {
    /** Parsed metadata from the header comment */
    meta: TemplateMeta;
    /** Raw HTML template content (including header comment) */
    content: string;
    /** Absolute path to the template file */
    filePath: string;
}
export interface ValidationWarning {
    field: string;
    message: string;
}
/**
 * Parse the HTML comment header to extract template metadata.
 * Returns null if no valid header is found.
 */
export declare function parseTemplateHeader(content: string): TemplateMeta | null;
/**
 * Load a specific template from a source's templates directory.
 *
 * @param sourcePath - Absolute path to the source directory (e.g., ~/.craft-agent/workspaces/ws/sources/linear)
 * @param templateId - The template identifier (e.g., "issue-detail")
 * @returns The loaded template, or null if not found
 */
export declare function loadTemplate(sourcePath: string, templateId: string): LoadedTemplate | null;
/**
 * List all available templates for a source.
 *
 * @param sourcePath - Absolute path to the source directory
 * @returns Array of template metadata (without content, for efficiency)
 */
export declare function listTemplates(sourcePath: string): TemplateMeta[];
/**
 * Validate data against a template's @required fields.
 * Returns warnings for missing required fields.
 * Always non-blocking — the template should still be rendered.
 */
export declare function validateTemplateData(meta: TemplateMeta, data: Record<string, unknown>): ValidationWarning[];
