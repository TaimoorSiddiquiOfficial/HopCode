/**
 * Skills Storage
 *
 * CRUD operations for workspace skills.
 * Skills are stored in {workspace}/skills/{slug}/ directories.
 */
import type { LoadedSkill } from './types.ts';
/** Global agent skills directory: ~/.agents/skills/ */
export declare const GLOBAL_AGENT_SKILLS_DIR: string;
/** Global HopCode skills directory: ~/.hopcode/skills/ */
export declare const GLOBAL_HOPCODE_SKILLS_DIR: string;
/** Project-level agent skills relative directory name */
export declare const PROJECT_AGENT_SKILLS_DIR = ".agents/skills";
/** Project-level HopCode skills relative directory name */
export declare const PROJECT_HOPCODE_SKILLS_DIR = ".hopcode/skills";
/**
 * Load a single skill from a workspace
 * @param workspaceRoot - Absolute path to workspace root
 * @param slug - Skill directory name
 */
export declare function loadSkill(workspaceRoot: string, slug: string): LoadedSkill | null;
/**
 * Load all skills from a workspace
 * @param workspaceRoot - Absolute path to workspace root
 */
export declare function loadWorkspaceSkills(workspaceRoot: string): LoadedSkill[];
/** Invalidate the skills cache (call on working dir change or skill file events). */
export declare function invalidateSkillsCache(): void;
/**
 * Load all skills from all sources (global, workspace, project)
 * Skills with the same slug are overridden by higher-priority sources.
 * Priority: global (lowest) < workspace < project (highest)
 *
 * Results are cached per (workspaceRoot, projectRoot) pair. Call
 * invalidateSkillsCache() on working directory changes or skill file events.
 *
 * @param workspaceRoot - Absolute path to workspace root
 * @param projectRoot - Optional project root (working directory) for project-level skills
 */
export declare function loadAllSkills(workspaceRoot: string, projectRoot?: string): LoadedSkill[];
/**
 * Load a single skill by slug from all sources (project > workspace > global).
 * Unlike loadAllSkills(), this only reads the specific slug directory — O(1) not O(N).
 *
 * @param workspaceRoot - Absolute path to workspace root
 * @param slug - Skill slug to load
 * @param projectRoot - Optional project root for project-level skills
 */
export declare function loadSkillBySlug(workspaceRoot: string, slug: string, projectRoot?: string): LoadedSkill | null;
/**
 * Get icon path for a skill
 * @param workspaceRoot - Absolute path to workspace root
 * @param slug - Skill directory name
 */
export declare function getSkillIconPath(workspaceRoot: string, slug: string): string | null;
/**
 * Delete a skill from a workspace
 * @param workspaceRoot - Absolute path to workspace root
 * @param slug - Skill directory name
 */
export declare function deleteSkill(workspaceRoot: string, slug: string): boolean;
/**
 * Check if a skill exists in a workspace
 * @param workspaceRoot - Absolute path to workspace root
 * @param slug - Skill directory name
 */
export declare function skillExists(workspaceRoot: string, slug: string): boolean;
/**
 * List skill slugs in a workspace
 * @param workspaceRoot - Absolute path to workspace root
 */
export declare function listSkillSlugs(workspaceRoot: string): string[];
/**
 * Download an icon from a URL and save it to the skill directory.
 * Returns the path to the downloaded icon, or null on failure.
 */
export declare function downloadSkillIcon(skillDir: string, iconUrl: string): Promise<string | null>;
/**
 * Check if a skill needs its icon downloaded.
 * Returns true if metadata has a URL icon and no local icon file exists.
 */
export declare function skillNeedsIconDownload(skill: LoadedSkill): boolean;
export { isIconUrl } from '../utils/icon.ts';
