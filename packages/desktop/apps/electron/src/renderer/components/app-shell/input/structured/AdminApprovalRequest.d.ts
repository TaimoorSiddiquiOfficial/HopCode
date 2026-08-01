import * as React from 'react';
export interface AdminApprovalRequestData {
    appName: string;
    reason: string;
    command: string;
    impact?: string;
    requiresSystemPrompt?: boolean;
    rememberForMinutes?: number;
}
interface AdminApprovalRequestProps {
    request: AdminApprovalRequestData;
    onApprove: (options: {
        rememberForMinutes?: number;
    }) => void;
    onCancel: () => void;
    /** When true, removes container styling (shadow, rounded) - used when wrapped by InputContainer */
    unstyled?: boolean;
}
/**
 * AdminApprovalRequest - Friendly admin-elevation approval card for non-technical users.
 *
 * Goal: make privileged escalation understandable and safe.
 */
export declare function AdminApprovalRequest({ request, onApprove, onCancel, unstyled, }: AdminApprovalRequestProps): React.JSX.Element;
export {};
