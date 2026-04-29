/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-control-regex */

import type React from 'react';
import { EventEmitter } from 'node:events';
import { render as inkRender } from 'ink';
import type { Config } from '@hoptrendy/hopcode-core';
import { LoadedSettings } from '../config/settings.js';
import { KeypressProvider } from '../ui/contexts/KeypressContext.js';
import { SettingsContext } from '../ui/contexts/SettingsContext.js';
import { ShellFocusContext } from '../ui/contexts/ShellFocusContext.js';
import { ConfigContext } from '../ui/contexts/ConfigContext.js';

// ---------------------------------------------------------------------------
// Re-implement ink-testing-library's render using the CLI's own `ink` module.
// This ensures `StdinContext` identity matches between the test harness
// (ink@6.8.0 in packages/cli/node_modules/ink) and the KeypressProvider,
// so the stdin.write() → keypress patch actually targets the right object.
// ---------------------------------------------------------------------------

class Stdout extends EventEmitter {
  get columns() {
    return 100;
  }
  frames: string[] = [];
  _lastFrame: string | undefined;
  write = (frame: string) => {
    this.frames.push(frame);
    this._lastFrame = frame;
  };
  lastFrame = (): string | undefined => this._lastFrame;
}

class Stderr extends EventEmitter {
  frames: string[] = [];
  _lastFrame: string | undefined;
  write = (frame: string) => {
    this.frames.push(frame);
    this._lastFrame = frame;
  };
  lastFrame = (): string | undefined => this._lastFrame;
}

class Stdin extends EventEmitter {
  isTTY = true;
  data: Buffer | string | null = null;
  constructor(options: { isTTY?: boolean } = {}) {
    super();
    this.isTTY = options.isTTY ?? true;
  }
  write = (data: string) => {
    this.data = data;
    this.emit('readable');
    this.emit('data', data);
  };
  setEncoding() {}
  setRawMode() {}
  resume() {}
  pause() {}
  ref() {}
  unref() {}
  read = () => {
    const { data } = this;
    this.data = null;
    return data;
  };
}

const instances: Array<ReturnType<typeof inkRender>> = [];

function render(tree: React.ReactNode) {
  const stdout = new Stdout();
  const stderr = new Stderr();
  const stdin = new Stdin();

  const instance = inkRender(tree, {
    stdout: stdout as unknown as NodeJS.WriteStream,
    stderr: stderr as unknown as NodeJS.WriteStream,
    stdin: stdin as unknown as NodeJS.ReadStream,
    debug: true,
    exitOnCtrlC: false,
    patchConsole: false,
  });

  instances.push(instance);

  return {
    rerender: instance.rerender,
    unmount: instance.unmount,
     
    cleanup: instance.cleanup,
    stdout,
    stderr,
    stdin,
    frames: stdout.frames,
    lastFrame: stdout.lastFrame,
  };
}

export function cleanup() {
  for (const instance of instances) {
    instance.unmount();
     
    instance.cleanup?.();
  }
  instances.length = 0;
}

const mockSettings = new LoadedSettings(
  { path: '', settings: {}, originalSettings: {} },
  { path: '', settings: {}, originalSettings: {} },
  { path: '', settings: {}, originalSettings: {} },
  { path: '', settings: {}, originalSettings: {} },
  true,
  new Set(),
);

