import type { ReactNode } from 'react';
interface WorkspaceUnavailableStateProps {
    title: string;
    description: string;
    actionLabel: string;
    onAction: () => void;
    theme?: 'dark' | 'light';
    icon?: ReactNode;
}
export declare function WorkspaceUnavailableState({ title, description, actionLabel, onAction, theme, icon, }: WorkspaceUnavailableStateProps): import("react").JSX.Element;
export {};
