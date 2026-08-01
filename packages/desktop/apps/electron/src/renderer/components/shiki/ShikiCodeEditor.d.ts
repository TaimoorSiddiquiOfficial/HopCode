/**
 * ShikiCodeEditor - Editable code/markdown editor using react-simple-code-editor
 *
 * Replaces Monaco Editor for markdown editing with a lighter weight solution.
 * Uses textarea overlay technique with Shiki for syntax highlighting.
 *
 * Features:
 * - Syntax highlighting via Shiki
 * - Light/dark theme support
 * - Auto-indentation (tab key)
 * - Read-only mode support
 */
import * as React from 'react';
export interface ShikiCodeEditorProps {
    /** The code/markdown content */
    value: string;
    /** Language for syntax highlighting (default: 'markdown') */
    language?: string;
    /** Callback when content changes */
    onChange?: (value: string) => void;
    /** Whether the editor is read-only */
    readOnly?: boolean;
    /** Callback when ready */
    onReady?: () => void;
    /** Additional class names */
    className?: string;
    /** Placeholder text when empty */
    placeholder?: string;
}
/**
 * ShikiCodeEditor - Lightweight syntax highlighted editor
 */
export declare function ShikiCodeEditor({ value, language, onChange, readOnly, onReady, className, placeholder, }: ShikiCodeEditorProps): React.JSX.Element;
