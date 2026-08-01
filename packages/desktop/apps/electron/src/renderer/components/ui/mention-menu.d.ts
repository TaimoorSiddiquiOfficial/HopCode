import * as React from 'react';
import type { LoadedSkill, LoadedSource } from '../../../shared/types';
export type MentionItemType = 'skill' | 'source' | 'file' | 'folder';
export interface MentionItem {
    id: string;
    type: MentionItemType;
    label: string;
    description?: string;
    skill?: LoadedSkill;
    source?: LoadedSource;
    file?: {
        path: string;
        type: 'file' | 'directory';
        relativePath: string;
    };
}
export interface MentionSection {
    id: string;
    label: string;
    items: MentionItem[];
}
export interface InlineMentionMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sections: MentionSection[];
    onSelect: (item: MentionItem) => void;
    filter?: string;
    position: {
        x: number;
        y: number;
    };
    workspaceId?: string;
    maxWidth?: number;
    className?: string;
    /** Whether file search is in progress */
    isSearching?: boolean;
}
/**
 * Check if the @ character at the given position is a valid mention trigger.
 * Valid triggers are:
 * - @ at the start of input (position 0)
 * - @ preceded by whitespace (space, tab, newline)
 * - @ preceded by opening brackets or quotes: ( " '
 *
 * Invalid triggers (returns false):
 * - @ in the middle of a word (e.g., "test@example.com")
 * - @ preceded by alphanumeric or other characters
 *
 * @param textBeforeCursor - The text from start of input to cursor position
 * @param atPosition - The position of the @ character in textBeforeCursor
 * @returns true if this @ should trigger the mention menu
 */
export declare function isValidMentionTrigger(textBeforeCursor: string, atPosition: number): boolean;
export declare function InlineMentionMenu({ open, onOpenChange, sections, onSelect, filter, position, workspaceId, maxWidth, className, }: InlineMentionMenuProps): React.JSX.Element | null;
/** Interface for elements that can be used with useInlineMention */
export interface MentionInputElement {
    getBoundingClientRect: () => DOMRect;
    getCaretRect?: () => DOMRect | null;
    value: string;
    selectionStart: number;
}
export interface UseInlineMentionOptions {
    /** Ref to input element (textarea or RichTextInput handle) */
    inputRef: React.RefObject<MentionInputElement | null>;
    skills: LoadedSkill[];
    sources: LoadedSource[];
    /** Base path for file search (working directory) */
    basePath?: string;
    onSelect: (item: MentionItem) => void;
    /** Workspace ID for fully-qualified skill names */
    workspaceId?: string;
}
export interface UseInlineMentionReturn {
    isOpen: boolean;
    filter: string;
    position: {
        x: number;
        y: number;
    };
    sections: MentionSection[];
    /** Whether file search is in progress */
    isSearching: boolean;
    handleInputChange: (value: string, cursorPosition: number) => void;
    close: () => void;
    handleSelect: (item: MentionItem) => {
        value: string;
        cursorPosition: number;
    };
}
export declare function useInlineMention({ inputRef, skills, sources, basePath, onSelect, workspaceId, }: UseInlineMentionOptions): UseInlineMentionReturn;
