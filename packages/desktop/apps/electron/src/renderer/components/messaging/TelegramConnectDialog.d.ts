/**
 * TelegramConnectDialog — token-input pairing flow in a modal.
 *
 * Sibling to WhatsAppConnectDialog: same Dialog shape, different auth flow
 * (Telegram Bot API doesn't support QR login — only bot tokens issued by
 * @BotFather). User pastes a token → Test → Save → dialog closes.
 *
 * Used by MessagingSettingsPage as the only flow for saving Telegram tokens.
 * The `reconfigure` prop is set when the user picks "Reconfigure" from the
 * three-dot menu, so the UI treats it as replacing an existing token.
 */
import * as React from 'react';
interface TelegramConnectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** When true, treat the flow as "replace existing token" (used from Reconfigure menu item). */
    reconfigure?: boolean;
    onSaved?: () => void;
}
export declare function TelegramConnectDialog({ open, onOpenChange, reconfigure, onSaved, }: TelegramConnectDialogProps): React.JSX.Element;
export {};
