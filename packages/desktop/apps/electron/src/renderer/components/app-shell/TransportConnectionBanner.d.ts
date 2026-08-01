import type { TransportConnectionState } from '../../../shared/types';
export declare function shouldShowTransportConnectionBanner(state: TransportConnectionState | null): boolean;
export interface TransportBannerCopy {
    title: string;
    description: string;
    showRetry: boolean;
    tone: 'warning' | 'error' | 'info';
}
export declare function getTransportBannerCopy(state: TransportConnectionState): TransportBannerCopy;
export declare function TransportConnectionBanner({ state, onRetry, }: {
    state: TransportConnectionState;
    onRetry: () => void;
}): import("react").JSX.Element;
