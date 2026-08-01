/**
 * WhatsAppConnectDialogPreview
 *
 * The real WhatsAppConnectDialog's internal phase state machine is driven by
 * `onWhatsAppEvent` callbacks — not props — so we can't force the phase via
 * props directly. Instead, when the variant prop changes we fire a synthetic
 * event through the playground messaging handle, which is the same mechanism
 * the mock IPC uses to drive the real state transitions.
 *
 * A small key-on-phase trick remounts the dialog so events fire cleanly
 * without stale timers (the "connected" phase auto-closes after 1.2s).
 */
import * as React from 'react';
type Phase = 'idle' | 'starting' | 'show_qr' | 'connected' | 'error';
export interface WhatsAppConnectDialogPreviewProps {
    phase: Phase;
    errorMessage: string;
}
export declare function WhatsAppConnectDialogPreview({ phase, errorMessage, }: WhatsAppConnectDialogPreviewProps): React.JSX.Element;
export {};
