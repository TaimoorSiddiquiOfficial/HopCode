/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@hoptrendy/hopcode-core/transcriptRecords': path.resolve(
        __dirname,
        '../core/src/utils/transcript-records.ts',
      ),
      '@hoptrendy/hopcode-core': path.resolve(__dirname, '../core/index.ts'),
      // cli's daemon-status-provider.test.ts imports `FakeAgent` /
      // `makeChannel` from acp-bridge's package-private
      // `internal/testUtils` module. This alias overrides the runtime
      // resolution so vitest reads the .ts source directly instead of
      // the build-then-stale `dist/` copy.
      '@hoptrendy/acp-bridge/internal/testUtils': path.resolve(
        __dirname,
        '../acp-bridge/src/internal/testUtils.ts',
      ),
      // Same rationale as above: bridgeErrors and status subpaths
      // resolve to dist/ via package.json exports, but tests in the
      // monorepo worktree need the live source (dist may be stale or
      // absent during development).
      '@hoptrendy/acp-bridge/bridgeErrors': path.resolve(
        __dirname,
        '../acp-bridge/src/bridgeErrors.ts',
      ),
      '@hoptrendy/acp-bridge/status': path.resolve(
        __dirname,
        '../acp-bridge/src/status.ts',
      ),
      '@hoptrendy/acp-bridge/bridge': path.resolve(
        __dirname,
        '../acp-bridge/src/bridge.ts',
      ),
      '@hoptrendy/acp-bridge/spawnChannel': path.resolve(
        __dirname,
        '../acp-bridge/src/spawnChannel.ts',
      ),
      '@hoptrendy/acp-bridge/bridgeClient': path.resolve(
        __dirname,
        '../acp-bridge/src/bridgeClient.ts',
      ),
      '@hoptrendy/acp-bridge/bridgeOptions': path.resolve(
        __dirname,
        '../acp-bridge/src/bridgeOptions.ts',
      ),
      '@hoptrendy/acp-bridge/bridgeTypes': path.resolve(
        __dirname,
        '../acp-bridge/src/bridgeTypes.ts',
      ),
      '@hoptrendy/acp-bridge/bridgeFileSystem': path.resolve(
        __dirname,
        '../acp-bridge/src/bridgeFileSystem.ts',
      ),
      '@hoptrendy/acp-bridge/sessionArtifacts': path.resolve(
        __dirname,
        '../acp-bridge/src/sessionArtifacts.ts',
      ),
      '@hoptrendy/acp-bridge/eventBus': path.resolve(
        __dirname,
        '../acp-bridge/src/eventBus.ts',
      ),
      '@hoptrendy/acp-bridge/replayWindowLimits': path.resolve(
        __dirname,
        '../acp-bridge/src/replayWindowLimits.ts',
      ),
      '@hoptrendy/acp-bridge/transcriptReplay': path.resolve(
        __dirname,
        '../acp-bridge/src/transcript-replay.ts',
      ),
      '@hoptrendy/acp-bridge/workspacePaths': path.resolve(
        __dirname,
        '../acp-bridge/src/workspacePaths.ts',
      ),
      '@hoptrendy/channel-base': path.resolve(
        __dirname,
        '../channels/base/src/index.ts',
      ),
      '@hoptrendy/channel-telegram': path.resolve(
        __dirname,
        '../channels/telegram/src/index.ts',
      ),
      '@hoptrendy/channel-weixin/accounts': path.resolve(
        __dirname,
        '../channels/weixin/src/accounts.ts',
      ),
      '@hoptrendy/channel-weixin/login': path.resolve(
        __dirname,
        '../channels/weixin/src/login.ts',
      ),
      '@hoptrendy/channel-weixin': path.resolve(
        __dirname,
        '../channels/weixin/src/index.ts',
      ),
      '@hoptrendy/channel-dingtalk': path.resolve(
        __dirname,
        '../channels/dingtalk/src/index.ts',
      ),
      '@hoptrendy/channel-feishu': path.resolve(
        __dirname,
        '../channels/feishu/src/index.ts',
      ),
      '@hoptrendy/channel-qqbot': path.resolve(
        __dirname,
        '../channels/qqbot/src/index.ts',
      ),
      '@hoptrendy/quran-guidance': path.resolve(
        __dirname,
        '../quran-guidance/src/index.ts',
      ),
      '@hoptrendy/sdk/daemon/transcript': path.resolve(
        __dirname,
        '../sdk-typescript/src/daemon/transcript.ts',
      ),
      '@hoptrendy/sdk/daemon/ui/transcript': path.resolve(
        __dirname,
        '../sdk-typescript/src/daemon/ui/transcript.ts',
      ),
      '@hoptrendy/sdk/daemon/types': path.resolve(
        __dirname,
        '../sdk-typescript/src/daemon/types.ts',
      ),
      '@hoptrendy/sdk/daemon': path.resolve(
        __dirname,
        '../sdk-typescript/src/daemon/index.ts',
      ),
    },
  },
  test: {
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', 'config.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/cypress/**'],
    environment: 'jsdom',
    globals: true,
    reporters: ['default', 'junit'],
    silent: true,
    outputFile: {
      junit: 'junit.xml',
    },
    setupFiles: ['./test-setup.ts'],
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
    server: {
      deps: {
        inline: [/@hopcode\/hopcode-core/],
      },
    },
  },
});
