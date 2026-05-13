/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect } from 'vitest';
import { ApprovalConfig, ApprovalMode } from './approvalConfig.js';

describe('ApprovalConfig', () => {
  describe('getApprovalMode', () => {
    it('defaults to DEFAULT mode', () => {
      const config = new ApprovalConfig({});
      expect(config.getApprovalMode()).toBe(ApprovalMode.DEFAULT);
    });

    it('returns configured mode', () => {
      const config = new ApprovalConfig({
        approvalMode: ApprovalMode.AUTO_EDIT,
      });
      expect(config.getApprovalMode()).toBe(ApprovalMode.AUTO_EDIT);
    });
  });

  describe('getPrePlanMode', () => {
    it('defaults to DEFAULT when no pre-plan mode recorded', () => {
      const config = new ApprovalConfig({});
      expect(config.getPrePlanMode()).toBe(ApprovalMode.DEFAULT);
    });
  });

  describe('setApprovalMode', () => {
    it('sets the mode when trusted', () => {
      const config = new ApprovalConfig({});
      config.setApprovalMode(ApprovalMode.IZN, true);
      expect(config.getApprovalMode()).toBe(ApprovalMode.IZN);
    });

    it('throws when setting IZN in untrusted folder', () => {
      const config = new ApprovalConfig({});
      expect(() => config.setApprovalMode(ApprovalMode.IZN, false)).toThrow(
        'Cannot enable privileged approval modes',
      );
    });

    it('throws when setting AUTO_EDIT in untrusted folder', () => {
      const config = new ApprovalConfig({});
      expect(() =>
        config.setApprovalMode(ApprovalMode.AUTO_EDIT, false),
      ).toThrow('Cannot enable privileged approval modes');
    });

    it('allows DEFAULT mode even in untrusted folder', () => {
      const config = new ApprovalConfig({
        approvalMode: ApprovalMode.AUTO_EDIT,
      });
      expect(() =>
        config.setApprovalMode(ApprovalMode.DEFAULT, false),
      ).not.toThrow();
      expect(config.getApprovalMode()).toBe(ApprovalMode.DEFAULT);
    });

    it('allows PLAN mode even in untrusted folder', () => {
      const config = new ApprovalConfig({});
      expect(() =>
        config.setApprovalMode(ApprovalMode.PLAN, false),
      ).not.toThrow();
      expect(config.getApprovalMode()).toBe(ApprovalMode.PLAN);
    });

    describe('prePlanMode tracking', () => {
      it('saves pre-plan mode when entering plan mode', () => {
        const config = new ApprovalConfig({
          approvalMode: ApprovalMode.AUTO_EDIT,
        });
        config.setApprovalMode(ApprovalMode.PLAN, true);
        expect(config.getPrePlanMode()).toBe(ApprovalMode.AUTO_EDIT);
      });

      it('clears pre-plan mode when leaving plan mode', () => {
        const config = new ApprovalConfig({
          approvalMode: ApprovalMode.AUTO_EDIT,
        });
        // Enter plan mode
        config.setApprovalMode(ApprovalMode.PLAN, true);
        expect(config.getPrePlanMode()).toBe(ApprovalMode.AUTO_EDIT);
        // Leave plan mode
        config.setApprovalMode(ApprovalMode.AUTO_EDIT, true);
        expect(config.getPrePlanMode()).toBe(ApprovalMode.DEFAULT);
      });

      it('does not update pre-plan mode when already in plan mode', () => {
        const config = new ApprovalConfig({
          approvalMode: ApprovalMode.AUTO_EDIT,
        });
        config.setApprovalMode(ApprovalMode.PLAN, true);
        expect(config.getPrePlanMode()).toBe(ApprovalMode.AUTO_EDIT);
        // Setting plan mode again while already in plan mode shouldn't change prePlanMode
        config.setApprovalMode(ApprovalMode.PLAN, true);
        expect(config.getPrePlanMode()).toBe(ApprovalMode.AUTO_EDIT);
      });
    });
  });
});
