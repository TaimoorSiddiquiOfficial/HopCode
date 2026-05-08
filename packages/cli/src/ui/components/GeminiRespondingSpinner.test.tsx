/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Text } from 'ink';
import { HopCodeSpinner } from './HopCodeRespondingSpinner.js';

describe('<HopCodeSpinner />', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses a low-frequency fixed-width indicator inside tmux', () => {
    vi.stubEnv('TMUX', '/tmp/tmux-1000/default,12345,0');

    const { lastFrame } = render(<HopCodeSpinner />);

    expect(lastFrame()).toContain('.');
  });

  // Regression: Footer.tsx renders <HopCodeSpinner /> inside a <Text> wrapper
  // ('<Text>...<HopCodeSpinner /> {msg}</Text>'). Ink forbids <Box> from being
  // nested inside <Text>, so the tmux branch must return a <Text>, not a
  // <Box>-wrapped one — otherwise the CLI throws on startup inside tmux.
  it('renders without throwing when nested inside a <Text> (Footer context)', () => {
    vi.stubEnv('TMUX', '/tmp/tmux-1000/default,12345,0');

    expect(() =>
      render(
        <Text>
          <HopCodeSpinner /> startup message
        </Text>,
      ),
    ).not.toThrow();
  });
});
