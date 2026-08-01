import type { Message } from '../../../shared/types';
export type ErrorMessageAction = NonNullable<Message['errorActions']>[number];
export interface HandleErrorMessageActionOptions {
    sessionId?: string;
    onOpenUrl?: (url: string) => void;
    onOpenSettings?: () => void;
    onRetryFocus?: (detail?: {
        sessionId?: string;
    }) => void;
    onRetry?: () => void;
}
/**
 * Execute an error-message action using the app's canonical handlers.
 *
 * Retry intentionally routes through the session-scoped focus event system
 * instead of querying the DOM, which is fragile in multi-panel mode and
 * no longer matches the RichTextInput implementation.
 */
export declare function handleErrorMessageAction(action: ErrorMessageAction, { sessionId, onOpenUrl, onOpenSettings, onRetryFocus, onRetry, }?: HandleErrorMessageActionOptions): void;
