/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { Component, type ErrorInfo, type ReactNode } from 'react';
interface ErrorBoundaryProps {
    children: ReactNode;
    /**
     * Custom fallback renderer. Receives the caught error and a `reset` callback
     * that clears the boundary's error state (e.g. to retry after the offending
     * data has changed). When omitted, a minimal default message is shown.
     */
    fallback?: (error: Error, reset: () => void) => ReactNode;
    /** Optional side-effecting hook for logging the error. */
    onError?: (error: Error, info: ErrorInfo) => void;
}
interface ErrorBoundaryState {
    error: Error | null;
}
/**
 * React error boundary for the Ink tree. Catches render-time errors in its
 * subtree and shows a fallback instead of letting the exception propagate and
 * crash the whole CLI. The CLI UI otherwise has no error boundary, so any
 * unexpected history-item shape in a full-detail render path (transcript) would
 * take the process down.
 */
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState;
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, info: ErrorInfo): void;
    private readonly reset;
    render(): ReactNode;
}
export {};
