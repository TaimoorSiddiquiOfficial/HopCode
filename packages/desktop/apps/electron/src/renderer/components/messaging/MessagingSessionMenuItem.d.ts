/**
 * MessagingSessionMenuItem
 *
 * The "Connect Messaging → Telegram / WhatsApp" submenu block shared by
 * SessionMenu (real context/dropdown menus) and the playground preview.
 *
 * Behavior:
 *  - If the target platform isn't connected yet, route the user to the right
 *    setup entry point (WhatsApp opens the connect dialog; Telegram defaults
 *    to navigating to messaging settings + toasting — callers can override
 *    that via `onTelegramNotConfigured`).
 *  - If the platform is connected, dispatch `messagingDialogAtom` with a
 *    pairing-code dialog and kick off `generateMessagingPairingCode`.
 *
 * Renders the `<Sub>` block only — the caller decides placement and
 * separators. Reads menu primitives from `useMenuComponents()` so it works
 * identically inside a DropdownMenu or ContextMenu.
 */
import * as React from 'react';
import type { TFunction } from 'i18next';
export interface MessagingSessionMenuItemProps {
    /** Session to bind the pairing code to. */
    sessionId: string;
    /**
     * Called when the user clicks Telegram but Telegram isn't connected yet.
     * Default: navigate to messaging settings + toast.
     * Playground overrides this to toast only (it has no router).
     */
    onTelegramNotConfigured?: () => void;
    /**
     * Override the error classifier used when pairing-code generation fails.
     * Default: {@link classifyMessagingError} — matches "not connected" and
     * "rate limit" messages into i18n keys.
     */
    classifyError?: (err: unknown, t: TFunction) => string;
}
export declare function MessagingSessionMenuItem({ sessionId, onTelegramNotConfigured, classifyError, }: MessagingSessionMenuItemProps): React.JSX.Element;
/**
 * Translate raw errors from the pairing-code RPC into user-facing text.
 * Narrow on purpose — only classifies well-known failure modes; anything else
 * is surfaced verbatim so real errors aren't hidden.
 */
export declare function classifyMessagingError(err: unknown, t: TFunction): string;
