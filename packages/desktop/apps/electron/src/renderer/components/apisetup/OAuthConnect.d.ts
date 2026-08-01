/**
 * OAuthConnect - Reusable OAuth connection control
 *
 * Renders content for two flow states:
 * 1. Waiting for code: Auth code input form (form ID binds to external submit button)
 * 2. Non-waiting: Error message display (if any)
 *
 * Does NOT include layout wrappers or action buttons — the parent controls
 * button placement and loading states. Error display follows the same pattern
 * as ApiKeyInput (shown below the content area).
 *
 * Used in: Onboarding CredentialsStep, Settings OAuth dialog
 */
export type OAuthStatus = 'idle' | 'validating' | 'success' | 'error';
export interface OAuthConnectProps {
    /** Current connection status */
    status: OAuthStatus;
    /** Error message when status is 'error' */
    errorMessage?: string;
    /** Whether we're waiting for user to paste an auth code */
    isWaitingForCode?: boolean;
    /** Start the OAuth browser flow */
    onStartOAuth: () => void;
    /** Submit the authorization code from the browser */
    onSubmitAuthCode?: (code: string) => void;
    /** Cancel the OAuth flow (while waiting for code) */
    onCancelOAuth?: () => void;
    /** Form ID for auth code form (default: "auth-code-form") */
    formId?: string;
}
export declare function OAuthConnect({ status, errorMessage, isWaitingForCode, onSubmitAuthCode, formId, }: OAuthConnectProps): import("react").JSX.Element | null;
