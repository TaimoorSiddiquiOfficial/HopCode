import { type Stats } from 'fs';
export interface PathValidationResult {
    valid: boolean;
    reason?: string;
}
type StatLike = (path: string) => Stats;
/**
 * Validate path format for the current server platform (no filesystem access).
 * Rejects cross-platform paths (e.g., Windows paths on macOS and vice versa).
 * Platform is injectable for cross-platform unit testing without mocking globals.
 */
export declare function validatePathFormat(path: string, platform?: NodeJS.Platform): PathValidationResult;
/**
 * Validate that a path is a usable working directory on the current server.
 * Checks format, existence, and that the path is a directory.
 */
export declare function isValidWorkingDirectory(path: string, platform?: NodeJS.Platform, statFn?: StatLike): PathValidationResult;
/**
 * Validate that a workspace root path is usable on the current server.
 * Existing directories are allowed. Non-existent paths are allowed only when
 * their parent directory exists, which supports "create new workspace" flows.
 */
export declare function isValidWorkspaceRootPath(path: string, platform?: NodeJS.Platform, statFn?: StatLike): PathValidationResult;
export {};
