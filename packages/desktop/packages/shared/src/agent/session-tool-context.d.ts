/**
 * Session Tool Context Factory
 *
 * Creates a SessionToolContext implementation with full access
 * to Electron internals, credential managers, MCP validation, etc.
 *
 * This enables the shared handlers in session-tools-core to work with
 * the app's full feature set.
 */
import type { SessionToolContext } from '@craft-agent/session-tools-core';
export type { SessionToolContext, SessionToolCallbacks } from '@craft-agent/session-tools-core';
/**
 * Options for creating a session tool context
 */
export interface SessionToolContextOptions {
    sessionId: string;
    workspacePath: string;
    workspaceId: string;
    onPlanSubmitted: (planPath: string) => void;
    onAuthRequest: (request: unknown) => void;
}
/**
 * Create a SessionToolContext with full capabilities.
 *
 * This provides:
 * - Full file system access
 * - Full Zod validators
 * - Credential manager with keychain access
 * - MCP connection validation
 * - Icon management
 */
export declare function createSessionToolContext(options: SessionToolContextOptions): SessionToolContext;
