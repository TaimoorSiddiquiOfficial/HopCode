interface SystemMessageProps {
    content: string;
    variant: 'info' | 'error' | 'warning';
    source?: string;
    data?: unknown;
    /** Run /context detail, exactly like typing it (context-usage panels). */
    onShowContextDetail?: () => void;
    isLatest?: boolean;
    showRetryHint?: boolean;
    onRetryClick?: () => void;
}
export declare const SystemMessage: import("react").MemoExoticComponent<({ content, variant, source, data, onShowContextDetail, isLatest, showRetryHint, onRetryClick, }: SystemMessageProps) => import("react").JSX.Element>;
export {};
