import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface ScriptSandboxArgs {
    language: 'python3' | 'node' | 'bun';
    script: string;
    inputFiles?: string[];
    stdin?: string;
    timeoutMs?: number;
}
export declare function handleScriptSandbox(ctx: SessionToolContext, args: ScriptSandboxArgs): Promise<ToolResult>;
