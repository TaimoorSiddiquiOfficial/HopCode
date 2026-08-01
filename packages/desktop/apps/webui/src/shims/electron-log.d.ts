/** electron-log shim for browser — routes to console. */
declare const _default: {
    info: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    warn: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    error: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    debug: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    verbose: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    silly: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    log: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    transports: {
        ipc: {
            level: boolean;
        };
    };
    scope: () => {
        info: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        warn: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        error: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
        debug: {
            (...data: any[]): void;
            (message?: any, ...optionalParams: any[]): void;
        };
    };
};
export default _default;
