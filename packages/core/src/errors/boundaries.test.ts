/**
 * Tests for Error Boundaries Module
 */

import { describe, it, expect, vi } from 'vitest';
import {
  withinAgentBoundary,
  withinToolBoundary,
  withinServiceBoundary,
  withinUIBoundary,
} from './boundaries.js';
import {
  HopCodeError,
  ErrorCategory,
  CancellationError,
  InputError,
  ToolError,
} from './types.js';

// Mock error logger
vi.mock('./logger.js', () => ({
  errorLogger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('withinAgentBoundary', () => {
  it('returns operation result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    const result = await withinAgentBoundary(
      { agentId: 'test-agent' },
      operation,
    );

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected cancellation error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(new CancellationError('CANCELLED', 'User cancelled'));

    const result = await withinAgentBoundary(
      { agentId: 'test-agent' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected max turns error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new HopCodeError('MAX_TURNS', ErrorCategory.INPUT, 'Max turns reached'),
      );

    const result = await withinAgentBoundary(
      { agentId: 'test-agent' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('does not catch unexpected error', async () => {
    const error = new HopCodeError(
      'CONNECTION_ERROR',
      ErrorCategory.NETWORK,
      'Service unavailable',
    );
    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withinAgentBoundary({ agentId: 'test-agent' }, operation),
    ).rejects.toThrow('Service unavailable');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('calls custom onError callback', async () => {
    const error = new CancellationError('CANCELLED', 'User cancelled');
    const onError = vi.fn();
    const operation = vi.fn().mockRejectedValue(error);

    await withinAgentBoundary({ agentId: 'test-agent', onError }, operation);

    expect(onError).toHaveBeenCalledWith(error);
  });
});

describe('withinToolBoundary', () => {
  it('returns operation result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    const result = await withinToolBoundary(
      { toolName: 'test-tool' },
      operation,
    );

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected tool not found error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new ToolError('TOOL_NOT_FOUND', 'Tool not found: test-tool'),
      );

    const result = await withinToolBoundary(
      { toolName: 'test-tool' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected invalid params error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new InputError('INVALID_PARAMS', 'Invalid parameters'),
      );

    const result = await withinToolBoundary(
      { toolName: 'test-tool' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected execution failed error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new ToolError('EXECUTION_FAILED', 'Tool execution failed'),
      );

    const result = await withinToolBoundary(
      { toolName: 'test-tool' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('does not catch unexpected error', async () => {
    const error = new HopCodeError(
      'UNKNOWN_ERROR',
      ErrorCategory.INTERNAL,
      'Unknown',
    );
    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withinToolBoundary({ toolName: 'test-tool' }, operation),
    ).rejects.toThrow('Unknown');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('calls custom onError callback', async () => {
    const error = new ToolError('TOOL_NOT_FOUND', 'Tool not found');
    const onError = vi.fn();
    const operation = vi.fn().mockRejectedValue(error);

    await withinToolBoundary({ toolName: 'test-tool', onError }, operation);

    expect(onError).toHaveBeenCalledWith(error);
  });
});

describe('withinServiceBoundary', () => {
  it('returns operation result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    const result = await withinServiceBoundary(
      { serviceName: 'test-service' },
      operation,
    );

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected connection refused error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new HopCodeError(
          'CONNECTION_REFUSED',
          ErrorCategory.NETWORK,
          'Service unavailable',
        ),
      );

    const result = await withinServiceBoundary(
      { serviceName: 'test-service' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected timeout error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new HopCodeError('TIMEOUT', ErrorCategory.NETWORK, 'Request timeout'),
      );

    const result = await withinServiceBoundary(
      { serviceName: 'test-service' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected service unavailable error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new HopCodeError(
          'SERVICE_UNAVAILABLE',
          ErrorCategory.NETWORK,
          'Service temporarily down',
        ),
      );

    const result = await withinServiceBoundary(
      { serviceName: 'test-service' },
      operation,
    );

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('does not catch unexpected error', async () => {
    const error = new ToolError('TOOL_ERROR', 'Tool failed');
    const operation = vi.fn().mockRejectedValue(error);

    await expect(
      withinServiceBoundary({ serviceName: 'test-service' }, operation),
    ).rejects.toThrow('Tool failed');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('calls custom onError callback', async () => {
    const error = new HopCodeError(
      'CONNECTION_REFUSED',
      ErrorCategory.NETWORK,
      'Service unavailable',
    );
    const onError = vi.fn();
    const operation = vi.fn().mockRejectedValue(error);

    await withinServiceBoundary(
      { serviceName: 'test-service', onError },
      operation,
    );

    expect(onError).toHaveBeenCalledWith(error);
  });
});

describe('withinUIBoundary', () => {
  it('returns operation result on success', async () => {
    const operation = vi.fn().mockResolvedValue('success');

    const result = await withinUIBoundary('TestComponent', operation);

    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected render error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new HopCodeError(
          'RENDER_ERROR',
          ErrorCategory.INTERNAL,
          'Component render failed',
        ),
      );

    const result = await withinUIBoundary('TestComponent', operation);

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('handles expected state error', async () => {
    const operation = vi
      .fn()
      .mockRejectedValue(
        new HopCodeError(
          'STATE_ERROR',
          ErrorCategory.INTERNAL,
          'Invalid component state',
        ),
      );

    const result = await withinUIBoundary('TestComponent', operation);

    expect(result).toBeUndefined();
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('does not catch unexpected error', async () => {
    const error = new HopCodeError(
      'CONNECTION_ERROR',
      ErrorCategory.NETWORK,
      'Service unavailable',
    );
    const operation = vi.fn().mockRejectedValue(error);

    await expect(withinUIBoundary('TestComponent', operation)).rejects.toThrow(
      'Service unavailable',
    );
    expect(operation).toHaveBeenCalledTimes(1);
  });
});
