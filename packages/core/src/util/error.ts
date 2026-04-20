/**
 * Named Error - Base class for errors with names
 * OpenCode compatibility layer for HopCode
 */

import type { z } from 'zod';

export class NamedError extends Error {
  override readonly name: string;
  readonly metadata?: Record<string, unknown>;

  constructor(
    message: string,
    name?: string,
    metadata?: Record<string, unknown>,
  ) {
    super(message);
    this.name = name ?? this.constructor.name;
    this.metadata = metadata;
    Object.setPrototypeOf(this, NamedError.prototype);
  }

  static create<T extends z.ZodType>(name: string, schema: T) {
    return class extends NamedError {
      constructor(data: z.infer<T>, options?: { cause?: unknown }) {
        super(
          `${name}: ${JSON.stringify(data)}`,
          name,
          data as Record<string, unknown>,
        );
        if (options?.cause) {
          Object.defineProperty(this, 'cause', { value: options.cause });
        }
      }
      static get schema() {
        return schema;
      }
    };
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata,
    };
  }
}
