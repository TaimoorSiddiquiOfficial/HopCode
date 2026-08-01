/**
 * Client capabilities — named actions a client can perform on behalf of the server.
 *
 * See docs/adr-transport-locality.md for the locality boundary definition.
 */
import type { RpcServer } from './types';
/** Capability: open a URL in the client's default browser. */
export declare const CLIENT_OPEN_EXTERNAL = "client:openExternal";
/** Capability: open a file with the OS default application. */
export declare const CLIENT_OPEN_PATH = "client:openPath";
/** Capability: reveal a file in Finder / Explorer. */
export declare const CLIENT_SHOW_IN_FOLDER = "client:showItemInFolder";
/** Capability: show a confirmation dialog (message box) on the client. */
export declare const CLIENT_CONFIRM_DIALOG = "client:confirmDialog";
/** Capability: show a native file/folder picker on the client. */
export declare const CLIENT_OPEN_FILE_DIALOG = "client:openFileDialog";
/** All capabilities a local Electron client advertises on handshake. */
export declare const LOCAL_CLIENT_CAPABILITIES: readonly string[];
/**
 * Ask a specific client to open a URL in its default browser.
 *
 * Returns `{ opened: true }` on success.
 * Returns `{ opened: false, error, authUrl }` on failure — caller can
 * show authUrl to user for manual "copy link / open" action.
 */
export declare function requestClientOpenExternal(server: RpcServer, clientId: string, url: string): Promise<{
    opened: boolean;
    error?: string;
    authUrl?: string;
}>;
/**
 * Ask the client to open a file with the OS default application.
 * Equivalent to Electron's `shell.openPath()`.
 */
export declare function requestClientOpenPath(server: RpcServer, clientId: string, path: string): Promise<{
    error?: string;
}>;
/**
 * Ask the client to reveal a file in Finder / Explorer.
 * Equivalent to Electron's `shell.showItemInFolder()`.
 */
export declare function requestClientShowInFolder(server: RpcServer, clientId: string, path: string): Promise<void>;
/** Spec for a confirmation dialog (maps to Electron's MessageBoxOptions). */
export interface ConfirmDialogSpec {
    type?: 'none' | 'info' | 'warning' | 'error' | 'question';
    title: string;
    message: string;
    detail?: string;
    buttons: string[];
    defaultId?: number;
    cancelId?: number;
}
/**
 * Ask the client to show a confirmation dialog.
 * Returns the index of the clicked button.
 */
export declare function requestClientConfirmDialog(server: RpcServer, clientId: string, spec: ConfirmDialogSpec): Promise<{
    response: number;
}>;
/** Spec for a file/folder picker dialog (maps to Electron's OpenDialogOptions). */
export interface FileDialogSpec {
    title?: string;
    defaultPath?: string;
    properties?: string[];
    filters?: Array<{
        name: string;
        extensions: string[];
    }>;
}
/**
 * Ask the client to show a native file/folder picker.
 * Returns the selection result (canceled + filePaths).
 */
export declare function requestClientOpenFileDialog(server: RpcServer, clientId: string, spec: FileDialogSpec): Promise<{
    canceled: boolean;
    filePaths: string[];
}>;
