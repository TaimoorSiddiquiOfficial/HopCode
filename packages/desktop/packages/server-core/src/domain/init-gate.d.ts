/**
 * Tracks startup initialization state and coordinates async waiters.
 * Waiters are settled exactly once as either ready (resolve) or failed (reject).
 */
export declare class InitGate {
    private settled;
    private readonly promise;
    private resolvePromise;
    private rejectPromise;
    constructor();
    wait(): Promise<void>;
    markReady(): void;
    markFailed(error: unknown): void;
}
