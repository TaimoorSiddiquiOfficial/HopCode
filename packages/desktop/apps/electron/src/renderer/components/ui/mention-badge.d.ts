import * as React from 'react';
import type { LoadedSkill, LoadedSource } from '../../../shared/types';
import type { MentionItemType } from './mention-menu';
export interface MentionBadgeProps {
    type: MentionItemType;
    label: string;
    /** Skill data for skill mentions */
    skill?: LoadedSkill;
    /** Source data for source mentions */
    source?: LoadedSource;
    /** Workspace ID for skill avatar */
    workspaceId?: string;
    /** Called when the remove button is clicked */
    onRemove?: () => void;
    /** Additional className */
    className?: string;
}
/**
 * MentionBadge - Inline badge for displaying active @mentions
 *
 * Used in the ActiveMentionBadges row above the input field to show
 * skills and sources that have been mentioned via @.
 */
export declare function MentionBadge({ type, label, skill, source, workspaceId, onRemove, className, }: MentionBadgeProps): React.JSX.Element;
export interface ParsedMention {
    id: string;
    type: MentionItemType;
    label: string;
    skill?: LoadedSkill;
    source?: LoadedSource;
}
export interface ActiveMentionBadgesProps {
    /** Parsed mentions to display */
    mentions: ParsedMention[];
    /** Workspace ID for skill avatars */
    workspaceId?: string;
    /** Called when a mention is removed */
    onRemove?: (id: string, type: MentionItemType) => void;
    /** Additional className for the container */
    className?: string;
}
/**
 * ActiveMentionBadges - Row of mention badges shown above the input
 *
 * Displays all active @mentions (skills and sources) as removable badges.
 * Hidden when there are no mentions.
 */
export declare function ActiveMentionBadges({ mentions, workspaceId, onRemove, className, }: ActiveMentionBadgesProps): React.JSX.Element | null;
