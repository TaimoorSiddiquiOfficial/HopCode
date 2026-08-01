export type ScriptRuntimeLanguage = 'python3' | 'node' | 'bun';
export interface ResolvedScriptRuntime {
    command: string;
    argsPrefix: string[];
    source: 'env' | 'bundled' | 'path';
}
export interface ResolveScriptRuntimeContext {
    /**
     * Whether host app is packaged. Defaults to CRAFT_IS_PACKAGED=1.
     * In packaged mode, PATH fallback is blocked by default.
     */
    isPackaged?: boolean;
    /**
     * Optional explicit app root path (usually Electron app.getAppPath()).
     */
    appRootPath?: string;
    /**
     * Optional explicit resources base used by Electron startup.
     * Typically:
     * - packaged: <process.resourcesPath>/app
     * - dev: <repo>/apps/electron
     */
    resourcesBasePath?: string;
}
/**
 * Resolve runtime command and fixed argument prefix for script execution tools.
 *
 * Resolution order:
 * - env override (CRAFT_UV / CRAFT_NODE / CRAFT_BUN)
 * - bundled binary path (when available)
 * - PATH fallback (dev only)
 */
export declare function resolveScriptRuntime(language: ScriptRuntimeLanguage, ctx?: ResolveScriptRuntimeContext): ResolvedScriptRuntime;
