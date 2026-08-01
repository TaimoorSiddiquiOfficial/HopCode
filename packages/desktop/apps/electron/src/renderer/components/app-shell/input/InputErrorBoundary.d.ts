import * as React from 'react';
interface InputErrorBoundaryProps {
    sessionId?: string;
    resetKey: string;
    onClearDraft?: () => void;
    children: React.ReactNode;
}
interface InputErrorBoundaryState {
    hasError: boolean;
}
/**
 * Keeps chat input failures local to the composer area so the rest of the chat
 * page remains usable. This is intentionally narrower than the root Sentry
 * boundary because malformed drafts or future composer bugs should not blank the
 * entire app.
 */
export declare class InputErrorBoundary extends React.Component<InputErrorBoundaryProps, InputErrorBoundaryState> {
    state: InputErrorBoundaryState;
    static getDerivedStateFromError(): InputErrorBoundaryState;
    componentDidCatch(error: Error, info: React.ErrorInfo): void;
    componentDidUpdate(prevProps: InputErrorBoundaryProps): void;
    private retry;
    private clearDraftAndRetry;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | React.JSX.Element | null | undefined;
}
export {};
