export { extractWorkspaceSlugFromPath } from './workspace-slug.ts';
/**
 * Extract workspace slug for skill qualification.
 *
 * NOTE: Requires Node.js (fs/path). For browser contexts, use extractWorkspaceSlugFromPath
 * from './workspace-slug.ts' instead.
 */
export declare function extractWorkspaceSlug(rootPath: string, fallbackId: string): string;
