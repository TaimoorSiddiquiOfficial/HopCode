/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import fs from 'node:fs';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { Ignore, loadIgnoreRules } from './ignore.js';
import { createTmpDir, cleanupTmpDir, } from '../../test-utils/file-system-test-helpers.js';
const mockDebugLogger = vi.hoisted(() => ({
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    isEnabled: vi.fn(() => false),
}));
vi.mock('../debugLogger.js', () => ({
    createDebugLogger: () => mockDebugLogger,
}));
describe('Ignore', () => {
    describe('getDirectoryFilter', () => {
        it('should ignore directories matching directory patterns', () => {
            const ig = new Ignore().add(['foo/', 'bar/']);
            const dirFilter = ig.getDirectoryFilter();
            expect(dirFilter('foo/')).toBe(true);
            expect(dirFilter('bar/')).toBe(true);
            expect(dirFilter('baz/')).toBe(false);
        });
        it('should not ignore directories with file patterns', () => {
            const ig = new Ignore().add(['foo.js', '*.log']);
            const dirFilter = ig.getDirectoryFilter();
            expect(dirFilter('foo.js')).toBe(false);
            expect(dirFilter('foo.log')).toBe(false);
        });
    });
    describe('getFileFilter', () => {
        it('should not ignore files with directory patterns', () => {
            const ig = new Ignore().add(['foo/', 'bar/']);
            const fileFilter = ig.getFileFilter();
            expect(fileFilter('foo')).toBe(false);
            expect(fileFilter('foo/file.txt')).toBe(false);
        });
        it('should ignore files matching file patterns', () => {
            const ig = new Ignore().add(['*.log', 'foo.js']);
            const fileFilter = ig.getFileFilter();
            expect(fileFilter('foo.log')).toBe(true);
            expect(fileFilter('foo.js')).toBe(true);
            expect(fileFilter('bar.txt')).toBe(false);
        });
    });
    it('should accumulate patterns across multiple add() calls', () => {
        const ig = new Ignore().add('foo.js');
        ig.add('bar.js');
        const fileFilter = ig.getFileFilter();
        expect(fileFilter('foo.js')).toBe(true);
        expect(fileFilter('bar.js')).toBe(true);
        expect(fileFilter('baz.js')).toBe(false);
    });
    it('should return a stable and consistent fingerprint', () => {
        const ig1 = new Ignore().add(['foo', '!bar']);
        const ig2 = new Ignore().add('foo\n!bar');
        // Fingerprints should be identical for the same rules.
        expect(ig1.getFingerprint()).toBe(ig2.getFingerprint());
        // Adding a new rule should change the fingerprint.
        ig2.add('baz');
        expect(ig1.getFingerprint()).not.toBe(ig2.getFingerprint());
    });
    it('should include addSource patterns in the fingerprint', () => {
        const ig1 = new Ignore().addSource('build/');
        const ig2 = new Ignore().addSource('dist/');
        expect(ig1.getFingerprint()).not.toBe(ig2.getFingerprint());
    });
});
describe('loadIgnoreRules', () => {
    let tmpDir;
    afterEach(async () => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
        if (tmpDir) {
            await cleanupTmpDir(tmpDir);
        }
    });
    it('should load rules from .gitignore', async () => {
        tmpDir = await createTmpDir({
            '.gitignore': '*.log',
        });
        const ignore = loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: true,
            useHopcodeignore: false,
            ignoreDirs: [],
        });
        const fileFilter = ignore.getFileFilter();
        expect(fileFilter('test.log')).toBe(true);
        expect(fileFilter('test.txt')).toBe(false);
    });
    it('should load rules from .hopcodeignore', async () => {
        tmpDir = await createTmpDir({
            '.hopcodeignore': '*.log',
        });
        const ignore = loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: false,
            useHopcodeignore: true,
            ignoreDirs: [],
        });
        const fileFilter = ignore.getFileFilter();
        expect(fileFilter('test.log')).toBe(true);
        expect(fileFilter('test.txt')).toBe(false);
    });
    it('should combine rules from .gitignore and .hopcodeignore', async () => {
        tmpDir = await createTmpDir({
            '.gitignore': '*.log',
            '.hopcodeignore': '*.txt',
        });
        const ignore = loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: true,
            useHopcodeignore: true,
            ignoreDirs: [],
        });
        const fileFilter = ignore.getFileFilter();
        expect(fileFilter('test.log')).toBe(true);
        expect(fileFilter('test.txt')).toBe(true);
        expect(fileFilter('test.md')).toBe(false);
    });
    it('should add ignoreDirs', async () => {
        tmpDir = await createTmpDir({});
        const ignore = loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: false,
            useHopcodeignore: false,
            ignoreDirs: ['logs/'],
        });
        const dirFilter = ignore.getDirectoryFilter();
        expect(dirFilter('logs/')).toBe(true);
        expect(dirFilter('src/')).toBe(false);
    });
    it('should handle missing ignore files gracefully', async () => {
        tmpDir = await createTmpDir({});
        const ignore = loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: true,
            useHopcodeignore: true,
            ignoreDirs: [],
        });
        const fileFilter = ignore.getFileFilter();
        expect(fileFilter('anyfile.txt')).toBe(false);
    });
    it('should handle ignore files that cannot be read gracefully', async () => {
        tmpDir = await createTmpDir({
            '.hopcodeignore': '*.log',
        });
        const originalReadFileSync = fs.readFileSync;
        vi.spyOn(fs, 'readFileSync').mockImplementation(((filePath, options) => {
            if (String(filePath).endsWith('.hopcodeignore')) {
                throw new Error('ignore file disappeared');
            }
            return originalReadFileSync(filePath, options);
        }));
        expect(() => loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: false,
            usehopcodeignore: true,
            ignoreDirs: [],
        })).not.toThrow();
    });
    it('should warn when an existing ignore file cannot be read', async () => {
        tmpDir = await createTmpDir({
            '.agentignore': '*.log',
        });
        const originalReadFileSync = fs.readFileSync;
        vi.spyOn(fs, 'readFileSync').mockImplementation(((filePath, options) => {
            if (String(filePath).endsWith('.agentignore')) {
                const error = new Error('permission denied');
                error.code = 'EACCES';
                throw error;
            }
            return originalReadFileSync(filePath, options);
        }));
        expect(() => loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: false,
            usehopcodeignore: true,
            ignoreDirs: [],
        })).not.toThrow();
        expect(mockDebugLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Failed to read'));
    });
    it('should always add .git to the ignore list', async () => {
        tmpDir = await createTmpDir({});
        const ignore = loadIgnoreRules({
            projectRoot: tmpDir,
            useGitignore: false,
            useHopcodeignore: false,
            ignoreDirs: [],
        });
        const dirFilter = ignore.getDirectoryFilter();
        expect(dirFilter('.git/')).toBe(true);
    });
});
//# sourceMappingURL=ignore.test.js.map