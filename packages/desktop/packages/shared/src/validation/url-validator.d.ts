import type { AgentError } from '../agent/errors.ts';
export interface UrlValidationResult {
    valid: boolean;
    error?: string;
    typedError?: AgentError;
}
export declare function validateMcpUrl(url: string): Promise<UrlValidationResult>;
