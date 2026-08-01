export type ToastTone = 'info' | 'warning' | 'error' | 'success';
export interface WebShellToast {
    id: string;
    tone: ToastTone;
    message: string;
}
interface ToastHostProps {
    toasts: readonly WebShellToast[];
    onDismiss: (id: string) => void;
    autoDismissMs?: number;
}
export declare function ToastHost({ toasts, onDismiss, autoDismissMs, }: ToastHostProps): import("react").JSX.Element | null;
export {};
