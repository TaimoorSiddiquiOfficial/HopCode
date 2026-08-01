import * as React from 'react';
interface RichBlockShellProps {
    children: React.ReactNode;
    onEdit?: () => void;
    editTitle?: string;
    className?: string;
}
export declare function RichBlockShell({ children, onEdit, editTitle, className }: RichBlockShellProps): React.JSX.Element;
export {};
