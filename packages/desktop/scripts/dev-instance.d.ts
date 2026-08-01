export type DevInstance = {
    kind: 'numbered' | 'git-worktree';
    source: string;
    instanceNumber: string;
    label: string;
    appName: string;
    configDir?: string;
    runtimeDir: string;
    userDataDir: string;
    serverLockFile: string;
    deeplinkScheme: string;
    resolvePort(defaultPort: number): number;
};
export type ResolvedDevPort = {
    port: number;
    source: 'env' | 'instance' | 'default';
    instance: DevInstance | null;
};
export type ResolveDevPortOptions = {
    allowZero?: boolean;
};
export declare function detectDevInstance(rootDir: string): DevInstance | null;
export declare function resolveDevPort(rootDir: string, defaultPort: number, envVar?: string, options?: ResolveDevPortOptions): ResolvedDevPort;
