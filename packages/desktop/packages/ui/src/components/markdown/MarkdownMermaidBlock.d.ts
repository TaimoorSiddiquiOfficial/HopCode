import * as React from 'react';
interface MarkdownMermaidBlockProps {
    code: string;
    className?: string;
    /** Whether to show the inline expand button. Default true.
     *  Set to false when the mermaid block is the first block in a message,
     *  where the TurnCard's own fullscreen button already occupies the same position. */
    showExpandButton?: boolean;
    /** Whether clicking/tapping the inline diagram should open fullscreen.
     *  Enabled by default for chat parity with image blocks; editor node-views can disable it. */
    tapToOpen?: boolean;
    /** Optional minimum block height to reserve space before responsive sizing settles. */
    minHeight?: number;
}
export declare function MarkdownMermaidBlock({ code, className, showExpandButton, tapToOpen, minHeight }: MarkdownMermaidBlockProps): React.JSX.Element;
export {};
