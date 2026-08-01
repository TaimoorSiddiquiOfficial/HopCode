/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useCallback, useEffect } from 'react';
import { AuthType, HopCodeOAuth2Events, HopCodeOAuth2Event, } from '@hoptrendy/hopcode-core';
export const useHopCodeAuth = (pendingAuthType, isAuthenticating) => {
    const [hopCodeAuthState, setHopCodeAuthState] = useState({
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
        const handleDeviceAuth = (deviceAuth) => {
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
        const handleAuthProgress = (status, message) => {
            setHopCodeAuthState((prev) => ({
                ...prev,
                authStatus: status,
                authMessage: message || null,
            }));
        };
        // Add event listeners
        HopCodeOAuth2Events.on(HopCodeOAuth2Event.AuthUri, handleDeviceAuth);
        HopCodeOAuth2Events.on(HopCodeOAuth2Event.AuthProgress, handleAuthProgress);
        // Cleanup event listeners when component unmounts or auth finishes
        return () => {
            HopCodeOAuth2Events.off(HopCodeOAuth2Event.AuthUri, handleDeviceAuth);
            HopCodeOAuth2Events.off(HopCodeOAuth2Event.AuthProgress, handleAuthProgress);
        };
    }, [isHopCodeAuth, isAuthenticating]);
    const cancelHopCodeAuth = useCallback(() => {
        // Emit cancel event to stop polling
        HopCodeOAuth2Events.emit(HopCodeOAuth2Event.AuthCancel);
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
//# sourceMappingURL=useHopCodeAuth.js.map