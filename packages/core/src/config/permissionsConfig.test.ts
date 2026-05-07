/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { PermissionsConfig } from './permissionsConfig.js';
import { ToolNames } from '../tools/tool-names.js';

const baseParams = {
  bareMode: false,
  permissionsAllow: [],
  permissionsAsk: [],
  permissionsDeny: [],
};

describe('PermissionsConfig', () => {
  describe('getCoreTools', () => {
    it('returns coreTools when not in bare mode', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        coreTools: ['Shell', 'ReadFile'],
      });
      expect(config.getCoreTools()).toEqual(['Shell', 'ReadFile']);
    });

    it('returns bare-mode defaults regardless of coreTools', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        bareMode: true,
        coreTools: [ToolNames.WEB_FETCH],
      });
      expect(config.getCoreTools()).toEqual([
        ToolNames.READ_FILE,
        ToolNames.EDIT,
        ToolNames.SHELL,
      ]);
    });

    it('returns undefined when coreTools is not set and not bare', () => {
      const config = new PermissionsConfig(baseParams);
      expect(config.getCoreTools()).toBeUndefined();
    });
  });

  describe('getPermissionsAllow', () => {
    it('returns allow list from permissions params', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsAllow: ['Bash(*)', 'Edit'],
      });
      expect(config.getPermissionsAllow()).toEqual(['Bash(*)', 'Edit']);
    });

    it('merges allowedTools into permissions allow', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsAllow: ['Bash(*)'],
        allowedTools: ['Shell', 'Edit'],
      });
      expect(config.getPermissionsAllow()).toEqual([
        'Bash(*)',
        'Shell',
        'Edit',
      ]);
    });

    it('returns empty array when both are empty', () => {
      const config = new PermissionsConfig(baseParams);
      expect(config.getPermissionsAllow()).toEqual([]);
    });

    it('does not duplicate entries when merging', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsAllow: ['Bash(*)'],
        allowedTools: ['Bash(*)', 'Edit'],
      });
      expect(config.getPermissionsAllow()).toEqual(['Bash(*)', 'Edit']);
    });

    it('skips falsy entries during merge', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsAllow: ['Bash(*)'],
        allowedTools: ['', 'Edit'] as string[],
      });
      expect(config.getPermissionsAllow()).toEqual(['Bash(*)', 'Edit']);
    });
  });

  describe('getPermissionsAsk', () => {
    it('returns ask list from permissions params', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsAsk: ['Shell(*)'],
      });
      expect(config.getPermissionsAsk()).toEqual(['Shell(*)']);
    });

    it('returns empty array by default', () => {
      const config = new PermissionsConfig(baseParams);
      expect(config.getPermissionsAsk()).toEqual([]);
    });
  });

  describe('getPermissionsDeny', () => {
    it('returns deny list from permissions params', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsDeny: ['WriteFile'],
      });
      expect(config.getPermissionsDeny()).toEqual(['WriteFile']);
    });

    it('merges excludeTools into deny list', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        permissionsDeny: ['WriteFile'],
        excludeTools: ['Shell', 'Glob'],
      });
      expect(config.getPermissionsDeny()).toEqual([
        'WriteFile',
        'Shell',
        'Glob',
      ]);
    });

    it('returns empty array when both are empty', () => {
      const config = new PermissionsConfig(baseParams);
      expect(config.getPermissionsDeny()).toEqual([]);
    });
  });

  describe('getToolDiscoveryCommand', () => {
    it('returns undefined by default', () => {
      const config = new PermissionsConfig(baseParams);
      expect(config.getToolDiscoveryCommand()).toBeUndefined();
    });

    it('returns configured command', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        toolDiscoveryCommand: 'echo tools',
      });
      expect(config.getToolDiscoveryCommand()).toBe('echo tools');
    });
  });

  describe('getDisabledSlashCommands', () => {
    it('returns disabled commands as frozen array', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        disabledSlashCommands: ['clear', 'reset'],
      });
      const result = config.getDisabledSlashCommands();
      expect(result).toEqual(['clear', 'reset']);
      expect(Object.isFrozen(result)).toBe(true);
    });

    it('returns empty frozen array by default', () => {
      const config = new PermissionsConfig(baseParams);
      const result = config.getDisabledSlashCommands();
      expect(result).toEqual([]);
      expect(Object.isFrozen(result)).toBe(true);
    });
  });

  describe('getToolCallCommand', () => {
    it('returns undefined by default', () => {
      const config = new PermissionsConfig(baseParams);
      expect(config.getToolCallCommand()).toBeUndefined();
    });

    it('returns configured command', () => {
      const config = new PermissionsConfig({
        ...baseParams,
        toolCallCommand: '/model',
      });
      expect(config.getToolCallCommand()).toBe('/model');
    });
  });
});
