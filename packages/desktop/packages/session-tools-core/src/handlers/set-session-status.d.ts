import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SetSessionStatusArgs {
    sessionId?: string;
    status: string;
}
export declare function handleSetSessionStatus(ctx: SessionToolContext, args: SetSessionStatusArgs): Promise<ToolResult>;
