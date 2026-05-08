/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  DEFAULT_OTLP_ENDPOINT,
  DEFAULT_TELEMETRY_TARGET,
  type TelemetryTarget,
} from '../telemetry/index.js';

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
  useCollector?: boolean;
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
  useCollector?: boolean;
}

/**
 * Telemetry configuration extracted from the monolithic Config class.
 * Owns all telemetry-related settings.
 *
 * This delegate is stateless — all inputs are provided at construction time.
 */
export class TelemetryConfig {
  private readonly settings: TelemetrySettings;

  constructor(params: TelemetryConfigParams) {
    this.settings = {
      enabled: params.enabled ?? false,
      target: params.target ?? DEFAULT_TELEMETRY_TARGET,
      otlpEndpoint: params.otlpEndpoint,
      otlpProtocol: params.otlpProtocol,
      otlpTracesEndpoint: params.otlpTracesEndpoint,
      otlpLogsEndpoint: params.otlpLogsEndpoint,
      otlpMetricsEndpoint: params.otlpMetricsEndpoint,
      logPrompts: params.logPrompts ?? true,
      includeSensitiveSpanAttributes:
        params.includeSensitiveSpanAttributes ?? false,
      outfile: params.outfile,
      useCollector: params.useCollector,
    };
  }

  getEnabled(): boolean {
    return this.settings.enabled ?? false;
  }

  getSettings(): TelemetrySettings {
    return this.settings;
  }

  getLogPromptsEnabled(): boolean {
    return this.settings.logPrompts ?? true;
  }

  getOtlpEndpoint(): string | undefined {
    return this.settings.otlpEndpoint ?? DEFAULT_OTLP_ENDPOINT;
  }

  getOtlpProtocol(): 'grpc' | 'http' {
    return this.settings.otlpProtocol ?? 'grpc';
  }

  getOtlpTracesEndpoint(): string | undefined {
    return this.settings.otlpTracesEndpoint;
  }

  getOtlpLogsEndpoint(): string | undefined {
    return this.settings.otlpLogsEndpoint;
  }

  getOtlpMetricsEndpoint(): string | undefined {
    return this.settings.otlpMetricsEndpoint;
  }

  getTarget(): TelemetryTarget {
    return this.settings.target ?? DEFAULT_TELEMETRY_TARGET;
  }

  getOutfile(): string | undefined {
    return this.settings.outfile;
  }

  getUseCollector(): boolean {
    return this.settings.useCollector ?? false;
  }
}
