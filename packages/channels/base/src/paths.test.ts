import { describe, it, expect, afterEach } from 'vitest';
import * as path from 'node:path';
import * as os from 'node:os';
import { getGlobalHopCodeDir, resolvePath } from './paths.js';

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
    expect(resolvePath('~')).toBe(os.homedir());
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

describe('channels/base paths – resolvePath', () => {
  it('returns absolute paths unchanged', () => {
    const abs = path.resolve('/tmp/x');
    expect(resolvePath(abs)).toBe(abs);
  });

  it('expands bare tilde (~) to home directory', () => {
    expect(resolvePath('~')).toBe(os.homedir());
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
