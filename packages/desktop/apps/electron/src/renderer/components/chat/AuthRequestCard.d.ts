import * as React from 'react';
import type { Message, CredentialResponse } from '../../../shared/types';
interface AuthRequestCardProps {
    message: Message;
    /** Callback to respond to credential request */
    onRespondToCredential?: (sessionId: string, requestId: string, response: CredentialResponse) => void;
    /** Session ID for this auth request */
    sessionId: string;
    /** Whether the card is interactive (last message, no user message after). Default true. */
    isInteractive?: boolean;
}
/**
 * AuthRequestCard - Inline auth UI displayed in chat history
 *
 * Renders different UIs based on auth type:
 * - credential: Form for API key, bearer token, basic auth
 * - oauth/oauth-google/oauth-slack/oauth-microsoft: OAuth flow with browser redirect
 *
 * Status handling:
 * - pending: Show interactive form/button
 * - completed: Show success state
 * - cancelled: Show cancelled state
 * - failed: Show error state
 */
export declare function AuthRequestCard({ message, onRespondToCredential, sessionId, isInteractive }: AuthRequestCardProps): React.JSX.Element;
/**
 * Memoized version for performance in chat list
 */
export declare const MemoizedAuthRequestCard: React.MemoExoticComponent<typeof AuthRequestCard>;
export {};
