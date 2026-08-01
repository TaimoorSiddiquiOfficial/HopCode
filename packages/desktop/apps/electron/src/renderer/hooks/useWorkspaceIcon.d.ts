/**
 * useWorkspaceIcon Hook
 *
 * Fetches workspace icons as data URLs for rendering in img tags.
 * Handles file:// to data URL conversion via IPC since Electron's CSP
 * blocks direct file:// URLs in the renderer.
 *
 * Used by settings pages that display workspace icons.
 */
import type { Workspace } from '../../shared/types';
/**
 * Hook to get a workspace icon as a renderable URL.
 *
 * - Remote URLs (http/https) are returned directly
 * - Local file:// URLs are converted to data URLs via IPC
 * - Returns undefined while loading or if no icon exists
 *
 * @param workspace - The workspace object with iconUrl
 * @returns Data URL or remote URL for the icon, or undefined
 */
export declare function useWorkspaceIcon(workspace: Workspace | undefined): string | undefined;
/**
 * Hook to get icons for multiple workspaces at once.
 * More efficient than calling useWorkspaceIcon for each workspace.
 *
 * @param workspaces - Array of workspace objects
 * @returns Map of workspaceId -> icon URL (data URL or remote URL)
 */
export declare function useWorkspaceIcons(workspaces: Workspace[]): Map<string, string>;
