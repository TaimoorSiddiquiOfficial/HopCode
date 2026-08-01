import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface ListSessionsArgs {
    status?: string;
    label?: string;
    search?: string;
    sortBy?: 'recent' | 'name' | 'status';
    limit?: number;
    offset?: number;
}
export declare function handleListSessions(ctx: SessionToolContext, args: ListSessionsArgs): Promise<ToolResult>;
