import type { Session, TransportConnectionState } from '../../shared/types';
export interface SessionContentHint {
    name?: string;
    preview?: string;
    lastFinalMessageId?: string;
    messageCount?: number | null;
}
export declare function hasSessionContentHint(session: SessionContentHint | null | undefined): boolean;
export declare function shouldShowForegroundMessageLoading(messagesLoaded: boolean, visibleMessageCount: number | null | undefined, expectedMessageCount?: number | null, hasContentHint?: boolean): boolean;
export declare function shouldShowMissingSessionState({ hasSession, hasSessionMeta, missingForMs, confirmationDelayMs, }: {
    hasSession: boolean;
    hasSessionMeta: boolean;
    missingForMs: number;
    confirmationDelayMs: number;
}): boolean;
export declare function shouldTreatSessionLoadFailureAsTransportFallback(state: TransportConnectionState | null | undefined): boolean;
export declare function formatSessionLoadFailure(error: unknown): string;
export declare function mergeSessionRefreshResult(existingSession: Session | null | undefined, freshSession: Session): {
    session: Session;
    preservedExistingMessages: boolean;
};
