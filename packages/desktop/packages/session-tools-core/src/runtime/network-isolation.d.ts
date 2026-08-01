export interface NetworkIsolationPlan {
    status: 'enforced' | 'unavailable';
    backend: 'sandbox-exec' | 'unshare' | 'firejail' | 'none';
    command: string;
    args: string[];
}
/**
 * Wrap command execution to deny outbound network where supported.
 *
 * Current support:
 * - macOS: sandbox-exec with deny network profile
 * - Linux: unshare -n (preferred) or firejail --net=none
 * - others: unavailable (fail-safe for script_sandbox)
 */
export declare function applyNetworkIsolation(command: string, args: string[]): NetworkIsolationPlan;
