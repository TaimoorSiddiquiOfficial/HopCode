/**
 * Named Error - Base class for errors with names
 * OpenCode compatibility layer for HopCode
 */

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

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      metadata: this.metadata,
    };
  }
}
