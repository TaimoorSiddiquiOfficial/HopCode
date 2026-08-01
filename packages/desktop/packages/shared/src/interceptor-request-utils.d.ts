/**
 * Resolve method/body/headers from fetch(input, init), including Request inputs.
 */
export declare function resolveRequestContext(input: string | URL | Request, init?: RequestInit): Promise<{
    bodyStr?: string;
    normalizedInit: RequestInit;
}>;
