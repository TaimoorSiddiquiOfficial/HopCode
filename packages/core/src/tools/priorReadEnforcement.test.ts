/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import { FileReadCache } from '../services/fileReadCache.js';
import { ToolErrorType } from './tool-error.js';
import { ToolNames } from './tool-names.js';
import { checkPriorRead, StructuredToolError } from './priorReadEnforcement.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal mock Stats-like object. Our tests only need the fields
 * that `checkPriorRead` inspects (isDirectory, isFile, mtimeMs, size) and
 * the fields `FileReadCache.check` compares (mtimeMs, size, dev, ino).
 */
function mockStats(overrides: Partial<fs.Stats> = {}): fs.Stats {
  return {
    dev: 1,
    ino: 100,
    mtimeMs: 1_700_000_000_000,
    size: 1024,
    isDirectory: () => false,
    isFile: () => true,
    isBlockDevice: () => false,
    isCharacterDevice: () => false,
    isSymbolicLink: () => false,
    isFIFO: () => false,
    isSocket: () => false,
    ...overrides,
  } as fs.Stats;
}

// Since we can't easily seed the real cache, we mock `cache.check()`
// directly in tests that need specific cache states. For the
// filesystem-side tests we mock `fs.promises.stat`.
// ---------------------------------------------------------------------------

