import type { HopCodeProviderConnectResult } from '../../../shared/types';
interface ProviderConnectFormProps {
    onConnected: (result: HopCodeProviderConnectResult) => void;
    onCancel?: () => void;
    showHeader?: boolean;
    className?: string;
}
export declare function ProviderConnectForm({ onConnected, onCancel, showHeader, className, }: ProviderConnectFormProps): import("react").JSX.Element;
export {};
