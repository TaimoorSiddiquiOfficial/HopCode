/**
 * Messaging Gateway Atoms
 *
 * Workspace-level state for messaging bindings.
 * Populated by subscribing to messaging:bindingChanged push events.
 */
export interface MessagingBinding {
    id: string;
    workspaceId: string;
    sessionId: string;
    platform: string;
    channelId: string;
    channelName?: string;
    enabled: boolean;
    createdAt: number;
}
export declare const messagingBindingsAtom: any;
export declare const messagingBindingsBySessionAtom: any;
export declare const setMessagingBindingsAtom: any;
/**
 * Global messaging dialog state.
 *
 * Hoisted out of SessionMenu so dialogs survive context-menu / dropdown close.
 * Rendered by <MessagingDialogHost /> mounted at AppShell level.
 */
export type MessagingDialogState = {
    kind: 'closed';
} | {
    kind: 'pairing';
    platform: 'telegram' | 'whatsapp';
    sessionId: string;
    code: string | null;
    expiresAt: number | null;
    botUsername?: string;
    error?: string;
} | {
    kind: 'wa_connect';
    continueToPairingSessionId?: string;
};
export declare const messagingDialogAtom: any;
