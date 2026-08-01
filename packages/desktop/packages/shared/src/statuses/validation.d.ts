/**
 * Status Validation
 *
 * Runtime validation for session status IDs.
 * Ensures sessions always have valid status references.
 */
/**
 * Validate and normalize a session's status
 * If invalid or undefined, returns 'todo' as fallback
 *
 * @param workspaceRootPath - Workspace root path
 * @param sessionStatus - Status ID to validate
 * @returns Valid status ID (or 'todo' fallback)
 */
export declare function validateSessionStatus(workspaceRootPath: string, sessionStatus: string | undefined): string;
