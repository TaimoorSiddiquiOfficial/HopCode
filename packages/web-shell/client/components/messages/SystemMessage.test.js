import { jsx as _jsx } from "react/jsx-runtime";
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider } from '../../i18n';
import { TranscriptRenderModeProvider } from '../../transcriptRenderMode';
import { serializeGoalStatusMessage } from './GoalStatusMessage';
import { SystemMessage } from './SystemMessage';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const mounted = [];
afterEach(() => {
    for (const { root, container } of mounted.splice(0)) {
        act(() => root.unmount());
        container.remove();
    }
});
function render(node) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => {
        root.render(_jsx(I18nProvider, { language: "en", children: node }));
    });
    mounted.push({ root, container });
    return container;
}
describe('SystemMessage — prompt_cancelled marker', () => {
    it('renders the user-cancelled marker as a status region', () => {
        const container = render(_jsx(SystemMessage, { content: "", variant: "info", source: "prompt_cancelled" }));
        const status = container.querySelector('[role="status"]');
        expect(status).not.toBeNull();
        expect(status?.textContent).toBe('You cancelled this request');
    });
    it('ignores message content when rendering the cancelled marker', () => {
        const container = render(_jsx(SystemMessage, { content: "raw daemon text that must not leak", variant: "info", source: "prompt_cancelled" }));
        expect(container.textContent).toBe('You cancelled this request');
        expect(container.textContent).not.toContain('raw daemon text');
    });
    it('renders a normal message without the status marker for other sources', () => {
        const container = render(_jsx(SystemMessage, { content: "a plain note", variant: "error" }));
        expect(container.querySelector('[role="status"]')).toBeNull();
        expect(container.textContent).toContain('a plain note');
    });
});
describe('SystemMessage — goal status activation', () => {
    const content = serializeGoalStatusMessage({
        kind: 'set',
        condition: 'Ship safely',
        setAt: 1,
    });
    it('keeps the existing interactive event behavior by default', () => {
        const handler = vi.fn();
        window.addEventListener('web-shell-goal-status-active', handler);
        const container = render(_jsx(SystemMessage, { content: content, variant: "info", isLatest: true }));
        expect(container.textContent).toContain('Ship safely');
        expect(handler).toHaveBeenCalledOnce();
        window.removeEventListener('web-shell-goal-status-active', handler);
    });
    it('does not dispatch the goal event in readonly mode', () => {
        const handler = vi.fn();
        window.addEventListener('web-shell-goal-status-active', handler);
        const container = render(_jsx(TranscriptRenderModeProvider, { value: "readonly", children: _jsx(SystemMessage, { content: content, variant: "info", isLatest: true }) }));
        expect(container.textContent).toContain('Ship safely');
        expect(handler).not.toHaveBeenCalled();
        window.removeEventListener('web-shell-goal-status-active', handler);
    });
});
//# sourceMappingURL=SystemMessage.test.js.map