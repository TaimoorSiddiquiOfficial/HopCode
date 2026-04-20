import { z } from 'zod';

declare module 'zod' {
  interface ZodType {
    meta(data: unknown): this;
  }
}

// @ts-expect-error — patching prototype at runtime
z.ZodType.prototype.meta = function (data: unknown) {
  // @ts-expect-error — _meta is not in the public type
  this._meta = data;
  return this;
};
