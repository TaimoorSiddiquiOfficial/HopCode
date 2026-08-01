import type { ContentBadge } from '@craft-agent/core';
export interface SlashCommandMatch {
    type: 'command';
    id: string;
    fullMatch: string;
    startIndex: number;
}
/**
 * Find slash commands that should render as command badges.
 *
 * When commandNames are provided, commands can appear anywhere after whitespace.
 * Without commandNames, only a leading slash command is matched for submitted
 * message display.
 */
export declare function findSlashCommandMatches(text: string, commandNames?: string[]): SlashCommandMatch[];
export declare function extractCommandBadges(text: string, commandNames?: string[]): ContentBadge[];
