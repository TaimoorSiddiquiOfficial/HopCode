import log from 'electron-log/main';
import type { MessagingLogger } from '@craft-agent/messaging-gateway';
export declare const isDebugMode: boolean;
export declare const mainLog: any;
export declare const sessionLog: any;
export declare const handlerLog: any;
export declare const windowLog: any;
export declare const agentLog: any;
export declare const searchLog: any;
/**
 * Dedicated messaging gateway log.
 *
 * Kept outside the Electron-managed logs folder so messaging issues can be
 * inspected independently at a stable path across debug and production builds.
 */
export declare const messagingGatewayLogPath: string;
export declare const messagingGatewayLog: MessagingLogger;
/**
 * Get the path to the current Electron main log file.
 * Returns undefined if file logging is disabled.
 */
export declare function getLogFilePath(): string | undefined;
export declare function getMessagingGatewayLogFilePath(): string;
export default log;
