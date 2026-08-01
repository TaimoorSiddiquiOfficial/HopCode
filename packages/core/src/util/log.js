import { createDebugLogger } from '../utils/debugLogger.js';
export class Log {
    static create(options) {
        const logger = createDebugLogger(options.service.toUpperCase());
        return {
            debug: (message, ...args) => logger.debug(message, ...args),
            info: (message, ...args) => logger.info(message, ...args),
            warn: (message, ...args) => logger.warn(message, ...args),
            error: (message, ...args) => logger.error(message, ...args),
            time: (label, meta) => {
                const start = Date.now();
                return {
                    [Symbol.dispose]: () => {
                        logger.debug(`${label} took ${Date.now() - start}ms`, meta);
                    },
                };
            },
        };
    }
}
//# sourceMappingURL=log.js.map