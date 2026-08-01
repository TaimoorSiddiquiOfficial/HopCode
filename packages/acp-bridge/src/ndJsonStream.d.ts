/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AnyMessage, Stream } from '@agentclientprotocol/sdk';
export interface NdJsonMessageObservation {
    direction: 'sent' | 'received';
    bytes: number;
    message: AnyMessage;
}
export interface NdJsonStreamHooks {
    onMessageReceived?: (bytes: number) => void;
    onMessageSent?: (bytes: number) => void;
    onMessageObserved?: (observation: NdJsonMessageObservation) => void;
}
export declare function ndJsonStream(output: WritableStream<Uint8Array>, input: ReadableStream<Uint8Array>, hooks?: NdJsonStreamHooks): Stream;
