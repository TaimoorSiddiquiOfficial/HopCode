import type { z } from 'zod';
export declare function fn<T extends z.ZodType, Result>(schema: T, cb: (input: z.infer<T>) => Result): {
    (input: z.infer<T>): Result;
    force(input: z.infer<T>): Result;
    schema: T;
};
