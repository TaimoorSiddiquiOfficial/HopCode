import { describe, it, expect } from 'vitest';
import { checkIznGate, reportIznScope } from '../engine/izn-gate.js';

describe('checkIznGate', () => {
  it('allows non-destructive tool calls', () => {
    const result = checkIznGate({
      toolName: 'read_file',
      toolArgs: { file_path: '/some/file.ts' },
    });
    expect(result.allowed).toBe(true);
  });

  it('blocks file deletion with clarification plan', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'rm -rf /some/dir',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('file_deletion');
    // New clarification fields
    expect(result.category).toContain('file_deletion');
    expect(result.analysisPlan.length).toBeGreaterThan(0);
    expect(result.intentQuestions.length).toBeGreaterThan(0);
    expect(result.impactScope.length).toBeGreaterThan(0);
  });

  it('blocks force-push with clarification plan', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'git push --force origin main',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('force_push');
    expect(result.category).toContain('force_push');
    expect(result.analysisPlan.length).toBeGreaterThan(0);
  });

  it('blocks database drop with clarification plan', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'DROP TABLE users;',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('database_drop');
    expect(result.category).toContain('database_drop');
    expect(result.intentQuestions.length).toBeGreaterThan(0);
  });

  it('blocks permission change with clarification plan', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'chmod 777 /etc/something',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('permission_change');
    expect(result.category).toContain('permission_change');
    expect(result.impactScope.length).toBeGreaterThan(0);
  });

  it('provides verification steps when blocked', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'rm somefile.txt',
    });
    if (!result.allowed) {
      expect(result.requiredConfirmation).toContain('Izn Mode');
      expect(result.requiredConfirmation).toContain(
        'Self-Verification Required',
      );
      // Intent questions probe the user's goal
      expect(
        result.intentQuestions.some((q) => q.toLowerCase().includes('goal')),
      ).toBe(true);
      // Impact scope covers dependency and cascade analysis
      const impactText = result.impactScope.join(' ').toLowerCase();
      expect(impactText).toMatch(/import|depend|child|subclass|parent/);
    }
  });

  it('allows normal git push without force', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'git push origin main',
    });
    expect(result.allowed).toBe(true);
  });

  it('allows normal writes', () => {
    const result = checkIznGate({
      toolName: 'write_file',
      toolArgs: { file_path: '/tmp/test.txt', content: 'hello' },
    });
    expect(result.allowed).toBe(true);
  });

  it('does not trigger on description field (false-positive fix)', () => {
    // description is human-written label, not command content.
    // A safe command like "git branch -d old-branch" with a description
    // containing "delete" must not trigger the deletion gate.
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'git branch -d old-branch',
      toolArgs: {
        command: 'git branch -d old-branch',
        description: 'Delete old branch after merging',
        timeout: 30000,
      },
    });
    expect(result.allowed).toBe(true);
  });

  it('does not trigger when only description has destructive words', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'echo "cleanup done"',
      toolArgs: {
        command: 'echo "cleanup done"',
        description: 'Remove temporary files and clean up the workspace',
      },
    });
    expect(result.allowed).toBe(true);
  });
});

describe('reportIznScope', () => {
  it('returns generic scope reminder for non-destructive tools', () => {
    const result = reportIznScope({
      toolName: 'write_file',
      toolArgs: { file_path: '/tmp/test.txt', content: 'hello' },
    });
    expect(result.context).toContain('Izn scope');
    expect(result.context).toContain('Verify this change matches your intent');
  });

  it('returns category-specific report for destructive tools', () => {
    const result = reportIznScope({
      toolName: 'run_shell_command',
      command: 'rm -rf /some/dir',
    });
    expect(result.context).toContain('file_deletion completed');
    expect(result.context).toContain('List what was deleted');
  });

  it('includes intent verification guidance in destructive report', () => {
    const result = reportIznScope({
      toolName: 'run_shell_command',
      command: 'DROP TABLE users;',
    });
    expect(result.context).toContain('Intent verification:');
    expect(result.context).toContain(
      'If intent was clarified before this action',
    );
    expect(result.context).toContain(
      'confirm the result matches what was agreed',
    );
  });

  it('includes revert conditions from matched rules', () => {
    const result = reportIznScope({
      toolName: 'run_shell_command',
      command: 'rm -rf critical-project/',
    });
    expect(result.context).toContain('Revert conditions');
    expect(result.context).toContain('critical project files');
  });

  it('returns generic reminder for tools without a command or args', () => {
    const result = reportIznScope({ toolName: 'read_file' });
    expect(result.context).toContain('Izn scope');
  });
});

