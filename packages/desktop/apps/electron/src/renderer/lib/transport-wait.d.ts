import type { ElectronAPI, TransportConnectionState } from '../../shared/types';
export declare function waitForTransportConnected(api: Pick<ElectronAPI, 'getTransportConnectionState' | 'onTransportConnectionStateChanged'>, options?: {
    timeoutMs?: number;
}): Promise<TransportConnectionState>;
