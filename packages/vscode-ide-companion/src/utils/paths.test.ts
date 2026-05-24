/**
 * @license
 * Copyright 2025.hopcode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import * as path from 'node:path';
import * as os from 'node:os';
import * as fs from 'node:fs';
import {
  getGlobalHopcodeDir,
  getRuntimeBaseDir,
  resetEnvBootstrapForTesting,
} from './paths.js';

/**
 * Each test gets a clean temp homedir (no `.env` files), so the lazy
 * `bootstrapHomeEnvOverrides()` becomes a no-op unless the test explicitly
 * writes `.env` content into the mocked home. ESM bans spying on `os.homedir`,
 * so we redirect via the underlying `HOME` / `USERPROFILE` env vars.
 */
function withCleanHome() {
  const tempHome = fs.mkdtempSync(
    path.join(os.tmpdir(), 'hopcode-paths-test-'),
  );
  const realHome = fs.realpathSync(tempHome);
  const originalHomeEnv = process.env['HOME'];
  const originalUserProfile = process.env['USERPROFILE'];
  process.env['HOME'] = realHome;
  process.env['USERPROFILE'] = realHome;
  return {
    tempHome: realHome,
    cleanup: () => {
      if (originalHomeEnv !== undefined) {
        process.env['HOME'] = originalHomeEnv;
      } else {
        delete process.env['HOME'];
      }
      if (originalUserProfile !== undefined) {
        process.env['USERPROFILE'] = originalUserProfile;
      } else {
        delete process.env['USERPROFILE'];
      }
      fs.rmSync(realHome, { recursive: true, force: true });
    },
  };
}

describe('vscode-ide-companion paths – getGlobalHopcodeDir', () => {
  const originalEnv = process.env['HOPCODE_HOME'];
  let home: ReturnType<typeof withCleanHome>;

  beforeEach(() => {
    resetEnvBootstrapForTesting();
    home = withCleanHome();
  });

  afterEach(() => {
    home.cleanup();
    if (originalEnv !== undefined) {
      process.env['HOPCODE_HOME'] = originalEnv;
    } else {
      delete process.env['HOPCODE_HOME'];
    }
  });

  it('defaults to ~/.hopcode when HOPCODE_HOME is not set', () => {
    delete process.env['HOPCODE_HOME'];
    expect(getGlobalHopcodeDir()).toBe(path.join(home.tempHome, '.hopcode'));
  });

  it('uses HOPCODE_HOME when set to absolute path', () => {
    const configDir = path.resolve('/tmp/custom-hopcode');
    process.env['HOPCODE_HOME'] = configDir;
    expect(getGlobalHopcodeDir()).toBe(configDir);
  });

  it('resolves relative HOPCODE_HOME against process.cwd', () => {
    process.env['HOPCODE_HOME'] = 'relative/config';
    expect(getGlobalHopcodeDir()).toBe(path.resolve('relative/config'));
  });

  it('expands tilde (~/x) in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~/custom-hopcode';
    expect(getGlobalHopcodeDir()).toBe(
      path.join(home.tempHome, 'custom-hopcode'),
    );
  });

  it('expands Windows-style tilde (~\\x) in HOPCODE_HOME', () => {
    process.env['HOPCODE_HOME'] = '~\\custom-hopcode';
    expect(getGlobalHopcodeDir()).toBe(
      path.join(home.tempHome, 'custom-hopcode'),
    );
  });

  it('treats bare tilde (~) as home directory', () => {
    process.env['HOPCODE_HOME'] = '~';
    expect(getGlobalHopcodeDir()).toBe(home.tempHome);
  });
});

describe('vscode-ide-companion paths – getRuntimeBaseDir', () => {
  const originalHome = process.env['HOPCODE_HOME'];
  const originalRuntime = process.env['HOPCODE_RUNTIME_DIR'];
  let home: ReturnType<typeof withCleanHome>;

  beforeEach(() => {
    resetEnvBootstrapForTesting();
    home = withCleanHome();
  });

  afterEach(() => {
    home.cleanup();
    if (originalHome !== undefined) {
      process.env['HOPCODE_HOME'] = originalHome;
    } else {
      delete process.env['HOPCODE_HOME'];
    }
    if (originalRuntime !== undefined) {
      process.env['HOPCODE_RUNTIME_DIR'] = originalRuntime;
    } else {
      delete process.env['HOPCODE_RUNTIME_DIR'];
    }
  });

  it('falls back to getGlobalHopcodeDir() when neither env var is set', () => {
    delete process.env['HOPCODE_HOME'];
    delete process.env['HOPCODE_RUNTIME_DIR'];
    expect(getRuntimeBaseDir()).toBe(getGlobalHopcodeDir());
  });

  it('uses HOPCODE_RUNTIME_DIR when set to absolute path', () => {
    delete process.env['HOPCODE_HOME'];
    const runtimeDir = path.resolve('/tmp/custom-runtime');
    process.env['HOPCODE_RUNTIME_DIR'] = runtimeDir;
    expect(getRuntimeBaseDir()).toBe(runtimeDir);
  });

  it('resolves relative HOPCODE_RUNTIME_DIR against process.cwd', () => {
    delete process.env['HOPCODE_HOME'];
    process.env['HOPCODE_RUNTIME_DIR'] = 'relative/runtime';
    expect(getRuntimeBaseDir()).toBe(path.resolve('relative/runtime'));
  });

  it('expands tilde (~/x) in HOPCODE_RUNTIME_DIR', () => {
    delete process.env['HOPCODE_HOME'];
    process.env['HOPCODE_RUNTIME_DIR'] = '~/custom-runtime';
    expect(getRuntimeBaseDir()).toBe(
      path.join(home.tempHome, 'custom-runtime'),
    );
  });

  it('falls back to HOPCODE_HOME when HOPCODE_RUNTIME_DIR is unset', () => {
    delete process.env['HOPCODE_RUNTIME_DIR'];
    const configDir = path.resolve('/tmp/custom-hopcode');
    process.env['HOPCODE_HOME'] = configDir;
    expect(getRuntimeBaseDir()).toBe(configDir);
  });

  it('HOPCODE_RUNTIME_DIR takes priority over HOPCODE_HOME', () => {
    const configDir = path.resolve('/tmp/custom-hopcode');
    const runtimeDir = path.resolve('/tmp/custom-runtime');
    process.env['HOPCODE_HOME'] = configDir;
    process.env['HOPCODE_RUNTIME_DIR'] = runtimeDir;
    expect(getRuntimeBaseDir()).toBe(runtimeDir);
  });
});

