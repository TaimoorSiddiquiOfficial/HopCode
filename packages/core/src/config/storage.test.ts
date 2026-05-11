/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as os from 'node:os';
import * as path from 'node:path';
import { Storage } from './storage.js';

describe('Storage ? getGlobalSettingsPath', () => {
  it('returns path to ~/.hopcode/settings.json', () => {
    const expected = path.join(os.homedir(), '.hopcode', 'settings.json');
    expect(Storage.getGlobalSettingsPath()).toBe(expected);
  });
});

describe('Storage ? additional helpers', () => {
  const projectRoot = '/tmp/project';
  const storage = new Storage(projectRoot);

  it('getWorkspaceSettingsPath returns project/.hopcode/settings.json', () => {
    const expected = path.join(projectRoot, '.hopcode', 'settings.json');
    expect(storage.getWorkspaceSettingsPath()).toBe(expected);
  });

  it('getUserCommandsDir returns ~/.hopcode/commands', () => {
    const expected = path.join(os.homedir(), '.hopcode', 'commands');
    expect(Storage.getUserCommandsDir()).toBe(expected);
  });

  it('getProjectCommandsDir returns project/.hopcode/commands', () => {
    const expected = path.join(projectRoot, '.hopcode', 'commands');
    expect(storage.getProjectCommandsDir()).toBe(expected);
  });

  it('getMcpOAuthTokensPath returns ~/.hopcode/mcp-oauth-tokens.json', () => {
    const expected = path.join(
      os.homedir(),
      '.hopcode',
      'mcp-oauth-tokens.json',
    );
    expect(Storage.getMcpOAuthTokensPath()).toBe(expected);
  });
});

describe('Storage ? getRuntimeBaseDir / setRuntimeBaseDir', () => {
  const originalEnv = process.env['HOPCODE_RUNTIME_DIR'];

  beforeEach(() => {
    // Reset state before each test
    Storage.setRuntimeBaseDir(null);
    delete process.env['HOPCODE_RUNTIME_DIR'];
  });

  afterEach(() => {
    // Restore original env
    Storage.setRuntimeBaseDir(null);
    if (originalEnv !== undefined) {
      process.env['HOPCODE_RUNTIME_DIR'] = originalEnv;
    } else {
      delete process.env['HOPCODE_RUNTIME_DIR'];
    }
  });

  it('defaults to getGlobalHopCodeDir() when nothing is configured', () => {
    expect(Storage.getRuntimeBaseDir()).toBe(Storage.getGlobalHopCodeDir());
  });

  it('uses setRuntimeBaseDir value when set with absolute path', () => {
    const runtimeDir = path.resolve('custom', 'runtime');
    Storage.setRuntimeBaseDir(runtimeDir);
    expect(Storage.getRuntimeBaseDir()).toBe(runtimeDir);
  });

  it('env var HOPCODE_RUNTIME_DIR takes priority over setRuntimeBaseDir', () => {
    const settingsDir = path.resolve('from-settings');
    const envDir = path.resolve('from-env');
    Storage.setRuntimeBaseDir(settingsDir);
    process.env['HOPCODE_RUNTIME_DIR'] = envDir;
    expect(Storage.getRuntimeBaseDir()).toBe(envDir);
  });

  it('expands tilde (~) in setRuntimeBaseDir', () => {
    Storage.setRuntimeBaseDir('~/custom-runtime');
    const expected = path.join(os.homedir(), 'custom-runtime');
    expect(Storage.getRuntimeBaseDir()).toBe(expected);
  });

  it('expands Windows-style tilde paths in setRuntimeBaseDir', () => {
    Storage.setRuntimeBaseDir('~\\custom-runtime');
    const expected = path.join(os.homedir(), 'custom-runtime');
    expect(Storage.getRuntimeBaseDir()).toBe(expected);
  });

  it('expands tilde (~) in HOPCODE_RUNTIME_DIR env var', () => {
    process.env['HOPCODE_RUNTIME_DIR'] = '~/env-runtime';
    const expected = path.join(os.homedir(), 'env-runtime');
    expect(Storage.getRuntimeBaseDir()).toBe(expected);
  });

  it('resolves relative paths in setRuntimeBaseDir using process.cwd by default', () => {
    Storage.setRuntimeBaseDir('relative/path');
    const expected = path.resolve('relative/path');
    expect(Storage.getRuntimeBaseDir()).toBe(expected);
  });

  it('resolves relative paths in setRuntimeBaseDir using explicit cwd', () => {
    const cwd = path.resolve('workspace', 'projectA');
    Storage.setRuntimeBaseDir('.hopcode', cwd);
    expect(Storage.getRuntimeBaseDir()).toBe(path.join(cwd, '.hopcode'));
  });

  it('ignores cwd when path is absolute', () => {
    const absolutePath = path.resolve('absolute', 'path');
    const cwd = path.resolve('workspace', 'projectA');
    Storage.setRuntimeBaseDir(absolutePath, cwd);
    expect(Storage.getRuntimeBaseDir()).toBe(absolutePath);
  });

  it('ignores cwd when path starts with tilde', () => {
    Storage.setRuntimeBaseDir(
      '~/runtime',
      path.resolve('workspace', 'projectA'),
    );
    const expected = path.join(os.homedir(), 'runtime');
    expect(Storage.getRuntimeBaseDir()).toBe(expected);
  });

  it('resolves relative paths in HOPCODE_RUNTIME_DIR env var', () => {
    process.env['HOPCODE_RUNTIME_DIR'] = 'relative/env-path';
    const expected = path.resolve('relative/env-path');
    expect(Storage.getRuntimeBaseDir()).toBe(expected);
  });

  it('resets to default when setRuntimeBaseDir is called with null', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    expect(Storage.getRuntimeBaseDir()).toBe(customDir);

    Storage.setRuntimeBaseDir(null);
    expect(Storage.getRuntimeBaseDir()).toBe(Storage.getGlobalHopCodeDir());
  });

  it('resets to default when setRuntimeBaseDir is called with undefined', () => {
    Storage.setRuntimeBaseDir(path.resolve('custom'));
    Storage.setRuntimeBaseDir(undefined);
    expect(Storage.getRuntimeBaseDir()).toBe(Storage.getGlobalHopCodeDir());
  });

  it('resets to default when setRuntimeBaseDir is called with empty string', () => {
    Storage.setRuntimeBaseDir(path.resolve('custom'));
    Storage.setRuntimeBaseDir('');
    expect(Storage.getRuntimeBaseDir()).toBe(Storage.getGlobalHopCodeDir());
  });

  it('handles bare tilde (~) as home directory', () => {
    Storage.setRuntimeBaseDir('~');
    expect(Storage.getRuntimeBaseDir()).toBe(os.homedir());
  });
});

