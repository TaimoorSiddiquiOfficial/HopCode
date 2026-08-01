export declare function lazy<T>(fn: () => Promise<T>): {
    (): Promise<T>;
    reset(): void;
};
