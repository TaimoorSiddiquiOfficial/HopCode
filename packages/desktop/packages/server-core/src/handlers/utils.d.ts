import { type Workspace } from '@craft-agent/shared/config';
import type { PlatformServices } from '../runtime/platform';
/**
 * Get workspace by ID or name, throwing if not found.
 * Use this when a workspace must exist for the operation to proceed.
 */
export declare function getWorkspaceOrThrow(workspaceId: string): Workspace;
export declare function buildBackendHostRuntimeContext(platform: PlatformServices): {
    appRootPath: any;
    resourcesPath: any;
    isPackaged: any;
};
/**
 * Sanitizes a filename to prevent path traversal and filesystem issues.
 * Removes dangerous characters and limits length.
 */
export declare function sanitizeFilename(name: string): string;
/**
 * Resolve allowed directories for a workspace: its root path and configured
 * working directory (if set). Returns an empty array if the workspace is
 * unknown or has no relevant paths.
 */
export declare function getWorkspaceAllowedDirs(workspaceId?: string | null): string[];
/**
 * Validates that a file path is within allowed directories to prevent path traversal attacks.
 * Allowed directories: user's home directory, /tmp, and any additional dirs passed by the caller
 * (e.g. workspace root, workspace working directory).
 */
export declare function validateFilePath(filePath: string, additionalAllowedDirs?: string[]): Promise<string>;
