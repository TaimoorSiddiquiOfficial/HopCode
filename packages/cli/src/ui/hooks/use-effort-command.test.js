/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEffortCommand } from './use-effort-command.js';
describe('useEffortCommand', () => {
    let setReasoningEffort;
    let setValue;
    let config;
    let settings;
    beforeEach(() => {
        setReasoningEffort = vi.fn();
        setValue = vi.fn();
        config = { setReasoningEffort };
        settings = {
            setValue,
            isTrusted: true,
            user: { settings: {} },
            workspace: { settings: {} },
        };
    });
    it('opens and closes the dialog', () => {
        const { result } = renderHook(() => useEffortCommand(settings, config));
        expect(result.current.isEffortDialogOpen).toBe(false);
        act(() => result.current.openEffortDialog());
        expect(result.current.isEffortDialogOpen).toBe(true);
    });
    it('applies and persists the selected tier, then closes', () => {
        const { result } = renderHook(() => useEffortCommand(settings, config));
        act(() => result.current.openEffortDialog());
        act(() => result.current.handleEffortSelect('xhigh'));
        expect(setReasoningEffort).toHaveBeenCalledWith('xhigh');
        expect(setValue).toHaveBeenCalledWith(expect.anything(), 'model.reasoningEffort', 'xhigh');
        expect(result.current.isEffortDialogOpen).toBe(false);
    });
    it('cancels without mutating config or settings on undefined', () => {
        const { result } = renderHook(() => useEffortCommand(settings, config));
        act(() => result.current.openEffortDialog());
        act(() => result.current.handleEffortSelect(undefined));
        expect(setReasoningEffort).not.toHaveBeenCalled();
        expect(setValue).not.toHaveBeenCalled();
        expect(result.current.isEffortDialogOpen).toBe(false);
    });
    it('confirms the requested tier in-chat on success', () => {
        const addItem = vi.fn();
        config = {
            setReasoningEffort,
            getReasoningEffort: vi.fn().mockReturnValue('xhigh'),
        };
        const { result } = renderHook(() => useEffortCommand(settings, config, addItem));
        act(() => result.current.handleEffortSelect('xhigh'));
        expect(addItem).toHaveBeenCalledTimes(1);
        const [item] = addItem.mock.calls[0];
        expect(item.type).toBe('info');
        expect(item.text).toContain('xhigh');
        expect(item.text).toContain('requested');
    });
    it('warns in-chat when thinking is disabled (tier did not take effect)', () => {
        const addItem = vi.fn();
        config = {
            setReasoningEffort,
            // Thinking disabled: setReasoningEffort is a no-op, so the read-back
            // returns something other than the requested tier.
            getReasoningEffort: vi.fn().mockReturnValue(undefined),
        };
        const { result } = renderHook(() => useEffortCommand(settings, config, addItem));
        act(() => result.current.handleEffortSelect('high'));
        expect(addItem).toHaveBeenCalledTimes(1);
        const [item] = addItem.mock.calls[0];
        expect(item.type).toBe('info');
        expect(item.text).toContain('thinking is currently disabled');
    });
});
//# sourceMappingURL=use-effort-command.test.js.map