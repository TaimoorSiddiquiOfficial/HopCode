/**
 * Path Portability Utilities
 *
 * Functions for making filesystem paths portable across machines.
 * Supports ~ and ${HOME} path variables for cross-machine compatibility.
 */
/**
 * Expand path variables (~, ${HOME}, $HOME) to absolute paths.
 *
 * @param inputPath - Path that may contain variables
 * @param basePath - Base path for relative path resolution (defaults to cwd)
 * @returns Absolute path with all variables expanded
 *
 * @example
 * expandPath('~')                    // '/Users/alice'
 * expandPath('~/Documents')          // '/Users/alice/Documents'
 * expandPath('${HOME}/projects')     // '/Users/alice/projects'
 * expandPath('/absolute/path')       // '/absolute/path' (unchanged)
 */
export declare function expandPath(inputPath: string, basePath?: string): string;
/**
 * Convert absolute path to portable form.
 * If path is within home directory, converts to ~ prefix.
 *
 * @param absolutePath - Absolute path to convert
 * @returns Portable path (with ~ prefix if in home) or original if outside home
 *
 * @example
 * toPortablePath('/Users/alice')           // '~'
 * toPortablePath('/Users/alice/Documents') // '~/Documents'
 * toPortablePath('/var/log')               // '/var/log' (unchanged)
 */
export declare function toPortablePath(absolutePath: string): string;
/**
 * Check if a path contains unexpanded variables.
 */
export declare function hasPathVariables(path: string): boolean;
/**
 * Check if a path is already portable (has ~ prefix or is relative).
 */
export declare function isPortablePath(path: string): boolean;
/**
 * Normalize a path to use forward slashes for consistent cross-platform comparison.
 * Use this before comparing paths or using regex patterns on paths.
 *
 * @example
 * normalizePath('C:\\Users\\foo\\bar') // 'C:/Users/foo/bar'
 * normalizePath('/Users/foo/bar')      // '/Users/foo/bar' (unchanged)
 */
export declare function normalizePath(path: string): string;
/**
 * Normalize a path for cross-platform comparison.
 * - Resolve to absolute
 * - Convert backslashes to forward slashes
 * - Lowercase on Windows
 */
export declare function normalizePathForComparison(path: string): string;
/**
 * Check if a file path starts with a directory path (cross-platform).
 * Handles both Windows backslashes and Unix forward slashes.
 *
 * @example
 * pathStartsWith('C:\\Users\\foo\\file.txt', 'C:\\Users\\foo') // true
 * pathStartsWith('/home/user/file.txt', '/home/user')          // true
 * pathStartsWith('/home/user2/file.txt', '/home/user')         // false
 */
export declare function pathStartsWith(filePath: string, dirPath: string): boolean;
/**
 * Strip a directory prefix from a path (cross-platform).
 * Returns the relative path portion after the prefix.
 *
 * @example
 * stripPathPrefix('/home/user/docs/file.txt', '/home/user') // 'docs/file.txt'
 * stripPathPrefix('C:\\foo\\bar\\baz.txt', 'C:\\foo')       // 'bar/baz.txt'
 */
export declare function stripPathPrefix(filePath: string, prefix: string): string;
/**
 * Register the Electron main process directory as the root for bundled assets.
 * Call this once at app startup: setBundledAssetsRoot(__dirname)
 *
 * After this, getBundledAssetsDir('docs') will resolve to `<__dirname>/resources/docs/`
 * in the packaged app, or fall back to dev paths if that doesn't exist.
 */
export declare function setBundledAssetsRoot(dir: string): void;
/**
 * Resolve the path to a bundled assets subdirectory.
 *
 * All bundled assets now live in resources/ which electron-builder handles natively.
 * Tries candidates in order:
 * 1. Electron packaged app: <assetsRoot>/resources/<subfolder>
 * 2. Dev: electron app resources folder (when running from apps/electron)
 * 3. Dev: dist output (after build:copy)
 *
 * Returns the first candidate that exists on disk, or undefined if none found.
 *
 * @param subfolder - Name of the assets subdirectory (e.g. 'docs', 'tool-icons', 'themes', 'permissions')
 */
export declare function getBundledAssetsDir(subfolder: string): string | undefined;
