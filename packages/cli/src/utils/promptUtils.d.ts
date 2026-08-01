/**
 * Prompts the user for a secret value (API key, password) with masked output.
 * Each character is echoed as '*'. Handles paste correctly on Windows and Unix.
 *
 * @param prompt - Text to display before the input cursor
 * @returns The entered string
 */
export declare function promptForSecretInput(prompt: string): Promise<string>;
