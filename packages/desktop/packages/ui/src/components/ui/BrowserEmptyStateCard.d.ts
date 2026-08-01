import * as React from 'react';
export interface BrowserEmptyPromptSample {
    short: string;
    full: string;
}
export interface BrowserEmptyStateCardProps {
    title: string;
    description: string;
    prompts?: readonly BrowserEmptyPromptSample[];
    showExamplePrompts?: boolean;
    showSafetyHint?: boolean;
    onPromptSelect?: (prompt: BrowserEmptyPromptSample) => void;
}
export declare function BrowserEmptyStateCard({ title, description, prompts, showExamplePrompts, showSafetyHint, onPromptSelect, }: BrowserEmptyStateCardProps): React.JSX.Element;