describe('Storage ? runtime path methods use getRuntimeBaseDir', () => {
  const originalEnv = process.env['HOPCODE_RUNTIME_DIR'];

  beforeEach(() => {
    Storage.setRuntimeBaseDir(null);
    delete process.env['HOPCODE_RUNTIME_DIR'];
  });

  afterEach(() => {
    Storage.setRuntimeBaseDir(null);
    if (originalEnv !== undefined) {
      process.env['HOPCODE_RUNTIME_DIR'] = originalEnv;
    } else {
      delete process.env['HOPCODE_RUNTIME_DIR'];
    }
  });

  it('getGlobalTempDir uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    expect(Storage.getGlobalTempDir()).toBe(path.join(customDir, 'tmp'));
  });

  it('getGlobalDebugDir uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    expect(Storage.getGlobalDebugDir()).toBe(path.join(customDir, 'debug'));
  });

  it('getDebugLogPath uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    expect(Storage.getDebugLogPath('session-123')).toBe(
      path.join(customDir, 'debug', 'session-123.txt'),
    );
  });

  it('getGlobalIdeDir is anchored to the global Qwen dir, not runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    // IDE lock files are discovery anchors shared with the VS Code companion,
    // which can only see env vars (not settings-based runtimeOutputDir), so
    // getGlobalIdeDir must follow getGlobalHopCodeDir to keep both sides aligned.
    expect(Storage.getGlobalIdeDir()).toBe(
      path.join(Storage.getGlobalHopCodeDir(), 'ide'),
    );
  });

  it('getProjectDir uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    const storage = new Storage('/tmp/project');
    expect(storage.getProjectDir()).toContain(path.join(customDir, 'projects'));
  });

  it('getHistoryDir uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    const storage = new Storage('/tmp/project');
    expect(storage.getHistoryDir()).toContain(path.join(customDir, 'history'));
  });

  it('getProjectTempDir uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    const storage = new Storage('/tmp/project');
    expect(storage.getProjectTempDir()).toContain(path.join(customDir, 'tmp'));
  });

  it('getProjectTempCheckpointsDir uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    const storage = new Storage('/tmp/project');
    expect(storage.getProjectTempCheckpointsDir()).toContain(
      path.join(customDir, 'tmp'),
    );
    expect(storage.getProjectTempCheckpointsDir()).toMatch(/checkpoints$/);
  });

  it('getHistoryFilePath uses custom runtime base dir', () => {
    const customDir = path.resolve('custom');
    Storage.setRuntimeBaseDir(customDir);
    const storage = new Storage('/tmp/project');
    expect(storage.getHistoryFilePath()).toContain(path.join(customDir, 'tmp'));
    expect(storage.getHistoryFilePath()).toMatch(/shell_history$/);
  });
});

