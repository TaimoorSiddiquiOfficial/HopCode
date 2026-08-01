/**
 * Shared authentication validation utilities
 * Used by both CredentialRequest and AuthRequestCard components
 */
/**
 * Validate basic auth credentials based on whether password is required
 *
 * @param username - The username/API key value
 * @param password - The password value
 * @param passwordRequired - Whether password field is required (defaults to true for backward compatibility)
 * @returns true if credentials are valid, false otherwise
 */
export declare function validateBasicAuthCredentials(username: string, password: string, passwordRequired?: boolean): boolean;
/**
 * Get the password value to submit based on whether it's required
 * When password is not required, always submit empty string regardless of field content
 *
 * @param password - The password field value
 * @param passwordRequired - Whether password is required
 * @returns The password value to submit (trimmed or empty string)
 */
export declare function getPasswordValue(password: string, passwordRequired?: boolean): string;
/**
 * Get the password label with optional suffix
 *
 * @param baseLabel - The base label (e.g., "Password")
 * @param passwordRequired - Whether password is required
 * @returns The label with " (optional)" suffix if not required
 */
export declare function getPasswordLabel(baseLabel: string, passwordRequired?: boolean): string;
/**
 * Get the password placeholder text
 *
 * @param baseLabel - The base label (e.g., "Password")
 * @param passwordRequired - Whether password is required
 * @returns Appropriate placeholder text
 */
export declare function getPasswordPlaceholder(baseLabel: string, passwordRequired?: boolean): string;
