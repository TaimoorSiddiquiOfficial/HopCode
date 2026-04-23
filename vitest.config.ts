import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      'packages/cli',
      'packages/core',
      'packages/vscode-ide-companion',
      'packages/sdk-typescript',
      'packages/channels/base',
      'packages/channels/dingtalk',
      'packages/channels/telegram',
      'packages/channels/weixin',
      'integration-tests',
      'scripts',
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      include: ['packages/*/src/**/*', 'packages/channels/*/src/**/*'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.test.*',
        '**/*.spec.*',
      ],
    },
  },
});
