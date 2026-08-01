/**
 * Session Tools Core - Validation Utilities
 *
 * Shared validation logic for session-scoped tools.
 * Provides portable validation that works in both in-process and subprocess contexts.
 */
import { z } from 'zod';
import type { ValidationResult, ValidationIssue } from './types.ts';
/**
 * Create an empty valid result
 */
export declare function validResult(): ValidationResult;
/**
 * Create an invalid result with a single error
 */
export declare function invalidResult(path: string, message: string, suggestion?: string): ValidationResult;
/**
 * Merge multiple validation results into one
 */
export declare function mergeResults(...results: ValidationResult[]): ValidationResult;
/**
 * Format validation result as human-readable text for tool responses.
 * This is the simplified version used by session tools.
 */
export declare function formatValidationResult(result: ValidationResult): string;
/**
 * Validate JSON file existence and parse it
 */
export declare function readJsonFile(filePath: string): {
    success: true;
    data: unknown;
} | {
    success: false;
    error: string;
};
/**
 * Validate a JSON file has required fields
 */
export declare function validateJsonFileHasFields(filePath: string, requiredFields: string[]): ValidationResult;
/**
 * Convert Zod error to ValidationIssues
 */
export declare function zodErrorToIssues(error: z.ZodError, filePath: string): ValidationIssue[];
/**
 * Regex for valid slugs: lowercase alphanumeric with hyphens
 */
export declare const SLUG_REGEX: RegExp;
/**
 * Validate a slug format
 */
export declare function validateSlug(slug: string): ValidationResult;
/**
 * Zod schema for skill metadata (SKILL.md frontmatter)
 */
export declare const SkillMetadataSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    globs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    alwaysAllow: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    icon: z.ZodOptional<z.ZodString>;
    requiredSources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    name: z.ZodString;
    description: z.ZodString;
    globs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    alwaysAllow: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    icon: z.ZodOptional<z.ZodString>;
    requiredSources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    name: z.ZodString;
    description: z.ZodString;
    globs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    alwaysAllow: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    icon: z.ZodOptional<z.ZodString>;
    requiredSources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, z.ZodTypeAny, "passthrough">>;
/**
 * Validate skill SKILL.md content (without filesystem access).
 * Used by both in-process and subprocess implementations.
 *
 * @param markdownContent - The full SKILL.md file content
 * @param slug - The skill slug (folder name), used for slug format validation
 */
export declare function validateSkillContent(markdownContent: string, slug: string): ValidationResult;
/**
 * Valid mermaid diagram types
 */
export declare const MERMAID_DIAGRAM_TYPES: readonly ["graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram", "erDiagram", "gantt", "pie", "mindmap", "timeline", "gitGraph", "C4Context", "sankey"];
/**
 * Basic mermaid syntax validation (no rendering).
 * Checks for common syntax errors without requiring a browser.
 */
export declare function validateMermaidSyntax(code: string): ValidationResult;
/**
 * Required fields for source config.json
 */
export declare const SOURCE_CONFIG_REQUIRED_FIELDS: string[];
/**
 * Valid source types
 */
export declare const SOURCE_TYPES: readonly ["mcp", "api", "local"];
/**
 * Basic source config validation (schema-level).
 * For full validation with Zod schemas, use the validators from packages/shared.
 */
export declare function validateSourceConfigBasic(config: unknown): ValidationResult;
