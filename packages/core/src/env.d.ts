export declare class Env {
    static get(key: string): string | undefined;
    static set(key: string, value: string): void;
    static all(): Record<string, string | undefined>;
}
