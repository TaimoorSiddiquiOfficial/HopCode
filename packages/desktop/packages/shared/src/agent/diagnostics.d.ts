/**
 * Error diagnostics for backend failures.
 *
 * HopCode is the only built-in backend, so diagnostics focus on captured
 * HTTP failures and the raw process error text.
 */
import type { LlmProviderType } from '../config/llm-connections.ts';
export type DiagnosticCode = 'billing_error' | 'token_expired' | 'invalid_credentials' | 'rate_limited' | 'mcp_unreachable' | 'service_unavailable' | 'unknown_error';
export interface DiagnosticResult {
    code: DiagnosticCode;
    title: string;
    message: string;
    details: string[];
}
interface DiagnosticConfig {
    authType?: string;
    workspaceId?: string;
    rawError: string;
    providerType?: LlmProviderType;
    baseUrl?: string;
}
export declare function runErrorDiagnostics(config: DiagnosticConfig): Promise<DiagnosticResult>;
export {};
