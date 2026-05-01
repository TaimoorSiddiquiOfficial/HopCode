/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  evaluatePowerShellCommand,
  resolvePowerShellConfig,
  DEFAULT_POWERSHELL_CONFIG,
  type PowerShellSecurityConfig,
} from './powershell-security.js';

// ── resolvePowerShellConfig ────────────────────────────────────────────

describe('resolvePowerShellConfig', () => {
  it('returns defaults when no partial config provided', () => {
    const result = resolvePowerShellConfig();
    expect(result).toEqual(DEFAULT_POWERSHELL_CONFIG);
  });

  it('returns defaults when partial is undefined', () => {
    const result = resolvePowerShellConfig(undefined);
    expect(result).toEqual(DEFAULT_POWERSHELL_CONFIG);
  });

  it('merges partial enabled with defaults', () => {
    const result = resolvePowerShellConfig({ enabled: true });
    expect(result.enabled).toBe(true);
    expect(result.mode).toBe('ask');
    expect(result.allowlist).toEqual([]);
    expect(result.blocklist).toEqual([]);
  });

  it('merges partial mode with defaults', () => {
    const result = resolvePowerShellConfig({ mode: 'allow' });
    expect(result.enabled).toBe(false);
    expect(result.mode).toBe('allow');
  });

  it('merges allowlist with defaults', () => {
    const result = resolvePowerShellConfig({ allowlist: ['get-*'] });
    expect(result.allowlist).toEqual(['get-*']);
  });

  it('merges blocklist with defaults', () => {
    const result = resolvePowerShellConfig({ blocklist: ['rm *'] });
    expect(result.blocklist).toEqual(['rm *']);
  });

  it('merges all fields', () => {
    const result = resolvePowerShellConfig({
      enabled: true,
      mode: 'deny',
      allowlist: ['dir'],
      blocklist: ['rm *'],
    });
    expect(result).toEqual({
      enabled: true,
      mode: 'deny',
      allowlist: ['dir'],
      blocklist: ['rm *'],
    });
  });
});

// ── evaluatePowerShellCommand ──────────────────────────────────────────

describe('evaluatePowerShellCommand', () => {
  // ── Master switch (enabled: false) ────────────────────────────────────

  it('blocks all commands when disabled (master switch off)', () => {
    const config: PowerShellSecurityConfig = {
      enabled: false,
      mode: 'allow',
      allowlist: ['*'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
    expect(result.reason).toContain('disabled');
  });

  it('blocks even allowlisted commands when disabled', () => {
    const config: PowerShellSecurityConfig = {
      enabled: false,
      mode: 'allow',
      allowlist: ['dir'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('dir', config);
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
  });

  it('uses defaults when no config is passed', () => {
    const result = evaluatePowerShellCommand('Get-Process');
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
    expect(result.reason).toContain('disabled');
  });

  // ── Blocklist ─────────────────────────────────────────────────────────

  it('hard-denies commands matching blocklist pattern', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: ['rm -rf *'],
    };
    const result = evaluatePowerShellCommand('rm -rf /', config);
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
    expect(result.reason).toContain('blocklist');
  });

  it('blocklist works with * wildcard', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: ['Stop-Process *'],
    };
    const result = evaluatePowerShellCommand(
      'Stop-Process -Name chrome',
      config,
    );
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
  });

  it('blocklist is case-insensitive', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: ['stop-process *'],
    };
    const result = evaluatePowerShellCommand(
      'Stop-Process -Name chrome',
      config,
    );
    expect(result.allowed).toBe(false);
  });

  it('blocklist takes priority over allowlist', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['rm *'],
      blocklist: ['rm -rf *'],
    };
    const result = evaluatePowerShellCommand('rm -rf /', config);
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
  });

  it('command not matching blocklist falls through to mode', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: ['rm -rf *'],
    };
    const result = evaluatePowerShellCommand('dir', config);
    expect(result.allowed).toBe(true);
    expect(result.requiresConfirmation).toBe(false);
  });

  // ── Allowlist ─────────────────────────────────────────────────────────

  it('auto-allows commands matching allowlist', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['Get-*'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(true);
    expect(result.requiresConfirmation).toBe(false);
    expect(result.isHardDenial).toBe(false);
  });

  it('allowlist with * wildcard matches many commands', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['npm *'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('npm install express', config);
    expect(result.allowed).toBe(true);
  });

  it('allowlist exact match', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['dir'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('dir', config);
    expect(result.allowed).toBe(true);
  });

  it('allowlist exact match does not match subset', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['dir'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('dir /s', config);
    expect(result.allowed).toBe(false); // Falls through to 'deny' mode
  });

  it('allowlist is case-insensitive', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['get-*'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(true);
  });

  // ── Mode: 'allow' ────────────────────────────────────────────────────

  it('mode=allow auto-approves unmatched commands', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(true);
    expect(result.requiresConfirmation).toBe(false);
  });

  // ── Mode: 'ask' ───────────────────────────────────────────────────────

  it('mode=ask requires confirmation for unmatched commands', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'ask',
      allowlist: [],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(true);
    expect(result.requiresConfirmation).toBe(true);
    expect(result.isHardDenial).toBe(false);
    expect(result.reason).toContain('confirmation');
  });

  it('mode=ask passes through allowlisted commands without confirmation', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'ask',
      allowlist: ['Get-*'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(true);
    expect(result.requiresConfirmation).toBe(false);
  });

  // ── Mode: 'deny' ──────────────────────────────────────────────────────

  it('mode=deny blocks unmatched commands', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: [],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(false);
    expect(result.isHardDenial).toBe(true);
    expect(result.reason).toContain('mode is set to "deny"');
  });

  it('mode=deny passes through allowlisted commands', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['Get-*'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('Get-Process', config);
    expect(result.allowed).toBe(true);
  });

  // ── Edge cases ────────────────────────────────────────────────────────

  it('trims whitespace from command before matching', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'deny',
      allowlist: ['dir'],
      blocklist: [],
    };
    const result = evaluatePowerShellCommand('  dir  ', config);
    expect(result.allowed).toBe(true);
  });

  it('handles empty command gracefully', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: ['rm *'],
    };
    const result = evaluatePowerShellCommand('', config);
    expect(result.allowed).toBe(true); // Falls through to 'allow' mode
  });

  it('blocklist empty string does not match everything', () => {
    const config: PowerShellSecurityConfig = {
      enabled: true,
      mode: 'allow',
      allowlist: [],
      blocklist: [''],
    };
    const result = evaluatePowerShellCommand('rm -rf /', config);
    expect(result.allowed).toBe(true); // Empty blocklist pattern shouldn't match
  });
});
