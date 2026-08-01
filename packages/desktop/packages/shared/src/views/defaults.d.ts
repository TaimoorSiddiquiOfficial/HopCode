/**
 * Default Views
 *
 * Built-in views provided to new workspaces (or when views.json is missing).
 * Users can modify or remove these — they're just the starting point.
 */
import type { ViewConfig } from './types.ts';
/**
 * Default views seeded into views.json.
 * Each represents a common session state that users want to see at a glance.
 */
export declare function getDefaultViews(): ViewConfig[];
