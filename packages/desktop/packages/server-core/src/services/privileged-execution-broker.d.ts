import type { Logger } from '../runtime/platform';
export interface PrivilegedExecutionRequest {
    requestId: string;
    sessionId: string;
    command: string;
    commandHash: string;
    reason?: string;
    impact?: string;
    approvalTtlSeconds: number;
    createdAt: number;
    expiresAt: number;
}
/**
 * PrivilegedExecutionBroker
 *
 * Owns privileged-execution approval binding and auditing.
 * Execution itself is delegated to backend tool execution paths.
 */
export declare class PrivilegedExecutionBroker {
    private logger;
    private pending;
    constructor(logger: Logger);
    createRequest(input: {
        requestId: string;
        sessionId: string;
        command: string;
        reason?: string;
        impact?: string;
        approvalTtlSeconds?: number;
    }): PrivilegedExecutionRequest;
    resolveApproval(requestId: string, approved: boolean, options?: {
        expectedCommandHash?: string;
    }): {
        ok: boolean;
        reason?: string;
        request?: PrivilegedExecutionRequest;
    };
    private hashCommand;
    private validatePolicy;
    auditEvent(event: string, payload: Record<string, unknown>): void;
    private appendAudit;
}
