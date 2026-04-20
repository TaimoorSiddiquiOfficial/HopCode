import { z } from 'zod';

declare module 'zod' {
  interface ZodType {
    meta(data: unknown): this;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(z.ZodType.prototype as any).meta = function (data: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (this as any)._meta = data;
  return this;
};
