/**
 * Send Developer Feedback Handler
 *
 * Persists freeform markdown feedback from the agent to the development team.
 * Uses an injected submitFeedback callback to avoid depending on fs paths directly.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SendDeveloperFeedbackArgs {
    message: string;
}
/**
 * Handle the send_developer_feedback tool call.
 *
 * Validates the message, generates a unique ID, and delegates to the
 * context-provided submitFeedback callback for persistence.
 */
export declare function handleSendDeveloperFeedback(ctx: SessionToolContext, args: SendDeveloperFeedbackArgs): Promise<ToolResult>;
