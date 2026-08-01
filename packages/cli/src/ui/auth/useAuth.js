/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { AuthEvent, AuthType, getErrorMessage, logAuth, buildInstallPlan, applyProviderInstallPlan, } from '@hoptrendy/hopcode-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createLoadedSettingsAdapter } from '../../config/loadedSettingsAdapter.js';
import { useHopCodeAuth } from '../hooks/useHopCodeAuth.js';
import { AuthState, MessageType } from '../types.js';
import { t } from '../../i18n/index.js';
/**
 * Normalize model IDs: split by comma, trim, deduplicate, remove empty.
 */
export function normalizeModelIds(modelIdsInput) {
    return modelIdsInput
        .split(',')
        .map((id) => id.trim())
        .filter((id, index, array) => id.length > 0 && array.indexOf(id) === index);
}
/** @deprecated Use normalizeModelIds instead. */
export const normalizeCustomModelIds = normalizeModelIds;
/**
 * Mask an API key for display: show first 3 and last 4 chars.
 */
export function maskApiKey(apiKey) {
    const trimmed = apiKey.trim();
    if (trimmed.length === 0)
        return '(not set)';
    if (trimmed.length <= 6)
        return '***';
    return `${trimmed.slice(0, 3)}...${trimmed.slice(-4)}`;
}
export const useAuthCommand = (settings, config, addItem, onAuthChange) => {
    const unAuthenticated = config.getAuthType() === undefined;
    const [authState, setAuthState] = useState(unAuthenticated ? AuthState.Updating : AuthState.Unauthenticated);
    const [authError, setAuthError] = useState(null);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(unAuthenticated);
    const [pendingAuthType, setPendingAuthType] = useState(undefined);
    const [externalAuthState, setExternalAuthState] = useState(null);
    const { hopCodeAuthState, cancelHopCodeAuth } = useHopCodeAuth(pendingAuthType, isAuthenticating);
    // -- Shared helpers -------------------------------------------------------
    const onAuthError = useCallback((error) => {
        setAuthError(error);
        if (error) {
            setAuthState(AuthState.Updating);
            setIsAuthDialogOpen(true);
        }
    }, [setAuthError, setAuthState]);
    const handleAuthFailure = useCallback((error, protocolForTelemetry) => {
        setIsAuthenticating(false);
        setExternalAuthState(null);
        const msg = t('Failed to authenticate. Message: {{message}}', {
            message: getErrorMessage(error),
        });
        onAuthError(msg);
        // Prefer the explicit argument over the closed-over pendingAuthType:
        // setPendingAuthType(protocol) queues an async React update, but a
        // synchronous throw in handleProviderSubmit reaches the catch before
        // the next render, so the closure may still see `undefined` here.
        // Callers from the new unified flow pass `protocol` explicitly to
        // sidestep that staleness; legacy callers fall back to the closure.
        const effectiveProtocol = protocolForTelemetry ?? pendingAuthType;
        if (effectiveProtocol) {
            logAuth(config, new AuthEvent(effectiveProtocol, 'manual', 'error', msg));
        }
    }, [onAuthError, pendingAuthType, config]);
    const completeAuthentication = useCallback(() => {
        setAuthError(null);
        setAuthState(AuthState.Authenticated);
        setPendingAuthType(undefined);
        setIsAuthDialogOpen(false);
        setIsAuthenticating(false);
        onAuthChange?.();
    }, [onAuthChange]);
    // -- Provider connect -----------------------------------------------------
    const handleProviderSubmit = useCallback(async (providerConfig, inputs) => {
        // Resolve the protocol once and store it as pendingAuthType so that if
        // applyProviderInstallPlan rejects, handleAuthFailure (which gates the
        // AuthEvent telemetry on pendingAuthType being defined) can record the
        // failure under the right AuthType bucket instead of silently dropping
        // it.
        const protocol = inputs.protocol ?? providerConfig.protocol;
        try {
            setPendingAuthType(protocol);
            setIsAuthenticating(true);
            setAuthError(null);
            const plan = buildInstallPlan(providerConfig, inputs);
            await applyProviderInstallPlan(plan, {
                settings: createLoadedSettingsAdapter(settings),
                reloadModelProviders: (mp) => config.reloadModelProvidersConfig(mp),
                syncAuthState: (authType, modelId, baseUrl) => config
                    .getModelsConfig()
                    .syncAfterAuthRefresh(authType, modelId, baseUrl),
                refreshAuth: (authType) => config.refreshAuth(authType),
            });
            completeAuthentication();
            addItem({
                type: MessageType.INFO,
                text: t('Successfully configured {{provider}}. Use /model to switch models.', { provider: providerConfig.label }),
            }, Date.now());
            logAuth(config, new AuthEvent(protocol, 'manual', 'success'));
        }
        catch (error) {
            // Pass protocol explicitly so error telemetry is recorded even when
            // a synchronous throw beats the setPendingAuthType state update.
            handleAuthFailure(error, protocol);
        }
    }, [settings, config, completeAuthentication, addItem, handleAuthFailure]);
    // -- Dialog open / close / cancel ----------------------------------------
    const openAuthDialog = useCallback(() => {
        setIsAuthDialogOpen(true);
    }, []);
    const closeAuthDialog = useCallback(() => {
        setIsAuthDialogOpen(false);
        setAuthError(null);
    }, []);
    const cancelAuthentication = useCallback(() => {
        if (isAuthenticating && pendingAuthType === AuthType.HOPCODE_OAUTH) {
            cancelHopCodeAuth();
        }
        if (isAuthenticating && pendingAuthType) {
            logAuth(config, new AuthEvent(pendingAuthType, 'manual', 'cancelled'));
        }
        setIsAuthenticating(false);
        setExternalAuthState(null);
        setIsAuthDialogOpen(true);
        setAuthError(null);
    }, [isAuthenticating, pendingAuthType, cancelHopCodeAuth, config]);
    // -- Validate HOPCODE_DEFAULT_AUTH_TYPE env var on mount --------------------
    useEffect(() => {
        const defaultAuthType = process.env['HOPCODE_DEFAULT_AUTH_TYPE'] ??
            process.env['HOPCODE_DEFAULT_AUTH_TYPE'];
        if (defaultAuthType &&
            ![
                AuthType.HOPCODE_OAUTH,
                AuthType.USE_OPENAI,
                AuthType.USE_ANTHROPIC,
                AuthType.USE_GEMINI,
                AuthType.USE_VERTEX_AI,
            ].includes(defaultAuthType)) {
            onAuthError(t('Invalid HOPCODE_DEFAULT_AUTH_TYPE value: "{{value}}". Valid values are: {{validValues}}', {
                value: defaultAuthType,
                validValues: [
                    AuthType.HOPCODE_OAUTH,
                    AuthType.USE_OPENAI,
                    AuthType.USE_ANTHROPIC,
                    AuthType.USE_GEMINI,
                    AuthType.USE_VERTEX_AI,
                ].join(', '),
            }));
        }
    }, [onAuthError]);
    // -- Public interface ----------------------------------------------------
    const state = useMemo(() => ({
        authError,
        isAuthDialogOpen,
        isAuthenticating,
        pendingAuthType,
        externalAuthState,
        hopCodeAuthState,
    }), [
        authError,
        isAuthDialogOpen,
        isAuthenticating,
        pendingAuthType,
        externalAuthState,
        hopCodeAuthState,
    ]);
    const actions = useMemo(() => ({
        setAuthState,
        onAuthError,
        closeAuthDialog,
        handleProviderSubmit,
        openAuthDialog,
        cancelAuthentication,
    }), [
        setAuthState,
        onAuthError,
        closeAuthDialog,
        handleProviderSubmit,
        openAuthDialog,
        cancelAuthentication,
    ]);
    return {
        authState,
        setAuthState,
        authError,
        onAuthError,
        isAuthDialogOpen,
        isAuthenticating,
        pendingAuthType,
        externalAuthState,
        hopCodeAuthState,
        closeAuthDialog,
        handleProviderSubmit,
        openAuthDialog,
        cancelAuthentication,
        state,
        actions,
    };
};
//# sourceMappingURL=useAuth.js.map