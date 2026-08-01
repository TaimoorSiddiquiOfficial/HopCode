export declare class Log {
    static create(options: {
        service: string;
    }): {
        debug: (message: string, ...args: unknown[]) => void;
        info: (message: string, ...args: unknown[]) => void;
        warn: (message: string, ...args: unknown[]) => void;
        error: (message: string, ...args: unknown[]) => void;
        time: (label: string, meta?: unknown) => {
            [Symbol.dispose]: () => void;
        };
    };
}
