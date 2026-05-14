/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { PermissionBlockerService } from '../services/permissionBlockerService.js';

// ---------------------------------------------------------------------------
// Mocks — mock factory is hoisted, so define fns inline
// ---------------------------------------------------------------------------

vi.mock('node:fs', () => ({
  default: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    mkdirSync: vi.fn(),
  },
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
}));

// Cast the mocked fs to access mock fns via vitest mock methods.
const mockFs = fs as unknown as {
  readFileSync: ReturnType<typeof vi.fn>;
  writeFileSync: ReturnType<typeof vi.fn>;
  mkdirSync: ReturnType<typeof vi.fn>;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TEST_PERSIST_PATH = path.join(
  path.sep,
  'tmp',
  'hopcode-test',
  'blocker.json',
);

beforeEach(() => {
  vi.clearAllMocks();
  mockFs.readFileSync.mockImplementation(() => {
    throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
  });
  mockFs.writeFileSync.mockReturnValue(undefined);
  mockFs.mkdirSync.mockReturnValue(undefined);
});

// ---------------------------------------------------------------------------

describe('PermissionBlockerService', () => {
  // ── Construction / disk loading ─────────────────────────────────────

  it('creates an empty store when the persistence file does not exist', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    expect(svc.getBlockedTools()).toHaveLength(0);
    expect(svc.buildPromptNote()).toBeNull();
  });

  it('handles malformed JSON on disk gracefully', () => {
    mockFs.readFileSync.mockReturnValue('not valid json {{{');
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    expect(svc.getBlockedTools()).toHaveLength(0);
  });

  it('loads existing denial records from disk', () => {
    const store = {
      denials: {
        run_shell_command: { count: 3, lastSeenAt: 1_700_000_000_000 },
        edit: { count: 1, lastSeenAt: 1_699_999_000_000 },
      },
    };
    mockFs.readFileSync.mockReturnValue(JSON.stringify(store));

    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    const blocked = svc.getBlockedTools();
    expect(blocked).toHaveLength(1); // only run_shell_command >= 2
    expect(blocked[0]!.tool).toBe('run_shell_command');
    expect(blocked[0]!.count).toBe(3);
  });

  // ── recordDenial ────────────────────────────────────────────────────

  it('records a single denial without persisting (below threshold)', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('edit');

    // Below threshold (1 < 2): no disk write
    expect(mockFs.writeFileSync).not.toHaveBeenCalled();
    expect(svc.getBlockedTools()).toHaveLength(0);
  });

  it('persists after denial count reaches threshold (2)', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('browser');
    svc.recordDenial('browser');

    expect(mockFs.writeFileSync).toHaveBeenCalledTimes(1);
    const blocked = svc.getBlockedTools();
    expect(blocked).toHaveLength(1);
    expect(blocked[0]!.tool).toBe('browser');
    expect(blocked[0]!.count).toBe(2);
  });

  it('increments count across multiple denials', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('web_fetch');
    svc.recordDenial('web_fetch');
    svc.recordDenial('web_fetch');

    const blocked = svc.getBlockedTools();
    expect(blocked).toHaveLength(1);
    expect(blocked[0]!.count).toBe(3);
  });

  it('tracks multiple tools independently', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('agent');
    svc.recordDenial('agent');
    svc.recordDenial('browser');
    svc.recordDenial('browser');

    const blocked = svc.getBlockedTools();
    expect(blocked).toHaveLength(2);
  });

  // ── getBlockedTools ─────────────────────────────────────────────────

  it('sorts blocked tools by count descending', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    // browser: 2, run_shell_command: 5, edit: 3
    svc.recordDenial('browser');
    svc.recordDenial('browser');
    svc.recordDenial('run_shell_command');
    svc.recordDenial('run_shell_command');
    svc.recordDenial('run_shell_command');
    svc.recordDenial('run_shell_command');
    svc.recordDenial('run_shell_command');
    svc.recordDenial('edit');
    svc.recordDenial('edit');
    svc.recordDenial('edit');

    const blocked = svc.getBlockedTools();
    expect(blocked).toHaveLength(3);
    expect(blocked[0]!.tool).toBe('run_shell_command');
    expect(blocked[0]!.count).toBe(5);
    expect(blocked[1]!.tool).toBe('edit');
    expect(blocked[1]!.count).toBe(3);
    expect(blocked[2]!.tool).toBe('browser');
    expect(blocked[2]!.count).toBe(2);
  });

  // ── buildPromptNote ─────────────────────────────────────────────────

  it('returns null when no tools are blocked', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    expect(svc.buildPromptNote()).toBeNull();
  });

  it('builds a prompt note listing blocked tools', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('run_shell_command');
    svc.recordDenial('run_shell_command');
    svc.recordDenial('browser');
    svc.recordDenial('browser');

    const note = svc.buildPromptNote();
    expect(note).not.toBeNull();
    expect(note!).toContain('# Previously Blocked Actions');
    expect(note!).toContain('run_shell_command (denied 2x)');
    expect(note!).toContain('browser (denied 2x)');
  });

  // ── clear ───────────────────────────────────────────────────────────

  it('clears a specific tool', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('edit');
    svc.recordDenial('edit');
    svc.recordDenial('browser');
    svc.recordDenial('browser');

    svc.clear('edit');
    const blocked = svc.getBlockedTools();
    expect(blocked).toHaveLength(1);
    expect(blocked[0]!.tool).toBe('browser');
  });

  it('clears all tools when no tool name is given', () => {
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    svc.recordDenial('edit');
    svc.recordDenial('edit');
    svc.recordDenial('browser');
    svc.recordDenial('browser');

    svc.clear();
    expect(svc.getBlockedTools()).toHaveLength(0);
    expect(svc.buildPromptNote()).toBeNull();
  });

  // ── Persistence error resilience ────────────────────────────────────

  it('handles mkdirSync failure gracefully during save', () => {
    mockFs.mkdirSync.mockImplementation(() => {
      throw new Error('EACCES: permission denied');
    });
    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    // Should not throw
    svc.recordDenial('edit');
    svc.recordDenial('edit'); // triggers saveToDisk
    // Still tracked in memory even if persist failed
    expect(svc.getBlockedTools()).toHaveLength(1);
  });

  it('handles writeFileSync failure gracefully', () => {
    mockFs.writeFileSync.mockImplementation(() => {
      throw new Error('ENOSPC: no space left on device');
    });

    const svc = new PermissionBlockerService(TEST_PERSIST_PATH);
    // Should not throw
    svc.recordDenial('web_fetch');
    svc.recordDenial('web_fetch');
    // Still tracked in memory
    expect(svc.getBlockedTools()).toHaveLength(1);
  });
});