// Minimal key-sequence parser for test keypress simulation.
// Handles escape sequences, arrow keys, Enter, Escape, Tab, Ctrl+C, etc.
function parseKeys(data: string): Array<{
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  sequence: string;
}> {
  const keys: Array<{
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    sequence: string;
  }> = [];
  let i = 0;
  while (i < data.length) {
    if (data[i] === '\x1b') {
      if (data[i + 1] === '[') {
        const seq = data.slice(i);
        const csiMatch = seq.match(/^\x1b\[(\d*)(;?\d*)([A-Za-z~])/);
        if (csiMatch) {
          const fullSeq = csiMatch[0];
          const code = csiMatch[3];
          const nameMap: Record<string, string> = {
            A: 'up',
            B: 'down',
            C: 'right',
            D: 'left',
            H: 'home',
            F: 'end',
            Z: 'tab',
          };
          if (code === 'Z') {
            keys.push({
              name: 'tab',
              shift: true,
              ctrl: false,
              meta: false,
              sequence: fullSeq,
            });
          } else if (nameMap[code]) {
            keys.push({
              name: nameMap[code],
              shift: false,
              ctrl: false,
              meta: false,
              sequence: fullSeq,
            });
          } else if (code === '~') {
            const tildeNames: Record<string, string> = {
              '2': 'insert',
              '3': 'delete',
              '5': 'pageup',
              '6': 'pagedown',
            };
            const n = csiMatch[1] || '';
            keys.push({
              name: tildeNames[n] || '',
              shift: false,
              ctrl: false,
              meta: false,
              sequence: fullSeq,
            });
          } else {
            keys.push({
              name: '',
              shift: false,
              ctrl: false,
              meta: false,
              sequence: fullSeq,
            });
          }
          i += fullSeq.length;
        } else {
          keys.push({
            name: 'escape',
            ctrl: false,
            meta: false,
            shift: false,
            sequence: '\x1b',
          });
          i += 1;
        }
      } else if (data[i + 1] === '\x03') {
        keys.push({
          name: 'c',
          ctrl: true,
          meta: false,
          shift: false,
          sequence: '\x1b\x03',
        });
        i += 2;
      } else {
        keys.push({
          name: 'escape',
          ctrl: false,
          meta: false,
          shift: false,
          sequence: '\x1b',
        });
        i += 1;
      }
    } else if (data[i] === '\r' || data[i] === '\n') {
      keys.push({
        name: 'return',
        ctrl: false,
        meta: false,
        shift: false,
        sequence: data[i],
      });
      i += 1;
    } else if (data[i] === '\t') {
      keys.push({
        name: 'tab',
        ctrl: false,
        meta: false,
        shift: false,
        sequence: '\t',
      });
      i += 1;
    } else if (data.charCodeAt(i) < 32 && data.charCodeAt(i) !== 13) {
      const charCode = data.charCodeAt(i);
      const letter = String.fromCharCode(charCode + 96);
      keys.push({
        name: letter,
        ctrl: true,
        meta: false,
        shift: false,
        sequence: data[i],
      });
      i += 1;
    } else {
      keys.push({
        name: data[i] === ' ' ? 'space' : data[i].toLowerCase(),
        ctrl: false,
        meta: false,
        shift: false,
        sequence: data[i],
      });
      i += 1;
    }
  }
  return keys;
}

export const renderWithProviders = (
  component: React.ReactElement,
  {
    shellFocus = true,
    settings = mockSettings,
    config = undefined,
  }: {
    shellFocus?: boolean;
    settings?: LoadedSettings;
    config?: Config;
  } = {},
) => {
  const result = render(
    <SettingsContext.Provider value={settings}>
      <ConfigContext.Provider value={config}>
        <ShellFocusContext.Provider value={shellFocus}>
          <KeypressProvider kittyProtocolEnabled={false}>
            {component}
          </KeypressProvider>
        </ShellFocusContext.Provider>
      </ConfigContext.Provider>
    </SettingsContext.Provider>,
  );

  // Patch the mock stdin to emit 'keypress' events when data is written.
  // The stock Mock stdin.write() emits 'data' which readline would convert
  // to keypress events. But readline.emitKeypressEvents installs its internal
  // 'data' listener on construction — we can't remove it. If we emit 'data'
  // AND 'keypress', every write produces two keypresses, which breaks toggle
  // (p toggles preview on→off), counts (toHaveBeenCalledTimes(1) sees 2), etc.
  //
  // Solution: override write() to emit 'keypress' directly and set stdin.data
  // for ink's internal read() path, BUT skip the original write (no 'data'
  // event) so readline doesn't produce a duplicate keypress.
  const origStdin = result.stdin;
  origStdin.write = (data: string) => {
    const keys = parseKeys(data);
    for (const key of keys) {
      origStdin.emit('keypress', null, key);
    }
    // Set data so stdin.read() returns the last written data for ink internals.
    (origStdin as unknown as { data: unknown }).data = data;
    return true;
  };

  return result;
};
