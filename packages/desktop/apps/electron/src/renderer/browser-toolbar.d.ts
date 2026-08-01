/**
 * Browser Toolbar — React entry point
 *
 * Renders the shared BrowserControls component inside a chromeless
 * BrowserWindow. Communicates with the main process via a dedicated
 * preload script (browser-toolbar preload).
 */
import './index.css';
interface ToolbarState {
    url: string;
    title: string;
    isLoading: boolean;
    canGoBack: boolean;
    canGoForward: boolean;
    themeColor?: string | null;
    presentation?: 'window' | 'docked';
    dockExpanded?: boolean;
}
declare global {
    interface Window {
        browserToolbar: {
            instanceId: string;
            navigate: (url: string) => Promise<void>;
            goBack: () => Promise<void>;
            goForward: () => Promise<void>;
            reload: () => Promise<void>;
            stop: () => Promise<void>;
            setMenuGeometry: (open: boolean, height?: number) => Promise<void>;
            toggleDockExpanded: () => Promise<void>;
            hideWindow: () => Promise<void>;
            closeWindowEntirely: () => Promise<void>;
            onStateUpdate: (callback: (state: ToolbarState) => void) => () => void;
            onThemeColor: (callback: (color: string | null) => void) => () => void;
            onForceCloseMenu: (callback: (payload: {
                reason?: string;
            }) => void) => () => void;
        };
    }
}
export {};
