declare module 'zod' {
    interface ZodType {
        meta(data: unknown): this;
    }
}
export {};
