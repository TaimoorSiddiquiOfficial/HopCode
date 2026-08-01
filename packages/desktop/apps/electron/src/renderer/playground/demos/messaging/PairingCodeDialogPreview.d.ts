/**
 * PairingCodeDialogPreview
 *
 * Renders the real PairingCodeDialog with `open` wired to local state so the
 * user can dismiss it (ESC / outside click / close button) just like in the
 * real app. The dialog auto-reopens whenever any display prop changes so that
 * switching variants in the playground sidebar brings it back without needing
 * a separate "reopen" button. Computes `expiresAt` from an
 * `expiresInSeconds` prop so the variant sidebar can show "Expired" (0) or
 * a specific countdown state.
 */
import * as React from 'react';
export interface PairingCodeDialogPreviewProps {
    platform: 'telegram' | 'whatsapp';
    code: string;
    expiresInSeconds: number;
    botUsername: string;
    error: string;
}
export declare function PairingCodeDialogPreview({ platform, code, expiresInSeconds, botUsername, error, }: PairingCodeDialogPreviewProps): React.JSX.Element;
