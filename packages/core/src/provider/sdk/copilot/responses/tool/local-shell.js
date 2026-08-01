import { createProviderDefinedToolFactoryWithOutputSchema } from '@ai-sdk/provider-utils';
import { z } from 'zod/v4';
export const localShellInputSchema = z.object({
    action: z.object({
        type: z.literal('exec'),
        command: z.array(z.string()),
        timeoutMs: z.number().optional(),
        user: z.string().optional(),
        workingDirectory: z.string().optional(),
        env: z.record(z.string(), z.string()).optional(),
    }),
});
export const localShellOutputSchema = z.object({
    output: z.string(),
});
export const localShell = createProviderDefinedToolFactoryWithOutputSchema({
    id: 'openai.local_shell',
    name: 'local_shell',
    inputSchema: localShellInputSchema,
    outputSchema: localShellOutputSchema,
});
//# sourceMappingURL=local-shell.js.map