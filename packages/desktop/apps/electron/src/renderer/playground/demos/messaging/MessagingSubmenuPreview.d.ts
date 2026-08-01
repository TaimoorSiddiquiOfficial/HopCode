/**
 * MessagingSubmenuPreview
 *
 * Renders a focused demo of just the "Connect Messaging" submenu shared with
 * the real SessionMenu. Clicking either branch runs the same code path:
 *   - When the platform is not connected, it opens the WhatsApp connect
 *     dialog (WhatsApp) or toasts (Telegram — playground has no router).
 *   - When connected, it dispatches a pairing dialog via messagingDialogAtom.
 *
 * We mount <MessagingDialogHost /> so the dispatched dialogs actually show
 * up in the preview.
 */
import * as React from 'react';
export interface MessagingSubmenuPreviewProps {
    telegramConnected: boolean;
    whatsappConnected: boolean;
}
export declare function MessagingSubmenuPreview({ telegramConnected, whatsappConnected, }: MessagingSubmenuPreviewProps): React.JSX.Element;