describe('checkPriorRead', () => {
  let cache: FileReadCache;

  beforeEach(() => {
    cache = new FileReadCache();
  });

  // ── ENOENT — pre-read (expectExisting: false, default) ──────────────

  it('returns ok when file does not exist (pre-read ENOENT)', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
    );

    const result = await checkPriorRead(cache, '/tmp/missing.txt', 'editing');
    expect(result).toEqual({ ok: true });
  });

  // ── ENOENT — post-read (expectExisting: true) ───────────────────────

  it('rejects when file disappears after read (post-read ENOENT)', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('ENOENT'), { code: 'ENOENT' }),
    );

    const result = await checkPriorRead(
      cache,
      '/tmp/disappeared.txt',
      'editing',
      { expectExisting: true },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.FILE_CHANGED_SINCE_READ);
      expect(result.rawMessage).toContain('disappeared after the model read');
      expect(result.rawMessage).toContain(ToolNames.READ_FILE);
      expect(result.displayMessage).toContain('file disappeared');
    }
  });

  // ── Non-ENOENT stat failures ────────────────────────────────────────

  it('rejects when stat fails with EACCES (fail-closed)', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('EACCES'), { code: 'EACCES' }),
    );

    const result = await checkPriorRead(cache, '/etc/shadow', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.PRIOR_READ_VERIFICATION_FAILED);
      expect(result.rawMessage).toContain('EACCES');
      expect(result.displayMessage).toContain('cannot verify prior read');
    }
  });

  it('rejects when stat fails with EBUSY (fail-closed)', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('EBUSY'), { code: 'EBUSY' }),
    );

    const result = await checkPriorRead(cache, '/tmp/locked.db', 'overwriting');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.PRIOR_READ_VERIFICATION_FAILED);
      expect(result.rawMessage).toContain('EBUSY');
    }
  });

  it('rejects when stat fails with unknown error code (fail-closed)', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('unknown'), {}),
    );

    const result = await checkPriorRead(cache, '/tmp/broken', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.PRIOR_READ_VERIFICATION_FAILED);
      expect(result.rawMessage).toContain('unknown error');
    }
  });

  // ── Directory rejection ─────────────────────────────────────────────

  it('rejects directories with TARGET_IS_DIRECTORY', async () => {
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(
      mockStats({ isDirectory: () => true, isFile: () => false }),
    );

    const result = await checkPriorRead(cache, '/tmp/some-dir', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.TARGET_IS_DIRECTORY);
      expect(result.rawMessage).toContain('is a directory');
      expect(result.displayMessage).toContain('directory');
    }
  });

  it('rejects directories for overwriting verb too', async () => {
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(
      mockStats({ isDirectory: () => true, isFile: () => false }),
    );

    const result = await checkPriorRead(cache, '/tmp/some-dir', 'overwriting');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.TARGET_IS_DIRECTORY);
      expect(result.rawMessage).toContain('is a directory');
    }
  });

  // ── Special file rejection (FIFO, socket, device) ───────────────────

  it('rejects FIFO with EDIT_REQUIRES_PRIOR_READ', async () => {
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(
      mockStats({ isFile: () => false, isFIFO: () => true }),
    );

    const result = await checkPriorRead(cache, '/tmp/myfifo', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
      expect(result.rawMessage).toContain('FIFO');
    }
  });

  it('rejects socket with EDIT_REQUIRES_PRIOR_READ', async () => {
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(
      mockStats({ isFile: () => false, isSocket: () => true }),
    );

    const result = await checkPriorRead(cache, '/tmp/mysock', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
      expect(result.rawMessage).toContain('socket');
    }
  });

  // ── Cache: fresh + read + cacheable → ok ────────────────────────────

  it('returns ok when cache is fresh and file was read as text', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);

    // Stub check to return a fresh entry with lastReadAt and cacheable
    vi.spyOn(cache, 'check').mockReturnValue({
      state: 'fresh',
      entry: {
        inodeKey: '1:100',
        realPath: '/tmp/test.txt',
        mtimeMs: stats.mtimeMs,
        sizeBytes: stats.size,
        lastReadAt: 1_700_000_001_000,
        lastReadCacheable: true,
        lastWriteAt: undefined,
        lastReadWasFull: false,
      },
    });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'editing');
    expect(result).toEqual({ ok: true });
  });

  // ── Cache: fresh but never read → EDIT_REQUIRES_PRIOR_READ ──────────

  it('rejects when cache is fresh but lastReadAt is undefined', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({
      state: 'fresh',
      entry: {
        inodeKey: '1:100',
        realPath: '/tmp/test.txt',
        mtimeMs: stats.mtimeMs,
        sizeBytes: stats.size,
        lastReadAt: undefined,
        lastReadCacheable: false,
        lastWriteAt: 1_700_000_000_500,
        lastReadWasFull: false,
      },
    });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
      expect(result.rawMessage).toContain('has not been read');
      expect(result.rawMessage).toContain(ToolNames.READ_FILE);
    }
  });

  // ── Cache: stale → FILE_CHANGED_SINCE_READ ──────────────────────────

  it('rejects when cache is stale (file changed since read)', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({
      state: 'stale',
      entry: {
        inodeKey: '1:100',
        realPath: '/tmp/test.txt',
        mtimeMs: stats.mtimeMs,
        sizeBytes: stats.size,
        lastReadAt: undefined,
        lastReadCacheable: false,
        lastWriteAt: undefined,
        lastReadWasFull: false,
      },
    });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.FILE_CHANGED_SINCE_READ);
      expect(result.rawMessage).toContain('has been modified');
      expect(result.rawMessage).toContain(ToolNames.READ_FILE);
      expect(result.displayMessage).toContain('file changed since last read');
    }
  });

  // ── Cache: unknown → EDIT_REQUIRES_PRIOR_READ ───────────────────────

  it('rejects when cache state is unknown (never read)', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({ state: 'unknown' });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
      expect(result.rawMessage).toContain('has not been read');
      expect(result.rawMessage).toContain(
        'a partial read with offset / limit is fine',
      );
    }
  });

  // ── Cache: non-cacheable read (binary/image/PDF) ────────────────────

  it('rejects non-text payloads with EDIT_REQUIRES_PRIOR_READ', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({
      state: 'fresh',
      entry: {
        inodeKey: '1:100',
        realPath: '/tmp/photo.png',
        mtimeMs: stats.mtimeMs,
        sizeBytes: stats.size,
        lastReadAt: 1_700_000_001_000,
        lastReadCacheable: false,
        lastWriteAt: undefined,
        lastReadWasFull: false,
      },
    });

    const result = await checkPriorRead(cache, '/tmp/photo.png', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
      expect(result.rawMessage).toContain('binary');
      expect(result.rawMessage).toContain('payload');
      expect(result.displayMessage).toContain('cannot edit via this tool');
    }
  });

  // ── Verb differentiation ────────────────────────────────────────────

  it('uses "overwriting" verb-specific wording in unknown state', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({ state: 'unknown' });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'overwriting');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.type).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
      expect(result.rawMessage).toContain('read the full file');
      expect(result.rawMessage).toContain('overwriting replaces every byte');
    }
  });

  it('uses "edit" verb-specific wording in unknown state', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({ state: 'unknown' });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.rawMessage).toContain(
        'a partial read with offset / limit is fine',
      );
    }
  });

  // ── overwriting verb in displayMessage ──────────────────────────────

  it('uses "overwriting" in displayMessage for overwriting verb', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({ state: 'unknown' });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'overwriting');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.displayMessage).toContain('overwriting');
    }
  });

  it('uses "editing" in displayMessage for editing verb', async () => {
    const stats = mockStats();
    vi.spyOn(fs.promises, 'stat').mockResolvedValue(stats);
    vi.spyOn(cache, 'check').mockReturnValue({ state: 'unknown' });

    const result = await checkPriorRead(cache, '/tmp/test.txt', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.displayMessage).toContain('editing');
    }
  });

  // ── overwriting verb in EACCES message ──────────────────────────────

  it('uses "overwriting" in EACCES displayMessage for overwriting verb', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('EACCES'), { code: 'EACCES' }),
    );

    const result = await checkPriorRead(
      cache,
      '/tmp/restricted',
      'overwriting',
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.displayMessage).toContain('overwriting');
    }
  });

  it('uses "editing" in EACCES displayMessage for editing verb', async () => {
    vi.spyOn(fs.promises, 'stat').mockRejectedValue(
      Object.assign(new Error('EACCES'), { code: 'EACCES' }),
    );

    const result = await checkPriorRead(cache, '/tmp/restricted', 'editing');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.displayMessage).toContain('editing');
    }
  });
});

// ---------------------------------------------------------------------------
// StructuredToolError
// ---------------------------------------------------------------------------

describe('StructuredToolError', () => {
  it('has the correct name', () => {
    const err = new StructuredToolError(
      'test message',
      ToolErrorType.EDIT_REQUIRES_PRIOR_READ,
    );
    expect(err.name).toBe('StructuredToolError');
    expect(err.message).toBe('test message');
    expect(err.errorType).toBe(ToolErrorType.EDIT_REQUIRES_PRIOR_READ);
  });

  it('is an instance of Error', () => {
    const err = new StructuredToolError('msg', ToolErrorType.UNKNOWN);
    expect(err).toBeInstanceOf(Error);
  });

  it('carries errorType for scheduler dispatch', () => {
    const err = new StructuredToolError(
      'file changed',
      ToolErrorType.FILE_CHANGED_SINCE_READ,
    );
    expect(err.errorType).toBe(ToolErrorType.FILE_CHANGED_SINCE_READ);
  });
});
