/**
 * EscapeInterruptContext
 *
 * Provides state for the double-Esc interrupt feature.
 * When processing, first Esc shows a warning overlay; second Esc within 1 second interrupts.
 *
 * This is a separate context to avoid prop drilling through the component tree:
 * AppShell -> MainContentPanel -> ChatPage -> ChatDisplay -> InputContainer -> FreeFormInput
 */
import * as React from 'react';
interface EscapeInterruptContextType {
    /** Whether the escape warning overlay should be shown */
    showEscapeOverlay: boolean;
    /** Trigger the first escape press - shows overlay and returns false. If already showing, returns true (proceed with interrupt) */
    handleEscapePress: () => boolean;
    /** Dismiss the overlay (called after timeout or after interrupt) */
    dismissOverlay: () => void;
}
export declare function EscapeInterruptProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useEscapeInterrupt(): EscapeInterruptContextType;
export {};
