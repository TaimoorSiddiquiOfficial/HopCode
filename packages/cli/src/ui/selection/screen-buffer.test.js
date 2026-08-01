import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Qwen
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, afterEach } from 'vitest';
import { Text } from 'ink';
import { render } from 'ink-testing-library';
import { getScreenBuffer } from './screen-buffer.js';
/** The background escape the patched renderer appends to selected cells. */
const SELECTION_BG = '[48;5;240m';
let current;
afterEach(() => {
    current?.unmount();
    current = undefined;
});
describe('ScreenBuffer (Ink frame-controller M0)', () => {
    it('exposes the composited frame as addressable cells', () => {
        current = render(_jsx(Text, { children: "hello \u4E2D\u6587" }));
        const buffer = getScreenBuffer(current.stdout);
        expect(buffer).toBeDefined();
        expect(buffer.dimensions.height).toBeGreaterThan(0);
        expect(buffer.lineText(0)).toBe('hello 中文');
        expect(buffer.getCellAt(0, 0)?.value).toBe('h');
    });
    it('handles wide characters with a leading cell and a spacer', () => {
        current = render(_jsx(Text, { children: "hello \u4E2D\u6587" }));
        const buffer = getScreenBuffer(current.stdout);
        // "hello " occupies columns 0-5; the first wide glyph starts at column 6.
        const wide = buffer.getCellAt(6, 0);
        expect(wide?.value).toBe('中');
        expect(wide?.fullWidth).toBe(true);
        // The trailing half of a wide glyph is an empty spacer cell.
        expect(buffer.getCellAt(7, 0)?.value).toBe('');
    });
    it('highlights the selected range before serialization and clears it', () => {
        current = render(_jsx(Text, { children: "hello world" }));
        const buffer = getScreenBuffer(current.stdout);
        expect(current.lastFrame()).not.toContain(SELECTION_BG);
        buffer.setSelection({ sx: 0, sy: 0, ex: 4, ey: 0 });
        expect(current.lastFrame()).toContain(SELECTION_BG);
        buffer.setSelection(null);
        expect(current.lastFrame()).not.toContain(SELECTION_BG);
    });
    it('does not leak the highlight onto identical text elsewhere on screen', () => {
        // "abc" appears twice; selecting the first must not highlight the second.
        current = render(_jsxs(Text, { children: ["abc", '\n', "abc"] }));
        const buffer = getScreenBuffer(current.stdout);
        buffer.setSelection({ sx: 0, sy: 0, ex: 2, ey: 0 });
        const frame = current.lastFrame() ?? '';
        const [firstLine, secondLine] = frame.split('\n');
        expect(firstLine).toContain(SELECTION_BG);
        expect(secondLine).not.toContain(SELECTION_BG);
    });
    it('publishes exactly one frame per distinct selection change (no loop, deduped)', () => {
        current = render(_jsx(Text, { children: "hello world" }));
        const buffer = getScreenBuffer(current.stdout);
        let publishes = 0;
        buffer.subscribe(() => {
            publishes++;
        });
        buffer.setSelection({ sx: 0, sy: 0, ex: 2, ey: 0 });
        expect(publishes).toBe(1);
        // Identical selection is deduplicated: no extra render.
        buffer.setSelection({ sx: 0, sy: 0, ex: 2, ey: 0 });
        expect(publishes).toBe(1);
        // A different selection renders once more.
        buffer.setSelection({ sx: 0, sy: 0, ex: 4, ey: 0 });
        expect(publishes).toBe(2);
    });
});
//# sourceMappingURL=screen-buffer.test.js.map