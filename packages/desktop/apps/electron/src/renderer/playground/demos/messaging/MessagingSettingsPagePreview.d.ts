/**
 * MessagingSettingsPagePreview
 *
 * Thin playground wrapper around the real MessagingSettingsPage that drives
 * the mock messaging state via `window.__playgroundMessaging` based on
 * variant props. Lets you toggle Telegram/WhatsApp connection status and
 * seed bindings without the component needing playground-specific props.
 */
import * as React from 'react';
type BindingsPreset = 'none' | 'one' | 'many';
export interface MessagingSettingsPagePreviewProps {
    telegramConnected: boolean;
    whatsappConnected: boolean;
    bindings: BindingsPreset;
}
export declare function MessagingSettingsPagePreview({ telegramConnected, whatsappConnected, bindings, }: MessagingSettingsPagePreviewProps): React.JSX.Element;
export {};
