/**
 * Check whether targetPath is baseDir or a child path of baseDir.
 */
export declare function isPathInsideOrEqual(baseDir: string, targetPath: string): boolean;
/**
 * Lexical + symlink-aware containment check for existing paths.
 */
export declare function isPathWithinDirectory(targetPath: string, baseDir: string): boolean;
/**
 * Containment check for output/creation paths.
 *
 * Prevents symlink escapes by validating the nearest existing ancestor's real path.
 */
export declare function isPathWithinDirectoryForCreation(targetPath: string, baseDir: string): boolean;
