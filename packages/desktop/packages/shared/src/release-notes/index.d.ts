/**
 * Release Notes Utilities
 *
 * Loads release notes from bundled assets and syncs them to ~/.craft-agent/release-notes/.
 * Follows the same pattern as docs/index.ts.
 *
 * Source content lives in apps/electron/resources/release-notes/*.md.
 */
/**
 * Initialize release notes directory with bundled content.
 * Call at app startup alongside initializeDocs().
 */
export declare function initializeReleaseNotes(): void;
export interface ReleaseNote {
    version: string;
    content: string;
}
/**
 * Get release notes sorted newest-first, limited to the most recent 10.
 */
export declare function getReleaseNotesList(): ReleaseNote[];
/**
 * Get the latest release note version string.
 */
export declare function getLatestReleaseVersion(): string | undefined;
/**
 * Get all release notes combined into a single markdown string.
 * Each version is separated by a horizontal rule.
 */
export declare function getCombinedReleaseNotes(): string;
