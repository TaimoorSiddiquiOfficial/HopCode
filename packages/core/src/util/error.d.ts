/**
 * Named Error - Base class for errors with names
 * OpenCode compatibility layer for HopCode
 */
import type { z } from 'zod';
export declare class NamedError extends Error {
    readonly name: string;
    readonly metadata?: Record<string, unknown>;
    constructor(message: string, name?: string, metadata?: Record<string, unknown>);
    static create<T extends z.ZodType>(name: string, schema: T): {
        new (data: z.infer<T>, options?: {
            cause?: unknown;
        }): {
            readonly name: string;
            readonly metadata?: Record<string, unknown>;
            toJSON(): {
                name: string;
                message: string;
                stack: string | undefined;
                metadata: Record<string, unknown> | undefined;
            };
            message: string;
            stack?: string;
            cause?: unknown;
        };
        get schema(): T;
        create<T extends z.ZodType>(name: string, schema: T): /*elided*/ any;
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        metadata: Record<string, unknown> | undefined;
    };
}
