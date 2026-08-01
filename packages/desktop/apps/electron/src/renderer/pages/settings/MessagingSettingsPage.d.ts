/**
 * MessagingSettingsPage
 *
 * Configure messaging platform connections (Telegram, WhatsApp) and view
 * active session bindings.
 *
 * Layout:
 *  - One SettingsCard per platform (Telegram, WhatsApp)
 *  - Each card renders a PlatformRow: [brand logo] [name] [API · status]
 *    with a Connect button (disconnected) or three-dot menu (connected)
 *  - Active bindings render inline under their platform's row, each with
 *    "Open" (navigate to session) and "Disconnect" actions
 */
import * as React from 'react';
import type { DetailsPageMeta } from '@/lib/navigation-registry';
export declare const meta: DetailsPageMeta;
export default function MessagingSettingsPage(): React.JSX.Element | null;
