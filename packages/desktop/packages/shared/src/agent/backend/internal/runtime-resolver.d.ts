import type { BackendHostRuntimeContext } from '../types.ts';
export interface ResolvedBackendRuntimePaths {
    hopcodeCliPath?: string;
    nodeRuntimePath?: string;
    bundledRuntimePath?: string;
}
export interface ResolvedBackendHostTooling {
    ripgrepPath?: string;
}
export declare function resolveBackendRuntimePaths(hostRuntime: BackendHostRuntimeContext): ResolvedBackendRuntimePaths;
export declare function resolveBackendHostTooling(hostRuntime: BackendHostRuntimeContext): ResolvedBackendHostTooling;
