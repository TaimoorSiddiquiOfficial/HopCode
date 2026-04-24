#!/usr/bin/env tsx
/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Provider Connectivity Diagnostic Tool
 *
 * Tests network connectivity to all configured AI provider endpoints
 * and generates a comprehensive status report.
 */

import { PROVIDER_REGISTRY } from '../packages/cli/src/commands/auth/registry.js';
import type { ProviderConfig } from '@hoptrendy/hopcode-core';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface DiagnosticResult {
  provider: ProviderConfig;
  status: 'reachable' | 'unreachable' | 'error' | 'skipped';
  responseTime?: number;
  statusCode?: number;
  errorMessage?: string;
  hasApiKey?: boolean;
}

interface ProviderStatus {
  id: string;
  label: string;
  baseUrl?: string;
  status: string;
  apiKeyConfigured: boolean;
  details: string;
}

/**
 * Check if an API key is configured for a provider
 */
function hasApiKey(envKey: string): boolean {
  if (!envKey) return false;
  const value = process.env[envKey];
  return !!value && value.length > 0;
}

/**
 * Test connectivity to a provider endpoint
 */
async function testProviderConnectivity(
  provider: ProviderConfig,
): Promise<DiagnosticResult> {
  const result: DiagnosticResult = {
    provider,
    status: 'skipped',
    hasApiKey: hasApiKey(provider.envKey),
  };

  // Skip providers without a base URL (native auth types)
  if (!provider.baseUrl) {
    result.status = 'skipped';
    result.errorMessage = 'Native auth provider (no HTTP endpoint)';
    return result;
  }

  // Skip local providers that may not be running
  const isLocalProvider =
    provider.id.includes('local') || provider.id.includes('localhost');
  if (isLocalProvider) {
    result.status = 'skipped';
    result.errorMessage =
      'Local provider - requires local service to be running';
    return result;
  }

  const startTime = Date.now();

  try {
    // Use a simple HEAD or GET request to test connectivity
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`${provider.baseUrl}/models`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          // Don't send Authorization header - just testing endpoint reachability
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      result.responseTime = Date.now() - startTime;
      result.statusCode = response.status;

      // Consider 2xx and 4xx (with body) as "reachable" - endpoint exists
      // 4xx often means "need auth" which is fine - endpoint is reachable
      if (
        response.status >= 200 ||
        response.status === 401 ||
        response.status === 403
      ) {
        result.status = 'reachable';
      } else {
        result.status = 'unreachable';
        result.errorMessage = `HTTP ${response.status}`;
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    result.status = 'error';
    result.responseTime = Date.now() - startTime;

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        result.errorMessage = 'Timeout (>10s)';
      } else if (error.message.includes('fetch failed')) {
        result.errorMessage = `Connection failed: ${error.message.split(':').slice(1).join(':') || 'network error'}`;
      } else if (error.message.includes('ENOTFOUND')) {
        result.errorMessage = 'DNS resolution failed';
      } else if (error.message.includes('ECONNREFUSED')) {
        result.errorMessage = 'Connection refused';
      } else if (error.message.includes('CERT_')) {
        result.errorMessage = 'SSL/TLS certificate error';
      } else {
        result.errorMessage = error.message;
      }
    } else {
      result.errorMessage = 'Unknown error';
    }
  }

  return result;
}

/**
 * Format a diagnostic result as a status line
 */
function formatStatus(result: DiagnosticResult): ProviderStatus {
  const {
    provider,
    status,
    responseTime,
    statusCode,
    errorMessage,
    hasApiKey,
  } = result;

  let details = '';
  let statusIcon = '';

  switch (status) {
    case 'reachable':
      statusIcon = '✓';
      details = `HTTP ${statusCode} (${responseTime}ms)`;
      if (!hasApiKey && provider.requiresApiKey) {
        details += ' ⚠️ No API key';
      }
      break;
    case 'unreachable':
      statusIcon = '✕';
      details = errorMessage || 'Unreachable';
      break;
    case 'error':
      statusIcon = '✕';
      details = errorMessage || 'Error';
      break;
    case 'skipped':
      statusIcon = '○';
      details = errorMessage || 'Skipped';
      break;
  }

  return {
    id: provider.id,
    label: provider.label,
    baseUrl: provider.baseUrl,
    status: statusIcon,
    apiKeyConfigured: !!hasApiKey,
    details,
  };
}

/**
 * Generate a markdown report from diagnostic results
 */
