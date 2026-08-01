export declare class Filesystem {
    static read(filepath: string): Promise<string>;
    static write(filepath: string, content: string): Promise<void>;
    static readJson<T = unknown>(filepath: string): Promise<T>;
    static writeJson(filepath: string, data: unknown): Promise<void>;
}
