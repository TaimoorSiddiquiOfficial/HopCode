/** fs/promises shim — not available in browser. */
export declare const readFile: () => Promise<never>;
export declare const writeFile: () => Promise<never>;
export declare const mkdir: () => Promise<void>;
export declare const readdir: () => Promise<never[]>;
export declare const stat: () => Promise<never>;
export declare const access: () => Promise<never>;
export declare const rm: () => Promise<void>;
export declare const unlink: () => Promise<void>;
export declare const rename: () => Promise<void>;
export declare const copyFile: () => Promise<void>;
declare const _default: {
    readFile: () => Promise<never>;
    writeFile: () => Promise<never>;
    mkdir: () => Promise<void>;
    readdir: () => Promise<never[]>;
    stat: () => Promise<never>;
    access: () => Promise<never>;
    rm: () => Promise<void>;
    unlink: () => Promise<void>;
    rename: () => Promise<void>;
    copyFile: () => Promise<void>;
};
export default _default;
