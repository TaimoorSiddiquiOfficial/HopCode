/**
 * Automations Config Path Resolver
 */
/**
 * Generate a short 6-character hex ID for matcher identification.
 * Uses crypto.randomBytes for uniqueness (24 bits of entropy = 16M possibilities).
 */
export declare function generateShortId(): string;
/**
 * Resolve the automations config path for a workspace.
 */
export declare function resolveAutomationsConfigPath(workspaceRoot: string): string;
