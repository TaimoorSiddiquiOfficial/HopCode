/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type {
  PermissionCheckContext,
  PermissionManager,
} from '../permissions/types.js';
import {
  evaluatePermissionRules,
  injectPermissionRulesIfMissing,
  persistPermissionOutcome,
} from './permission-helpers.js';
import { ToolConfirmationOutcome } from '../tools/tools.js';
import type { ToolCallConfirmationDetails } from '../tools/tools.js';

// ---------------------------------------------------------------------------
// evaluatePermissionRules
// ---------------------------------------------------------------------------

describe('evaluatePermissionRules', () => {
  function makePm(
    overrides: Partial<PermissionManager> = {},
  ): PermissionManager | null {
    return {
      hasRelevantRules: vi.fn(),
      evaluate: vi.fn(),
      hasMatchingAskRule: vi.fn(),
      ...overrides,
    } as unknown as PermissionManager;
  }

  it('returns default permission when PM is null', async () => {
    const ctx = {
      toolName: 'test',
      command: 'echo hi',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(null, 'ask', ctx);
    expect(result.finalPermission).toBe('ask');
    expect(result.pmForcedAsk).toBe(false);
  });

  it('returns default permission when PM has no relevant rules', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(false),
    });
    const ctx = {
      toolName: 'test',
      command: 'echo hi',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'ask', ctx);
    expect(result.finalPermission).toBe('ask');
    expect(result.pmForcedAsk).toBe(false);
  });

  it('returns PM override when PM evaluates to allow', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(true),
      evaluate: vi.fn().mockResolvedValue('allow'),
    });
    const ctx = {
      toolName: 'test',
      command: 'echo hi',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'ask', ctx);
    expect(result.finalPermission).toBe('allow');
    expect(result.pmForcedAsk).toBe(false);
  });

  it('returns PM override when PM evaluates to deny', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(true),
      evaluate: vi.fn().mockResolvedValue('deny'),
    });
    const ctx = {
      toolName: 'test',
      command: 'rm -rf /',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'ask', ctx);
    expect(result.finalPermission).toBe('deny');
    expect(result.pmForcedAsk).toBe(false);
  });

  it('returns PM override when PM evaluates to ask', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(true),
      evaluate: vi.fn().mockResolvedValue('ask'),
      hasMatchingAskRule: vi.fn().mockReturnValue(true),
    });
    const ctx = {
      toolName: 'test',
      command: 'echo hi',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'allow', ctx);
    expect(result.finalPermission).toBe('ask');
    expect(result.pmForcedAsk).toBe(true);
  });

  it('does not set pmForcedAsk when ask rule has no matching ask-specific rule', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(true),
      evaluate: vi.fn().mockResolvedValue('ask'),
      hasMatchingAskRule: vi.fn().mockReturnValue(false),
    });
    const ctx = {
      toolName: 'test',
      command: 'echo hi',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'allow', ctx);
    expect(result.finalPermission).toBe('ask');
    expect(result.pmForcedAsk).toBe(false);
  });

  it('respects defaultPermission=deny by skipping PM evaluation', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(true),
      evaluate: vi.fn(), // should NOT be called
    });
    const ctx = {
      toolName: 'test',
      command: 'rm -rf /',
    } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'deny', ctx);
    expect(result.finalPermission).toBe('deny');
    expect(pm.evaluate).not.toHaveBeenCalled();
  });

  it('returns "default" when PM evaluate returns "default"', async () => {
    const pm = makePm({
      hasRelevantRules: vi.fn().mockReturnValue(true),
      evaluate: vi.fn().mockResolvedValue('default'),
    });
    const ctx = { toolName: 'test' } as PermissionCheckContext;
    const result = await evaluatePermissionRules(pm, 'ask', ctx);
    // PM returned 'default', which is not a substantive override
    expect(result.finalPermission).toBe('default');
  });
});

// ---------------------------------------------------------------------------
// injectPermissionRulesIfMissing
// ---------------------------------------------------------------------------

