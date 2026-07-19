import { describe, it, expect, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  canonicalizeWorkspacePath,
  getGlobalHopCodeDir,
  getWorkspaceScopeDirName,
  resolvePath,
} from './paths.js';

describe('channels/base paths – getGlobalHopCodeDir', () => {
  const originalEnv = process.env['HOPCODE_HOME'];

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env['HOPCODE_HOME'] = originalEnv;
    } else {
      delete process.env['HOPCODE_HOME'];
    }
  });

  it('defaults to ~/.hopcode when HOPCODE_HOME is not set', () => {
    delete process.env['HOPCODE_HOME'];
    expect(getGlobalHopCodeDir()).toBe(path.join(os.homedir(), '.hopcode'));
  });

  it('uses HOPCODE_HOME when set to absolute path', () => {
    const configDir = path.resolve('/tmp/custom-hopcode');
    process.env['HOPCODE_HOME'] = configDir;
    expect(getGlobalHopCodeDir()).toBe(configDir);
  });

  it('resolves relative HOPCODE_HOME against process.cwd', () => {
    process.env['HOPCODE_HOME'] = 'relative/config';
    expect(getGlobalHopCodeDir()).toBe(path.resolve('relative/config'));
  });

  it('expands tilde (~/x) in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~/custom-hopcode';
    expect(getGlobalHopCodeDir()).toBe(
      path.join(os.homedir(), 'custom-hopcode'),
    );
  });

  it('expands Windows-style tilde (~\\x) in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~\\custom-hopcode';
    expect(getGlobalHopCodeDir()).toBe(
      path.join(os.homedir(), 'custom-hopcode'),
    );
  });

  it('treats bare tilde (~) as home directory', () => {
    process.env['HOPCODE_HOME'] = '~';
    expect(getGlobalHopCodeDir()).toBe(os.homedir());
  });
});

describe('channels/base paths – resolvePath', () => {
  it('returns absolute paths unchanged', () => {
    const abs = path.resolve('/tmp/x');
    expect(resolvePath(abs)).toBe(abs);
  });

  it('expands bare tilde (~) to home directory', () => {
    expect(resolvePath('~')).toBe(path.normalize(os.homedir()));
  });

  it('expands POSIX-style tilde (~/x)', () => {
    expect(resolvePath('~/xomo')).toBe(path.join(os.homedir(), 'xomo'));
  });

  it('expands Windows-style tilde (~\\x)', () => {
    expect(resolvePath('~\\xomo')).toBe(path.join(os.homedir(), 'xomo'));
  });

  it('resolves relative paths against process.cwd', () => {
    expect(resolvePath('relative/dir')).toBe(path.resolve('relative/dir'));
  });
});

describe('canonicalizeWorkspacePath', () => {
  // Regression for the #7065 review finding: scope identity must follow the
  // repo's workspace-canonicalization contract (realpath after resolve), so
  // symlinked spellings of the same directory — e.g. macOS `/tmp/ws` vs
  // `/private/tmp/ws` — address the same store from the worker and the CLI.
  it('collapses a symlinked spelling to the same scope as the real path', () => {
    const real = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'ws-'));
    const link = `${real}-link`;
    fs.symlinkSync(real, link);
    try {
      expect(canonicalizeWorkspacePath(link)).toBe(
        canonicalizeWorkspacePath(real),
      );
      expect(getWorkspaceScopeDirName(link)).toBe(
        getWorkspaceScopeDirName(real),
      );
    } finally {
      fs.unlinkSync(link);
      fs.rmSync(real, { recursive: true, force: true });
    }
  });

  it('collapses trailing-separator and dot-dot spellings of a nonexistent path', () => {
    // The realpath step cannot help for paths that do not exist on disk, so
    // the resolved fallback itself must canonicalize equivalent spellings.
    const missing = path.join(os.tmpdir(), 'qwen-scope-missing-norm');
    expect(getWorkspaceScopeDirName(`${missing}${path.sep}`)).toBe(
      getWorkspaceScopeDirName(missing),
    );
    expect(
      getWorkspaceScopeDirName(
        path.join(missing, '..', 'qwen-scope-missing-norm'),
      ),
    ).toBe(getWorkspaceScopeDirName(missing));
  });

  it('keeps the resolved spelling for a path that does not exist (ENOENT fallback)', () => {
    const missing = path.join(os.tmpdir(), 'qwen-scope-missing', 'nested');
    expect(canonicalizeWorkspacePath(missing)).toBe(resolvePath(missing));
    // The scope name of a nonexistent path is exactly the one computed from
    // its resolved spelling — the realpath step degrades to a no-op.
    expect(getWorkspaceScopeDirName(missing)).toBe(
      getWorkspaceScopeDirName(resolvePath(missing)),
    );
  });
});
