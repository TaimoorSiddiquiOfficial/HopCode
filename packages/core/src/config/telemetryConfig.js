/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { DEFAULT_OTLP_ENDPOINT, DEFAULT_TELEMETRY_TARGET, } from '../telemetry/index.js';
/**
 * Telemetry configuration extracted from the monolithic Config class.
 * Owns all telemetry-related settings.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export class TelemetryConfig {
    settings;
    constructor(params) {
        this.settings = {
            enabled: params.enabled ?? false,
            target: params.target ?? DEFAULT_TELEMETRY_TARGET,
            otlpEndpoint: params.otlpEndpoint,
            otlpProtocol: params.otlpProtocol,
            otlpTracesEndpoint: params.otlpTracesEndpoint,
            otlpLogsEndpoint: params.otlpLogsEndpoint,
            otlpMetricsEndpoint: params.otlpMetricsEndpoint,
            logPrompts: params.logPrompts ?? true,
            includeSensitiveSpanAttributes: params.includeSensitiveSpanAttributes ?? false,
            outfile: params.outfile,
            resourceAttributes: params.resourceAttributes,
            metrics: params.metrics,
            resourceAttributeWarnings: params.resourceAttributeWarnings,
        };
    }
    getEnabled() {
        return this.settings.enabled ?? false;
    }
    getSettings() {
        return this.settings;
    }
    getLogPromptsEnabled() {
        return this.settings.logPrompts ?? true;
    }
    getOtlpEndpoint() {
        return this.settings.otlpEndpoint ?? DEFAULT_OTLP_ENDPOINT;
    }
    getOtlpProtocol() {
        return this.settings.otlpProtocol ?? 'grpc';
    }
    getOtlpTracesEndpoint() {
        return this.settings.otlpTracesEndpoint;
    }
    getOtlpLogsEndpoint() {
        return this.settings.otlpLogsEndpoint;
    }
    getOtlpMetricsEndpoint() {
        return this.settings.otlpMetricsEndpoint;
    }
    getTarget() {
        return this.settings.target ?? DEFAULT_TELEMETRY_TARGET;
    }
    getOutfile() {
        return this.settings.outfile;
    }
}
//# sourceMappingURL=telemetryConfig.js.map