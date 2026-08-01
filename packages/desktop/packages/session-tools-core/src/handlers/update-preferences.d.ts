/**
 * Update User Preferences Handler
 *
 * Updates stored user preferences (name, timezone, location, language, notes).
 * Uses an injected updatePreferences callback to avoid depending on @craft-agent/shared.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface UpdatePreferencesArgs {
    name?: string;
    timezone?: string;
    city?: string;
    region?: string;
    country?: string;
    language?: string;
    notes?: string;
    includeCoAuthoredBy?: boolean;
}
/**
 * Handle the update_user_preferences tool call.
 *
 * Validates and merges preference updates, then delegates to the
 * context-provided updatePreferences callback for actual persistence.
 */
export declare function handleUpdatePreferences(ctx: SessionToolContext, args: UpdatePreferencesArgs): Promise<ToolResult>;
