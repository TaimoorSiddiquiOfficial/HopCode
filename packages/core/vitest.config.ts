/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { defineConfig } from 'vitest/config';
import path from 'node:path';

const TEST_TIMEOUT_MS = process.platform === 'win32' ? 15_000 : 5_000;

export default defineConfig({
  resolve: {
    alias: {
      '@hoptrendy/quran-guidance': path.resolve(
        __dirname,
        '../quran-guidance/src/index.ts',
      ),
    },
  },
  test: {
    reporters: ['default', 'junit'],
    silent: true,
    setupFiles: ['./test-setup.ts'],
    outputFile: {
      junit: 'junit.xml',
    },
    testTimeout: TEST_TIMEOUT_MS,
    // Don't fail on unhandled rejections - they're a Vitest fake-timer artifact
    dangerouslyIgnoreUnhandledErrors: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reportsDirectory: './coverage',
      include: ['src/**/*'],
      reporter: [
        ['text', { file: 'full-text-summary.txt' }],
        'html',
        'json',
        'lcov',
        'cobertura',
        ['json-summary', { outputFile: 'coverage-summary.json' }],
      ],
    },
    poolOptions: {
      threads: {
        minThreads: 8,
        maxThreads: 16,
      },
    },
  },
});
