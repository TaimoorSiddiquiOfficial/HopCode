import * as React from 'react';
import type { LoadedSkill, LoadedSource } from '../../../shared/types';
export interface EscapeCompositionEventLike {
    key?: string;
    isComposing?: boolean;
    nativeEvent?: {
        isComposing?: boolean;
    };
}
/**
 * Returns true when Escape is pressed while IME composition is active.
 *
 * Uses both local composition state and event-level composing flags for
 * browser/runtime compatibility.
 */
export declare function isEscapeDuringComposition(event: EscapeCompositionEventLike, isComposingRefActive: boolean): boolean;
export interface RichTextInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onInput' | 'onPaste'> {
    /** Current text value */
    value: string;
    /** Called when text changes */
    onChange: (value: string) => void;
    /** Placeholder text(s) when empty - can be a single string or array for rotation */
    placeholder?: string | string[];
    /** Available skills for mention parsing */
    skills?: LoadedSkill[];
    /** Available sources for mention parsing */
    sources?: LoadedSource[];
    /** Workspace ID for avatars */
    workspaceId?: string;
    /** Slash command names that should render as inline command badges */
    slashCommandNames?: string[];
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Called when input changes (provides value and cursor position for mention detection) */
    onInput?: (value: string, cursorPosition: number) => void;
    /** Called on paste */
    onPaste?: (e: React.ClipboardEvent) => void;
    /** Called when pasted text exceeds line threshold - should create file attachment */
    onLongTextPaste?: (text: string) => void;
}
export interface RichTextInputHandle {
    focus: () => void;
    blur: () => void;
    /** The text value */
    value: string;
    /** Selection start position in text model */
    selectionStart: number;
    /** Set the text value */
    setValue: (value: string) => void;
    /** Set selection range */
    setSelectionRange: (start: number, end: number) => void;
    /** Get bounding rect for position calculations */
    getBoundingClientRect: () => DOMRect;
    /** Get bounding rect of the current caret/selection position */
    getCaretRect: () => DOMRect | null;
    /** The underlying div element */
    element: HTMLDivElement | null;
}
export declare function shouldSyncRenderedValue(lastValue: string, nextValue: string, lastBadgeSignature: string, nextBadgeSignature: string): boolean;
export declare const RichTextInput: React.ForwardRefExoticComponent<RichTextInputProps & React.RefAttributes<RichTextInputHandle>>;
