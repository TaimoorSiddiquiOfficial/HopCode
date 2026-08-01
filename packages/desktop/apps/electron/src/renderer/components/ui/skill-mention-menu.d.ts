/**
 * @deprecated This file is deprecated. Use mention-menu.tsx instead.
 * The unified mention menu supports both skills and sources with type badges.
 */
import * as React from 'react';
import type { LoadedSkill } from '../../../shared/types';
export interface InlineSkillMentionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    skills: LoadedSkill[];
    onSelect: (slug: string) => void;
    filter?: string;
    position: {
        x: number;
        y: number;
    };
    workspaceId?: string;
    className?: string;
}
export declare function InlineSkillMention({ open, onOpenChange, skills, onSelect, filter, position, workspaceId, className, }: InlineSkillMentionProps): React.JSX.Element | null;
/** Interface for elements that can be used with useInlineSkillMention */
export interface SkillMentionInputElement {
    getBoundingClientRect: () => DOMRect;
    value: string;
    selectionStart: number;
}
export interface UseInlineSkillMentionOptions {
    inputRef: React.RefObject<SkillMentionInputElement | null>;
    skills: LoadedSkill[];
    onSelect: (slug: string) => void;
}
export interface UseInlineSkillMentionReturn {
    isOpen: boolean;
    filter: string;
    position: {
        x: number;
        y: number;
    };
    handleInputChange: (value: string, cursorPosition: number) => void;
    close: () => void;
    handleSelect: (slug: string) => string;
}
export declare function useInlineSkillMention({ inputRef, skills, onSelect, }: UseInlineSkillMentionOptions): UseInlineSkillMentionReturn;
