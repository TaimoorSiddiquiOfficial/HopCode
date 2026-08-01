import { type ReactNode } from 'react';
type DialogSize = 'sm' | 'md' | 'lg' | 'xl';
interface DialogShellProps {
    title: string;
    subtitle?: string;
    size?: DialogSize;
    allowFullscreen?: boolean;
    onClose: () => void;
    children: ReactNode;
}
export declare const DialogShellIdContext: import("react").Context<object | null>;
export declare function isTopDialogShellId(shellId: object | null): boolean;
export declare function DialogShell({ title, subtitle, size, allowFullscreen, onClose, children, }: DialogShellProps): import("react").JSX.Element;
export {};
