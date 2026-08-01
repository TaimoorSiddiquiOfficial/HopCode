import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from 'ink-testing-library';
import { act } from 'react';
import { Text } from 'ink';
import { ErrorBoundary } from './ErrorBoundary.js';
// A child that throws during render to trip the boundary.
const Thrower = ({ message }) => {
    throw new Error(message);
};
describe('ErrorBoundary', () => {
    // React logs caught render errors to console.error; silence it so the test
    // output stays clean (the boundary catching the error is the point).
    let errorSpy;
    beforeEach(() => {
        errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    });
    afterEach(() => {
        errorSpy.mockRestore();
    });
    it('renders children when no error is thrown', () => {
        const { lastFrame } = render(_jsx(ErrorBoundary, { children: _jsx(Text, { children: "healthy child" }) }));
        expect(lastFrame()).toContain('healthy child');
    });
    it('catches a render error and shows the default fallback with the message', () => {
        const { lastFrame } = render(_jsx(ErrorBoundary, { children: _jsx(Thrower, { message: "kaboom" }) }));
        const output = lastFrame() ?? '';
        expect(output).toContain('Something went wrong while rendering.');
        expect(output).toContain('kaboom');
    });
    it('renders a custom fallback with the caught error', () => {
        const { lastFrame } = render(_jsx(ErrorBoundary, { fallback: (error) => _jsxs(Text, { children: ["custom: ", error.message] }), children: _jsx(Thrower, { message: "boom" }) }));
        expect(lastFrame()).toContain('custom: boom');
    });
    it('calls onError with the error and component stack', () => {
        const onError = vi.fn();
        render(_jsx(ErrorBoundary, { onError: onError, children: _jsx(Thrower, { message: "logged" }) }));
        expect(onError).toHaveBeenCalledTimes(1);
        const [error, info] = onError.mock.calls[0];
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('logged');
        // React passes an ErrorInfo with a componentStack string.
        expect(typeof info.componentStack).toBe('string');
    });
    it('reset clears the error state so children can recover', () => {
        let shouldThrow = true;
        let capturedReset;
        const Maybe = () => {
            if (shouldThrow) {
                throw new Error('transient');
            }
            return _jsx(Text, { children: "recovered" });
        };
        const tree = (_jsx(ErrorBoundary, { fallback: (error, reset) => {
                capturedReset = reset;
                return _jsxs(Text, { children: ["err: ", error.message] });
            }, children: _jsx(Maybe, {}) }));
        const { lastFrame, rerender } = render(tree);
        expect(lastFrame()).toContain('err: transient');
        // The offending condition clears, then reset() drops the boundary's error
        // state and the subtree re-renders successfully.
        shouldThrow = false;
        act(() => {
            capturedReset?.();
        });
        rerender(tree);
        expect(lastFrame()).toContain('recovered');
    });
});
//# sourceMappingURL=ErrorBoundary.test.js.map