describe('Storage ? config paths remain at ~/.hopcode regardless of runtime dir', () => {
  const originalEnv = process.env['HOPCODE_RUNTIME_DIR'];
  const globalHopcodeDir = Storage.getGlobalHopCodeDir();

  beforeEach(() => {
    Storage.setRuntimeBaseDir(path.resolve('custom-runtime'));
    process.env['HOPCODE_RUNTIME_DIR'] = path.resolve('env-runtime');
  });

  afterEach(() => {
    Storage.setRuntimeBaseDir(null);
    if (originalEnv !== undefined) {
      process.env['HOPCODE_RUNTIME_DIR'] = originalEnv;
    } else {
      delete process.env['HOPCODE_RUNTIME_DIR'];
    }
  });

  it('getGlobalSettingsPath still uses ~/.hopcode', () => {
    expect(Storage.getGlobalSettingsPath()).toBe(
      path.join(globalHopcodeDir, 'settings.json'),
    );
  });

  it('getInstallationIdPath still uses ~/.hopcode', () => {
    expect(Storage.getInstallationIdPath()).toBe(
      path.join(globalHopcodeDir, 'installation_id'),
    );
  });

  it('getGoogleAccountsPath still uses ~/.hopcode', () => {
    expect(Storage.getGoogleAccountsPath()).toBe(
      path.join(globalHopcodeDir, 'google_accounts.json'),
    );
  });

  it('getMcpOAuthTokensPath still uses ~/.hopcode', () => {
    expect(Storage.getMcpOAuthTokensPath()).toBe(
      path.join(globalHopcodeDir, 'mcp-oauth-tokens.json'),
    );
  });

  it('getOAuthCredsPath still uses ~/.hopcode', () => {
    expect(Storage.getOAuthCredsPath()).toBe(
      path.join(globalHopcodeDir, 'oauth_creds.json'),
    );
  });

  it('getUserCommandsDir still uses ~/.hopcode', () => {
    expect(Storage.getUserCommandsDir()).toBe(
      path.join(globalHopcodeDir, 'commands'),
    );
  });

  it('getGlobalMemoryFilePath still uses ~/.hopcode', () => {
    expect(Storage.getGlobalMemoryFilePath()).toBe(
      path.join(globalHopcodeDir, 'memory.md'),
    );
  });

  it('getGlobalBinDir still uses ~/.hopcode', () => {
    expect(Storage.getGlobalBinDir()).toBe(path.join(globalHopcodeDir, 'bin'));
  });

  it('getUserSkillsDirs still includes ~/.hopcode/skills', () => {
    const storage = new Storage('/tmp/project');
    const skillsDirs = storage.getUserSkillsDirs();
    expect(
      skillsDirs.some((dir) => dir === path.join(globalHopcodeDir, 'skills')),
    ).toBe(true);
  });
});

