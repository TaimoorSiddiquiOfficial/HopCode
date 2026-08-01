/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare function getStableClientId(clientId: string | undefined, sessionId?: string): string;
export declare function persistStableClientId(clientId: string | undefined, sessionId?: string): void;
export declare function detachDaemonClient(opts: {
    baseUrl: string;
    token?: string;
    sessionId: string;
    clientId?: string;
}): Promise<void>;
