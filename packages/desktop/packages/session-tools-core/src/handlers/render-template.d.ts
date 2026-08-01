/**
 * Render Template Handler
 *
 * Renders HTML templates with data using Mustache syntax.
 * Templates are stored per-source in the workspace.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface RenderTemplateArgs {
    source: string;
    template: string;
    data: Record<string, unknown>;
}
/**
 * Handle the render_template tool call.
 *
 * 1. Validates source and template exist
 * 2. Soft-validates data against template @required fields
 * 3. Renders template with Mustache
 * 4. Writes output HTML to session data folder
 * 5. Returns absolute path for use in html-preview blocks
 */
export declare function handleRenderTemplate(ctx: SessionToolContext, args: RenderTemplateArgs): Promise<ToolResult>;
