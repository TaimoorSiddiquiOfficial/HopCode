/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import {
  resolveToolName,
  getSpecifierKind,
  toolMatchesRuleToolName,
  parseRule,
  parseRules,
  splitCompoundCommand,
  matchesCommandPattern,
  resolvePathPattern,
  matchesPathPattern,
  matchesDomainPattern,
  matchesMcpPattern,
  matchesRule,
  buildPermissionRules,
  buildHumanReadableRuleLabel,
  getRuleDisplayName,
} from '../permissions/rule-parser.js';
import type { PathMatchContext } from '../permissions/rule-parser.js';

// ---------------------------------------------------------------------------
// resolveToolName
// ---------------------------------------------------------------------------

describe('resolveToolName', () => {
  it('resolves "Bash" to "run_shell_command"', () => {
    expect(resolveToolName('Bash')).toBe('run_shell_command');
  });

  it('resolves "Edit" to "edit"', () => {
    expect(resolveToolName('Edit')).toBe('edit');
  });

  it('resolves "Read" to "read_file"', () => {
    expect(resolveToolName('Read')).toBe('read_file');
  });

  it('resolves legacy "SearchFiles" to "grep_search"', () => {
    expect(resolveToolName('SearchFiles')).toBe('grep_search');
  });

  it('resolves legacy "FindFiles" to "glob"', () => {
    expect(resolveToolName('FindFiles')).toBe('glob');
  });

  it('resolves legacy "task" to "agent"', () => {
    expect(resolveToolName('task')).toBe('agent');
  });

  it('resolves "Task" to "agent"', () => {
    expect(resolveToolName('Task')).toBe('agent');
  });

  it('passes through unknown tool names unchanged', () => {
    expect(resolveToolName('mcp__github__list_repos')).toBe(
      'mcp__github__list_repos',
    );
  });

  it('passes through already-canonical names', () => {
    expect(resolveToolName('run_shell_command')).toBe('run_shell_command');
    expect(resolveToolName('edit')).toBe('edit');
    expect(resolveToolName('read_file')).toBe('read_file');
  });
});

// ---------------------------------------------------------------------------
// getSpecifierKind
// ---------------------------------------------------------------------------

describe('getSpecifierKind', () => {
  it('returns "command" for shell tools', () => {
    expect(getSpecifierKind('run_shell_command')).toBe('command');
    expect(getSpecifierKind('monitor')).toBe('command');
  });

  it('returns "path" for file-reading tools', () => {
    expect(getSpecifierKind('read_file')).toBe('path');
    expect(getSpecifierKind('grep_search')).toBe('path');
    expect(getSpecifierKind('glob')).toBe('path');
    expect(getSpecifierKind('list_directory')).toBe('path');
  });

  it('returns "path" for file-editing tools', () => {
    expect(getSpecifierKind('edit')).toBe('path');
    expect(getSpecifierKind('write_file')).toBe('path');
  });

  it('returns "domain" for WebFetch', () => {
    expect(getSpecifierKind('web_fetch')).toBe('domain');
  });

  it('returns "literal" for unknown tools', () => {
    expect(getSpecifierKind('agent')).toBe('literal');
    expect(getSpecifierKind('skill')).toBe('literal');
  });
});

// ---------------------------------------------------------------------------
// toolMatchesRuleToolName
// ---------------------------------------------------------------------------

