/**
 * ConfigValidator - Pre-Write Configuration Validation
 *
 * Provides validation utilities for configuration files before writing.
 * Backend agents can use this to validate Write/Edit tool
 * inputs before they modify config files.
 *
 * Key responsibilities:
 * - Validate JSON syntax before writing
 * - Detect config file types by path/extension
 * - Provide helpful error messages for malformed configs
 */
import type { ConfigValidationResult, ConfigFileType, ConfigValidatorConfig } from './types.ts';
/**
 * ConfigValidator provides pre-write validation for config files.
 *
 * Usage:
 * ```typescript
 * const validator = new ConfigValidator();
 *
 * // Check file type before writing
 * const fileType = validator.getConfigType('/path/to/config.json');
 *
 * // Validate content before writing
 * const result = validator.validateContent('/path/to/config.json', newContent);
 * if (!result.valid) {
 *   // Show errors to user/agent
 * }
 * ```
 */
export declare class ConfigValidator {
    private config;
    constructor(config?: ConfigValidatorConfig);
    /**
     * Detect the config file type based on path/extension.
     *
     * @param filePath - Path to the file
     * @returns Config type or null if not a known config format
     */
    getConfigType(filePath: string): ConfigFileType;
    /**
     * Check if a file path is a HopCode config file.
     *
     * @param filePath - Path to check
     * @returns true if this is a HopCode config
     */
    isCraftAgentConfig(filePath: string): boolean;
    /**
     * Validate content before writing to a config file.
     * Detects the file type from the path and validates accordingly.
     *
     * @param filePath - Path to the file being written
     * @param content - Content to validate
     * @returns Validation result with errors/warnings
     */
    validateContent(filePath: string, content: string): ConfigValidationResult;
    /**
     * Validate JSON content.
     *
     * @param content - JSON string to validate
     * @returns Validation result
     */
    validateJson(content: string): ConfigValidationResult;
    /**
     * Validate TOML content (basic syntax check).
     * Note: Full TOML validation would require a TOML parser.
     *
     * @param content - TOML string to validate
     * @returns Validation result
     */
    validateToml(content: string): ConfigValidationResult;
    /**
     * Validate YAML content (basic syntax check).
     * Note: Full YAML validation would require a YAML parser.
     *
     * @param content - YAML string to validate
     * @returns Validation result
     */
    validateYaml(content: string): ConfigValidationResult;
    /**
     * Get line and column number from a character position.
     */
    private getLineColumn;
    /**
     * Format validation errors for display.
     *
     * @param result - Validation result
     * @param filePath - Path to the file (for context)
     * @returns Formatted error string
     */
    formatErrors(result: ConfigValidationResult, filePath?: string): string;
}
