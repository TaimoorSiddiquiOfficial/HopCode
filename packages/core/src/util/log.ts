import { createDebugLogger } from '../utils/debugLogger.js';

export class Log {
  static create(options: { service: string }) {
    const logger = createDebugLogger(options.service.toUpperCase());
    return {
      debug: (message: string, ...args: unknown[]) =>
        logger.debug(message, ...args),
      info: (message: string, ...args: unknown[]) =>
        logger.info(message, ...args),
      warn: (message: string, ...args: unknown[]) =>
        logger.warn(message, ...args),
      error: (message: string, ...args: unknown[]) =>
        logger.error(message, ...args),
      time: (label: string, meta?: unknown) => {
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
