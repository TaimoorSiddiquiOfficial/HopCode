/**
 * Session ID Validation
 *
 * Security utilities for validating session IDs to prevent path traversal attacks.
 * Session IDs should only contain letters, numbers, hyphens, and underscores.
 */
/**
 * Validate that a session ID is safe for use in file paths.
 * Throws a SecurityError if the session ID contains path traversal characters.
 *
 * @param sessionId - The session ID to validate
 * @throws Error if sessionId is invalid or contains path traversal
 */
export declare function validateSessionId(sessionId: string): void;
/**
 * Sanitize a session ID by stripping any path components.
 * This is a defense-in-depth measure - validation should happen first.
 *
 * @param sessionId - The session ID to sanitize
 * @returns The sanitized session ID (basename only)
 */
export declare function sanitizeSessionId(sessionId: string): string;
/**
 * Check if a session ID is valid without throwing.
 *
 * @param sessionId - The session ID to check
 * @returns true if valid, false otherwise
 */
export declare function isValidSessionId(sessionId: string): boolean;
