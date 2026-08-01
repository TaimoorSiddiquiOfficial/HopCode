/** @sentry/electron/renderer shim — no-op for browser builds. */
export declare function init(..._args: any[]): void;
export declare const captureException: () => void;
export declare const captureMessage: () => void;
export declare const ErrorBoundary: ({ children }: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) => import("react").ReactNode;
