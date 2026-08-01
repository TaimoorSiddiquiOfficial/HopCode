/**
 * Credential Prompt Handler
 *
 * Prompts the user to enter credentials for a source via the secure input UI.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult, CredentialInputMode } from '../types.ts';
export interface CredentialPromptArgs {
    sourceSlug: string;
    mode: CredentialInputMode;
    labels?: {
        credential?: string;
        username?: string;
        password?: string;
    };
    description?: string;
    hint?: string;
    /** Header names for multi-header auth (e.g., ["DD-API-KEY", "DD-APPLICATION-KEY"]) */
    headerNames?: string[];
    passwordRequired?: boolean;
}
/**
 * Handle the source_credential_prompt tool call.
 *
 * 1. Validate mode and parameters
 * 2. Load source config for name
 * 3. Build auth request with all provided options
 * 4. Trigger auth request (will cause forceAbort)
 */
export declare function handleCredentialPrompt(ctx: SessionToolContext, args: CredentialPromptArgs): Promise<ToolResult>;
