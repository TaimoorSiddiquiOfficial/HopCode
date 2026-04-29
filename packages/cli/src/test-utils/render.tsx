/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-control-regex */

import { render } from 'ink-testing-library';
import type React from 'react';
import type { Config } from '@hoptrendy/hopcode-core';
import { LoadedSettings } from '../config/settings.js';
import { KeypressProvider } from '../ui/contexts/KeypressContext.js';
import { SettingsContext } from '../ui/contexts/SettingsContext.js';
import { ShellFocusContext } from '../ui/contexts/ShellFocusContext.js';
import { ConfigContext } from '../ui/contexts/ConfigContext.js';

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
): ReturnType<typeof render> => {
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
  // This bridges ink-testing-library's stdin.write() to the KeypressProvider's
  // event handling, which relies on readline's emitKeypressEvents in production
  // but that doesn't work with the test mock stdin.
  const origStdin = result.stdin;
  const originalWrite = origStdin.write.bind(origStdin);
  origStdin.write = (data: string) => {
    const str = data;
    const keys = parseKeys(str);
    // Emit keypress events directly on the stdin so KeypressProvider
    // receives them. This bypasses the broken readline integration.
    for (const key of keys) {
      origStdin.emit('keypress', null, key);
    }
    // Also call the original write so ink's internal handling works.
    return originalWrite(data);
  };

  return result;
};
