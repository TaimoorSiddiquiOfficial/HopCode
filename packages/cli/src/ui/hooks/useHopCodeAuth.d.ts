/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthType, type DeviceAuthorizationData } from '@hoptrendy/hopcode-core';
export interface HopCodeAuthState {
    deviceAuth: DeviceAuthorizationData | null;
    authStatus: 'idle' | 'polling' | 'success' | 'error' | 'timeout' | 'rate_limit';
    authMessage: string | null;
}
export declare const useHopCodeAuth: (pendingAuthType: AuthType | undefined, isAuthenticating: boolean) => {
    hopCodeAuthState: HopCodeAuthState;
    cancelHopCodeAuth: () => void;
};
