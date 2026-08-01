/**
 * Typed errors for better error handling and user-friendly messages.
 *
 * These error types map HTTP status codes and error patterns to
 * actionable error information that can be displayed to users.
 */
export type ErrorCode = 'invalid_api_key' | 'invalid_credentials' | 'expired_oauth_token' | 'token_expired' | 'rate_limited' | 'service_error' | 'service_unavailable' | 'network_error' | 'proxy_error' | 'mcp_auth_required' | 'mcp_unreachable' | 'billing_error' | 'model_no_tool_support' | 'invalid_model' | 'data_policy_error' | 'invalid_request' | 'image_too_large' | 'provider_error' | 'unknown_error';
/** Provider info attached to errors for user-facing context */
export interface ProviderInfo {
    name: string;
    statusPageUrl?: string;
    dashboardUrl?: string;
}
export interface RecoveryAction {
    /** Keyboard shortcut (single letter) */
    key: string;
    /** Description of the action */
    label: string;
    /** Slash command to execute (e.g., '/settings') */
    command?: string;
    /** Custom action type for special handling */
    action?: 'retry' | 'settings' | 'reauth' | 'open_url' | 'reconnect_source';
    /** URL to open (for 'open_url' action) */
    url?: string;
    /** Source slug (for 'reconnect_source' action) */
    sourceSlug?: string;
}
export interface AgentError {
    /** Error code for programmatic handling */
    code: ErrorCode;
    /** User-friendly title */
    title: string;
    /** Detailed message explaining what went wrong */
    message: string;
    /** Suggested recovery actions */
    actions: RecoveryAction[];
    /** Whether auto-retry is possible */
    canRetry: boolean;
    /** Retry delay in ms (if canRetry is true) */
    retryDelayMs?: number;
    /** Original error message for debugging */
    originalError?: string;
    /** Diagnostic check results for debugging */
    details?: string[];
    /** Provider info for user-facing context */
    providerInfo?: ProviderInfo;
}
/**
 * Parse an error and return a typed AgentError with user-friendly info
 */
export declare function parseError(error: unknown, providerContext?: {
    providerType?: string;
}): AgentError;
/**
 * Check if an error is a billing/auth error that blocks usage
 */
export declare function isBillingError(error: AgentError): boolean;
/**
 * Check if an error can be automatically retried
 */
export declare function canAutoRetry(error: AgentError): boolean;
/**
 * Parse SDK error text and return a typed AgentError if detected.
 *
 * The SDK emits errors in two distinctive formats:
 * 1. "Error title · Action hint" - using middle dot (·, U+00B7) separator
 *    e.g., "Invalid API key · Fix external API key"
 * 2. "API Error: {status} {json}" - raw API error dump
 *    e.g., "API Error: 402 {"error":{"code":402,"message":"Payment required"}}"
 *
 * Returns null if text is not an SDK error.
 */
export declare function parseSDKErrorText(text: string): AgentError | null;
/**
 * Quick check if text looks like an SDK error (for filtering).
 */
export declare function isSDKErrorText(text: string): boolean;
