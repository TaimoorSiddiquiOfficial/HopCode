/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { RepoMapService } from './repoMapService.js';
import type { RepoMapResult } from './repoMapService.js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as os from 'node:os';

describe('RepoMapService', () => {
  describe('format', () => {
    it('formats empty result', () => {
      const result: RepoMapResult = {
        entries: [],
        totalFiles: 0,
        seedFiles: [],
      };
      const output = RepoMapService.format(result, '/project');
      expect(output).toContain('top 0 of 0 files');
    });

    it('formats entries with exports', () => {
      const result: RepoMapResult = {
        entries: [
          {
            file: path.join('project', 'src', 'foo.ts'),
            exports: ['Foo', 'bar'],
            rank: 0.15,
          },
          {
            file: path.join('project', 'src', 'baz.ts'),
            exports: ['Baz'],
            rank: 0.1,
          },
        ],
        totalFiles: 5,
        seedFiles: [],
      };
      const output = RepoMapService.format(result, path.join('project'));
      expect(output).toContain('top 2 of 5 files');
      expect(output).toContain(path.join('src', 'foo.ts'));
      expect(output).toContain('Foo, bar');
      expect(output).toContain(path.join('src', 'baz.ts'));
      expect(output).toContain('Baz');
    });

    it('shows seed files when personalized', () => {
      const result: RepoMapResult = {
        entries: [
          {
            file: path.join('project', 'src', 'foo.ts'),
            exports: [],
            rank: 0.5,
          },
        ],
        totalFiles: 10,
        seedFiles: [path.join('project', 'src', 'bar.ts')],
      };
      const output = RepoMapService.format(result, path.join('project'));
      expect(output).toContain(path.join('Personalized from: src', 'bar.ts'));
    });

    it('truncates long export lists', () => {
      const result: RepoMapResult = {
        entries: [
          {
            file: path.join('project', 'src', 'big.ts'),
            exports: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            rank: 1.0,
          },
        ],
        totalFiles: 3,
        seedFiles: [],
      };
      const output = RepoMapService.format(result, path.join('project'));
      expect(output).toContain('A, B, C, D, E, F, G, H, ...');
      expect(output).not.toContain('I');
    });
  });

  describe('caching', () => {
    let tmpDir: string;

    beforeEach(async () => {
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-map-test-'));
    });

    afterEach(async () => {
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('returns empty result for empty directory', async () => {
      const service = new RepoMapService(tmpDir);
      const result = await service.getRelevantFiles();
      expect(result.totalFiles).toBe(0);
      expect(result.entries).toHaveLength(0);
    });

    it('discovers imports and ranks files', async () => {
      // Create a simple import graph: b.ts imports from a.ts
      await fs.writeFile(
        path.join(tmpDir, 'a.ts'),
        'export const foo = 1;\n',
        'utf8',
      );
      await fs.writeFile(
        path.join(tmpDir, 'b.ts'),
        "import { foo } from './a';\nexport const bar = 2;\n",
        'utf8',
      );

      const service = new RepoMapService(tmpDir);
      const result = await service.getRelevantFiles();

      expect(result.totalFiles).toBe(2);
      expect(result.entries.length).toBeGreaterThanOrEqual(1);
    });

    it('handles bare specifier imports (npm packages)', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'c.ts'),
        "import glob from 'glob';\nexport const x = 1;\n",
        'utf8',
      );

      const service = new RepoMapService(tmpDir);
      const result = await service.getRelevantFiles();
      expect(result.totalFiles).toBe(1);
      expect(result.entries).toHaveLength(1);
    });
  });

  describe('invalidate', () => {
    it('clears the in-memory cache', () => {
      const service = new RepoMapService('/tmp');
      service.invalidate();
      // After invalidation, getRelevantFiles will rebuild
      // (no assertion needed — just verify the method doesn't throw)
    });
  });

  describe('seed-based personalization', () => {
    let tmpDir: string;

    beforeEach(async () => {
      tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repo-map-seed-'));
    });

    afterEach(async () => {
      await fs.rm(tmpDir, { recursive: true, force: true });
    });

    it('returns seed file info in result', async () => {
      await fs.writeFile(
        path.join(tmpDir, 'seed.ts'),
        "import { dep } from './dep';\nexport const seed = 1;\n",
        'utf8',
      );
      await fs.writeFile(
        path.join(tmpDir, 'dep.ts'),
        'export const dep = 1;\n',
        'utf8',
      );

      const service = new RepoMapService(tmpDir);
      const seedPath = path.join(tmpDir, 'seed.ts');
      const result = await service.getRelevantFiles([seedPath]);

      expect(result.seedFiles).toContain(seedPath);
    });
  });
});
