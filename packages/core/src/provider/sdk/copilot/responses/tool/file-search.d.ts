import { z } from 'zod/v4';
export declare const fileSearchArgsSchema: z.ZodObject<{
    vectorStoreIds: z.ZodArray<z.ZodString>;
    maxNumResults: z.ZodOptional<z.ZodNumber>;
    ranking: z.ZodOptional<z.ZodObject<{
        ranker: z.ZodOptional<z.ZodString>;
        scoreThreshold: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    filters: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        key: z.ZodString;
        type: z.ZodEnum<{
            eq: "eq";
            gt: "gt";
            gte: "gte";
            lt: "lt";
            lte: "lte";
            ne: "ne";
        }>;
        value: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean]>;
    }, z.core.$strip>, z.ZodType<any, unknown, z.core.$ZodTypeInternals<any, unknown>>]>>;
}, z.core.$strip>;
export declare const fileSearchOutputSchema: z.ZodObject<{
    queries: z.ZodArray<z.ZodString>;
    results: z.ZodNullable<z.ZodArray<z.ZodObject<{
        attributes: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        fileId: z.ZodString;
        filename: z.ZodString;
        score: z.ZodNumber;
        text: z.ZodString;
    }, z.core.$strip>>>;
}, z.core.$strip>;
export declare const fileSearch: any;
