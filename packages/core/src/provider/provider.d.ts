import z from 'zod';
import { ModelsDev } from './models.js';
import { type LanguageModelV2 } from '@openrouter/ai-sdk-provider';
export declare namespace Provider {
    const Model: z.ZodObject<{
        id: z.ZodString;
        providerID: z.ZodString;
        api: z.ZodObject<{
            id: z.ZodString;
            url: z.ZodString;
            npm: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            id: string;
            url: string;
            npm: string;
        }, {
            id: string;
            url: string;
            npm: string;
        }>;
        name: z.ZodString;
        family: z.ZodOptional<z.ZodString>;
        capabilities: z.ZodObject<{
            temperature: z.ZodBoolean;
            reasoning: z.ZodBoolean;
            attachment: z.ZodBoolean;
            toolcall: z.ZodBoolean;
            input: z.ZodObject<{
                text: z.ZodBoolean;
                audio: z.ZodBoolean;
                image: z.ZodBoolean;
                video: z.ZodBoolean;
                pdf: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            }, {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            }>;
            output: z.ZodObject<{
                text: z.ZodBoolean;
                audio: z.ZodBoolean;
                image: z.ZodBoolean;
                video: z.ZodBoolean;
                pdf: z.ZodBoolean;
            }, "strip", z.ZodTypeAny, {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            }, {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            }>;
            interleaved: z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
                field: z.ZodEnum<["reasoning_content", "reasoning_details"]>;
            }, "strip", z.ZodTypeAny, {
                field: "reasoning_content" | "reasoning_details";
            }, {
                field: "reasoning_content" | "reasoning_details";
            }>]>;
        }, "strip", z.ZodTypeAny, {
            input: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            output: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            reasoning: boolean;
            temperature: boolean;
            attachment: boolean;
            toolcall: boolean;
            interleaved: boolean | {
                field: "reasoning_content" | "reasoning_details";
            };
        }, {
            input: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            output: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            reasoning: boolean;
            temperature: boolean;
            attachment: boolean;
            toolcall: boolean;
            interleaved: boolean | {
                field: "reasoning_content" | "reasoning_details";
            };
        }>;
        cost: z.ZodObject<{
            input: z.ZodNumber;
            output: z.ZodNumber;
            cache: z.ZodObject<{
                read: z.ZodNumber;
                write: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                write: number;
                read: number;
            }, {
                write: number;
                read: number;
            }>;
            experimentalOver200K: z.ZodOptional<z.ZodObject<{
                input: z.ZodNumber;
                output: z.ZodNumber;
                cache: z.ZodObject<{
                    read: z.ZodNumber;
                    write: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    write: number;
                    read: number;
                }, {
                    write: number;
                    read: number;
                }>;
            }, "strip", z.ZodTypeAny, {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            }, {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            }>>;
        }, "strip", z.ZodTypeAny, {
            input: number;
            output: number;
            cache: {
                write: number;
                read: number;
            };
            experimentalOver200K?: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            } | undefined;
        }, {
            input: number;
            output: number;
            cache: {
                write: number;
                read: number;
            };
            experimentalOver200K?: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            } | undefined;
        }>;
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
        status: z.ZodEnum<["alpha", "beta", "deprecated", "active"]>;
        options: z.ZodRecord<z.ZodString, z.ZodAny>;
        headers: z.ZodRecord<z.ZodString, z.ZodString>;
        release_date: z.ZodString;
        variants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        limit: {
            output: number;
            context: number;
            input?: number | undefined;
        };
        id: string;
        status: "active" | "alpha" | "beta" | "deprecated";
        headers: Record<string, string>;
        options: Record<string, any>;
        api: {
            id: string;
            url: string;
            npm: string;
        };
        capabilities: {
            input: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            output: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            reasoning: boolean;
            temperature: boolean;
            attachment: boolean;
            toolcall: boolean;
            interleaved: boolean | {
                field: "reasoning_content" | "reasoning_details";
            };
        };
        providerID: string;
        cost: {
            input: number;
            output: number;
            cache: {
                write: number;
                read: number;
            };
            experimentalOver200K?: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            } | undefined;
        };
        release_date: string;
        family?: string | undefined;
        variants?: Record<string, Record<string, any>> | undefined;
    }, {
        name: string;
        limit: {
            output: number;
            context: number;
            input?: number | undefined;
        };
        id: string;
        status: "active" | "alpha" | "beta" | "deprecated";
        headers: Record<string, string>;
        options: Record<string, any>;
        api: {
            id: string;
            url: string;
            npm: string;
        };
        capabilities: {
            input: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            output: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            reasoning: boolean;
            temperature: boolean;
            attachment: boolean;
            toolcall: boolean;
            interleaved: boolean | {
                field: "reasoning_content" | "reasoning_details";
            };
        };
        providerID: string;
        cost: {
            input: number;
            output: number;
            cache: {
                write: number;
                read: number;
            };
            experimentalOver200K?: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            } | undefined;
        };
        release_date: string;
        family?: string | undefined;
        variants?: Record<string, Record<string, any>> | undefined;
    }>;
    type Model = z.infer<typeof Model>;
    const Info: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        source: z.ZodEnum<["env", "config", "custom", "api"]>;
        env: z.ZodArray<z.ZodString, "many">;
        key: z.ZodOptional<z.ZodString>;
        options: z.ZodRecord<z.ZodString, z.ZodAny>;
        models: z.ZodRecord<z.ZodString, z.ZodObject<{
            id: z.ZodString;
            providerID: z.ZodString;
            api: z.ZodObject<{
                id: z.ZodString;
                url: z.ZodString;
                npm: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
                url: string;
                npm: string;
            }, {
                id: string;
                url: string;
                npm: string;
            }>;
            name: z.ZodString;
            family: z.ZodOptional<z.ZodString>;
            capabilities: z.ZodObject<{
                temperature: z.ZodBoolean;
                reasoning: z.ZodBoolean;
                attachment: z.ZodBoolean;
                toolcall: z.ZodBoolean;
                input: z.ZodObject<{
                    text: z.ZodBoolean;
                    audio: z.ZodBoolean;
                    image: z.ZodBoolean;
                    video: z.ZodBoolean;
                    pdf: z.ZodBoolean;
                }, "strip", z.ZodTypeAny, {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                }, {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                }>;
                output: z.ZodObject<{
                    text: z.ZodBoolean;
                    audio: z.ZodBoolean;
                    image: z.ZodBoolean;
                    video: z.ZodBoolean;
                    pdf: z.ZodBoolean;
                }, "strip", z.ZodTypeAny, {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                }, {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                }>;
                interleaved: z.ZodUnion<[z.ZodBoolean, z.ZodObject<{
                    field: z.ZodEnum<["reasoning_content", "reasoning_details"]>;
                }, "strip", z.ZodTypeAny, {
                    field: "reasoning_content" | "reasoning_details";
                }, {
                    field: "reasoning_content" | "reasoning_details";
                }>]>;
            }, "strip", z.ZodTypeAny, {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            }, {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            }>;
            cost: z.ZodObject<{
                input: z.ZodNumber;
                output: z.ZodNumber;
                cache: z.ZodObject<{
                    read: z.ZodNumber;
                    write: z.ZodNumber;
                }, "strip", z.ZodTypeAny, {
                    write: number;
                    read: number;
                }, {
                    write: number;
                    read: number;
                }>;
                experimentalOver200K: z.ZodOptional<z.ZodObject<{
                    input: z.ZodNumber;
                    output: z.ZodNumber;
                    cache: z.ZodObject<{
                        read: z.ZodNumber;
                        write: z.ZodNumber;
                    }, "strip", z.ZodTypeAny, {
                        write: number;
                        read: number;
                    }, {
                        write: number;
                        read: number;
                    }>;
                }, "strip", z.ZodTypeAny, {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                }, {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                }>>;
            }, "strip", z.ZodTypeAny, {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            }, {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            }>;
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
            status: z.ZodEnum<["alpha", "beta", "deprecated", "active"]>;
            options: z.ZodRecord<z.ZodString, z.ZodAny>;
            headers: z.ZodRecord<z.ZodString, z.ZodString>;
            release_date: z.ZodString;
            variants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodRecord<z.ZodString, z.ZodAny>>>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            status: "active" | "alpha" | "beta" | "deprecated";
            headers: Record<string, string>;
            options: Record<string, any>;
            api: {
                id: string;
                url: string;
                npm: string;
            };
            capabilities: {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            };
            providerID: string;
            cost: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            };
            release_date: string;
            family?: string | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            status: "active" | "alpha" | "beta" | "deprecated";
            headers: Record<string, string>;
            options: Record<string, any>;
            api: {
                id: string;
                url: string;
                npm: string;
            };
            capabilities: {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            };
            providerID: string;
            cost: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            };
            release_date: string;
            family?: string | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        env: string[];
        name: string;
        id: string;
        source: "env" | "config" | "api" | "custom";
        options: Record<string, any>;
        models: Record<string, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            status: "active" | "alpha" | "beta" | "deprecated";
            headers: Record<string, string>;
            options: Record<string, any>;
            api: {
                id: string;
                url: string;
                npm: string;
            };
            capabilities: {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            };
            providerID: string;
            cost: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            };
            release_date: string;
            family?: string | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>;
        key?: string | undefined;
    }, {
        env: string[];
        name: string;
        id: string;
        source: "env" | "config" | "api" | "custom";
        options: Record<string, any>;
        models: Record<string, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            status: "active" | "alpha" | "beta" | "deprecated";
            headers: Record<string, string>;
            options: Record<string, any>;
            api: {
                id: string;
                url: string;
                npm: string;
            };
            capabilities: {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            };
            providerID: string;
            cost: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            };
            release_date: string;
            family?: string | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>;
        key?: string | undefined;
    }>;
    type Info = z.infer<typeof Info>;
    function fromModelsDevProvider(provider: ModelsDev.Provider): Info;
    function list(): Promise<{
        [providerID: string]: {
            env: string[];
            name: string;
            id: string;
            source: "env" | "config" | "api" | "custom";
            options: Record<string, any>;
            models: Record<string, {
                name: string;
                limit: {
                    output: number;
                    context: number;
                    input?: number | undefined;
                };
                id: string;
                status: "active" | "alpha" | "beta" | "deprecated";
                headers: Record<string, string>;
                options: Record<string, any>;
                api: {
                    id: string;
                    url: string;
                    npm: string;
                };
                capabilities: {
                    input: {
                        text: boolean;
                        pdf: boolean;
                        audio: boolean;
                        video: boolean;
                        image: boolean;
                    };
                    output: {
                        text: boolean;
                        pdf: boolean;
                        audio: boolean;
                        video: boolean;
                        image: boolean;
                    };
                    reasoning: boolean;
                    temperature: boolean;
                    attachment: boolean;
                    toolcall: boolean;
                    interleaved: boolean | {
                        field: "reasoning_content" | "reasoning_details";
                    };
                };
                providerID: string;
                cost: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                    experimentalOver200K?: {
                        input: number;
                        output: number;
                        cache: {
                            write: number;
                            read: number;
                        };
                    } | undefined;
                };
                release_date: string;
                family?: string | undefined;
                variants?: Record<string, Record<string, any>> | undefined;
            }>;
            key?: string | undefined;
        };
    }>;
    function getProvider(providerID: string): Promise<{
        env: string[];
        name: string;
        id: string;
        source: "env" | "config" | "api" | "custom";
        options: Record<string, any>;
        models: Record<string, {
            name: string;
            limit: {
                output: number;
                context: number;
                input?: number | undefined;
            };
            id: string;
            status: "active" | "alpha" | "beta" | "deprecated";
            headers: Record<string, string>;
            options: Record<string, any>;
            api: {
                id: string;
                url: string;
                npm: string;
            };
            capabilities: {
                input: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                output: {
                    text: boolean;
                    pdf: boolean;
                    audio: boolean;
                    video: boolean;
                    image: boolean;
                };
                reasoning: boolean;
                temperature: boolean;
                attachment: boolean;
                toolcall: boolean;
                interleaved: boolean | {
                    field: "reasoning_content" | "reasoning_details";
                };
            };
            providerID: string;
            cost: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
                experimentalOver200K?: {
                    input: number;
                    output: number;
                    cache: {
                        write: number;
                        read: number;
                    };
                } | undefined;
            };
            release_date: string;
            family?: string | undefined;
            variants?: Record<string, Record<string, any>> | undefined;
        }>;
        key?: string | undefined;
    }>;
    function getModel(providerID: string, modelID: string): Promise<{
        name: string;
        limit: {
            output: number;
            context: number;
            input?: number | undefined;
        };
        id: string;
        status: "active" | "alpha" | "beta" | "deprecated";
        headers: Record<string, string>;
        options: Record<string, any>;
        api: {
            id: string;
            url: string;
            npm: string;
        };
        capabilities: {
            input: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            output: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            reasoning: boolean;
            temperature: boolean;
            attachment: boolean;
            toolcall: boolean;
            interleaved: boolean | {
                field: "reasoning_content" | "reasoning_details";
            };
        };
        providerID: string;
        cost: {
            input: number;
            output: number;
            cache: {
                write: number;
                read: number;
            };
            experimentalOver200K?: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            } | undefined;
        };
        release_date: string;
        family?: string | undefined;
        variants?: Record<string, Record<string, any>> | undefined;
    }>;
    function getLanguage(model: Model): Promise<LanguageModelV2>;
    function closest(providerID: string, query: string[]): Promise<{
        providerID: string;
        modelID: string;
    } | undefined>;
    function getSmallModel(providerID: string): Promise<{
        name: string;
        limit: {
            output: number;
            context: number;
            input?: number | undefined;
        };
        id: string;
        status: "active" | "alpha" | "beta" | "deprecated";
        headers: Record<string, string>;
        options: Record<string, any>;
        api: {
            id: string;
            url: string;
            npm: string;
        };
        capabilities: {
            input: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            output: {
                text: boolean;
                pdf: boolean;
                audio: boolean;
                video: boolean;
                image: boolean;
            };
            reasoning: boolean;
            temperature: boolean;
            attachment: boolean;
            toolcall: boolean;
            interleaved: boolean | {
                field: "reasoning_content" | "reasoning_details";
            };
        };
        providerID: string;
        cost: {
            input: number;
            output: number;
            cache: {
                write: number;
                read: number;
            };
            experimentalOver200K?: {
                input: number;
                output: number;
                cache: {
                    write: number;
                    read: number;
                };
            } | undefined;
        };
        release_date: string;
        family?: string | undefined;
        variants?: Record<string, Record<string, any>> | undefined;
    } | undefined>;
    function sort(models: Model[]): any;
    function defaultModel(): Promise<{
        providerID: string;
        modelID: any;
    }>;
    function parseModel(model: string): {
        providerID: string;
        modelID: string;
    };
    const ModelNotFoundError: {
        new (data: {
            providerID: string;
            modelID: string;
            suggestions?: string[] | undefined;
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
            modelID: z.ZodString;
            suggestions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            providerID: string;
            modelID: string;
            suggestions?: string[] | undefined;
        }, {
            providerID: string;
            modelID: string;
            suggestions?: string[] | undefined;
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
    const InitError: {
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
}