describe('Storage – HOPCODE_HOME env var', () => {
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
    const expected = path.join(os.homedir(), '.hopcode');
    expect(Storage.getGlobalHopCodeDir()).toBe(expected);
  });

  it('uses HOPCODE_HOME when set to absolute path', () => {
    const configDir = path.resolve('/tmp/custom-hopcode');
    process.env['HOPCODE_HOME'] = configDir;
    expect(Storage.getGlobalHopCodeDir()).toBe(configDir);
  });

  it('resolves relative HOPCODE_HOME to absolute path', () => {
    process.env['HOPCODE_HOME'] = 'relative/config';
    const expected = path.resolve('relative/config');
    expect(Storage.getGlobalHopCodeDir()).toBe(expected);
  });

  it('config paths follow HOPCODE_HOME', () => {
    const configDir = path.resolve('/tmp/custom-hopcode');
    process.env['HOPCODE_HOME'] = configDir;
    expect(Storage.getGlobalSettingsPath()).toBe(
      path.join(configDir, 'settings.json'),
    );
    expect(Storage.getInstallationIdPath()).toBe(
      path.join(configDir, 'installation_id'),
    );
    expect(Storage.getUserCommandsDir()).toBe(path.join(configDir, 'commands'));
    expect(Storage.getMcpOAuthTokensPath()).toBe(
      path.join(configDir, 'mcp-oauth-tokens.json'),
    );
    expect(Storage.getOAuthCredsPath()).toBe(
      path.join(configDir, 'oauth_creds.json'),
    );
    expect(Storage.getGlobalBinDir()).toBe(path.join(configDir, 'bin'));
    expect(Storage.getGlobalMemoryFilePath()).toBe(
      path.join(configDir, 'memory.md'),
    );
  });

  it('project-level paths are NOT affected by HOPCODE_HOME', () => {
    const configDir = path.resolve('/tmp/custom-hopcode');
    const projectDir = path.resolve('/tmp/project');
    process.env['HOPCODE_HOME'] = configDir;
    const storage = new Storage(projectDir);
    expect(storage.getWorkspaceSettingsPath()).toBe(
      path.join(projectDir, '.hopcode', 'settings.json'),
    );
    expect(storage.getProjectCommandsDir()).toBe(
      path.join(projectDir, '.hopcode', 'commands'),
    );
  });

  it('expands tilde (~) in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~/custom-hopcode';
    const expected = path.join(os.homedir(), 'custom-hopcode');
    expect(Storage.getGlobalHopCodeDir()).toBe(expected);
  });

  it('expands Windows-style tilde in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~\\custom-hopcode';
    const expected = path.join(os.homedir(), 'custom-hopcode');
    expect(Storage.getGlobalHopCodeDir()).toBe(expected);
  });

  it('handles bare tilde (~) as home directory in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~';
    expect(Storage.getGlobalHopCodeDir()).toBe(os.homedir());
  });

  it('HOPCODE_HOME and HOPCODE_RUNTIME_DIR are independent', () => {
    const configDir = path.resolve('/tmp/config');
    const runtimeDir = path.resolve('/tmp/runtime');
    process.env['HOPCODE_HOME'] = configDir;
    process.env['HOPCODE_RUNTIME_DIR'] = runtimeDir;
    expect(Storage.getGlobalHopCodeDir()).toBe(configDir);
    expect(Storage.getRuntimeBaseDir()).toBe(runtimeDir);
    expect(Storage.getGlobalSettingsPath()).toBe(
      path.join(configDir, 'settings.json'),
    );
    expect(Storage.getGlobalTempDir()).toBe(path.join(runtimeDir, 'tmp'));
    expect(Storage.getGlobalDebugDir()).toBe(path.join(runtimeDir, 'debug'));
    delete process.env['HOPCODE_RUNTIME_DIR'];
  });
});

describe('Storage – runtime base dir async context isolation', () => {
  const originalEnv = process.env['HOPCODE_RUNTIME_DIR'];

  beforeEach(() => {
    Storage.setRuntimeBaseDir(null);
    delete process.env['HOPCODE_RUNTIME_DIR'];
  });

  afterEach(() => {
    Storage.setRuntimeBaseDir(null);
    if (originalEnv !== undefined) {
      process.env['HOPCODE_RUNTIME_DIR'] = originalEnv;
    } else {
      delete process.env['HOPCODE_RUNTIME_DIR'];
    }
  });

  it('uses contextual runtime dir inside runWithRuntimeBaseDir', async () => {
    Storage.setRuntimeBaseDir(path.resolve('global-runtime'));
    const cwd = path.resolve('workspace', 'project-a');

    await Storage.runWithRuntimeBaseDir('.hopcode', cwd, async () => {
      expect(Storage.getRuntimeBaseDir()).toBe(path.join(cwd, '.hopcode'));
    });
  });

  it('keeps concurrent contexts isolated', async () => {
    const cwdA = path.resolve('workspace', 'a');
    const cwdB = path.resolve('workspace', 'b');

    const runA = Storage.runWithRuntimeBaseDir('.hopcode-a', cwdA, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return Storage.getRuntimeBaseDir();
    });

    const runB = Storage.runWithRuntimeBaseDir('.hopcode-b', cwdB, async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return Storage.getRuntimeBaseDir();
    });

    const [a, b] = await Promise.all([runA, runB]);
    expect(a).toBe(path.join(cwdA, '.hopcode-a'));
    expect(b).toBe(path.join(cwdB, '.hopcode-b'));
  });
});
