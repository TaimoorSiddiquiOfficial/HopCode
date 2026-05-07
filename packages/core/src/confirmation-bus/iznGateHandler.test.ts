/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  IznGateHandler,
  buildIznClarificationMessage,
  type IznGateCheckParams,
} from './iznGateHandler.js';
import type { IznGateResult } from '@hoptrendy/quran-guidance';

// Mock the quran-guidance module
vi.mock('@hoptrendy/quran-guidance', () => ({
  checkIznGate: vi.fn(),
  reportIznScope: vi.fn(),
}));

import { checkIznGate, reportIznScope } from '@hoptrendy/quran-guidance';

const mockCheckIznGate = checkIznGate as ReturnType<typeof vi.fn>;
const mockReportIznScope = reportIznScope as ReturnType<typeof vi.fn>;

function makeParams(
  overrides?: Partial<IznGateCheckParams>,
): IznGateCheckParams {
  return {
    toolName: 'run_shell_command',
    toolArgs: { command: 'rm -rf /tmp/foo' },
    ...overrides,
  };
}

describe('IznGateHandler', () => {
  let handler: IznGateHandler;

  beforeEach(() => {
    vi.clearAllMocks();
    handler = new IznGateHandler();
  });

  describe('check', () => {
    it('allows when the gate passes', () => {
      mockCheckIznGate.mockReturnValue({ allowed: true });

      const result = handler.check(makeParams());

      expect(result).toEqual({ allowed: true });
      expect(mockCheckIznGate).toHaveBeenCalledTimes(1);
    });

    it('blocks and returns clarification when the gate does not pass', () => {
      const gateResult: IznGateResult & { allowed: false } = {
        allowed: false,
        category: ['destructive-write'],
        analysisPlan: ['Verify the target path', 'Check if backup exists'],
        impactScope: ['Would delete /tmp/foo and all contents'],
        intentQuestions: ['Is this directory intended to be deleted?'],
      };
      mockCheckIznGate.mockReturnValue(gateResult);

      const result = handler.check(makeParams());

      expect(result).not.toEqual({ allowed: true });
      if (!result.allowed) {
        expect(result.clarificationMessage).toContain('destructive-write');
        expect(result.clarificationMessage).toContain(
          'Self-Verification Steps',
        );
      }
    });

    it('allows retry of previously blocked command (hash match)', () => {
      // First call: blocked
      const gateResult: IznGateResult & { allowed: false } = {
        allowed: false,
        category: ['destructive-write'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      };
      mockCheckIznGate.mockReturnValue(gateResult);

      const first = handler.check(makeParams());
      expect(first.allowed).toBe(false);

      // Second call with same params: should be allowed via hash
      const second = handler.check(makeParams());
      expect(second).toEqual({ allowed: true });
      // checkIznGate should NOT have been called again (hash bypass)
      expect(mockCheckIznGate).toHaveBeenCalledTimes(1);
    });

    it('different command hashes produce different bypass behavior', () => {
      mockCheckIznGate.mockReturnValue({
        allowed: false,
        category: ['destructive-write'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      });

      // Block command A
      handler.check(makeParams({ toolArgs: { command: 'rm a' } }));
      expect(mockCheckIznGate).toHaveBeenCalledTimes(1);

      // Command B should NOT bypass (different hash)
      const result = handler.check(
        makeParams({ toolArgs: { command: 'rm b' } }),
      );
      expect(result.allowed).toBe(false);
      expect(mockCheckIznGate).toHaveBeenCalledTimes(2);
    });

    it('hash is consumed after one retry (single-use bypass)', () => {
      mockCheckIznGate.mockReturnValue({
        allowed: false,
        category: ['destructive-write'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      });

      handler.check(makeParams()); // blocked, hash stored
      handler.check(makeParams()); // allowed via hash
      // Third call with same params should NOT bypass (hash consumed)
      mockCheckIznGate.mockReturnValue({
        allowed: false,
        category: ['destructive-write'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      });
      const third = handler.check(makeParams()); // blocked again
      expect(third.allowed).toBe(false);
      expect(mockCheckIznGate).toHaveBeenCalledTimes(2); // first + third
    });

    it('records block history entry on block', () => {
      mockCheckIznGate.mockReturnValue({
        allowed: false,
        category: ['force-push', 'destructive-write'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      });

      handler.check(makeParams());

      expect(handler.getBlockHistory()).toEqual([{ category: 'force-push' }]);
    });

    it('accumulates block history across multiple blocks', () => {
      mockCheckIznGate
        .mockReturnValueOnce({
          allowed: false,
          category: ['destructive-write'],
          analysisPlan: ['Verify'],
          impactScope: [],
          intentQuestions: [],
        })
        .mockReturnValueOnce({
          allowed: false,
          category: ['force-push'],
          analysisPlan: ['Verify'],
          impactScope: [],
          intentQuestions: [],
        });

      handler.check(makeParams({ toolArgs: { command: 'rm a' } }));
      handler.check(makeParams({ toolArgs: { command: 'git push -f' } }));

      expect(handler.getBlockHistory()).toEqual([
        { category: 'destructive-write' },
        { category: 'force-push' },
      ]);
    });

    it('handles tool without command arg (empty hash)', () => {
      mockCheckIznGate.mockReturnValue({
        allowed: false,
        category: ['permission-change'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      });

      const result = handler.check(
        makeParams({ toolName: 'write_file', toolArgs: {} }),
      );

      expect(result.allowed).toBe(false);
    });
  });

  describe('clearBlockHistory', () => {
    it('resets block history', () => {
      mockCheckIznGate.mockReturnValue({
        allowed: false,
        category: ['destructive-write'],
        analysisPlan: ['Verify'],
        impactScope: [],
        intentQuestions: [],
      });

      handler.check(makeParams());
      expect(handler.getBlockHistory()).toHaveLength(1);

      handler.clearBlockHistory();
      expect(handler.getBlockHistory()).toEqual([]);
    });
  });

  describe('buildScopeReport', () => {
    it('returns context when reportIznScope returns data', () => {
      mockReportIznScope.mockReturnValue({
        context: 'Scope: file deletion in /tmp',
      });

      const result = handler.buildScopeReport(makeParams());
      expect(result).toBe('Scope: file deletion in /tmp');
    });

    it('returns null when reportIznScope returns falsy', () => {
      mockReportIznScope.mockReturnValue(null);

      const result = handler.buildScopeReport(makeParams());
      expect(result).toBeNull();
    });
  });
});

describe('buildIznClarificationMessage', () => {
  it('includes analysis plan, impact scope, and intent questions', () => {
    const result = buildIznClarificationMessage({
      allowed: false,
      category: ['destructive-write'],
      analysisPlan: ['Step 1: Check target path', 'Step 2: Verify backups'],
      impactScope: ['Affects /tmp directory'],
      intentQuestions: ['Do you want to proceed?'],
    });

    expect(result).toContain('Step 1: Check target path');
    expect(result).toContain('Step 2: Verify backups');
    expect(result).toContain('Impact Analysis');
    expect(result).toContain('Affects /tmp directory');
    expect(result).toContain('Clarify Intent');
    expect(result).toContain('Do you want to proceed?');
    expect(result).toContain('<system-reminder>');
    expect(result).toContain('</system-reminder>');
  });

  it('omits impact section when empty', () => {
    const result = buildIznClarificationMessage({
      allowed: false,
      category: ['info-request'],
      analysisPlan: ['Step 1'],
      impactScope: [],
      intentQuestions: [],
    });

    expect(result).not.toContain('Impact Analysis');
    expect(result).not.toContain('Clarify Intent');
  });
});
