import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SetSessionLabelsArgs {
    sessionId?: string;
    labels: string[];
}
export declare function handleSetSessionLabels(ctx: SessionToolContext, args: SetSessionLabelsArgs): Promise<ToolResult>;
