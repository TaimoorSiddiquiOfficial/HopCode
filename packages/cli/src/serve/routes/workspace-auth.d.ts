/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { Application, RequestHandler } from 'express';
import { type DeviceFlowProviderId, type DeviceFlowRegistry } from '../auth/device-flow.js';
import type { SendBridgeError } from '../server/error-response.js';
import type { ServeAuthProviderInstallRequest, ServeAuthProviderInstallResult } from '../types.js';
interface RegisterWorkspaceAuthRoutesDeps {
    mutate: (opts?: {
        strict?: boolean;
    }) => RequestHandler;
    deviceFlowRegistry: DeviceFlowRegistry;
    getSupportedDeviceFlowProviders: () => DeviceFlowProviderId[];
    sendBridgeError: SendBridgeError;
    boundWorkspace: string;
    allowPrivateAuthBaseUrl: boolean;
    installAuthProvider?: (req: ServeAuthProviderInstallRequest) => Promise<ServeAuthProviderInstallResult>;
}
export declare function registerWorkspaceAuthRoutes(app: Application, deps: RegisterWorkspaceAuthRoutesDeps): void;
export {};
