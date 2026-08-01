import * as React from 'react';
interface TiptapHoverActionsHostProps {
    children: React.ReactNode;
    className?: string;
    actionsOpen?: boolean;
}
export declare function TiptapHoverActionsHost({ children, className, actionsOpen }: TiptapHoverActionsHostProps): React.JSX.Element;
interface TiptapHoverActionsProps {
    children: React.ReactNode;
    className?: string;
    contentEditable?: boolean;
}
export declare function TiptapHoverActions({ children, className, contentEditable }: TiptapHoverActionsProps): React.JSX.Element;
interface TiptapHoverActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}
export declare function TiptapHoverActionButton({ className, active, type, ...props }: TiptapHoverActionButtonProps): React.JSX.Element;
export {};
