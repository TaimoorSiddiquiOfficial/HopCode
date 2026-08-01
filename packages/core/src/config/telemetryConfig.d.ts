/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { type TelemetryTarget } from '../telemetry/index.js';
export interface TelemetrySettings {
    enabled?: boolean;
    target?: TelemetryTarget;
    otlpEndpoint?: string;
    otlpProtocol?: 'grpc' | 'http';
    /** Per-signal endpoint override for traces (HTTP only). Used as-is without path appending. */
    otlpTracesEndpoint?: string;
    /** Per-signal endpoint override for logs (HTTP only). Used as-is without path appending. */
    otlpLogsEndpoint?: string;
    /** Per-signal endpoint override for metrics (HTTP only). Used as-is without path appending. */
    otlpMetricsEndpoint?: string;
    logPrompts?: boolean;
    includeSensitiveSpanAttributes?: boolean;
    outfile?: string;
    resourceAttributes?: Record<string, string>;
    metrics?: {
        includeSessionId?: boolean;
    };
    resourceAttributeWarnings?: string[];
}
export interface TelemetryConfigParams {
    enabled?: boolean;
    target?: TelemetryTarget;
    otlpEndpoint?: string;
    otlpProtocol?: 'grpc' | 'http';
    otlpTracesEndpoint?: string;
    otlpLogsEndpoint?: string;
    otlpMetricsEndpoint?: string;
    logPrompts?: boolean;
    includeSensitiveSpanAttributes?: boolean;
    outfile?: string;
    resourceAttributes?: Record<string, string>;
    metrics?: {
        includeSessionId?: boolean;
    };
    resourceAttributeWarnings?: string[];
}
/**
 * Telemetry configuration extracted from the monolithic Config class.
 * Owns all telemetry-related settings.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export declare class TelemetryConfig {
    private readonly settings;
    constructor(params: TelemetryConfigParams);
    getEnabled(): boolean;
    getSettings(): TelemetrySettings;
    getLogPromptsEnabled(): boolean;
    getOtlpEndpoint(): string | undefined;
    getOtlpProtocol(): 'grpc' | 'http';
    getOtlpTracesEndpoint(): string | undefined;
    getOtlpLogsEndpoint(): string | undefined;
    getOtlpMetricsEndpoint(): string | undefined;
    getTarget(): TelemetryTarget;
    getOutfile(): string | undefined;
}