describe('vscode-ide-companion paths – .env bootstrap', () => {
  const originalHome = process.env['HOPCODE_HOME'];
  const originalRuntime = process.env['HOPCODE_RUNTIME_DIR'];
  let home: ReturnType<typeof withCleanHome>;

  beforeEach(() => {
    resetEnvBootstrapForTesting();
    home = withCleanHome();
    delete process.env['HOPCODE_HOME'];
    delete process.env['HOPCODE_RUNTIME_DIR'];
  });

  afterEach(() => {
    home.cleanup();
    if (originalHome !== undefined) {
      process.env['HOPCODE_HOME'] = originalHome;
    } else {
      delete process.env['HOPCODE_HOME'];
    }
    if (originalRuntime !== undefined) {
      process.env['HOPCODE_RUNTIME_DIR'] = originalRuntime;
    } else {
      delete process.env['HOPCODE_RUNTIME_DIR'];
    }
  });

  it('reads HOPCODE_HOME from <homedir>/.hopcode/.env', () => {
    const configDir = path.resolve('/tmp/from.hopcode-dotenv');
    fs.mkdirSync(path.join(home.tempHome, '.hopcode'), { recursive: true });
    fs.writeFileSync(
      path.join(home.tempHome, '.hopcode', '.env'),
      `HOPCODE_HOME=${configDir}\n`,
    );
    expect(getGlobalHopcodeDir()).toBe(configDir);
    expect(process.env['HOPCODE_HOME']).toBe(configDir);
  });

  it('reads HOPCODE_HOME from <homedir>/.env when ~/.hopcode/.env is absent', () => {
    const configDir = path.resolve('/tmp/from-home-dotenv');
    fs.writeFileSync(
      path.join(home.tempHome, '.env'),
      `HOPCODE_HOME=${configDir}\n`,
    );
    expect(getGlobalHopcodeDir()).toBe(configDir);
    expect(process.env['HOPCODE_HOME']).toBe(configDir);
  });

  it('process env wins over .env file', () => {
    const envDir = path.resolve('/tmp/from-process-env');
    const dotenvDir = path.resolve('/tmp/from-dotenv');
    process.env['HOPCODE_HOME'] = envDir;
    fs.mkdirSync(path.join(home.tempHome, '.hopcode'), { recursive: true });
    fs.writeFileSync(
      path.join(home.tempHome, '.hopcode', '.env'),
      `HOPCODE_HOME=${dotenvDir}\n`,
    );
    expect(getGlobalHopcodeDir()).toBe(envDir);
  });

  it('reads HOPCODE_RUNTIME_DIR from <HOPCODE_HOME>/.env when HOPCODE_HOME is preset', () => {
    const configDir = path.join(home.tempHome, 'custom-hopcode');
    const runtimeDir = path.resolve('/tmp/from-runtime-dotenv');
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(
      path.join(configDir, '.env'),
      `HOPCODE_RUNTIME_DIR=${runtimeDir}\n`,
    );
    process.env['HOPCODE_HOME'] = configDir;
    expect(getRuntimeBaseDir()).toBe(runtimeDir);
  });

  it('does not read <homedir>/.env when HOPCODE_HOME is preset', () => {
    const configDir = path.resolve('/tmp/preset.hopcode-home');
    process.env['HOPCODE_HOME'] = configDir;
    fs.writeFileSync(
      path.join(home.tempHome, '.env'),
      `HOPCODE_RUNTIME_DIR=/tmp/should-be-ignored\n`,
    );
    expect(getRuntimeBaseDir()).toBe(configDir);
    expect(process.env['HOPCODE_RUNTIME_DIR']).toBeUndefined();
  });

  it('reads HOPCODE_RUNTIME_DIR from <new HOPCODE_HOME>/.env after discovery via ~/.hopcode/.env', () => {
    const configDir = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'hopcode-bootstrap-cfg-')),
    );
    const runtimeDir = path.resolve('/tmp/from-discovered-runtime');
    fs.mkdirSync(path.join(home.tempHome, '.hopcode'), { recursive: true });
    fs.writeFileSync(
      path.join(home.tempHome, '.hopcode', '.env'),
      `HOPCODE_HOME=${configDir}\n`,
    );
    fs.writeFileSync(
      path.join(configDir, '.env'),
      `HOPCODE_RUNTIME_DIR=${runtimeDir}\n`,
    );
    try {
      expect(getRuntimeBaseDir()).toBe(runtimeDir);
      expect(process.env['HOPCODE_HOME']).toBe(configDir);
      expect(process.env['HOPCODE_RUNTIME_DIR']).toBe(runtimeDir);
    } finally {
      fs.rmSync(configDir, { recursive: true, force: true });
    }
  });
});
