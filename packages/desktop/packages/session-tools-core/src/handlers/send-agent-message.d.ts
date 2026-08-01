import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SendAgentMessageArgs {
    sessionId: string;
    message: string;
    attachments?: Array<{
        path: string;
        name?: string;
    }>;
}
export declare function handleSendAgentMessage(ctx: SessionToolContext, args: SendAgentMessageArgs): Promise<ToolResult>;
