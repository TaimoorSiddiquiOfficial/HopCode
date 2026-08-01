import z from 'zod';
export declare namespace ProviderAuth {
    const Method: z.ZodObject<{
        type: z.ZodUnion<[z.ZodLiteral<"oauth">, z.ZodLiteral<"api">]>;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "api" | "oauth";
        label: string;
    }, {
        type: "api" | "oauth";
        label: string;
    }>;
    type Method = z.infer<typeof Method>;
    function methods(): Promise<any>;
    const Authorization: z.ZodObject<{
        url: z.ZodString;
        method: z.ZodUnion<[z.ZodLiteral<"auto">, z.ZodLiteral<"code">]>;
        instructions: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        url: string;
        method: "code" | "auto";
        instructions: string;
    }, {
        url: string;
        method: "code" | "auto";
        instructions: string;
    }>;
    type Authorization = z.infer<typeof Authorization>;
    const authorize: {
        (input: {
            method: number;
            providerID: string;
        }): Promise<{
            url: string;
            method: "code" | "auto";
            instructions: string;
        } | undefined>;
        force(input: {
            method: number;
            providerID: string;
        }): Promise<{
            url: string;
            method: "code" | "auto";
            instructions: string;
        } | undefined>;
        schema: z.ZodObject<{
            providerID: z.ZodString;
            method: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            method: number;
            providerID: string;
        }, {
            method: number;
            providerID: string;
        }>;
    };
    const callback: {
        (input: {
            method: number;
            providerID: string;
            code?: string | undefined;
        }): Promise<void>;
        force(input: {
            method: number;
            providerID: string;
            code?: string | undefined;
        }): Promise<void>;
        schema: z.ZodObject<{
            providerID: z.ZodString;
            method: z.ZodNumber;
            code: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            method: number;
            providerID: string;
            code?: string | undefined;
        }, {
            method: number;
            providerID: string;
            code?: string | undefined;
        }>;
    };
    const api: {
        (input: {
            key: string;
            providerID: string;
        }): Promise<void>;
        force(input: {
            key: string;
            providerID: string;
        }): Promise<void>;
        schema: z.ZodObject<{
            providerID: z.ZodString;
            key: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            key: string;
            providerID: string;
        }, {
            key: string;
            providerID: string;
        }>;
    };
    const OauthMissing: {
        new (data: {
            providerID: string;
        }, options?: {
            cause?: unknown;
        } | undefined): {
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
        get schema(): z.ZodObject<{
            providerID: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            providerID: string;
        }, {
            providerID: string;
        }>;
        create<T extends z.ZodType>(name: string, schema: T): {
            new (data: z.TypeOf<T>, options?: {
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
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    const OauthCodeMissing: {
        new (data: {
            providerID: string;
        }, options?: {
            cause?: unknown;
        } | undefined): {
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
        get schema(): z.ZodObject<{
            providerID: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            providerID: string;
        }, {
            providerID: string;
        }>;
        create<T extends z.ZodType>(name: string, schema: T): {
            new (data: z.TypeOf<T>, options?: {
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
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
    const OauthCallbackFailed: {
        new (data: {}, options?: {
            cause?: unknown;
        } | undefined): {
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
        get schema(): z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
        create<T extends z.ZodType>(name: string, schema: T): {
            new (data: z.TypeOf<T>, options?: {
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
        captureStackTrace(targetObject: object, constructorOpt?: Function): void;
        prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
        stackTraceLimit: number;
    };
}
