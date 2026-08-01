/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

const originalhopcodeHome = process.env['HOPCODE_HOME'];
const originalSystemSettingsPath =
  process.env['HOPCODE_CODE_SYSTEM_SETTINGS_PATH'];
const originalSystemDefaultsPath =
  process.env['HOPCODE_CODE_SYSTEM_DEFAULTS_PATH'];
const originalTrustedFoldersPath =
  process.env['HOPCODE_CODE_TRUSTED_FOLDERS_PATH'];

describe('serve fast path --open import boundary', () => {
  let temphopcodeHome: string | undefined;

  function useTemphopcodeHome(): void {
    temphopcodeHome = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'qws-fast-path-open-')),
    );
    process.env['HOPCODE_HOME'] = temphopcodeHome;
    process.env['HOPCODE_CODE_SYSTEM_SETTINGS_PATH'] = path.join(
      temphopcodeHome,
      'system-settings.json',
    );
    process.env['HOPCODE_CODE_SYSTEM_DEFAULTS_PATH'] = path.join(
      temphopcodeHome,
      'system-defaults.json',
    );
    process.env['HOPCODE_CODE_TRUSTED_FOLDERS_PATH'] = path.join(
      temphopcodeHome,
      'trustedFolders.json',
    );
  }

  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock('./run-hopcode-serve.js');
    vi.doUnmock('../commands/serve.js');
    vi.resetModules();
    if (originalhopcodeHome === undefined) {
      delete process.env['HOPCODE_HOME'];
    } else {
      process.env['HOPCODE_HOME'] = originalhopcodeHome;
    }
    if (originalSystemSettingsPath === undefined) {
      delete process.env['HOPCODE_CODE_SYSTEM_SETTINGS_PATH'];
    } else {
      process.env['HOPCODE_CODE_SYSTEM_SETTINGS_PATH'] =
        originalSystemSettingsPath;
    }
    if (originalSystemDefaultsPath === undefined) {
      delete process.env['HOPCODE_CODE_SYSTEM_DEFAULTS_PATH'];
    } else {
      process.env['HOPCODE_CODE_SYSTEM_DEFAULTS_PATH'] =
        originalSystemDefaultsPath;
    }
    if (originalTrustedFoldersPath === undefined) {
      delete process.env['HOPCODE_CODE_TRUSTED_FOLDERS_PATH'];
    } else {
      process.env['HOPCODE_CODE_TRUSTED_FOLDERS_PATH'] =
        originalTrustedFoldersPath;
    }
    if (temphopcodeHome) {
      fs.rmSync(temphopcodeHome, { recursive: true, force: true });
      temphopcodeHome = undefined;
    }
  });

  it('defers importing the full serve command opener until runtime is ready', async () => {
    useTemphopcodeHome();

    let resolveRuntime: (() => void) | undefined;
    const runtimeReady = new Promise<void>((resolve) => {
      resolveRuntime = resolve;
    });
    const runHopCodeServe = vi.fn(async () => ({
      runtimeReady,
      close: vi.fn().mockResolvedValue(undefined),
    }));
    let serveCommandImported = false;
    const openBrowser = vi.fn(async () => undefined);
    vi.doMock('./run-hopcode-serve.js', () => ({ runHopCodeServe }));
    vi.doMock('../commands/serve.js', () => {
      serveCommandImported = true;
      return { maybeOpenWebShellBrowser: openBrowser };
    });

    const { tryRunServeFastPath } = await import('./fast-path.js');
    void tryRunServeFastPath([
      'serve',
      '--port',
      '0',
      '--hostname',
      '127.0.0.1',
      '--open',
      '--no-web',
    ]);

    await vi.waitFor(() => expect(runHopCodeServe).toHaveBeenCalledTimes(1));
    expect(runHopCodeServe).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ deferRuntimeUntilFirstHealth: false }),
    );
    await Promise.resolve();
    expect(serveCommandImported).toBe(false);

    resolveRuntime?.();
    await vi.waitFor(() => expect(openBrowser).toHaveBeenCalledTimes(1));
    expect(serveCommandImported).toBe(true);
  });

  it('skips importing the full serve command opener when runtime startup fails', async () => {
    useTemphopcodeHome();

    let rejectRuntime: ((err: Error) => void) | undefined;
    const runtimeReady = new Promise<void>((_resolve, reject) => {
      rejectRuntime = reject;
    });
    const close = vi.fn().mockResolvedValue(undefined);
    const runHopCodeServe = vi.fn(async () => ({
      runtimeReady,
      close,
    }));
    let serveCommandImported = false;
    const openBrowser = vi.fn(async () => undefined);
    vi.doMock('./run-hopcode-serve.js', () => ({ runHopCodeServe }));
    vi.doMock('../commands/serve.js', () => {
      serveCommandImported = true;
      return { maybeOpenWebShellBrowser: openBrowser };
    });
    vi.spyOn(process, 'exit').mockImplementation(((code) => {
      throw new Error(`process.exit ${code}`);
    }) as typeof process.exit);

    const { tryRunServeFastPath } = await import('./fast-path.js');
    const fastPathPromise = tryRunServeFastPath([
      'serve',
      '--port',
      '0',
      '--hostname',
      '127.0.0.1',
      '--open',
      '--no-web',
    ]);

    await vi.waitFor(() => expect(runHopCodeServe).toHaveBeenCalledTimes(1));
    expect(runHopCodeServe).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ deferRuntimeUntilFirstHealth: false }),
    );
    await Promise.resolve();
    expect(serveCommandImported).toBe(false);

    rejectRuntime?.(new Error('runtime boom'));
    await expect(fastPathPromise).rejects.toThrow('process.exit 1');
    expect(openBrowser).not.toHaveBeenCalled();
    expect(serveCommandImported).toBe(false);
    expect(close).toHaveBeenCalledTimes(1);
  });
});
