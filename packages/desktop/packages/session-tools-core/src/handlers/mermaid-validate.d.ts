/**
 * Mermaid Validate Handler
 *
 * Validates Mermaid diagram syntax using beautiful-mermaid parser.
 * No DOM required - works identically across runtimes.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface MermaidValidateArgs {
    code: string;
}
/**
 * Handle the mermaid_validate tool call.
 *
 * Uses parseMermaid from beautiful-mermaid to validate syntax.
 * If parsing succeeds, the diagram is valid.
 * If parsing throws, returns the error message.
 */
export declare function handleMermaidValidate(_ctx: SessionToolContext, args: MermaidValidateArgs): Promise<ToolResult>;
