/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type React from 'react';
import type { DeviceAuthorizationData } from '@hoptrendy/hopcode-core';
interface HopCodeOAuthProgressProps {
    onTimeout: () => void;
    onCancel: () => void;
    deviceAuth?: DeviceAuthorizationData;
    authStatus?: 'idle' | 'polling' | 'success' | 'error' | 'timeout' | 'rate_limit';
    authMessage?: string | null;
}
export declare function HopCodeOAuthProgress({ onTimeout, onCancel, deviceAuth, authStatus, authMessage, }: HopCodeOAuthProgressProps): React.JSX.Element;
export {};