describe('toolMatchesRuleToolName', () => {
  it('matches exact tool names', () => {
    expect(toolMatchesRuleToolName('edit', 'edit')).toBe(true);
    // Edit meta-category covers write_file
    expect(toolMatchesRuleToolName('edit', 'write_file')).toBe(true);
  });

  it('Read meta-category covers all read tools', () => {
    expect(toolMatchesRuleToolName('read_file', 'grep_search')).toBe(true);
    expect(toolMatchesRuleToolName('read_file', 'glob')).toBe(true);
    expect(toolMatchesRuleToolName('read_file', 'list_directory')).toBe(true);
    expect(toolMatchesRuleToolName('read_file', 'read_file')).toBe(true);
  });

  it('Edit meta-category covers write_file', () => {
    expect(toolMatchesRuleToolName('edit', 'write_file')).toBe(true);
    expect(toolMatchesRuleToolName('edit', 'edit')).toBe(true);
    expect(toolMatchesRuleToolName('edit', 'read_file')).toBe(false);
  });

  it('Bash (run_shell_command) also covers monitor', () => {
    expect(toolMatchesRuleToolName('run_shell_command', 'monitor')).toBe(true);
  });

  it('Monitor does NOT cover shell', () => {
    expect(toolMatchesRuleToolName('monitor', 'run_shell_command')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// parseRule
// ---------------------------------------------------------------------------

describe('parseRule', () => {
  it('parses a simple tool name rule', () => {
    const rule = parseRule('Bash');
    expect(rule.toolName).toBe('run_shell_command');
    expect(rule.specifier).toBeUndefined();
    expect(rule.specifierKind).toBeUndefined();
    expect(rule.invalid).toBeUndefined();
  });

  it('parses a rule with specifier', () => {
    const rule = parseRule('Bash(git *)');
    expect(rule.toolName).toBe('run_shell_command');
    expect(rule.specifier).toBe('git *');
    expect(rule.specifierKind).toBe('command');
  });

  it('parses a path rule', () => {
    const rule = parseRule('Edit(/src/**/*.ts)');
    expect(rule.toolName).toBe('edit');
    expect(rule.specifier).toBe('/src/**/*.ts');
    expect(rule.specifierKind).toBe('path');
  });

  it('parses a domain rule', () => {
    const rule = parseRule('WebFetch(domain:example.com)');
    expect(rule.toolName).toBe('web_fetch');
    expect(rule.specifier).toBe('domain:example.com');
    expect(rule.specifierKind).toBe('domain');
  });

  it('handles empty specifier', () => {
    const rule = parseRule('Bash()');
    expect(rule.toolName).toBe('run_shell_command');
    expect(rule.specifier).toBe('');
  });

  it('marks rules with unbalanced parentheses as invalid', () => {
    const rule = parseRule('Bash(git *');
    expect(rule.invalid).toBe(true);
    expect(rule.toolName).toBe('run_shell_command');
  });

  it('handles legacy :* suffix normalization', () => {
    const rule = parseRule('Bash(git:*)');
    expect(rule.specifier).toBe('git *');
  });

  it('preserves trimmed raw string', () => {
    const rule = parseRule('  Bash(pip install)  ');
    // parseRule trims the input
    expect(rule.raw).toBe('Bash(pip install)');
    expect(rule.toolName).toBe('run_shell_command');
    expect(rule.specifier).toBe('pip install');
  });

  it('handles MCP tool names without specifier', () => {
    const rule = parseRule('mcp__puppeteer__navigate');
    expect(rule.toolName).toBe('mcp__puppeteer__navigate');
    expect(rule.specifier).toBeUndefined();
  });

  it('resolves legacy "replace" to "edit"', () => {
    const rule = parseRule('replace');
    expect(rule.toolName).toBe('edit');
  });

  it('resolves "Bash" to "run_shell_command" with specifier', () => {
    const rule = parseRule('Bash(npm *)');
    expect(rule.toolName).toBe('run_shell_command');
    expect(rule.specifier).toBe('npm *');
    expect(rule.specifierKind).toBe('command');
  });
});

// ---------------------------------------------------------------------------
// parseRules
// ---------------------------------------------------------------------------

describe('parseRules', () => {
  it('parses an array of rule strings', () => {
    const rules = parseRules(['Bash', 'Read(./src/**)']);
    expect(rules).toHaveLength(2);
    expect(rules[0]!.toolName).toBe('run_shell_command');
    expect(rules[1]!.toolName).toBe('read_file');
    expect(rules[1]!.specifier).toBe('./src/**');
  });

  it('skips empty entries', () => {
    const rules = parseRules(['Bash', '', '  ']);
    expect(rules).toHaveLength(1);
  });

  it('returns empty array for empty input', () => {
    expect(parseRules([])).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// splitCompoundCommand
// ---------------------------------------------------------------------------

describe('splitCompoundCommand', () => {
  it('returns a single-element array for simple commands', () => {
    expect(splitCompoundCommand('git status')).toEqual(['git status']);
  });

  it('splits on &&', () => {
    expect(splitCompoundCommand('git add . && git commit')).toEqual([
      'git add .',
      'git commit',
    ]);
  });

  it('splits on ||', () => {
    expect(splitCompoundCommand('make test || echo failed')).toEqual([
      'make test',
      'echo failed',
    ]);
  });

  it('splits on pipe', () => {
    expect(splitCompoundCommand('ls -la | grep foo')).toEqual([
      'ls -la',
      'grep foo',
    ]);
  });

  it('splits on semicolon', () => {
    expect(splitCompoundCommand('cd /tmp; ls')).toEqual(['cd /tmp', 'ls']);
  });

  it('does NOT split inside single quotes', () => {
    expect(splitCompoundCommand("echo 'hello && world'")).toEqual([
      "echo 'hello && world'",
    ]);
  });

  it('does NOT split inside double quotes', () => {
    expect(splitCompoundCommand('echo "a || b"')).toEqual(['echo "a || b"']);
  });

  it('handles backslash-escaped ampersand', () => {
    // The backslash escapes the first `&`, then space+&& becomes an operator
    // Result: 'echo a\' (literal with escaped &) then 'b' after the && split
    const result = splitCompoundCommand('echo a\\ && b');
    expect(result).toEqual(['echo a\\', 'b']);
  });

  it('splits on multiple operators', () => {
    expect(
      splitCompoundCommand('git add . && git commit -m "fix" || echo fail'),
    ).toEqual(['git add .', 'git commit -m "fix"', 'echo fail']);
  });

  it('trims whitespace from segments', () => {
    expect(splitCompoundCommand('  ls   &&   cat  ')).toEqual(['ls', 'cat']);
  });

  it('returns original for whitespace-only input', () => {
    // Whitespace-only: no segments, fallback returns [original]
    const result = splitCompoundCommand('   ');
    expect(result).toHaveLength(1);
  });

  it('splits on |& operator', () => {
    expect(splitCompoundCommand('cmd1 |& cmd2')).toEqual(['cmd1', 'cmd2']);
  });

  it('splits on ;; operator', () => {
    expect(splitCompoundCommand('cmd1 ;; cmd2')).toEqual(['cmd1', 'cmd2']);
  });
});

// ---------------------------------------------------------------------------
// matchesCommandPattern
// ---------------------------------------------------------------------------

describe('matchesCommandPattern', () => {
  it('matches exact command', () => {
    expect(matchesCommandPattern('git status', 'git status')).toBe(true);
  });

  it('matches prefix (no wildcard)', () => {
    expect(matchesCommandPattern('git', 'git status')).toBe(true);
  });

  it('does not match prefix that is not word-bounded', () => {
    expect(matchesCommandPattern('git', 'gitcommit')).toBe(false);
  });

  it('matches lone * wildcard', () => {
    expect(matchesCommandPattern('*', 'anything goes')).toBe(true);
    expect(matchesCommandPattern('*', '')).toBe(true);
  });

  it('matches word-boundary wildcard: "ls *"', () => {
    expect(matchesCommandPattern('ls *', 'ls -la')).toBe(true);
    expect(matchesCommandPattern('ls *', 'ls')).toBe(true);
    expect(matchesCommandPattern('ls *', 'lsoft')).toBe(false);
  });

  it('matches non-boundary wildcard: "ls*"', () => {
    expect(matchesCommandPattern('ls*', 'ls -la')).toBe(true);
    expect(matchesCommandPattern('ls*', 'lsoft')).toBe(true);
  });

  it('matches wildcard in middle', () => {
    expect(matchesCommandPattern('git * branch', 'git checkout branch')).toBe(
      true,
    );
  });

  it('matches wildcard at end', () => {
    expect(matchesCommandPattern('npm run *', 'npm run build')).toBe(true);
    expect(matchesCommandPattern('npm run *', 'npm run')).toBe(true);
  });

  it('rejects non-matching command', () => {
    expect(matchesCommandPattern('git *', 'npm install')).toBe(false);
  });

  it('matches empty pattern (edge case)', () => {
    expect(matchesCommandPattern('', '')).toBe(true);
  });

  it('strips leading variable assignments before matching', () => {
    expect(matchesCommandPattern('git *', 'DEBUG=1 git status')).toBe(true);
  });

  it('strips multiple leading variable assignments', () => {
    expect(matchesCommandPattern('git *', 'FOO=bar BAZ=qux git push')).toBe(
      true,
    );
  });
});

// ---------------------------------------------------------------------------
// resolvePathPattern
// ---------------------------------------------------------------------------

describe('resolvePathPattern', () => {
  const projectRoot = '/home/user/project';
  const cwd = '/home/user/project/src';

  it('resolves // prefix to absolute path', () => {
    expect(resolvePathPattern('//etc/passwd', projectRoot, cwd)).toBe(
      '/etc/passwd',
    );
  });

  it('resolves ~/ prefix relative to home', () => {
    // We can only test that it starts with the home dir
    const result = resolvePathPattern('~/Documents', projectRoot, cwd);
    expect(result).toContain('Documents');
    expect(result).not.toContain('~');
  });

  it('resolves / prefix relative to project root', () => {
    const result = resolvePathPattern('/src/foo.ts', projectRoot, cwd);
    expect(result).toBe('/home/user/project/src/foo.ts');
  });

  it('resolves ./ prefix relative to cwd', () => {
    const result = resolvePathPattern('./utils/bar.ts', projectRoot, cwd);
    expect(result).toBe('/home/user/project/src/utils/bar.ts');
  });

  it('resolves no-prefix relative to cwd', () => {
    const result = resolvePathPattern('*.env', projectRoot, cwd);
    expect(result).toBe('/home/user/project/src/*.env');
  });
});

// ---------------------------------------------------------------------------
// matchesPathPattern
// ---------------------------------------------------------------------------

describe('matchesPathPattern', () => {
  const projectRoot = '/home/user/project';
  const cwd = '/home/user/project';

  it('matches exact path', () => {
    expect(
      matchesPathPattern(
        './src/main.ts',
        '/home/user/project/src/main.ts',
        projectRoot,
        cwd,
      ),
    ).toBe(true);
  });

  it('rejects non-matching path', () => {
    expect(
      matchesPathPattern(
        './src/*.ts',
        '/home/user/project/tests/main.test.ts',
        projectRoot,
        cwd,
      ),
    ).toBe(false);
  });

  it('matches with ** recursive glob', () => {
    expect(
      matchesPathPattern(
        '/src/**/*.ts',
        '/home/user/project/src/utils/deep/nested/file.ts',
        projectRoot,
        cwd,
      ),
    ).toBe(true);
  });

  it('matches dotfiles with dot:true', () => {
    expect(
      matchesPathPattern('./.env', '/home/user/project/.env', projectRoot, cwd),
    ).toBe(true);
  });

  it('rejects non-matching directory', () => {
    expect(
      matchesPathPattern(
        '/src/**/*.ts',
        '/home/user/project/docs/readme.md',
        projectRoot,
        cwd,
      ),
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// matchesDomainPattern
// ---------------------------------------------------------------------------

describe('matchesDomainPattern', () => {
  it('matches exact domain', () => {
    expect(matchesDomainPattern('domain:example.com', 'example.com')).toBe(
      true,
    );
  });

  it('matches subdomain', () => {
    expect(matchesDomainPattern('domain:example.com', 'sub.example.com')).toBe(
      true,
    );
  });

  it('rejects different domain', () => {
    expect(matchesDomainPattern('domain:example.com', 'evil.com')).toBe(false);
  });

  it('matches specifier without domain: prefix', () => {
    expect(matchesDomainPattern('github.com', 'github.com')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(matchesDomainPattern('domain:Example.COM', 'example.com')).toBe(
      true,
    );
  });

  it('rejects empty domain', () => {
    expect(matchesDomainPattern('domain:example.com', '')).toBe(false);
  });

  it('rejects empty pattern', () => {
    expect(matchesDomainPattern('', 'example.com')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// matchesMcpPattern
// ---------------------------------------------------------------------------

describe('matchesMcpPattern', () => {
  it('matches exact tool name', () => {
    expect(
      matchesMcpPattern('mcp__puppeteer__navigate', 'mcp__puppeteer__navigate'),
    ).toBe(true);
  });

  it('matches wildcard suffix', () => {
    expect(
      matchesMcpPattern('mcp__puppeteer__*', 'mcp__puppeteer__navigate'),
    ).toBe(true);
  });

  it('matches server-level pattern (2 parts to 3+ parts)', () => {
    expect(
      matchesMcpPattern('mcp__puppeteer', 'mcp__puppeteer__navigate'),
    ).toBe(true);
  });

  it('does NOT match server-level pattern when tool has 2 parts', () => {
    // 2-part pattern, 2-part tool = exact match only
    expect(matchesMcpPattern('mcp__puppeteer', 'mcp__github')).toBe(false);
    expect(matchesMcpPattern('mcp__puppeteer', 'mcp__puppeteer')).toBe(true);
  });

  it('rejects non-matching server', () => {
    expect(
      matchesMcpPattern('mcp__puppeteer__*', 'mcp__filesystem__read'),
    ).toBe(false);
  });

  it('matches prefix with wildcard', () => {
    expect(
      matchesMcpPattern('mcp__chrome__use_*', 'mcp__chrome__use_page'),
    ).toBe(true);
    expect(
      matchesMcpPattern('mcp__chrome__use_*', 'mcp__chrome__navigate'),
    ).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// matchesRule (unified)
// ---------------------------------------------------------------------------

describe('matchesRule', () => {
  const pathCtx: PathMatchContext = {
    projectRoot: '/home/user/project',
    cwd: '/home/user/project',
  };

  it('never matches invalid rules', () => {
    const rule = parseRule('Bash(git *');
    expect(
      matchesRule(
        rule,
        'run_shell_command',
        'git status',
        undefined,
        undefined,
        pathCtx,
      ),
    ).toBe(false);
  });

  it('matches bare tool name rule', () => {
    const rule = parseRule('Bash');
    expect(matchesRule(rule, 'run_shell_command')).toBe(true);
  });

  it('rejects non-matching tool name', () => {
    const rule = parseRule('Bash');
    expect(matchesRule(rule, 'edit')).toBe(false);
  });

  it('matches command specifier', () => {
    const rule = parseRule('Bash(git *)');
    expect(matchesRule(rule, 'run_shell_command', 'git status')).toBe(true);
    expect(matchesRule(rule, 'run_shell_command', 'npm install')).toBe(false);
  });

  it('matches path specifier', () => {
    const rule = parseRule('Read(./src/**)');
    expect(
      matchesRule(
        rule,
        'read_file',
        undefined,
        '/home/user/project/src/main.ts',
        undefined,
        pathCtx,
      ),
    ).toBe(true);
  });

  it('matches domain specifier', () => {
    const rule = parseRule('WebFetch(domain:github.com)');
    expect(
      matchesRule(
        rule,
        'web_fetch',
        undefined,
        undefined,
        'github.com',
        pathCtx,
      ),
    ).toBe(true);
  });

  it('matches literal specifier for Skill', () => {
    const rule = parseRule('Skill(frontend-design)');
    expect(
      matchesRule(
        rule,
        'skill',
        undefined,
        undefined,
        undefined,
        pathCtx,
        'frontend-design',
      ),
    ).toBe(true);
  });

  it('rejects literal specifier when value does not match', () => {
    const rule = parseRule('Skill(frontend-design)');
    expect(
      matchesRule(
        rule,
        'skill',
        undefined,
        undefined,
        undefined,
        pathCtx,
        'backend-design',
      ),
    ).toBe(false);
  });

  it('matches MCP tool rule', () => {
    const rule = parseRule('mcp__puppeteer__*');
    expect(matchesRule(rule, 'mcp__puppeteer__navigate')).toBe(true);
  });

  it('Read meta-category rule matches grep_search', () => {
    const rule = parseRule('Read');
    expect(matchesRule(rule, 'grep_search')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildPermissionRules
// ---------------------------------------------------------------------------

describe('buildPermissionRules', () => {
  it('builds a command rule with command context', () => {
    const result = buildPermissionRules({
      toolName: 'run_shell_command',
      command: 'git status',
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('Bash(git status)');
  });

  it('builds a bare display name when no command context', () => {
    const result = buildPermissionRules({ toolName: 'run_shell_command' });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('Bash');
  });

  it('builds a path rule with directory for file-targeted tools', () => {
    const result = buildPermissionRules({
      toolName: 'edit',
      filePath: '/home/user/project/src/main.ts',
    });
    expect(result).toHaveLength(1);
    // File-targeted: uses parent dir + /** with // prefix for absolute path grammar
    expect(result[0]).toBe('Edit(//home/user/project/src/**)');
  });

  it('builds a bare display name when no file path', () => {
    const result = buildPermissionRules({ toolName: 'read_file' });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('Read');
  });

  it('builds a domain rule for WebFetch', () => {
    const result = buildPermissionRules({
      toolName: 'web_fetch',
      domain: 'github.com',
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('WebFetch(github.com)');
  });

  it('builds a literal rule for Skill', () => {
    const result = buildPermissionRules({
      toolName: 'skill',
      specifier: 'frontend-design',
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe('Skill(frontend-design)');
  });
});

// ---------------------------------------------------------------------------
// buildHumanReadableRuleLabel
// ---------------------------------------------------------------------------

describe('buildHumanReadableRuleLabel', () => {
  it('returns empty string for empty rules', () => {
    expect(buildHumanReadableRuleLabel([])).toBe('');
  });

  it('describes a bare Read rule', () => {
    expect(buildHumanReadableRuleLabel(['Read'])).toBe('read files');
  });

  it('describes a bare Bash rule', () => {
    expect(buildHumanReadableRuleLabel(['Bash'])).toBe('run commands');
  });

  it('describes a path rule', () => {
    const label = buildHumanReadableRuleLabel([
      'Read(/home/user/project/src/**)',
    ]);
    expect(label).toContain('read files in');
    expect(label).toContain('/home/user/project/src/');
  });

  it('describes a command rule', () => {
    const label = buildHumanReadableRuleLabel(['Bash(git *)']);
    expect(label).toContain("'git *'");
  });

  it('describes a domain rule', () => {
    const label = buildHumanReadableRuleLabel(['WebFetch(github.com)']);
    expect(label).toContain('github.com');
  });

  it('joins multiple rules with comma', () => {
    const label = buildHumanReadableRuleLabel(['Read(/src/**)', 'Bash(npm *)']);
    expect(label).toContain(',');
  });
});

// ---------------------------------------------------------------------------
// getRuleDisplayName
// ---------------------------------------------------------------------------

describe('getRuleDisplayName', () => {
  it('maps read tools to "Read"', () => {
    expect(getRuleDisplayName('read_file')).toBe('Read');
    expect(getRuleDisplayName('grep_search')).toBe('Read');
    expect(getRuleDisplayName('glob')).toBe('Read');
    expect(getRuleDisplayName('list_directory')).toBe('Read');
  });

  it('maps edit tools to "Edit"', () => {
    expect(getRuleDisplayName('edit')).toBe('Edit');
    expect(getRuleDisplayName('write_file')).toBe('Edit');
  });

  it('maps shell to "Bash"', () => {
    expect(getRuleDisplayName('run_shell_command')).toBe('Bash');
  });

  it('maps monitor to "Monitor"', () => {
    expect(getRuleDisplayName('monitor')).toBe('Monitor');
  });

  it('maps web_fetch to "WebFetch"', () => {
    expect(getRuleDisplayName('web_fetch')).toBe('WebFetch');
  });

  it('maps agent to "Agent"', () => {
    expect(getRuleDisplayName('agent')).toBe('Agent');
  });

  it('maps skill to "Skill"', () => {
    expect(getRuleDisplayName('skill')).toBe('Skill');
  });

  it('falls back to canonical name for unmapped tools', () => {
    expect(getRuleDisplayName('mcp__github__list_repos')).toBe(
      'mcp__github__list_repos',
    );
  });
});
