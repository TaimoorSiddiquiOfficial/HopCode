/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { TelemetryRuntimeConfig } from './runtime-config.js';
/**
 * Standard OTLP HTTP signal-specific paths per the OpenTelemetry specification.
 * gRPC uses service-based routing so no path appending is needed.
 */
declare const OTLP_SIGNAL_PATHS: {
    readonly traces: "v1/traces";
    readonly logs: "v1/logs";
    readonly metrics: "v1/metrics";
};
type OtlpSignal = keyof typeof OTLP_SIGNAL_PATHS;
/**
 * Resolve the final URL for an HTTP OTLP exporter.
 *
 * - If the URL path already ends with the signal-specific path (e.g., /v1/traces),
 *   use it as-is. This supports explicit full-path configuration.
 * - Otherwise, append the signal-specific path to the base URL.
 */
export declare function resolveHttpOtlpUrl(baseEndpoint: string, signal: OtlpSignal): string;
export declare function isTelemetrySdkInitialized(): boolean;
export declare function initializeTelemetry(config: TelemetryRuntimeConfig): void;
/**
 * Refresh the session context with a new session ID.
 * Must be called whenever the session changes (e.g. /clear, /resume)
 * so that SessionIdSpanProcessor stamps spans with the correct session.id.
 */
export declare function refreshSessionContext(sessionId: string): void;
export declare function shutdownTelemetry(): Promise<void>;
export declare function forceFlushMetrics(): Promise<void>;
export {};
