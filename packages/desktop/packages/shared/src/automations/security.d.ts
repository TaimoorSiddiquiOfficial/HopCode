/**
 * Security Utilities for Automations
 *
 * Shell sanitization and security-related utilities.
 * Prevents command injection attacks via environment variables.
 */
/**
 * Sanitize a value for safe use in shell environment variables.
 * Escapes characters that could be used for shell injection.
 *
 * @param value - The string value to sanitize
 * @returns Sanitized string safe for shell environment variables
 *
 * @example
 * sanitizeForShell('$(rm -rf /)') // Returns '\\$(rm -rf /)'
 * sanitizeForShell('`whoami`')    // Returns '\\`whoami\\`'
 */
export declare function sanitizeForShell(value: string): string;
