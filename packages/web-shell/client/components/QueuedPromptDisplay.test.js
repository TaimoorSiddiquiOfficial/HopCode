import { jsx as _jsx } from "react/jsx-runtime";
// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { getTranslator } from '../i18n';
import { QueuedPromptDisplay } from './QueuedPromptDisplay';
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const t = getTranslator('zh-CN');
const mounted = [];
function render(node) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    act(() => root.render(node));
    mounted.push({ root, container });
    return container;
}
afterEach(() => {
    for (const { root, container } of mounted.splice(0)) {
        act(() => root.unmount());
        container.remove();
    }
});
function setup(overrides = {}) {
    const handlers = {
        onDelete: vi.fn(),
        onInsert: vi.fn(),
        onEdit: vi.fn(),
    };
    const prompts = overrides.prompts
        ? [...overrides.prompts]
        : [
            { id: 1, text: '排队消息一' },
            { id: 2, text: '排队消息二' },
        ];
    const container = render(_jsx(QueuedPromptDisplay, { prompts: prompts, t: t, ...handlers, ...overrides }));
    return { container, handlers };
}
describe('QueuedPromptDisplay', () => {
    it('renders nothing when the queue is empty', () => {
        const { container } = setup({ prompts: [] });
        expect(container.textContent).toBe('');
    });
    it('lists each queued prompt', () => {
        const { container } = setup();
        expect(container.textContent).toContain('排队消息一');
        expect(container.textContent).toContain('排队消息二');
    });
    it('passes the prompt id to per-row delete', () => {
        const { container, handlers } = setup({
            prompts: [{ id: 42, text: 'only one' }],
        });
        const del = [...container.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === t('queue.delete'));
        act(() => del.dispatchEvent(new MouseEvent('click', { bubbles: true })));
        expect(handlers.onDelete).toHaveBeenCalledWith(42);
    });
    it('disables insert for a command prompt', () => {
        const { container } = setup({
            prompts: [{ id: 1, text: '/help me' }],
        });
        const insert = [...container.querySelectorAll('button')].find((b) => (b.textContent || '').includes(t('queue.insert')));
        expect(insert).toBeTruthy();
        expect(insert.disabled).toBe(true);
    });
});
//# sourceMappingURL=QueuedPromptDisplay.test.js.map