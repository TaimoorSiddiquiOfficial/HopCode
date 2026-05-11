/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { TelemetryConfig } from './telemetryConfig.js';

describe('TelemetryConfig', () => {
  describe('getEnabled', () => {
    it('defaults to false when not provided', () => {
      const config = new TelemetryConfig({});
      expect(config.getEnabled()).toBe(false);
    });

    it('returns true when enabled', () => {
      const config = new TelemetryConfig({ enabled: true });
      expect(config.getEnabled()).toBe(true);
    });

    it('returns false when explicitly disabled', () => {
      const config = new TelemetryConfig({ enabled: false });
      expect(config.getEnabled()).toBe(false);
    });
  });

  describe('getLogPromptsEnabled', () => {
    it('defaults to true when not provided', () => {
      const config = new TelemetryConfig({});
      expect(config.getLogPromptsEnabled()).toBe(true);
    });

    it('returns false when disabled', () => {
      const config = new TelemetryConfig({ logPrompts: false });
      expect(config.getLogPromptsEnabled()).toBe(false);
    });
  });

  describe('getOtlpEndpoint', () => {
    it('returns configured endpoint', () => {
      const config = new TelemetryConfig({
        otlpEndpoint: 'http://localhost:4318',
      });
      expect(config.getOtlpEndpoint()).toBe('http://localhost:4318');
    });
  });

  describe('getOtlpProtocol', () => {
    it('defaults to grpc', () => {
      const config = new TelemetryConfig({});
      expect(config.getOtlpProtocol()).toBe('grpc');
    });

    it('returns http when configured', () => {
      const config = new TelemetryConfig({ otlpProtocol: 'http' });
      expect(config.getOtlpProtocol()).toBe('http');
    });
  });

  describe('per-signal endpoints', () => {
    it('returns undefined for traces endpoint when not provided', () => {
      const config = new TelemetryConfig({});
      expect(config.getOtlpTracesEndpoint()).toBeUndefined();
    });

    it('returns configured traces endpoint', () => {
      const config = new TelemetryConfig({
        otlpTracesEndpoint: 'http://trace.example.com',
      });
      expect(config.getOtlpTracesEndpoint()).toBe('http://trace.example.com');
    });

    it('returns configured logs endpoint', () => {
      const config = new TelemetryConfig({
        otlpLogsEndpoint: 'http://log.example.com',
      });
      expect(config.getOtlpLogsEndpoint()).toBe('http://log.example.com');
    });

    it('returns configured metrics endpoint', () => {
      const config = new TelemetryConfig({
        otlpMetricsEndpoint: 'http://metric.example.com',
      });
      expect(config.getOtlpMetricsEndpoint()).toBe('http://metric.example.com');
    });
  });

  describe('getTarget', () => {
    it('has a default target', () => {
      const config = new TelemetryConfig({});
      expect(typeof config.getTarget()).toBe('string');
    });
  });

  describe('getOutfile', () => {
    it('returns undefined by default', () => {
      const config = new TelemetryConfig({});
      expect(config.getOutfile()).toBeUndefined();
    });

    it('returns configured outfile', () => {
      const config = new TelemetryConfig({
        outfile: '/tmp/telemetry.json',
      });
      expect(config.getOutfile()).toBe('/tmp/telemetry.json');
    });
  });

  describe('getSettings', () => {
    it('returns the full settings object', () => {
      const config = new TelemetryConfig({
        enabled: true,
        target: 'local' as TelemetryTarget,
        logPrompts: false,
      });
      const settings = config.getSettings();
      expect(settings.enabled).toBe(true);
      expect(settings.logPrompts).toBe(false);
    });
  });
});

import type { TelemetryTarget } from '../telemetry/index.js';
