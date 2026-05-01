import { describe, it, expect } from 'vitest';
import { checkIznGate } from '../engine/izn-gate.js';

describe('checkIznGate', () => {
  it('allows non-destructive tool calls', () => {
    const result = checkIznGate({
      toolName: 'read_file',
      toolArgs: { file_path: '/some/file.ts' },
    });
    expect(result.allowed).toBe(true);
  });

  it('blocks file deletion', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'rm -rf /some/dir',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('file_deletion');
  });

  it('blocks force-push', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'git push --force origin main',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('force_push');
  });

  it('blocks database drop', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'DROP TABLE users;',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('database_drop');
  });

  it('blocks permission change', () => {
    const result = checkIznGate({
      toolName: 'run_shell_command',
      command: 'chmod 777 /etc/something',
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('permission_change');
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
});
