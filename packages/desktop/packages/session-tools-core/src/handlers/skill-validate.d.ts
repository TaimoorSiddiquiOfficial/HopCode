/**
 * Skill Validate Handler
 *
 * Validates a skill's SKILL.md file for correct format and required fields.
 * Resolves skills from all three tiers: project > workspace > global.
 *
 * The handler resolves the session's workingDirectory on demand from the
 * persisted session.jsonl header — no construction-time propagation needed.
 * If resolution fails, project-tier skills are silently skipped with a warning.
 */
import type { SessionToolContext } from '../context.ts';
import type { ToolResult } from '../types.ts';
export interface SkillValidateArgs {
    skillSlug: string;
}
/**
 * Handle the skill_validate tool call.
 *
 * 1. Validate slug format
 * 2. Resolve workingDirectory from ctx or session header (graceful fallback)
 * 3. Resolve SKILL.md from all three tiers (project > workspace > global)
 * 4. Read and validate content (frontmatter + body)
 * 5. Return validation result with warnings if project tier was skipped
 */
export declare function handleSkillValidate(ctx: SessionToolContext, args: SkillValidateArgs): Promise<ToolResult>;
