import * as React from 'react';
import { type PermissionMode } from '@craft-agent/shared/agent/modes';
import type { AvailableSlashCommand } from '../../../shared/types';
export type HopCodeSlashCommandId = `qwen:${string}`;
export type HopCodeSkillCommandId = `qwen-skill:${string}`;
export type SlashCommandId = PermissionMode | 'compact' | HopCodeSlashCommandId | HopCodeSkillCommandId;
/** Union type for all item types in the slash menu */
export type SlashItemType = 'command' | 'folder';
export interface SlashCommand {
    id: SlashCommandId;
    label: string;
    description: string;
    icon: React.ReactNode;
    shortcut?: string;
    /** Optional color for the command (hex color string) */
    color?: string;
    /** Text inserted into the input when selected. Commands without this are handled as UI actions. */
    insertText?: string;
    source?: 'mode' | 'app' | 'hopcode' | 'qwen-skill';
}
/** Folder item for the slash menu */
export interface SlashFolderItem {
    id: string;
    type: 'folder';
    label: string;
    description: string;
    path: string;
}
/** Section with header for the inline slash menu */
export interface SlashSection {
    id: string;
    label: string;
    labelKey?: string;
    items: (SlashCommand | SlashFolderItem)[];
}
export interface CommandGroup {
    id: string;
    commands: SlashCommand[];
}
export declare const DEFAULT_SLASH_COMMANDS: SlashCommand[];
export declare const DEFAULT_SLASH_COMMAND_GROUPS: CommandGroup[];
export declare function isHopCodeSlashCommandId(commandId: SlashCommandId): commandId is HopCodeSlashCommandId | HopCodeSkillCommandId;
export declare function createQwenSlashSections({ availableCommands, availableSkills, enabled, }: {
    availableCommands?: AvailableSlashCommand[];
    availableSkills?: string[];
    enabled?: boolean;
}): SlashSection[];
export interface SlashCommandMenuProps {
    /** Flat list of commands (use this OR commandGroups, not both) */
    commands?: SlashCommand[];
    /** Grouped commands with separators between groups */
    commandGroups?: CommandGroup[];
    activeCommands?: SlashCommandId[];
    onSelect: (commandId: SlashCommandId) => void;
    showFilter?: boolean;
    filterPlaceholder?: string;
    className?: string;
}
export declare function SlashCommandMenu({ commands, commandGroups, activeCommands, onSelect, showFilter, filterPlaceholder, className, }: SlashCommandMenuProps): React.JSX.Element | null;
export interface InlineSlashCommandProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sections: SlashSection[];
    activeCommands?: SlashCommandId[];
    onSelectCommand: (commandId: SlashCommandId) => void;
    onSelectFolder: (path: string) => void;
    filter?: string;
    position: {
        x: number;
        y: number;
    };
    className?: string;
}
export declare function InlineSlashCommand({ open, onOpenChange, sections, activeCommands, onSelectCommand, onSelectFolder, filter, position, className, }: InlineSlashCommandProps): React.JSX.Element | null;
/** Interface for elements that can be used with useInlineSlashCommand */
export interface SlashCommandInputElement {
    getBoundingClientRect: () => DOMRect;
    getCaretRect?: () => DOMRect | null;
    value: string;
    selectionStart: number;
}
export declare function createInlineSlashSections({ availableCommands, availableSkills, enableQwenCommands, recentFolders, homeDir, }: {
    availableCommands?: AvailableSlashCommand[];
    availableSkills?: string[];
    enableQwenCommands?: boolean;
    recentFolders?: string[];
    homeDir?: string;
}): SlashSection[];
export interface UseInlineSlashCommandOptions {
    /** Ref to input element (textarea or RichTextInput handle) */
    inputRef: React.RefObject<SlashCommandInputElement | null>;
    onSelectCommand: (commandId: SlashCommandId) => void;
    onSelectFolder: (path: string) => void;
    activeCommands?: SlashCommandId[];
    recentFolders?: string[];
    homeDir?: string;
    availableCommands?: AvailableSlashCommand[];
    availableSkills?: string[];
    enableQwenCommands?: boolean;
}
export interface UseInlineSlashCommandReturn {
    isOpen: boolean;
    filter: string;
    position: {
        x: number;
        y: number;
    };
    sections: SlashSection[];
    handleInputChange: (value: string, cursorPosition: number) => void;
    close: () => void;
    activeCommands: SlashCommandId[];
    handleSelectCommand: (commandId: SlashCommandId) => {
        value: string;
        cursorPosition?: number;
    };
    handleSelectFolder: (path: string) => string;
}
export declare function useInlineSlashCommand({ inputRef, onSelectCommand, onSelectFolder, activeCommands, recentFolders, homeDir, availableCommands, availableSkills, enableQwenCommands, }: UseInlineSlashCommandOptions): UseInlineSlashCommandReturn;
