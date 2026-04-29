/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-control-regex */

// Unset NO_COLOR environment variable to ensure consistent theme behavior between local and CI test runs
if (process.env['NO_COLOR'] !== undefined) {
  delete process.env['NO_COLOR'];
}

// Avoid writing per-session debug log files during CLI tests.
// Individual tests can still opt in by overriding this env var explicitly.
if (process.env['HOPCODE_DEBUG_LOG_FILE'] === undefined) {
  process.env['HOPCODE_DEBUG_LOG_FILE'] = '0';
}

import './src/test-utils/customMatchers.js';

// Mock readline so that KeypressProvider can receive keypress events from
// ink-testing-library's mock stdin. Without this, readline's real
// emitKeypressEvents doesn't work because the mock stdin doesn't implement
// full Node.js Readable stream semantics (missing resume(), isRaw, etc.).
vi.mock('readline', async (importOriginal) => {
  const original = await importOriginal<typeof import('readline')>();

  // Minimal key-sequence parser that handles the escape sequences used in
  // tests (arrow keys, Enter, Escape, Tab, Ctrl+C, printable chars).
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
        // Escape sequence
        if (data[i + 1] === '[') {
          const seq = data.slice(i);
          // CSI sequences
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
              // Tilde codes: e.g. \x1b[3~ = delete
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
            // Bare ESC
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
          // ESC + Ctrl+C (kitty protocol)
          keys.push({
            name: 'c',
            ctrl: true,
            meta: false,
            shift: false,
            sequence: '\x1b\x03',
          });
          i += 2;
        } else {
          // Bare ESC (no CSI follow-up)
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
        // Ctrl+letter (0x01-0x1a)
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
        // Printable character
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

  return {
    ...original,
    createInterface: vi.fn().mockReturnValue({
      close: vi.fn(),
    }),
    emitKeypressEvents: vi.fn((stream: NodeJS.ReadableStream) => {
      const s = stream as NodeJS.ReadableStream & { _keypressSetup?: boolean };
      if (s._keypressSetup) return;
      s._keypressSetup = true;
      stream.on('data', (data: Buffer | string) => {
        const str = typeof data === 'string' ? data : data.toString('utf8');
        const keys = parseKeys(str);
        for (const key of keys) {
          stream.emit('keypress', null, key);
        }
      });
    }),
  };
});
