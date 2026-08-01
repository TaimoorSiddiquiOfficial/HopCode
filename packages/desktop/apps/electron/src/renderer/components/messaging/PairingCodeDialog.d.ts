/**
 * PairingCodeDialog — shows a 6-digit pairing code for binding a session
 * to a messaging channel. The user runs `/pair <code>` in their bot chat
 * to complete the binding.
 */
import * as React from 'react';
interface PairingCodeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    platform: 'telegram' | 'whatsapp';
    code: string | null;
    expiresAt: number | null;
    /** Bot username (without @) — enables the "Open bot" deep link. */
    botUsername?: string;
    /** Error text to show in place of the code (e.g., rate limit, adapter down). */
    error?: string;
}
export declare function PairingCodeDialog({ open, onOpenChange, platform, code, expiresAt, botUsername, error, }: PairingCodeDialogProps): React.JSX.Element;
export {};
