import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@hoptrendy/hopcode-cli/export': path.resolve(
        __dirname,
        '../cli/src/export/index.ts',
      ),
      '@hoptrendy/hopcode-core': path.resolve(
        __dirname,
        '../core/src/index.ts',
      ),
      '@hoptrendy/webui': path.resolve(
        __dirname,
        '../webui/src/index.ts',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.d.ts'],
    },
  },
});
