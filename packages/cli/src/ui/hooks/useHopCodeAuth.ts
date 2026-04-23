/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import {
  AuthType,
  hopCodeOAuth2Events,
  HopCodeOAuth2Event,
  type DeviceAuthorizationData,
} from '@hoptrendy/hopcode-core';

export interface HopCodeAuthState {
  deviceAuth: DeviceAuthorizationData | null;
  authStatus:
    | 'idle'
    | 'polling'
    | 'success'
    | 'error'
    | 'timeout'
    | 'rate_limit';
  authMessage: string | null;
}

export const useHopCodeAuth = (
  pendingAuthType: AuthType | undefined,
  isAuthenticating: boolean,
) => {
  const [hopCodeAuthState, setHopCodeAuthState] = useState<HopCodeAuthState>({
    deviceAuth: null,
    authStatus: 'idle',
    authMessage: null,
  });

  const isHopCodeAuth = pendingAuthType === AuthType.HOPCODE_OAUTH;

  // Set up event listeners when authentication starts
  useEffect(() => {
    if (!isHopCodeAuth || !isAuthenticating) {
      // Reset state when not authenticating or not HopCode auth
      setHopCodeAuthState({
        deviceAuth: null,
        authStatus: 'idle',
        authMessage: null,
      });
      return;
    }

    setHopCodeAuthState((prev) => ({
      ...prev,
      authStatus: 'idle',
    }));

    // Set up event listeners
    const handleDeviceAuth = (deviceAuth: DeviceAuthorizationData) => {
      setHopCodeAuthState((prev) => ({
        ...prev,
        deviceAuth: {
          verification_uri: deviceAuth.verification_uri,
          verification_uri_complete: deviceAuth.verification_uri_complete,
          user_code: deviceAuth.user_code,
          expires_in: deviceAuth.expires_in,
          device_code: deviceAuth.device_code,
        },
        authStatus: 'polling',
      }));
    };

    const handleAuthProgress = (
      status: 'success' | 'error' | 'polling' | 'timeout' | 'rate_limit',
      message?: string,
    ) => {
      setHopCodeAuthState((prev) => ({
        ...prev,
        authStatus: status,
        authMessage: message || null,
      }));
    };

    // Add event listeners
    hopCodeOAuth2Events.on(HopCodeOAuth2Event.AuthUri, handleDeviceAuth);
    hopCodeOAuth2Events.on(HopCodeOAuth2Event.AuthProgress, handleAuthProgress);

    // Cleanup event listeners when component unmounts or auth finishes
    return () => {
      hopCodeOAuth2Events.off(HopCodeOAuth2Event.AuthUri, handleDeviceAuth);
      hopCodeOAuth2Events.off(
        HopCodeOAuth2Event.AuthProgress,
        handleAuthProgress,
      );
    };
  }, [isHopCodeAuth, isAuthenticating]);

  const cancelHopCodeAuth = useCallback(() => {
    // Emit cancel event to stop polling
    hopCodeOAuth2Events.emit(HopCodeOAuth2Event.AuthCancel);

    setHopCodeAuthState({
      deviceAuth: null,
      authStatus: 'idle',
      authMessage: null,
    });
  }, []);

  return {
    hopCodeAuthState,
    cancelHopCodeAuth,
  };
};
