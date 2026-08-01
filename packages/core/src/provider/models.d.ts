import z from 'zod';
export declare namespace ModelsDev {
    const Model: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        family: z.ZodOptional<z.ZodString>;
        release_date: z.ZodString;
        attachment: z.ZodBoolean;
        reasoning: z.ZodBoolean;
        temperature: z.ZodBoolean;
        tool_call: z.ZodBoolean;
        interleaved: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<true>, z.ZodObject<{
            field: z.ZodEnum<["reasoning_content", "reasoning_details"]>;
        }, "strict", z.ZodTypeAny, {
            field: "reasoning_content" | "reasoning_details";
        }, {
            field: "reasoning_content" | "reasoning_details";
        }>]>>;
        cost: z.ZodOptional<z.ZodObject<{
            input: z.ZodNumber;
            output: z.ZodNumber;
            cache_read: z.ZodOptional<z.ZodNumber>;
            cache_write: z.ZodOptional<z.ZodNumber>;
            context_over_200k: z.ZodOptional<z.ZodObject<{
                input: z.ZodNumber;
                output: z.ZodNumber;
                cache_read: z.ZodOptional<z.ZodNumber>;
                cache_write: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
            }, {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            input: number;
            output: number;
            cache_read?: number | undefined;
            cache_write?: number | undefined;
            context_over_200k?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
            } | undefined;
        }, {
            input: number;
            output: number;
            cache_read?: number | undefined;
            cache_write?: number | undefined;
            context_over_200k?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
            } | undefined;
        }>>;
        limit: z.ZodObject<{
            context: z.ZodNumber;
            input: z.ZodOptional<z.ZodNumber>;
            output: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            output: number;
            context: number;
            input?: number | undefined;
        }, {
            output: number;
            context: number;
            input?: number | undefined;
        }>;
        modalities: z.ZodOptional<z.ZodObject<{
            input: z.ZodArray<z.ZodEnum<["text", "audio", "image", "video", "pdf"]>, "many">;
            output: z.ZodArray<z.ZodEnum<["text", "audio", "image", "video", "pdf"]>, "many">;
        }, "strip", z.ZodTypeAny, {
            input: ("text" | "pdf" | "audio" | "video" | "image")[];
            output: ("text" | "pdf" | "audio" | "video" | "image")[];
        }, {
            input: ("text" | "pdf" | "audio" | "video" | "image")[];
            output: ("text" | "pdf" | "audio" | "video" | "image")[];
        }>>;
        experimental: z.ZodOptional<z.ZodBoolean>;
        status: z.ZodOptional<z.ZodEnum<["alpha", "beta", "deprecated"]>>;
        options: z.ZodRecord<z.ZodString, z.ZodAny>;
        headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        provider: z.ZodOptional<z.ZodObject<{
            npm: z.ZodOptional<z.ZodString>;
            api: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            npm?: string | undefined;
            api?: string | undefined;
        }, {
            npm?: string | undefined;
            api?: string | undefined;
        }>>;
        variants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        limit: {
            output: number;
            context: number;
            input?: number | undefined;
        };
        id: string;
        reasoning: boolean;
        options: Record<string, any>;
        tool_call: boolean;
        temperature: boolean;
        attachment: boolean;
        release_date: string;
        provider?: {
            npm?: string | undefined;
            api?: string | undefined;
        } | undefined;
        status?: "alpha" | "beta" | "deprecated" | undefined;
        headers?: Record<string, string> | undefined;
        modalities?: {
            input: ("text" | "pdf" | "audio" | "video" | "image")[];
            output: ("text" | "pdf" | "audio" | "video" | "image")[];
        } | undefined;
        experimental?: boolean | undefined;
        family?: string | undefined;
        interleaved?: true | {
            field: "reasoning_content" | "reasoning_details";
        } | undefined;
        cost?: {
            input: number;
            output: number;
            cache_read?: number | undefined;
            cache_write?: number | undefined;
            context_over_200k?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
            } | undefined;
        } | undefined;
        variants?: Record<string, Record<string, any>> | undefined;
    }, {
        name: string;
        limit: {
            output: number;
            context: number;
            input?: number | undefined;
        };
        id: string;
        reasoning: boolean;
        options: Record<string, any>;
        tool_call: boolean;
        temperature: boolean;
        attachment: boolean;
        release_date: string;
        provider?: {
            npm?: string | undefined;
            api?: string | undefined;
        } | undefined;
        status?: "alpha" | "beta" | "deprecated" | undefined;
        headers?: Record<string, string> | undefined;
        modalities?: {
            input: ("text" | "pdf" | "audio" | "video" | "image")[];
            output: ("text" | "pdf" | "audio" | "video" | "image")[];
        } | undefined;
        experimental?: boolean | undefined;
        family?: string | undefined;
        interleaved?: true | {
            field: "reasoning_content" | "reasoning_details";
        } | undefined;
        cost?: {
            input: number;
            output: number;
            cache_read?: number | undefined;
            cache_write?: number | undefined;
            context_over_200k?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
            } | undefined;
        } | undefined;
        variants?: Record<string, Record<string, any>> | undefined;
    }>;
    type Model = z.infer<typeof Model>;
    const Provider: z.ZodObject<{
        api: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        env: z.ZodArray<z.ZodString, "many">;
        id: z.ZodString;
        npm: z.ZodOptional<z.ZodString>;
        models: z.ZodRecord<z.ZodString, z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            family: z.ZodOptional<z.ZodString>;
            release_date: z.ZodString;
            attachment: z.ZodBoolean;
            reasoning: z.ZodBoolean;
            temperature: z.ZodBoolean;
            tool_call: z.ZodBoolean;
            interleaved: z.ZodOptional<z.ZodUnion<[z.ZodLiteral<true>, z.ZodObject<{
                field: z.ZodEnum<["reasoning_content", "reasoning_details"]>;
            }, "strict", z.ZodTypeAny, {
                field: "reasoning_content" | "reasoning_details";
            }, {
                field: "reasoning_content" | "reasoning_details";
            }>]>>;
            cost: z.ZodOptional<z.ZodObject<{
                input: z.ZodNumber;
                output: z.ZodNumber;
                cache_read: z.ZodOptional<z.ZodNumber>;
                cache_write: z.ZodOptional<z.ZodNumber>;
                context_over_200k: z.ZodOptional<z.ZodObject<{
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    cache_read: z.ZodOptional<z.ZodNumber>;
                    cache_write: z.ZodOptional<z.ZodNumber>;
                }, "strip", z.ZodTypeAny, {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                }, {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                }>>;
            }, "strip", z.ZodTypeAny, {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            }, {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            }>>;
            limit: z.ZodObject<{
                context: z.ZodNumber;
                input: z.ZodOptional<z.ZodNumber>;
                output: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                output: number;
                context: number;
                input?: number | undefined;
            }, {
                output: number;
                context: number;
                input?: number | undefined;
            }>;
            modalities: z.ZodOptional<z.ZodObject<{
                input: z.ZodArray<z.ZodEnum<["text", "audio", "image", "video", "pdf"]>, "many">;
                output: z.ZodArray<z.ZodEnum<["text", "audio", "image", "video", "pdf"]>, "many">;
            }, "strip", z.ZodTypeAny, {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            }, {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            }>>;
            experimental: z.ZodOptional<z.ZodBoolean>;
            status: z.ZodOptional<z.ZodEnum<["alpha", "beta", "deprecated"]>>;
            options: z.ZodRecord<z.ZodString, z.ZodAny>;
            headers: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            provider: z.ZodOptional<z.ZodObject<{
                npm: z.ZodOptional<z.ZodString>;
                api: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                npm?: string | undefined;
                api?: string | undefined;
            }, {
                npm?: string | undefined;
                api?: string | undefined;
            }>>;
            variants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodAny>>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            reasoning: boolean;
            options: Record<string, any>;
            tool_call: boolean;
            temperature: boolean;
            attachment: boolean;
            release_date: string;
            provider?: {
                npm?: string | undefined;
                api?: string | undefined;
            } | undefined;
            status?: "alpha" | "beta" | "deprecated" | undefined;
            headers?: Record<string, string> | undefined;
            modalities?: {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            } | undefined;
            experimental?: boolean | undefined;
            family?: string | undefined;
            interleaved?: true | {
                field: "reasoning_content" | "reasoning_details";
            } | undefined;
            cost?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            } | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            reasoning: boolean;
            options: Record<string, any>;
            tool_call: boolean;
            temperature: boolean;
            attachment: boolean;
            release_date: string;
            provider?: {
                npm?: string | undefined;
                api?: string | undefined;
            } | undefined;
            status?: "alpha" | "beta" | "deprecated" | undefined;
            headers?: Record<string, string> | undefined;
            modalities?: {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            } | undefined;
            experimental?: boolean | undefined;
            family?: string | undefined;
            interleaved?: true | {
                field: "reasoning_content" | "reasoning_details";
            } | undefined;
            cost?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            } | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        env: string[];
        name: string;
        id: string;
        models: Record<string, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            reasoning: boolean;
            options: Record<string, any>;
            tool_call: boolean;
            temperature: boolean;
            attachment: boolean;
            release_date: string;
            provider?: {
                npm?: string | undefined;
                api?: string | undefined;
            } | undefined;
            status?: "alpha" | "beta" | "deprecated" | undefined;
            headers?: Record<string, string> | undefined;
            modalities?: {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            } | undefined;
            experimental?: boolean | undefined;
            family?: string | undefined;
            interleaved?: true | {
                field: "reasoning_content" | "reasoning_details";
            } | undefined;
            cost?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            } | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>;
        npm?: string | undefined;
        api?: string | undefined;
    }, {
        env: string[];
        name: string;
        id: string;
        models: Record<string, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            reasoning: boolean;
            options: Record<string, any>;
            tool_call: boolean;
            temperature: boolean;
            attachment: boolean;
            release_date: string;
            provider?: {
                npm?: string | undefined;
                api?: string | undefined;
            } | undefined;
            status?: "alpha" | "beta" | "deprecated" | undefined;
            headers?: Record<string, string> | undefined;
            modalities?: {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            } | undefined;
            experimental?: boolean | undefined;
            family?: string | undefined;
            interleaved?: true | {
                field: "reasoning_content" | "reasoning_details";
            } | undefined;
            cost?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            } | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>;
        npm?: string | undefined;
        api?: string | undefined;
    }>;
    type Provider = z.infer<typeof Provider>;
    const Data: {
        (): Promise<any>;
        reset(): void;
    };
    function get(): Promise<Record<string, {
        env: string[];
        name: string;
        id: string;
        models: Record<string, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            reasoning: boolean;
            options: Record<string, any>;
            tool_call: boolean;
            temperature: boolean;
            attachment: boolean;
            release_date: string;
            provider?: {
                npm?: string | undefined;
                api?: string | undefined;
            } | undefined;
            status?: "alpha" | "beta" | "deprecated" | undefined;
            headers?: Record<string, string> | undefined;
            modalities?: {
                input: ("text" | "pdf" | "audio" | "video" | "image")[];
                output: ("text" | "pdf" | "audio" | "video" | "image")[];
            } | undefined;
            experimental?: boolean | undefined;
            family?: string | undefined;
            interleaved?: true | {
                field: "reasoning_content" | "reasoning_details";
            } | undefined;
            cost?: {
                input: number;
                output: number;
                cache_read?: number | undefined;
                cache_write?: number | undefined;
                context_over_200k?: {
                    input: number;
                    output: number;
                    cache_read?: number | undefined;
                    cache_write?: number | undefined;
                } | undefined;
            } | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>;
        npm?: string | undefined;
        api?: string | undefined;
    }>>;
    function refresh(): Promise<void>;
}
