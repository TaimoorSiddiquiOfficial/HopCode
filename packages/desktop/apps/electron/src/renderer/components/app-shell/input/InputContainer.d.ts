import * as React from 'react';
import { type FreeFormInputProps } from './FreeFormInput';
import type { RichTextInputHandle } from '@/components/ui/rich-text-input';
import type { StructuredInputState, StructuredResponse } from './structured/types';
interface InputContainerProps extends Omit<FreeFormInputProps, 'inputRef'> {
    /** Structured input state - when present, shows structured UI instead of freeform */
    structuredInput?: StructuredInputState;
    /** Callback when user responds to structured input */
    onStructuredResponse?: (response: StructuredResponse) => void;
    /** External ref for the input (for focus control) */
    textareaRef?: React.RefObject<RichTextInputHandle>;
    /** Per-frame callback during height animation (for scroll sync) */
    onAnimatedHeightChange?: (delta: number) => void;
}
/**
 * InputContainer - Main orchestrator for FreeFormInput and StructuredInput
 *
 * Animation approach:
 * - Uses a hidden measuring div to get the natural height of content
 * - Container animates to measured height
 * - Content crossfades inside using AnimatePresence mode="sync"
 * - All visible children use absolute positioning to stack during transition
 */
export declare function InputContainer({ structuredInput, onStructuredResponse, textareaRef, compactMode, isProcessing, onAnimatedHeightChange, ...freeFormProps }: InputContainerProps): React.JSX.Element;
export {};
