import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Text, useStdin } from 'ink';
import { renderWithProviders } from './render.js';
import { useKeypressContext } from '../ui/contexts/KeypressContext.js';

describe('Keypress Debug', () => {
  it('stdin reference check - same object?', async () => {
    let stdinFromHook: unknown = null;
    const Comp: React.FC = () => {
      const { stdin } = useStdin();
      stdinFromHook = stdin;
      return React.createElement(Text, null, 'test');
    };

    const { stdin, unmount } = renderWithProviders(
      React.createElement(Comp, null),
    );

    await new Promise((r) => setTimeout(r, 50));

    expect(stdin).toBe(stdinFromHook); // Same object?
    unmount();
  });

  it('useStdin returns an object with isRaw', async () => {
    let stdinFromHook: unknown = null;
    const Comp: React.FC = () => {
      const { stdin } = useStdin();
      stdinFromHook = stdin;
      return React.createElement(Text, null, 'test');
    };

    const { unmount } = renderWithProviders(React.createElement(Comp, null));

    await new Promise((r) => setTimeout(r, 50));

    const s = stdinFromHook as { isRaw?: boolean };
    expect(s).toBeDefined();
    expect(typeof s.isRaw).toBe('boolean');
    unmount();
  });

  it('keypress listener count after direct on() call', async () => {
    const { stdin, unmount } = renderWithProviders(
      React.createElement(Text, null, 'test'),
    );

    await new Promise((r) => setTimeout(r, 50));

    // Manually add a keypress listener (what KeypressProvider should do)
    stdin.on('keypress', () => {});
    expect(stdin.listenerCount('keypress')).toBe(1);

    unmount();
  });

  it('does KeypressProvider actually subscribe?', async () => {
    // Test using KeypressProvider directly without renderWithProviders
    let isSubscribed = false;
    const handler = vi.fn();

    const Comp: React.FC = () => {
      const { subscribe } = useKeypressContext();
      React.useEffect(() => {
        subscribe(handler);
        isSubscribed = true;
      }, [subscribe]);
      return React.createElement(Text, null, 'test');
    };

    const { unmount } = renderWithProviders(React.createElement(Comp, null));

    await new Promise((r) => setTimeout(r, 50));
    expect(isSubscribed).toBe(true);
    unmount();
  });
});
