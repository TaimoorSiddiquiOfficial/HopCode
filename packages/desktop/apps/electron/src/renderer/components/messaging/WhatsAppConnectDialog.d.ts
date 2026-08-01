/**
 * WhatsAppConnectDialog — drives the Baileys QR-scan pairing flow from the UI.
 */
import * as React from 'react';
interface WhatsAppConnectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConnected?: () => void;
}
export declare function WhatsAppConnectDialog({ open, onOpenChange, onConnected }: WhatsAppConnectDialogProps): React.JSX.Element;
export {};
