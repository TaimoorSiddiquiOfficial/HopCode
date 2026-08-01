export declare class Instance {
    static state<T>(init: () => Promise<T>): () => Promise<T>;
}
