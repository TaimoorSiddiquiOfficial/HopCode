/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Browser-side voice capture for the Web Shell. Captures the microphone via
 * `getUserMedia`, downsamples to 16 kHz mono s16le PCM in an AudioWorklet, and
 * streams the raw frames to the daemon's `/voice/stream` WebSocket. The daemon
 * transcribes server-side (credentials never reach the browser) and returns
 * interim/final transcripts.
 *
 * Note: browsers cannot set an `Authorization` header on a WebSocket. When a
 * bearer token is configured it rides in the `Sec-WebSocket-Protocol`
 * subprotocol as `hopcode-bearer.<base64url(token)>` (see `bearerSubprotocol`),
 * which the daemon's ACP upgrade listener verifies — so this works against both
 * no-token loopback and token-required deployments.
 */
export type VoiceCaptureStatus = 'idle' | 'connecting' | 'recording' | 'transcribing' | 'error';
export interface UseVoiceCaptureOptions {
    baseUrl: string;
    token?: string;
    /** Called with the final transcript (may be empty). */
    onFinal: (text: string) => void;
    onError?: (message: string) => void;
}
export interface UseVoiceCaptureReturn {
    status: VoiceCaptureStatus;
    interimText: string;
    /** Recent input level, 0..1, for a live meter. */
    audioLevel: number;
    errorMessage: string | undefined;
    start: () => void;
    stop: () => void;
    abort: () => void;
}
export declare function useVoiceCapture(options: UseVoiceCaptureOptions): UseVoiceCaptureReturn;
