/**
 * Config Validate Handler
 *
 * Validates HopCode configuration files.
 * Uses full validators if available, otherwise basic validation.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface ConfigValidateArgs {
    target: 'config' | 'sources' | 'statuses' | 'preferences' | 'permissions' | 'automations' | 'tool-icons' | 'all';
    sourceSlug?: string;
}
/**
 * Handle the config_validate tool call.
 *
 * If ctx.validators is available, uses full Zod validators.
 * Otherwise falls back to basic JSON field checking.
 */
export declare function handleConfigValidate(ctx: SessionToolContext, args: ConfigValidateArgs): Promise<ToolResult>;