function generateReport(results: DiagnosticResult[]): string {
  const statuses = results.map(formatStatus);

  const lines: string[] = [];

  lines.push('# HopCode API Provider Diagnostic Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  // Summary
  const reachable = statuses.filter((s) => s.status === '✓').length;
  const unreachable = statuses.filter((s) => s.status === '✕').length;
  const skipped = statuses.filter((s) => s.status === '○').length;

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **Total Providers**: ${statuses.length}`);
  lines.push(`- **Reachable**: ${reachable}`);
  lines.push(`- **Unreachable/Errors**: ${unreachable}`);
  lines.push(`- **Skipped**: ${skipped} (native auth or local providers)`);
  lines.push('');

  // Detailed status table
  lines.push('## Provider Status');
  lines.push('');
  lines.push('| Status | Provider | Base URL | API Key | Details |');
  lines.push('|--------|----------|----------|---------|---------|');

  for (const status of statuses) {
    const urlDisplay = status.baseUrl
      ? `\`${status.baseUrl}\``
      : 'N/A (native auth)';
    const apiKeyStatus = status.apiKeyConfigured ? '✓' : '✕';
    lines.push(
      `| ${status.status} | ${status.label} (\`${status.id}\`) | ${urlDisplay} | ${apiKeyStatus} | ${status.details} |`,
    );
  }

  lines.push('');

  // Issues section
  const issues = statuses.filter((s) => s.status === '✕');
  if (issues.length > 0) {
    lines.push('## Issues Detected');
    lines.push('');
    for (const issue of issues) {
      lines.push(`### ${issue.label} (\`${issue.id}\`)`);
      lines.push('');
      lines.push(`- **Status**: ${issue.status}`);
      lines.push(`- **Base URL**: ${issue.baseUrl || 'N/A'}`);
      lines.push(`- **Issue**: ${issue.details}`);
      lines.push('');
      lines.push('**Troubleshooting:**');
      if (issue.details.includes('DNS')) {
        lines.push('- Check your network connection and DNS settings');
        lines.push('- Verify the base URL is correct');
      } else if (issue.details.includes('Timeout')) {
        lines.push('- The endpoint is slow to respond');
        lines.push('- Check for firewall or proxy issues');
      } else if (issue.details.includes('Connection refused')) {
        lines.push('- The service may be down');
        lines.push('- Check if the host is reachable');
      } else if (issue.details.includes('certificate')) {
        lines.push('- SSL/TLS certificate validation failed');
        lines.push('- Check your system certificates');
      } else {
        lines.push('- Verify network connectivity');
        lines.push('- Check firewall/proxy settings');
        lines.push('- Verify the API endpoint is accessible');
      }
      lines.push('');
    }
  }

  // Recommendations
  lines.push('## Recommendations');
  lines.push('');

  const noApiKey = statuses.filter(
    (s) => s.apiKeyConfigured === false && s.status !== '○',
  );
  if (noApiKey.length > 0) {
    lines.push('### Missing API Keys');
    lines.push('');
    lines.push(
      'The following providers are reachable but do not have API keys configured:',
    );
    lines.push('');
    for (const provider of noApiKey) {
      lines.push(
        `- **${provider.label}**: Run \`hopcode auth ${provider.id}\` to configure`,
      );
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Main diagnostic function
 */
async function runDiagnostics(): Promise<void> {
  console.log('HopCode API Provider Diagnostic Tool\n');
  console.log(`Testing ${PROVIDER_REGISTRY.length} providers...\n`);

  const results: DiagnosticResult[] = [];

  // Test providers in parallel with concurrency limit
  const concurrencyLimit = 5;
  for (let i = 0; i < PROVIDER_REGISTRY.length; i += concurrencyLimit) {
    const batch = PROVIDER_REGISTRY.slice(i, i + concurrencyLimit);
    const batchResults = await Promise.all(batch.map(testProviderConnectivity));
    results.push(...batchResults);

    // Progress update
    const completed = Math.min(i + concurrencyLimit, PROVIDER_REGISTRY.length);
    console.log(`Tested ${completed}/${PROVIDER_REGISTRY.length} providers...`);
  }

  console.log('\n');

  // Generate and display report
  const report = generateReport(results);
  console.log(report);

  // Also write to file
  const outputPath = join(__dirname, '..', 'DIAGNOSTICS.md');
  writeFileSync(outputPath, report);
  console.log(`\nFull report written to: ${outputPath}`);

  // Exit with error if any providers are unreachable
  const unreachable = results.filter(
    (r) => r.status === 'error' || r.status === 'unreachable',
  ).length;
  if (unreachable > 0) {
    console.log(`\n⚠️  ${unreachable} provider(s) have connectivity issues`);
  } else {
    console.log('\n✓ All reachable providers are healthy');
  }
}

// Run diagnostics
runDiagnostics().catch((error) => {
  console.error('Diagnostic failed:', error);
  process.exit(1);
});
