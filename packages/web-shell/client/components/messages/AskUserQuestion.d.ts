import type { PermissionRequest } from '../../adapters/types';
interface AskUserQuestionProps {
    request: PermissionRequest;
    onConfirm: (id: string, selectedOption: string, answers?: Record<string, string>) => void;
    variant?: 'inline' | 'floating';
    /**
     * Whether this question should pull keyboard focus to its first option when it
     * becomes the topmost one. Defaults to true. Split-view panes pass false so an
     * question in one pane doesn't steal focus from the pane the user is in; like
     * ToolApproval, keyboard handling is focus-scoped, so it stays operable once
     * the user tabs/clicks into it.
     */
    keyboardActive?: boolean;
}
export declare function AskUserQuestion({ request, onConfirm, variant, keyboardActive, }: AskUserQuestionProps): import("react").JSX.Element | null;
export {};
