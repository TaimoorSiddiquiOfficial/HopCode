/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  parseBooleanEnvFlag,
  parseTelemetryTargetValue,
  resolveTelemetrySettings,
} from './config.js';
import { TelemetryTarget } from './index.js';

describe('telemetry/config helpers', () => {
  describe('parseBooleanEnvFlag', () => {
    it('returns undefined for undefined', () => {
      expect(parseBooleanEnvFlag(undefined)).toBeUndefined();
    });

    it('parses true values', () => {
      expect(parseBooleanEnvFlag('true')).toBe(true);
      expect(parseBooleanEnvFlag('1')).toBe(true);
    });

    it('parses false/other values as false', () => {
      expect(parseBooleanEnvFlag('false')).toBe(false);
      expect(parseBooleanEnvFlag('0')).toBe(false);
      expect(parseBooleanEnvFlag('TRUE')).toBe(false);
      expect(parseBooleanEnvFlag('random')).toBe(false);
      expect(parseBooleanEnvFlag('')).toBe(false);
    });
  });

  describe('parseTelemetryTargetValue', () => {
    it('parses string values', () => {
      expect(parseTelemetryTargetValue('local')).toBe(TelemetryTarget.LOCAL);
      expect(parseTelemetryTargetValue('gcp')).toBe(TelemetryTarget.GCP);
    });

    it('accepts enum values', () => {
      expect(parseTelemetryTargetValue(TelemetryTarget.LOCAL)).toBe(
        TelemetryTarget.LOCAL,
      );
      expect(parseTelemetryTargetValue(TelemetryTarget.GCP)).toBe(
        TelemetryTarget.GCP,
      );
    });

    it('returns undefined for unknown', () => {
      expect(parseTelemetryTargetValue('other')).toBeUndefined();
      expect(parseTelemetryTargetValue(undefined)).toBeUndefined();
    });
  });

  describe('resolveTelemetrySettings', () => {
    it('falls back to settings when no argv/env provided', async () => {
      const settings = {
        enabled: false,
        target: TelemetryTarget.LOCAL,
        otlpEndpoint: 'http://localhost:4317',
        otlpProtocol: 'grpc' as const,
        logPrompts: false,
        outfile: 'settings.log',
        useCollector: false,
      };
      const resolved = await resolveTelemetrySettings({ settings });
      expect(resolved).toEqual({
        ...settings,
        otlpTracesEndpoint: undefined,
        otlpLogsEndpoint: undefined,
        otlpMetricsEndpoint: undefined,
      });
    });

    it('uses env over settings and argv over env', async () => {
      const settings = {
        enabled: false,
        target: TelemetryTarget.LOCAL,
        otlpEndpoint: 'http://settings:4317',
        otlpProtocol: 'grpc' as const,
        logPrompts: false,
        outfile: 'settings.log',
        useCollector: false,
      };
      const env = {
        HOPCODE_TELEMETRY_ENABLED: '1',
        HOPCODE_TELEMETRY_TARGET: 'gcp',
        HOPCODE_TELEMETRY_OTLP_ENDPOINT: 'http://env:4317',
        HOPCODE_TELEMETRY_OTLP_PROTOCOL: 'http',
        HOPCODE_TELEMETRY_LOG_PROMPTS: 'true',
        HOPCODE_TELEMETRY_OUTFILE: 'env.log',
        HOPCODE_TELEMETRY_USE_COLLECTOR: 'true',
      } as Record<string, string>;
      const argv = {
        telemetry: false,
        telemetryTarget: 'local',
        telemetryOtlpEndpoint: 'http://argv:4317',
        telemetryOtlpProtocol: 'grpc',
        telemetryLogPrompts: false,
        telemetryOutfile: 'argv.log',
      };

      const resolvedEnv = await resolveTelemetrySettings({ env, settings });
      expect(resolvedEnv).toEqual({
        enabled: true,
        target: TelemetryTarget.GCP,
        otlpEndpoint: 'http://env:4317',
        otlpProtocol: 'http',
        logPrompts: true,
        outfile: 'env.log',
        useCollector: true,
        otlpTracesEndpoint: undefined,
        otlpLogsEndpoint: undefined,
        otlpMetricsEndpoint: undefined,
      });

      const resolvedArgv = await resolveTelemetrySettings({
        argv,
        env,
        settings,
      });
      expect(resolvedArgv).toEqual({
        enabled: false,
        target: TelemetryTarget.LOCAL,
        otlpEndpoint: 'http://argv:4317',
        otlpProtocol: 'grpc',
        logPrompts: false,
        outfile: 'argv.log',
        useCollector: true, // from env as no argv option
        otlpTracesEndpoint: undefined,
        otlpLogsEndpoint: undefined,
        otlpMetricsEndpoint: undefined,
      });
    });

    it('falls back to OTEL_EXPORTER_OTLP_ENDPOINT when GEMINI var is missing', async () => {
      const settings = {};
      const env = {
        OTEL_EXPORTER_OTLP_ENDPOINT: 'http://otel:4317',
      } as Record<string, string>;
      const resolved = await resolveTelemetrySettings({ env, settings });
      expect(resolved.otlpEndpoint).toBe('http://otel:4317');
    });

    it('throws on unknown protocol values', async () => {
      const env = { HOPCODE_TELEMETRY_OTLP_PROTOCOL: 'unknown' } as Record<
        string,
        string
      >;
      await expect(resolveTelemetrySettings({ env })).rejects.toThrow(
        /Invalid telemetry OTLP protocol/i,
      );
    });

    it('throws on unknown target values', async () => {
      const env = { HOPCODE_TELEMETRY_TARGET: 'unknown' } as Record<
        string,
        string
      >;
      await expect(resolveTelemetrySettings({ env })).rejects.toThrow(
        /Invalid telemetry target/i,
      );
    });

    it('resolves per-signal endpoints from HOPCODE_ env vars', async () => {
      const env = {
        HOPCODE_TELEMETRY_OTLP_TRACES_ENDPOINT: 'http://traces:4317/v1/traces',
        HOPCODE_TELEMETRY_OTLP_LOGS_ENDPOINT: 'http://logs:4317/v1/logs',
        HOPCODE_TELEMETRY_OTLP_METRICS_ENDPOINT:
          'http://metrics:4317/v1/metrics',
      } as Record<string, string>;
      const resolved = await resolveTelemetrySettings({ env });
      expect(resolved.otlpTracesEndpoint).toBe('http://traces:4317/v1/traces');
      expect(resolved.otlpLogsEndpoint).toBe('http://logs:4317/v1/logs');
      expect(resolved.otlpMetricsEndpoint).toBe(
        'http://metrics:4317/v1/metrics',
      );
    });

    it('falls back to QWEN_ env vars for per-signal endpoints', async () => {
      const env = {
        QWEN_TELEMETRY_OTLP_TRACES_ENDPOINT:
          'http://qwen-traces:4317/v1/traces',
        QWEN_TELEMETRY_OTLP_LOGS_ENDPOINT: 'http://qwen-logs:4317/v1/logs',
        QWEN_TELEMETRY_OTLP_METRICS_ENDPOINT:
          'http://qwen-metrics:4317/v1/metrics',
      } as Record<string, string>;
      const resolved = await resolveTelemetrySettings({ env });
      expect(resolved.otlpTracesEndpoint).toBe(
        'http://qwen-traces:4317/v1/traces',
      );
      expect(resolved.otlpLogsEndpoint).toBe('http://qwen-logs:4317/v1/logs');
      expect(resolved.otlpMetricsEndpoint).toBe(
        'http://qwen-metrics:4317/v1/metrics',
      );
    });

    it('HOPCODE_ env vars take precedence over QWEN_', async () => {
      const env = {
        HOPCODE_TELEMETRY_OTLP_TRACES_ENDPOINT: 'http://hopcode-traces:4317',
        QWEN_TELEMETRY_OTLP_TRACES_ENDPOINT: 'http://qwen-traces:4317',
      } as Record<string, string>;
      const resolved = await resolveTelemetrySettings({ env });
      expect(resolved.otlpTracesEndpoint).toBe('http://hopcode-traces:4317');
    });

    it('falls back to OTEL_ env vars for per-signal endpoints', async () => {
      const env = {
        OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: 'http://otel-traces:4317',
        OTEL_EXPORTER_OTLP_LOGS_ENDPOINT: 'http://otel-logs:4317',
        OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: 'http://otel-metrics:4317',
      } as Record<string, string>;
      const resolved = await resolveTelemetrySettings({ env });
      expect(resolved.otlpTracesEndpoint).toBe('http://otel-traces:4317');
      expect(resolved.otlpLogsEndpoint).toBe('http://otel-logs:4317');
      expect(resolved.otlpMetricsEndpoint).toBe('http://otel-metrics:4317');
    });

    it('per-signal endpoints come from settings fallback', async () => {
      const settings = {
        otlpTracesEndpoint: 'http://settings-traces:4317',
        otlpLogsEndpoint: 'http://settings-logs:4317',
        otlpMetricsEndpoint: 'http://settings-metrics:4317',
      };
      const resolved = await resolveTelemetrySettings({ settings });
      expect(resolved.otlpTracesEndpoint).toBe('http://settings-traces:4317');
      expect(resolved.otlpLogsEndpoint).toBe('http://settings-logs:4317');
      expect(resolved.otlpMetricsEndpoint).toBe('http://settings-metrics:4317');
    });

    it('argv per-signal endpoints take highest precedence', async () => {
      const argv = {
        telemetryOtlpTracesEndpoint: 'http://argv-traces:4317',
        telemetryOtlpLogsEndpoint: 'http://argv-logs:4317',
        telemetryOtlpMetricsEndpoint: 'http://argv-metrics:4317',
      };
      const env = {
        HOPCODE_TELEMETRY_OTLP_TRACES_ENDPOINT: 'http://env-traces:4317',
      } as Record<string, string>;
      const resolved = await resolveTelemetrySettings({ argv, env });
      expect(resolved.otlpTracesEndpoint).toBe('http://argv-traces:4317');
      expect(resolved.otlpLogsEndpoint).toBe('http://argv-logs:4317');
      expect(resolved.otlpMetricsEndpoint).toBe('http://argv-metrics:4317');
    });
  });
});
