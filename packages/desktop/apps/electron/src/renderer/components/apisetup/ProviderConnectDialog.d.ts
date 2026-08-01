import type { HopCodeProviderConnectResult } from '../../../shared/types';
interface ProviderConnectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConnected: (result: HopCodeProviderConnectResult) => void;
}
export declare function ProviderConnectDialog({ open, onOpenChange, onConnected, }: ProviderConnectDialogProps): import("react").JSX.Element;
export {};
