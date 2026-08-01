import type { APICallError } from 'ai';
export declare namespace ProviderError {
    type ParsedStreamError = {
        type: 'context_overflow';
        message: string;
        responseBody: string;
    } | {
        type: 'api_error';
        message: string;
        isRetryable: false;
        responseBody: string;
    };
    function parseStreamError(input: unknown): ParsedStreamError | undefined;
    type ParsedAPICallError = {
        type: 'context_overflow';
        message: string;
        responseBody?: string;
    } | {
        type: 'api_error';
        message: string;
        statusCode?: number;
        isRetryable: boolean;
        responseHeaders?: Record<string, string>;
        responseBody?: string;
        metadata?: Record<string, string>;
    };
    function parseAPICallError(input: {
        providerID: string;
        error: APICallError;
    }): ParsedAPICallError;
}
