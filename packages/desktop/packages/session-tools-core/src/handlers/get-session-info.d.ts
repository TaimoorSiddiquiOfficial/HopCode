import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface GetSessionInfoArgs {
    sessionId?: string;
}
export declare function handleGetSessionInfo(ctx: SessionToolContext, args: GetSessionInfoArgs): Promise<ToolResult>;
