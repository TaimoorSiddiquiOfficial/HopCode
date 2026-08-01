/**
 * Mention Parsing Utilities
 *
 * Pure string-parsing functions for [bracket] mentions in chat messages.
 * No renderer/browser dependencies — safe to use in any context.
 *
 * Mention types:
 * - Skills:  [skill:slug] or [skill:workspaceId:slug]
 * - Sources: [source:slug]
 * - Files:   [file:path]
 * - Folders: [folder:path]
 */
export declare const WS_ID_CHARS = "[\\w .-]";
export interface ParsedMentions {
    /** Skill slugs mentioned via [skill:slug] */
    skills: string[];
    /** Invalid skill slugs mentioned but not found in availableSkillSlugs */
    invalidSkills: string[];
    /** Source slugs mentioned via [source:slug] */
    sources: string[];
    /** File paths mentioned via [file:path] */
    files: string[];
    /** Folder paths mentioned via [folder:path] */
    folders: string[];
}
/**
 * Parse all mentions from message text
 *
 * @param text - The message text to parse
 * @param availableSkillSlugs - Valid skill slugs to match against
 * @param availableSourceSlugs - Valid source slugs to match against
 * @returns Parsed mentions by type
 *
 * @example
 * parseMentions('[skill:commit] [source:linear]', ['commit'], ['linear'])
 * // Returns: { skills: ['commit'], sources: ['linear'] }
 */
export declare function parseMentions(text: string, availableSkillSlugs: string[], availableSourceSlugs: string[]): ParsedMentions;
/**
 * Strip all mentions from text, replacing skill/source mentions with their slug.
 *
 * @param text - The message text with mentions
 * @returns Text with skill/source mentions replaced by their slug
 *
 * @deprecated Prefer resolveSkillMentions + resolveSourceMentions for richer output.
 */
export declare function stripAllMentions(text: string): string;
/**
 * Resolve skill mentions to semantic markers with display names.
 *
 * [skill:datadog-api]           → [Mentioned skill: Datadog API (slug: datadog-api)]
 * [skill:My Workspace:commit]   → [Mentioned skill: Git Commit (slug: commit)]
 *
 * Skills not found in the map fall back to the slug as display name.
 *
 * @param text - The message text with skill mentions
 * @param skillNames - Map of slug → display name (from loaded skill metadata)
 */
export declare function resolveSkillMentions(text: string, skillNames: Map<string, string>): string;
/**
 * Resolve source mentions to semantic markers.
 *
 * [source:github] → [Mentioned source: github]
 *
 * @param text - The message text with source mentions
 */
export declare function resolveSourceMentions(text: string): string;
/**
 * Resolve file and folder mentions to semantic markers with absolute paths.
 *
 * [file:src/index.ts]       → [Mentioned file: index.ts (at /Users/me/project/src/index.ts)]
 * [folder:src/components]   → [Mentioned folder: components (at /Users/me/project/src/components)]
 * [file:/tmp/test.txt]      → [Mentioned file: test.txt (at /tmp/test.txt)]
 *
 * The semantic wrapper signals to the agent that the user explicitly referenced
 * this file/folder and it should be proactively read. This matches the
 * [Attached file: ...] pattern used by drag-and-drop attachments.
 *
 * Leaves other mention types ([skill:...], [source:...]) untouched.
 */
export declare function resolveFileMentions(text: string, workingDirectory: string): string;
