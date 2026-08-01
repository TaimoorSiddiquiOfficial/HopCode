import { z } from 'zod/v4';
export declare const localShellInputSchema: z.ZodObject<{
    action: z.ZodObject<{
        type: z.ZodLiteral<"exec">;
        command: z.ZodArray<z.ZodString>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        user: z.ZodOptional<z.ZodString>;
        workingDirectory: z.ZodOptional<z.ZodString>;
        env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const localShellOutputSchema: z.ZodObject<{
    output: z.ZodString;
}, z.core.$strip>;
export declare const localShell: any;
