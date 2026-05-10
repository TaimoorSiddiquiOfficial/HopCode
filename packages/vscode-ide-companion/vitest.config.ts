import path from 'node:path';
import { defineConfig, type Plugin } from 'vitest/config';

const coreSrcPath = path.resolve(__dirname, '../core/src');

/** Stub CSS imports so PostCSS/tailwind are never invoked during tests. */
const stubCssPlugin: Plugin = {
  name: 'stub-css',
  enforce: 'pre',
  transform(_, id) {
    if (id.endsWith('.css')) return { code: 'export default {}', map: null };
  },
};

export default defineConfig({
  plugins: [stubCssPlugin],
  resolve: {
    alias: [
      {
        // Sub-path imports: @hoptrendy/hopcode-core/src/foo/bar.js → packages/core/src/foo/bar.ts
        find: /^@hoptrendy\/hopcode-core\/src\/(.+)\.js$/,
        replacement: `${coreSrcPath}/$1.ts`,
      },
      {
        find: '@hoptrendy/hopcode-core',
        replacement: path.resolve(__dirname, '../core/src/index.ts'),
      },
      {
        find: '@hoptrendy/hopcode-cli/export',
        replacement: path.resolve(__dirname, '../cli/src/export/index.ts'),
      },
      {
        find: '@hoptrendy/webui',
        replacement: path.resolve(__dirname, '../webui/src/index.ts'),
      },
      {
        find: '@hoptrendy/quran-guidance',
        replacement: path.resolve(__dirname, '../quran-guidance/src/index.ts'),
      },
    ],
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
