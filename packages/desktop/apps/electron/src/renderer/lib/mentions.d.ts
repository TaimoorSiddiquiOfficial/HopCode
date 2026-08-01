/**
 * Utilities for parsing [bracket] mentions from chat messages
 *
 * Mention types:
 * - Skills:  [skill:slug]
 * - Sources: [source:slug]
 *
 * Bracket syntax allows mentions anywhere in text without word boundaries.
 */
import type { ContentBadge } from '@craft-agent/core';
import type { MentionItemType } from '@/components/ui/mention-menu';
import type { LoadedSkill, LoadedSource } from '../../shared/types';
import { parseMentions, stripAllMentions, resolveSkillMentions, resolveSourceMentions, type ParsedMentions } from '@craft-agent/shared/mentions';
export { parseMentions, stripAllMentions, resolveSkillMentions, resolveSourceMentions, type ParsedMentions };
export interface MentionMatch {
    type: MentionItemType;
    id: string;
    /** Full match text including @ prefix */
    fullMatch: string;
    /** Start index in the original text */
    startIndex: number;
}
/**
 * Find all mention matches in text with their positions
 *
 * @param text - The message text to search
 * @param availableSkillSlugs - Valid skill slugs
 * @param availableSourceSlugs - Valid source slugs
 * @returns Array of mention matches with positions
 */
export declare function findMentionMatches(text: string, availableSkillSlugs: string[], availableSourceSlugs: string[]): MentionMatch[];
/**
 * Remove a specific mention from text
 *
 * @param text - The message text
 * @param type - Type of mention to remove
 * @param id - ID of the mention (slug or path)
 * @returns Text with the mention removed
 */
export declare function removeMention(text: string, type: MentionItemType, id: string): string;
/**
 * Check if text contains any valid mentions
 */
export declare function hasMentions(text: string, availableSkillSlugs: string[], availableSourceSlugs: string[]): boolean;
/**
 * Extract valid [skill:...] mentions from message text (legacy API)
 *
 * @deprecated Use parseMentions() instead
 */
export declare function parseSkillMentions(text: string, availableSlugs: string[]): string[];
/**
 * Remove [bracket] mentions from message text (legacy API)
 *
 * @deprecated Use stripAllMentions() instead
 */
export declare function stripSkillMentions(text: string): string;
/**
 * Extract ContentBadge array from message text.
 * Used when sending messages to store badge metadata for display.
 *
 * Each badge is self-contained with label, icon (base64), and position.
 *
 * @param text - Message text with mentions
 * @param skills - Available skills (for label lookup)
 * @param sources - Available sources (for label lookup)
 * @param workspaceId - Workspace ID (for icon lookup)
 * @returns Array of ContentBadge objects
 */
export declare function extractBadges(text: string, skills: LoadedSkill[], sources: LoadedSource[], workspaceId: string): ContentBadge[];
