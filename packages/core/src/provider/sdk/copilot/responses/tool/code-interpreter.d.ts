import { z } from 'zod/v4';
export declare const codeInterpreterInputSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    containerId: z.ZodString;
}, z.core.$strip>;
export declare const codeInterpreterOutputSchema: z.ZodObject<{
    outputs: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"logs">;
        logs: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        url: z.ZodString;
    }, z.core.$strip>]>>>>;
}, z.core.$strip>;
export declare const codeInterpreterArgsSchema: z.ZodObject<{
    container: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
        fileIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>]>>;
}, z.core.$strip>;
type CodeInterpreterArgs = {
    /**
     * The code interpreter container.
     * Can be a container ID
     * or an object that specifies uploaded file IDs to make available to your code.
     */
    container?: string | {
        fileIds?: string[];
    };
};
export declare const codeInterpreterToolFactory: any;
export declare const codeInterpreter: (args?: CodeInterpreterArgs) => any;
export {};
