/**
 * Workspace Module
 *
 * Re-exports types and storage functions for workspaces.
 */
export type { WorkspaceConfig, CreateWorkspaceInput, LoadedWorkspace, WorkspaceSummary, } from './types.ts';
export { getDefaultWorkspacesDir, ensureDefaultWorkspacesDir, getWorkspacePath, getWorkspaceSourcesPath, getWorkspaceSessionsPath, getWorkspaceSkillsPath, loadWorkspaceConfig, saveWorkspaceConfig, loadWorkspace, getWorkspaceSummary, generateSlug, generateUniqueWorkspacePath, createWorkspaceAtPath, deleteWorkspaceFolder, isValidWorkspace, renameWorkspaceFolder, discoverWorkspacesInDefaultLocation, CONFIG_DIR, DEFAULT_WORKSPACES_DIR, } from './storage.ts';
