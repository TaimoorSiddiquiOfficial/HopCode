/**
 * Workspace Storage
 *
 * CRUD operations for workspaces.
 * Workspaces can be stored anywhere on disk via rootPath.
 * Default location: ~/.craft-agent/workspaces/
 */
import { CONFIG_DIR } from '../config/paths.ts';
import type { WorkspaceConfig, LoadedWorkspace, WorkspaceSummary } from './types.ts';
declare const DEFAULT_WORKSPACES_DIR: string;
/**
 * Get the default workspaces directory (~/.craft-agent/workspaces/)
 */
export declare function getDefaultWorkspacesDir(): string;
/**
 * Ensure default workspaces directory exists
 */
export declare function ensureDefaultWorkspacesDir(): void;
/**
 * Get workspace root path from ID
 * @param workspaceId - Workspace ID
 * @returns Absolute path to workspace root in default location
 */
export declare function getWorkspacePath(workspaceId: string): string;
/**
 * Get path to workspace sources directory
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function getWorkspaceSourcesPath(rootPath: string): string;
/**
 * Get path to workspace sessions directory
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function getWorkspaceSessionsPath(rootPath: string): string;
/**
 * Get path to workspace skills directory
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function getWorkspaceSkillsPath(rootPath: string): string;
/**
 * Load workspace config.json from a workspace folder
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function loadWorkspaceConfig(rootPath: string): WorkspaceConfig | null;
/**
 * Save workspace config.json to a workspace folder
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function saveWorkspaceConfig(rootPath: string, config: WorkspaceConfig): void;
/**
 * Load workspace with summary info from a rootPath
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function loadWorkspace(rootPath: string): LoadedWorkspace | null;
/**
 * Get workspace summary from a rootPath
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function getWorkspaceSummary(rootPath: string): WorkspaceSummary | null;
/**
 * Generate URL-safe slug from name
 */
export declare function generateSlug(name: string): string;
/**
 * Generate a unique folder path for a workspace by appending a numeric suffix
 * if the slug-based folder already exists.
 * E.g., "my-workspace", "my-workspace-2", "my-workspace-3", ...
 *
 * @param name - Display name to derive the slug from
 * @param baseDir - Parent directory where workspace folders live (e.g., ~/.craft-agent/workspaces/)
 * @returns Full path to a unique, non-existing folder
 */
export declare function generateUniqueWorkspacePath(name: string, baseDir: string): string;
/**
 * Create workspace folder structure at a given path
 * @param rootPath - Absolute path where workspace folder will be created
 * @param name - Display name for the workspace
 * @param defaults - Optional default settings for new sessions
 * @returns The created WorkspaceConfig
 */
export declare function createWorkspaceAtPath(rootPath: string, name: string, defaults?: WorkspaceConfig['defaults'], metadata?: Pick<WorkspaceConfig, 'kind' | 'isProtected'>): WorkspaceConfig;
/**
 * Delete a workspace folder and all its contents
 * @param rootPath - Absolute path to workspace root folder
 */
export declare function deleteWorkspaceFolder(rootPath: string): boolean;
/**
 * Check if a valid workspace exists at a path
 * @param rootPath - Absolute path to check
 */
export declare function isValidWorkspace(rootPath: string): boolean;
/**
 * Rename a workspace (updates config.json in the workspace folder)
 * @param rootPath - Absolute path to workspace root folder
 * @param newName - New display name
 */
export declare function renameWorkspaceFolder(rootPath: string, newName: string): boolean;
/**
 * Discover workspace folders in the default location that have valid config.json
 * Returns paths to valid workspaces found in ~/.craft-agent/workspaces/
 */
export declare function discoverWorkspacesInDefaultLocation(): string[];
/**
 * Get the color theme setting for a workspace.
 * Returns undefined if workspace uses the app default.
 *
 * @param rootPath - Absolute path to workspace root folder
 * @returns Theme ID or undefined (inherit from app default)
 */
export declare function getWorkspaceColorTheme(rootPath: string): string | undefined;
/**
 * Set the color theme for a workspace.
 * Pass undefined to clear and use app default.
 *
 * @param rootPath - Absolute path to workspace root folder
 * @param themeId - Preset theme ID or undefined to inherit
 */
export declare function setWorkspaceColorTheme(rootPath: string, themeId: string | undefined): void;
/**
 * Check if local (stdio) MCP servers are enabled for a workspace.
 * Resolution order: ENV (CRAFT_LOCAL_MCP_ENABLED) > workspace config > default (true)
 *
 * @param rootPath - Absolute path to workspace root folder
 * @returns true if local MCP servers should be enabled
 */
export declare function isLocalMcpEnabled(rootPath: string): boolean;
export { CONFIG_DIR, DEFAULT_WORKSPACES_DIR };
