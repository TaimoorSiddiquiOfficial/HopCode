/**
 * Empty shims for Node.js built-in modules.
 *
 * The shared code (@craft-agent/shared) imports Node.js modules for
 * file system operations, but these codepaths are only reached on the server.
 * In the browser, the web API adapter intercepts all calls before they
 * reach server-side code.
 *
 * These shims satisfy the bundler's static analysis without adding runtime bulk.
 */
export declare const readFileSync: () => never;
export declare const writeFileSync: () => never;
export declare const existsSync: () => boolean;
export declare const statSync: () => never;
export declare const unlinkSync: () => void;
export declare const mkdtempSync: () => string;
export declare const renameSync: () => void;
export declare const mkdirSync: () => void;
export declare const readdirSync: () => never[];
export declare const readdir: () => void;
export declare const copyFileSync: () => void;
export declare const promises: {
    readFile: () => Promise<never>;
    writeFile: () => Promise<never>;
    mkdir: () => Promise<void>;
    readdir: () => Promise<never[]>;
    stat: () => Promise<never>;
    access: () => Promise<never>;
    rm: () => Promise<void>;
    unlink: () => Promise<void>;
};
export declare const join: (...parts: string[]) => string;
export declare const resolve: (...parts: string[]) => string;
export declare const basename: (p: string) => string;
export declare const dirname: (p: string) => string;
export declare const extname: (p: string) => string;
export declare const relative: (from: string, to: string) => string;
export declare const sep = "/";
export declare const isAbsolute: (p: string) => boolean;
export declare const normalize: (p: string) => string;
export declare const parse: (p: string) => {
    root: string;
    dir: string;
    base: string;
    ext: string;
    name: string;
};
export declare const format: (obj: {
    dir?: string;
    base?: string;
}) => string;
export declare const posix: {
    join: (...parts: string[]) => string;
    resolve: (...parts: string[]) => string;
    basename: (p: string) => string;
    dirname: (p: string) => string;
    extname: (p: string) => string;
    relative: (from: string, to: string) => string;
    sep: string;
    isAbsolute: (p: string) => boolean;
    normalize: (p: string) => string;
    parse: (p: string) => {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
    };
    format: (obj: {
        dir?: string;
        base?: string;
    }) => string;
};
export declare const win32: {
    join: (...parts: string[]) => string;
    resolve: (...parts: string[]) => string;
    basename: (p: string) => string;
    dirname: (p: string) => string;
    extname: (p: string) => string;
    relative: (from: string, to: string) => string;
    sep: string;
    isAbsolute: (p: string) => boolean;
    normalize: (p: string) => string;
    parse: (p: string) => {
        root: string;
        dir: string;
        base: string;
        ext: string;
        name: string;
    };
    format: (obj: {
        dir?: string;
        base?: string;
    }) => string;
};
export declare const execSync: () => never;
export declare const exec: () => never;
export declare const spawn: () => never;
export declare const homedir: () => string;
export declare const tmpdir: () => string;
export declare const platform: () => string;
export declare const hostname: () => string;
export declare const cpus: () => {}[];
export declare const randomBytes: (n: number) => Uint8Array<ArrayBuffer>;
export declare const randomUUID: () => `${string}-${string}-${string}-${string}-${string}`;
export declare const createHash: () => {
    update: (this: any) => any;
    digest: () => string;
};
export declare const createHmac: () => {
    update: (this: any) => any;
    digest: () => string;
};
export declare const timingSafeEqual: (a: Uint8Array, b: Uint8Array) => boolean;
export declare const createServer: () => never;
export declare const request: () => never;
export declare const get: () => never;
export declare const promisify: (fn: any) => any;
export declare const inspect: (obj: any) => string;
export declare const deprecate: (fn: any) => any;
export declare const inherits: () => void;
export declare const Buffer: {
    from: (data: any) => Uint8Array<any>;
    isBuffer: () => boolean;
    alloc: (size: number) => Uint8Array<ArrayBuffer>;
    concat: (bufs: Uint8Array[]) => Uint8Array<ArrayBuffer>;
};
export declare const env: NodeJS.ProcessEnv;
export declare const cwd: () => string;
export declare const argv: never[];
export declare const pid = 0;
export declare const kill: () => void;
export declare const exit: () => void;
export declare const on: () => void;
export declare class EventEmitter {
    private _events;
    on(event: string, fn: Function): this;
    off(event: string, fn: Function): this;
    emit(event: string, ...args: any[]): boolean;
    removeAllListeners(): this;
    addListener(event: string, fn: Function): this;
    removeListener(event: string, fn: Function): this;
    listeners(event: string): Function[];
}
declare const _default: {};
export default _default;