describe('Izn progressive escalation', () => {
  const blockHistory = (cat: string, count: number) =>
    Array.from({ length: count }, () => ({
      category: cat as 'file_deletion',
    }));

  it('caution level (1–2 same-category blocks) — standard message', () => {
    const result = checkIznGate(
      {
        toolName: 'run_shell_command',
        command: 'rm -rf /tmp/cache',
      },
      blockHistory('file_deletion', 2),
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.escalationLevel).toBe('caution');
      expect(result.reason).toContain('Izn requires self-verification');
      expect(result.reason).not.toContain('WARNING');
      expect(result.reason).not.toContain('BLOCKED');
    }
  });

  it('warning level (3 same-category blocks) — stronger message', () => {
    const result = checkIznGate(
      {
        toolName: 'run_shell_command',
        command: 'rm -rf /tmp/cache',
      },
      blockHistory('file_deletion', 3),
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.escalationLevel).toBe('warning');
      expect(result.reason).toContain('WARNING');
      expect(result.reason).toContain('repeated same-category action');
      expect(result.requiredConfirmation).toContain('⚠️ Repeated Action');
    }
  });

  it('refusal level (5+ same-category blocks) — blocked message', () => {
    const result = checkIznGate(
      {
        toolName: 'run_shell_command',
        command: 'rm -rf /tmp/cache',
      },
      blockHistory('file_deletion', 5),
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.escalationLevel).toBe('refusal');
      expect(result.reason).toContain('BLOCKED');
      expect(result.reason).toContain('break into smaller verified steps');
      expect(result.requiredConfirmation).toContain('⛔ REPEATED BLOCK');
    }
  });

  it('no escalation when blockHistory is empty', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'rm -rf /tmp/cache',
    });
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.escalationLevel).toBeUndefined();
      expect(result.reason).not.toContain('WARNING');
      expect(result.reason).not.toContain('BLOCKED');
    }
  });

  it('no escalation when blockHistory is for different category', () => {
    const result = checkIznGate(
      {
        toolName: 'run_shell_command',
        command: 'rm -rf /tmp/cache',
      },
      [{ category: 'force_push' }, { category: 'force_push' }],
    );
    expect(result.allowed).toBe(false);
    if (!result.allowed) {
      expect(result.escalationLevel).toBeUndefined();
    }
  });

  it('reportIznScope includes warning message on escalation', () => {
    const result = reportIznScope(
      {
        toolName: 'run_shell_command',
        command: 'rm -rf /tmp/cache',
      },
      blockHistory('file_deletion', 3),
    );
    expect(result.context).toContain('⚠️ IZN WARNING');
    expect(result.context).toContain('regression risk');
  });

  it('reportIznScope includes refusal message on high escalation', () => {
    const result = reportIznScope(
      {
        toolName: 'run_shell_command',
        command: 'rm -rf /tmp/cache',
      },
      blockHistory('file_deletion', 5),
    );
    expect(result.context).toContain('⚠️ IZN REFUSAL');
    expect(result.context).toContain('blocked repeatedly');
  });

  it('reportIznScope for generic tool does not escalate', () => {
    const result = reportIznScope(
      { toolName: 'read_file' },
      blockHistory('file_deletion', 10),
    );
    expect(result.context).toContain('Izn scope');
    expect(result.context).not.toContain('WARNING');
    expect(result.context).not.toContain('REFUSAL');
  });
});