describe('injectPermissionRulesIfMissing', () => {
  const pmCtx = {
    toolName: 'run_shell_command',
    command: 'ls /tmp',
    cwd: '/tmp',
  } as PermissionCheckContext;

  it('injects permissionRules for exec-type when missing', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Exec',
      command: 'ls',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    expect(details.permissionRules).toBeDefined();
    expect(Array.isArray(details.permissionRules)).toBe(true);
    expect(details.permissionRules!.length).toBeGreaterThan(0);
  });

  it('injects permissionRules for mcp-type when missing', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'mcp',
      title: 'MCP',
      serverName: 'test-server',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    expect(details.permissionRules).toBeDefined();
    expect(Array.isArray(details.permissionRules)).toBe(true);
  });

  it('injects permissionRules for info-type when missing', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'info',
      message: 'test message',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    expect(details.permissionRules).toBeDefined();
  });

  it('does NOT inject permissionRules for edit-type', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'edit',
      title: 'Edit',
      fileName: 'test.txt',
      filePath: '/test.txt',
      fileDiff: '',
      originalContent: '',
      newContent: 'new',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    expect(details.permissionRules).toBeUndefined();
  });

  it('does NOT inject permissionRules for plan-type', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'plan',
      title: 'Plan',
      plan: 'test plan',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    expect(details.permissionRules).toBeUndefined();
  });

  it('does NOT inject permissionRules for mcp-response-type', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'mcp-response',
      toolName: 'test',
      output: 'response',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    expect(details.permissionRules).toBeUndefined();
  });

  it('does NOT inject when permissionRules are already present', () => {
    const existingRules = ['Bash(ls *)'];
    const details: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Exec',
      command: 'ls',
      permissionRules: existingRules,
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    // Should preserve existing rules, not overwrite
    expect(details.permissionRules).toBe(existingRules);
  });

  it('injects rules derived from the PM context', () => {
    const details: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Exec',
      command: 'ls /tmp',
    };

    injectPermissionRulesIfMissing(details, pmCtx);

    // The injected rules should contain a pattern matching the command
    expect(details.permissionRules).toBeDefined();
    expect(
      details.permissionRules!.some((r) => r.includes('run_shell_command')),
    ).toBe(true);
  });

  it('injects rules with path context for file tools', () => {
    const filePmCtx = {
      toolName: 'write_file',
      filePath: '/project/src/app.ts',
    } as PermissionCheckContext;

    const details: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Write',
      command: 'write',
    };

    injectPermissionRulesIfMissing(details, filePmCtx);

    expect(details.permissionRules).toBeDefined();
    // Should include the file path context
    expect(details.permissionRules!.some((r) => r.includes('app.ts'))).toBe(
      true,
    );
  });

  it('injects rules with domain context for web_fetch', () => {
    const domainPmCtx = {
      toolName: 'web_fetch',
      domain: 'example.com',
    } as PermissionCheckContext;

    const details: ToolCallConfirmationDetails = {
      type: 'info',
      message: 'fetch info',
    };

    injectPermissionRulesIfMissing(details, domainPmCtx);

    expect(details.permissionRules).toBeDefined();
    expect(
      details.permissionRules!.some((r) => r.includes('example.com')),
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// persistPermissionOutcome
// ---------------------------------------------------------------------------

describe('persistPermissionOutcome', () => {
  const mockPersistFn = vi.fn();
  const mockPm = {
    addPersistentRule: vi.fn(),
  } as unknown as PermissionManager | null;

  const mockDetails: ToolCallConfirmationDetails = {
    type: 'exec',
    title: 'Test',
    command: 'echo hello',
    permissionRules: ['Bash(echo *)'],
  };

  const mockPayload: ToolConfirmationPayload = {
    permissionRules: ['Bash(echo *)'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('persists for ProceedAlwaysProject scope', async () => {
    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      mockDetails,
      mockPersistFn,
      mockPm,
    );

    expect(mockPersistFn).toHaveBeenCalledWith(
      'project',
      'allow',
      'Bash(echo *)',
    );
    expect(mockPm?.addPersistentRule).toHaveBeenCalledWith(
      'Bash(echo *)',
      'allow',
    );
  });

  it('persists for ProceedAlwaysUser scope', async () => {
    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysUser,
      mockDetails,
      mockPersistFn,
      mockPm,
    );

    expect(mockPersistFn).toHaveBeenCalledWith('user', 'allow', 'Bash(echo *)');
    expect(mockPm?.addPersistentRule).toHaveBeenCalledWith(
      'Bash(echo *)',
      'allow',
    );
  });

  it('persists with payload.rules as fallback', async () => {
    const emptyDetails: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Test',
      command: 'echo hello',
      // no permissionRules
    };

    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      emptyDetails,
      mockPersistFn,
      mockPm,
      mockPayload,
    );

    // Falls back to payload.permissionRules
    expect(mockPersistFn).toHaveBeenCalledWith(
      'project',
      'allow',
      'Bash(echo *)',
    );
  });

  it('prefers details.rules over payload.rules when both present', async () => {
    const detailsWithRules: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Test',
      command: 'echo hello',
      permissionRules: ['Bash(echo details)'],
    };

    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      detailsWithRules,
      mockPersistFn,
      mockPm,
      mockPayload,
    );

    expect(mockPersistFn).toHaveBeenCalledWith(
      'project',
      'allow',
      'Bash(echo details)',
    );
  });

  it('skips persistence for ProceedOnce (not a persist scope)', async () => {
    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedOnce,
      mockDetails,
      mockPersistFn,
      mockPm,
    );

    expect(mockPersistFn).not.toHaveBeenCalled();
    expect(mockPm?.addPersistentRule).not.toHaveBeenCalled();
  });

  it('skips persistence for Cancel outcome', async () => {
    await persistPermissionOutcome(
      ToolConfirmationOutcome.Cancel,
      mockDetails,
      mockPersistFn,
      mockPm,
    );

    expect(mockPersistFn).not.toHaveBeenCalled();
  });

  it('skips persistence when no persistFn provided', async () => {
    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      mockDetails,
      undefined, // no persistFn
      mockPm,
    );

    // Should still update in-memory PM
    expect(mockPm?.addPersistentRule).toHaveBeenCalledWith(
      'Bash(echo *)',
      'allow',
    );
  });

  it('skips persistence when no PM provided', async () => {
    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      mockDetails,
      mockPersistFn,
      null, // no PM
    );

    // Should still persist to disk
    expect(mockPersistFn).toHaveBeenCalledWith(
      'project',
      'allow',
      'Bash(echo *)',
    );
  });

  it('handles empty permissionRules array', async () => {
    const noRulesDetails: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Test',
      command: 'echo hello',
      permissionRules: [],
    };

    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      noRulesDetails,
      mockPersistFn,
      mockPm,
    );

    expect(mockPersistFn).not.toHaveBeenCalled();
    expect(mockPm?.addPersistentRule).not.toHaveBeenCalled();
  });

  it('handles both details and payload being empty', async () => {
    const noRulesDetails: ToolCallConfirmationDetails = {
      type: 'exec',
      title: 'Test',
      command: 'echo hello',
    };
    const noRulesPayload: ToolConfirmationPayload = {
      // no permissionRules
    };

    await persistPermissionOutcome(
      ToolConfirmationOutcome.ProceedAlwaysProject,
      noRulesDetails,
      mockPersistFn,
      mockPm,
      noRulesPayload,
    );

    expect(mockPersistFn).not.toHaveBeenCalled();
  });
});
