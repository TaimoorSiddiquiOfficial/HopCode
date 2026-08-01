/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type IHopCodeOAuth2Client } from '@hoptrendy/hopcode-core';
import { type BrandedSecret, type DeviceFlowPollResult, type DeviceFlowProvider, type DeviceFlowProviderId, type DeviceFlowStartResult } from './device-flow.js';
/**
 * hopcode-oauth implementation of `DeviceFlowProvider` for `hopcode serve`.
 *
 * Uses the lower-level `HopCodeOAuth2Client` primitives (`requestDeviceAuthorization`
 * / `pollDeviceToken`) directly rather than the high-level
 * `authWithHopCodeDeviceFlow` because that helper invokes `open(url)` to launch
 * a browser on the daemon host — only the SDK/user side may decide to open
 * a URL.
 */
export declare class HopCodeOAuthDeviceFlowProvider implements DeviceFlowProvider {
    readonly providerId: DeviceFlowProviderId;
    private readonly client;
    constructor(client?: IHopCodeOAuth2Client);
    start(opts: {
        signal: AbortSignal;
    }): Promise<DeviceFlowStartResult>;
    poll(state: {
        deviceCode: BrandedSecret<string>;
        pkceVerifier?: BrandedSecret<string>;
    }, opts: {
        signal: AbortSignal;
    }): Promise<DeviceFlowPollResult>;
}
