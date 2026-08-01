/**
 * BrowserToolbar
 *
 * Electron-specific wrapper around the shared BrowserControls component.
 * Derives control state from BrowserInstanceInfo.
 */
import type { BrowserInstanceInfo } from '../../../shared/types';
interface BrowserToolbarProps {
    instanceInfo: BrowserInstanceInfo | null;
    onNavigate: (url: string) => void;
    onGoBack: () => void;
    onGoForward: () => void;
    onReload: () => void;
    onStop: () => void;
    compact?: boolean;
}
export declare function BrowserToolbar({ instanceInfo, onNavigate, onGoBack, onGoForward, onReload, onStop, compact, }: BrowserToolbarProps): import("react").JSX.Element;
export {};
