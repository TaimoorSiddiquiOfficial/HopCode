import type { Editor } from '@tiptap/core';
export interface SlashCommandItem {
    id: string;
    title: string;
    description?: string;
    icon: SlashIconName;
    group: 'Format' | 'Lists' | 'Blocks';
    aliases?: string[];
    run: (editor: Editor, insertPos?: number) => void;
}
export declare const SlashCommandPluginKey: any;
type SlashIconName = 'pilcrow' | 'heading-1' | 'heading-2' | 'heading-3' | 'list' | 'list-ordered' | 'list-checks' | 'quote' | 'text-quote' | 'minus' | 'code-xml' | 'square-code' | 'workflow' | 'sigma';
export declare function isSlashSuggestionActive(editor: Editor): boolean;
export declare function createSlashCommandItems(_editor: Editor): SlashCommandItem[];
export declare function filterSlashCommandItems(items: SlashCommandItem[], query: string): SlashCommandItem[];
export declare const TiptapSlashMenu: any;
export {};
